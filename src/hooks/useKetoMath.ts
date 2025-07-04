import { NutritionData } from '@/types/nutrition';
import saTable from '@/data/sugarAlcohols.json';
import giTableRaw from '@/data/gi_master.csv?raw';

const parseGiTable = (csvRaw: string) => {
  const lines = csvRaw.trim().split('\n').slice(1); // Skip header
  const giMap: Record<string, number> = {};
  
  lines.forEach(line => {
    const [food, gi] = line.split(',');
    if (food && gi) {
      giMap[food.toLowerCase().trim()] = parseInt(gi.trim());
    }
  });
  
  return giMap;
};

const giTable = parseGiTable(giTableRaw);

const lookupGi = (productName?: string): number => {
  if (!productName) return 50; // Default GI
  
  const nameCompare = productName.toLowerCase();
  
  // Find matching food item
  for (const [food, gi] of Object.entries(giTable)) {
    if (nameCompare.includes(food) || food.includes(nameCompare)) {
      return gi;
    }
  }
  
  return 50; // Default GI if no match
};

export const useKetoMath = (data: NutritionData) => {
  // Abort if no serving weight available
  if (!data.servingWeightG) {
    return null;
  }
  
  // --- normalise per-100 g ---
  const factor100 = 100 / data.servingWeightG;
  
  const fat100 = (data.fat || 0) * factor100;
  const protein100 = (data.protein || 0) * factor100;
  const carbs100 = (data.carbs || 0) * factor100;
  const fiber100 = (data.fiber || 0) * factor100;
  const sa100 = (data.sugarAlcohol || 0) * factor100;
  
  // sugar-alcohol factors
  const saMeta = Object.values(saTable).find(e =>
    data.sugarAlcohol && (data.productName || '').toLowerCase().includes(e.key)
  ) || { kcal_per_g: 0, net_carb_factor: 0 };
  
  const netCarb100 = Math.max(0,
    carbs100 - fiber100 - sa100 * saMeta.net_carb_factor);
  
  // calories reconstructed
  const kcal100 = 9 * fat100 + 4 * protein100 + 4 * netCarb100 + sa100 * saMeta.kcal_per_g;
  
  // fat-dominance ratio
  const R = fat100 ? (9 * fat100) / (4 * (protein100 + netCarb100)) : 0;
  
  // keto checks
  const passesNet = netCarb100 < 5;
  const passesR = R >= 1;
  const ketoOk = passesNet && passesR;
  
  // GI lookup
  const gi = data.gi ?? lookupGi(data.productName);
  
  const gl100 = gi * netCarb100 / 100;
  
  // Calorie mismatch check (if original calories provided)
  const originalKcal100 = data.calories ? (data.calories * factor100) : null;
  const calorieMismatch = originalKcal100 ? 
    Math.abs(kcal100 - originalKcal100) / originalKcal100 > 0.1 : false;
  
  return {
    per100g: { 
      fat100, 
      protein100, 
      carbs100, 
      fiber100, 
      sa100,
      netCarb100, 
      kcal100, 
      gi, 
      gl100, 
      R 
    },
    verdict: { 
      ketoOk, 
      passesNet, 
      passesR 
    },
    calorieMismatch,
    originalKcal100
  };
};
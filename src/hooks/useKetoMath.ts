import { NutritionData } from '@/types/nutrition';
import saTable from '@/data/sugarAlcohols.json';
import giTableRaw from '@/data/gi_master.csv?raw';
import { categorizeFood } from '@/utils/foodCategory';
import { extractMicronutrients } from '@/utils/micronutrient';

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
  
  // Enhanced GI lookup with food categorization
  const foodCategory = categorizeFood(data.ingredients);
  const gi = data.gi ?? lookupGi(data.productName) ?? foodCategory.giEstimate;
  
  // GI confidence tracking
  let giConfidence: string;
  if (data.gi) {
    giConfidence = 'direct';
  } else if (lookupGi(data.productName)) {
    giConfidence = 'table';
  } else {
    giConfidence = `heuristic-${foodCategory.confidence}`;
  }

  const gl100 = gi * netCarb100 / 100;

  // Additional v2 calculations
  const pctCarb = kcal100 > 0 ? (4 * netCarb100) / kcal100 * 100 : 0;
  const satRatio = fat100 > 0 ? (data.satFat || 0) * factor100 / fat100 : 0;
  const sodiumDensity = kcal100 > 0 ? ((data.sodium || 0) * factor100) / kcal100 : 0;
  
  // Micronutrient density (mg per 100g)
  const microsPer100g = extractMicronutrients(data.micros);
  
  // KetoScore calculation (0-100)
  const addedSugar100 = (data.addedSugar || 0) * factor100;
  let ketoScore = 100;
  ketoScore -= 6 * netCarb100;
  ketoScore -= 15 * Math.max(0, 1 - R) * 10;
  if (pctCarb > 10) ketoScore -= 5;
  if (gl100 > 5) ketoScore -= 10;
  if (addedSugar100 > 0) ketoScore -= 10;
  ketoScore = Math.max(0, Math.min(100, ketoScore));

  // Calorie mismatch check (if original calories provided)
  const originalKcal100 = data.calories ? (data.calories * factor100) : null;
  const calorieMismatch = originalKcal100 ? 
    Math.abs(kcal100 - originalKcal100) / originalKcal100 > 0.2 : false;

  // Warning flags
  const warnings: string[] = [];
  if (addedSugar100 > 0) warnings.push('High added sugar');
  if (satRatio > 0.66) warnings.push('High saturated fat ratio');
  if ((data.sodium || 0) * factor100 > 600) warnings.push('Very high sodium');
  if (calorieMismatch) warnings.push('Label inconsistency');

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
      R,
      pctCarb,
      satRatio,
      sodiumDensity,
      addedSugar100
    },
    verdict: { 
      ketoOk, 
      passesNet, 
      passesR 
    },
    calorieMismatch,
    originalKcal100,
    giConfidence,
    ketoScore,
    microsPer100g,
    warnings,
    foodCategory: foodCategory.category
  };
};
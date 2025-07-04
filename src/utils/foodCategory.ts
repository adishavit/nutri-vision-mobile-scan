import categoryMapping from '@/data/categoryGI.json';

export interface FoodCategory {
  category: string;
  giEstimate: number;
  confidence: number;
}

export const categorizeFood = (ingredients?: string): FoodCategory => {
  if (!ingredients || ingredients.trim().length === 0) {
    return {
      category: 'mixed / unknown',
      giEstimate: 50,
      confidence: 0.4
    };
  }

  const ingredientsLower = ingredients.toLowerCase();
  
  // Rule 1: Almond flour bakery
  if (ingredientsLower.startsWith('almond flour') || ingredientsLower.includes('almond flour')) {
    return {
      category: 'nut-flour bakery',
      giEstimate: categoryMapping['nut-flour bakery'].gi,
      confidence: categoryMapping['nut-flour bakery'].confidence
    };
  }
  
  // Rule 2: White flour bakery
  if (ingredientsLower.includes('wheat flour') || ingredientsLower.includes('white flour') || ingredientsLower.includes('enriched flour')) {
    return {
      category: 'white-flour bakery',
      giEstimate: categoryMapping['white-flour bakery'].gi,
      confidence: categoryMapping['white-flour bakery'].confidence
    };
  }
  
  // Rule 3: Rice products
  if (ingredientsLower.includes('rice')) {
    return {
      category: 'rice product',
      giEstimate: categoryMapping['rice product'].gi,
      confidence: categoryMapping['rice product'].confidence
    };
  }
  
  // Rule 4: High-GI sweeteners
  if (ingredientsLower.includes('isomaltulose') || 
      ingredientsLower.includes('fructose') || 
      ingredientsLower.includes('honey') ||
      ingredientsLower.includes('corn syrup') ||
      ingredientsLower.includes('sugar')) {
    return {
      category: 'high-GI sweetener',
      giEstimate: categoryMapping['high-GI sweetener'].gi,
      confidence: categoryMapping['high-GI sweetener'].confidence
    };
  }
  
  // Rule 5: Nut butter / fat bomb (≤ 3 items, all nuts/oils)
  const ingredientsList = ingredientsLower.split(',').map(i => i.trim());
  if (ingredientsList.length <= 3) {
    const isNutOrOil = (ingredient: string) => {
      return ingredient.includes('oil') || 
             ingredient.includes('nut') || 
             ingredient.includes('almond') ||
             ingredient.includes('peanut') ||
             ingredient.includes('coconut') ||
             ingredient.includes('butter') ||
             ingredient.includes('seed');
    };
    
    if (ingredientsList.every(isNutOrOil)) {
      return {
        category: 'nut butter / fat bomb',
        giEstimate: categoryMapping['nut butter / fat bomb'].gi,
        confidence: categoryMapping['nut butter / fat bomb'].confidence
      };
    }
  }
  
  // Fallback
  return {
    category: 'mixed / unknown',
    giEstimate: categoryMapping['mixed / unknown'].gi,
    confidence: categoryMapping['mixed / unknown'].confidence
  };
};
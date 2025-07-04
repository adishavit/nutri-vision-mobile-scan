
export interface NutritionData {
  productName?: string;
  servingSize?: string;        // "30 g" or "2 tbsp (30 mL)"
  servingWeightG?: number;     // NEW – grams after parser
  calories?: number;
  fat?: number;
  satFat?: number;             // NEW
  transFat?: number;           // NEW
  protein?: number;
  carbs?: number;
  fiber?: number;
  sugar?: number;
  sugarAlcohol?: number;       // NEW
  addedSugar?: number;         // NEW for v2
  sodium?: number;
  gi?: number;                 // NEW (lookup)
  ingredients?: string;        // NEW for v2 - ingredient list
  micros?: Record<string, number>; // NEW for v2 - %DV micronutrients
  claims?: string[];           // NEW for v2 - front label claims
}

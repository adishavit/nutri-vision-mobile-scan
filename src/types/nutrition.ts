
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
  sodium?: number;
  gi?: number;                 // NEW (lookup)
}

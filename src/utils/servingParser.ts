export const parseServingWeight = (servingSize: string): number | null => {
  if (!servingSize) return null;
  
  // 1. Look for explicit grams pattern: "(\d+(\.\d+)?)\s*g"
  const gramsMatch = servingSize.match(/(\d+(?:\.\d+)?)\s*g\b/i);
  if (gramsMatch) {
    return parseFloat(gramsMatch[1]);
  }
  
  // 2. Look for mL pattern and apply density fallback (assume 1 mL = 1 g for most foods)
  const mlMatch = servingSize.match(/(\d+(?:\.\d+)?)\s*mL\b/i);
  if (mlMatch) {
    return parseFloat(mlMatch[1]); // 1:1 density fallback
  }
  
  // 3. Look for other common patterns like "1 cup (240g)" or similar
  const parenthesesMatch = servingSize.match(/\((\d+(?:\.\d+)?)\s*g\)/i);
  if (parenthesesMatch) {
    return parseFloat(parenthesesMatch[1]);
  }
  
  // 4. Return null if not found
  return null;
};
export const parseServingWeight = (s: string): number | null => {
  // 1. explicit grams
  const gMatch = /(\d+(?:\.\d+)?)\s*g/i.exec(s);
  if (gMatch) return parseFloat(gMatch[1]);

  // 2. explicit mL → fallback density 1.0 g/mL
  const mMatch = /(\d+(?:\.\d+)?)\s*ml/i.exec(s);
  if (mMatch) return parseFloat(mMatch[1]);   // simple v1 assumption

  return null;
};
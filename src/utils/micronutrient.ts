import fdaDvRaw from '@/data/fda_dv_2024.csv?raw';

export const DV = {
  calcium:    1300, // mg
  iron:       18,
  potassium:  4700,
  magnesium:  420,
  vitaminD:   20   // µg
  // add more if needed
};

const parseFdaDvTable = (csvRaw: string) => {
  const lines = csvRaw.trim().split('\n').slice(1); // Skip header
  const dvMap: Record<string, number> = {};
  
  lines.forEach(line => {
    const [nutrient, val, unit] = line.split(',');
    if (nutrient && val) {
      const factor = unit?.trim() === 'µg' ? 0.001 : 1;
      dvMap[nutrient.toLowerCase().trim()] = parseFloat(val.trim()) * factor;
    }
  });
  
  return dvMap;
};

const fdaDvTable = parseFdaDvTable(fdaDvRaw);

export const convertDvToMg = (nutrientName: string, dvPercent: number): number => {
  const nutrientKey = nutrientName.toLowerCase().trim();
  const dvAmount = fdaDvTable[nutrientKey];
  
  if (!dvAmount) {
    return 0;
  }
  
  return (dvPercent / 100) * dvAmount;
};

export const extractMicronutrients = (micros?: Record<string, number>): Record<string, number> => {
  if (!micros) return {};
  
  const result: Record<string, number> = {};
  
  Object.entries(micros).forEach(([nutrientName, dvPercent]) => {
    const mgAmount = convertDvToMg(nutrientName, dvPercent);
    if (mgAmount > 0) {
      result[nutrientName] = mgAmount;
    }
  });
  
  return result;
};

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NutritionData } from '@/types/nutrition';

interface EditableNutritionDisplayProps {
  data: NutritionData;
  image?: string | null;
  onDataChange: (data: NutritionData) => void;
}

export const EditableNutritionDisplay = ({ data, image, onDataChange }: EditableNutritionDisplayProps) => {
  const [editableData, setEditableData] = useState<NutritionData>(data);
  const [stringValues, setStringValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setEditableData(data);
    // Initialize string values from data
    const newStringValues: Record<string, string> = {};
    const nutritionFields = ['calories', 'fat', 'sodium', 'carbs', 'sugar', 'fiber', 'protein'];
    nutritionFields.forEach(field => {
      const value = data[field as keyof NutritionData];
      newStringValues[field] = value !== undefined ? value.toString() : '';
    });
    setStringValues(newStringValues);
  }, [data]);

  const handleValueChange = (field: keyof NutritionData, value: string | number) => {
    const newData = { ...editableData, [field]: value };
    setEditableData(newData);
    onDataChange(newData);
  };

  const handleNumericValueChange = (field: string, stringValue: string) => {
    // Store the string value to preserve leading zeros
    setStringValues(prev => ({ ...prev, [field]: stringValue }));
    
    // Convert to number for the data object
    const numericValue = stringValue === '' ? 0 : parseFloat(stringValue) || 0;
    handleValueChange(field as keyof NutritionData, numericValue);
  };

  const nutritionFields = [
    { key: 'calories', label: 'Calories', unit: 'kcal' },
    { key: 'fat', label: 'Fat', unit: 'g' },
    { key: 'sodium', label: 'Sodium', unit: 'mg' },
    { key: 'carbs', label: 'Carbs', unit: 'g' },
    { key: 'sugar', label: 'Sugar', unit: 'g' },
    { key: 'fiber', label: 'Fiber', unit: 'g' },
    { key: 'protein', label: 'Protein', unit: 'g' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Image on the left */}
      {image && (
        <div className="flex-shrink-0 w-full lg:w-1/2 max-w-md">
          <img 
            src={image} 
            alt="Analyzed nutrition label" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Nutrition data to the right */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white flex-1 min-w-0">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">
            <Input
              value={editableData.productName || ''}
              onChange={(e) => handleValueChange('productName', e.target.value)}
              placeholder="Product Name"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/50 text-lg font-semibold"
            />
          </CardTitle>
          <Input
            value={editableData.servingSize || ''}
            onChange={(e) => handleValueChange('servingSize', e.target.value)}
            placeholder="Serving Size"
            className="bg-white/10 border-white/30 text-white placeholder:text-white/50 text-sm"
          />
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {nutritionFields.map((field) => (
              <div key={field.key} className="flex items-center gap-3">
                <Label className="text-white/90 text-sm w-16 flex-shrink-0">{field.label}</Label>
                <Input
                  type="text"
                  value={stringValues[field.key] || ''}
                  onChange={(e) => handleNumericValueChange(field.key, e.target.value)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 flex-1 h-8 min-w-0"
                  pattern="[0-9]*\.?[0-9]*"
                />
                <span className="text-white/60 text-xs w-8 flex-shrink-0 text-right">{field.unit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

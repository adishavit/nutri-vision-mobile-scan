
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NutritionData } from '@/pages/Index';

interface EditableNutritionDisplayProps {
  data: NutritionData;
  image?: string | null;
  onDataChange: (data: NutritionData) => void;
}

export const EditableNutritionDisplay = ({ data, image, onDataChange }: EditableNutritionDisplayProps) => {
  const [editableData, setEditableData] = useState<NutritionData>(data);

  useEffect(() => {
    setEditableData(data);
  }, [data]);

  const handleValueChange = (field: keyof NutritionData, value: string | number) => {
    const newData = { ...editableData, [field]: value };
    setEditableData(newData);
    onDataChange(newData);
  };

  const nutritionFields = [
    { key: 'calories' as keyof NutritionData, label: 'Calories', unit: 'kcal' },
    { key: 'protein' as keyof NutritionData, label: 'Protein', unit: 'g' },
    { key: 'carbs' as keyof NutritionData, label: 'Carbs', unit: 'g' },
    { key: 'fat' as keyof NutritionData, label: 'Fat', unit: 'g' },
    { key: 'fiber' as keyof NutritionData, label: 'Fiber', unit: 'g' },
    { key: 'sugar' as keyof NutritionData, label: 'Sugar', unit: 'g' },
    { key: 'sodium' as keyof NutritionData, label: 'Sodium', unit: 'mg' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">
      {/* Image on the left for desktop, top for mobile */}
      {image && (
        <div className="flex-shrink-0 w-full lg:w-48">
          <img 
            src={image} 
            alt="Analyzed nutrition label" 
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}

      {/* Nutrition data - full width on mobile, right side on desktop */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white flex-1 w-full">
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
              <div key={field.key} className="flex items-center gap-2">
                <Label className="text-white/90 text-sm min-w-[60px] flex-shrink-0">{field.label}</Label>
                <Input
                  type="number"
                  value={editableData[field.key] || ''}
                  onChange={(e) => handleValueChange(field.key, parseFloat(e.target.value) || 0)}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 flex-1 h-8 min-w-[80px]"
                  step="0.1"
                />
                <span className="text-white/60 text-xs min-w-[24px] flex-shrink-0">{field.unit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

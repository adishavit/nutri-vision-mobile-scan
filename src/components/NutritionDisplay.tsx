import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NutritionData } from '@/types/nutrition';

interface NutritionDisplayProps {
  data: NutritionData;
  image?: string | null;
}

export const NutritionDisplay = ({ data, image }: NutritionDisplayProps) => {
  const nutritionItems = [
    { label: 'Calories', value: data.calories, unit: 'kcal' },
    { label: 'Protein', value: data.protein, unit: 'g' },
    { label: 'Carbs', value: data.carbs, unit: 'g' },
    { label: 'Fat', value: data.fat, unit: 'g' },
    { label: 'Fiber', value: data.fiber, unit: 'g' },
    { label: 'Sugar', value: data.sugar, unit: 'g' },
    { label: 'Sodium', value: data.sodium, unit: 'mg' },
  ];

  return (
    <div className="space-y-4">
      {image && (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="pt-4">
            <img 
              src={image} 
              alt="Analyzed nutrition label" 
              className="w-full rounded-lg shadow-lg max-h-48 object-cover"
            />
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="text-xl">
            {data.productName || 'Nutritional Information'}
          </CardTitle>
          {data.servingSize && (
            <p className="text-white/80 text-sm">Serving Size: {data.servingSize}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {nutritionItems.map((item, index) => (
              item.value !== undefined && (
                <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-white">
                    {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
                  </div>
                  <div className="text-white/80 text-sm">{item.label}</div>
                  <div className="text-white/60 text-xs">{item.unit}</div>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

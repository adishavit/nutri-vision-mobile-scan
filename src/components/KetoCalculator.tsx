
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NutritionData } from '@/pages/Index';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KetoCalculatorProps {
  nutritionData: NutritionData;
}

export const KetoCalculator = ({ nutritionData }: KetoCalculatorProps) => {
  const { protein = 0, carbs = 0, fat = 0, fiber = 0 } = nutritionData;
  
  // Calculate net carbs (total carbs - fiber)
  const netCarbs = Math.max(0, carbs - fiber);
  
  // Calculate total macros for percentage calculation
  const totalMacros = protein + netCarbs + fat;
  
  if (totalMacros === 0) {
    return null;
  }
  
  // Calculate macro percentages
  const fatPercentage = (fat / totalMacros) * 100;
  const proteinPercentage = (protein / totalMacros) * 100;
  const carbPercentage = (netCarbs / totalMacros) * 100;
  
  // Determine keto compatibility using the correct formula: 3*(Fat) >= 2*(protein + (carbs - fiber))
  const getKetoStatus = () => {
    const ketoFormula = 3 * fat >= 2 * (protein + netCarbs);
    
    if (ketoFormula && carbPercentage <= 10) {
      return { status: 'Keto Friendly', color: 'bg-green-500', icon: TrendingUp };
    } else if (fatPercentage >= 50 && carbPercentage <= 20) {
      return { status: 'Low Carb', color: 'bg-yellow-500', icon: Minus };
    } else {
      return { status: 'High Carb', color: 'bg-red-500', icon: TrendingDown };
    }
  };
  
  const ketoStatus = getKetoStatus();
  const StatusIcon = ketoStatus.icon;

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className="w-5 h-5" />
          Keto Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Keto Status Badge */}
        <div className="flex justify-center">
          <Badge className={`${ketoStatus.color} text-white px-4 py-2 text-sm font-semibold`}>
            {ketoStatus.status}
          </Badge>
        </div>

        {/* Macro Breakdown */}
        <div className="space-y-3">
          <h4 className="font-semibold text-center">Macro Breakdown</h4>
          
          {/* Fat */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Fat</span>
              <span>{fatPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(fatPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Protein */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Protein</span>
              <span>{proteinPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(proteinPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Net Carbs */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Net Carbs</span>
              <span>{carbPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-red-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(carbPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Net Carbs Info */}
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-lg font-bold">{netCarbs.toFixed(1)}g</div>
          <div className="text-white/80 text-sm">Net Carbs</div>
          <div className="text-white/60 text-xs">
            ({carbs}g total - {fiber}g fiber)
          </div>
        </div>

        {/* Keto Formula Display */}
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-white/80 text-xs mb-1">Keto Formula:</div>
          <div className="text-sm font-mono">
            3×{fat}g ≥ 2×({protein}g + {netCarbs}g)
          </div>
          <div className="text-sm font-mono">
            {(3 * fat).toFixed(1)} ≥ {(2 * (protein + netCarbs)).toFixed(1)}
          </div>
        </div>

        {/* Keto Guidelines */}
        <div className="text-xs text-white/70 text-center space-y-1">
          <p>Keto Guidelines:</p>
          <p>Fat: 70-80% • Protein: 15-25% • Net Carbs: 5-10%</p>
        </div>
      </CardContent>
    </Card>
  );
};

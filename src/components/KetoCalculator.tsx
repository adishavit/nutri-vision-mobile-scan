import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { NutritionData } from '@/types/nutrition';
import { useKetoMath } from '@/hooks/useKetoMath';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface KetoCalculatorProps {
  nutritionData: NutritionData;
}

export const KetoCalculator = ({ nutritionData }: KetoCalculatorProps) => {
  const ketoMath = useKetoMath(nutritionData);
  const [microsOpen, setMicrosOpen] = useState(false);
  
  if (!ketoMath) {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Keto Analysis Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/80 text-sm">
            Serving weight could not be determined from the label. Please take a clearer photo 
            or manually edit the serving size to include weight (e.g., "30 g" or "2 tbsp (30 mL)").
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { per100g, verdict, calorieMismatch, originalKcal100, giConfidence, ketoScore, microsPer100g, warnings } = ketoMath;
  const StatusIcon = verdict.ketoOk ? CheckCircle : XCircle;

  // GI confidence badge color
  const getGiConfidenceColor = (confidence: string) => {
    if (confidence === 'direct' || confidence === 'table') return 'bg-green-500';
    if (confidence === 'heuristic-0.9') return 'bg-amber-500';
    return 'bg-gray-500';
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className={`w-5 h-5 ${verdict.ketoOk ? 'text-green-500' : 'text-red-500'}`} />
          Keto Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* KetoScore Dial */}
        <div className="flex justify-center">
          <div className="relative w-24 h-24">
            <div className="keto-score-dial" style={{'--score': ketoScore} as React.CSSProperties}>
              <div className="keto-score-inner">
                <span className="text-lg font-bold">{Math.round(ketoScore)}</span>
                <span className="text-xs">Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Keto Status Badge */}
        <div className="flex justify-center">
          <Badge className={`${verdict.ketoOk ? 'bg-green-500' : 'bg-red-500'} text-white px-4 py-2 text-sm font-semibold`}>
            {verdict.ketoOk ? 'Keto Friendly' : 'Not Keto Friendly'}
          </Badge>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-1">
            {warnings.map((warning, index) => (
              <div key={index} className="bg-red-500/20 border border-red-500/50 rounded-lg p-2">
                <div className="flex items-center gap-2 text-red-300">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{warning}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Per 100g Table */}
        <div className="space-y-3">
          <h4 className="font-semibold text-center">Per 100g Analysis</h4>
          
          <div className="bg-white/10 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Fat: {per100g.fat100.toFixed(1)}g</div>
              <div>Protein: {per100g.protein100.toFixed(1)}g</div>
              <div>Carbs: {per100g.carbs100.toFixed(1)}g</div>
              <div>Fiber: {per100g.fiber100.toFixed(1)}g</div>
              <div>Net Carbs: {per100g.netCarb100.toFixed(1)}g</div>
              <div>Calories: {per100g.kcal100.toFixed(0)} kcal</div>
              {per100g.sa100 > 0 && <div>Sugar Alcohol: {per100g.sa100.toFixed(1)}g</div>}
              {per100g.addedSugar100 > 0 && <div>Added Sugar: {per100g.addedSugar100.toFixed(1)}g</div>}
              <div>Carb %: {per100g.pctCarb.toFixed(1)}%</div>
              <div>Sat Fat %: {(per100g.satRatio * 100).toFixed(1)}%</div>
              <div className="flex items-center gap-1">
                GI: {per100g.gi}
                <Badge className={`${getGiConfidenceColor(giConfidence)} text-white text-xs px-1 py-0`}>
                  {giConfidence.replace('heuristic-', 'est ')}
                </Badge>
              </div>
              <div>GL: {per100g.gl100.toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Micronutrients Accordion */}
        {Object.keys(microsPer100g).length > 0 && (
          <Collapsible open={microsOpen} onOpenChange={setMicrosOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full bg-white/10 rounded-lg p-3 text-sm font-semibold">
              <span>Micronutrients (per 100g)</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${microsOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(microsPer100g).map(([nutrient, amount]) => (
                    <div key={nutrient}>
                      {nutrient}: {amount.toFixed(1)}mg
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Keto Flags */}
        <div className="space-y-2">
          <h4 className="font-semibold text-center">Keto Checks</h4>
          
          <div className="flex items-center gap-2 text-sm">
            {verdict.passesNet ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className={verdict.passesNet ? 'text-green-300' : 'text-red-300'}>
              Net carbs &lt; 5g/100g ({per100g.netCarb100.toFixed(1)}g)
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            {verdict.passesR ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className={verdict.passesR ? 'text-green-300' : 'text-red-300'}>
              Fat dominance R ≥ 1 ({per100g.R.toFixed(2)})
            </span>
          </div>
        </div>

        {/* Keto Formula Display */}
        <div className="bg-white/10 rounded-lg p-3 text-center">
          <div className="text-white/80 text-xs mb-1">Fat Dominance Formula:</div>
          <div className="text-sm font-mono">
            R = 9×{per100g.fat100.toFixed(1)} ÷ 4×({per100g.protein100.toFixed(1)} + {per100g.netCarb100.toFixed(1)})
          </div>
          <div className="text-sm font-mono">
            R = {per100g.R.toFixed(2)}
          </div>
        </div>

        {/* Keto Guidelines */}
        <div className="text-xs text-white/70 text-center space-y-1">
          <p>Keto Requirements:</p>
          <p>Net Carbs &lt; 5g/100g • Fat Dominance R ≥ 1</p>
        </div>
      </CardContent>
    </Card>
  );
};

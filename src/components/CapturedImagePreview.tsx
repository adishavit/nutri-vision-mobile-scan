
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Loader2 } from 'lucide-react';

interface CapturedImagePreviewProps {
  capturedImage: string;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onRetake: () => void;
}

export const CapturedImagePreview = ({ 
  capturedImage, 
  isAnalyzing, 
  onAnalyze, 
  onRetake 
}: CapturedImagePreviewProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6 max-w-md mx-auto">
      <CardContent className="pt-6">
        {/* Action buttons at the top */}
        <div className="flex gap-3 mb-4">
          <Button 
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="flex-1 bg-black/70 text-white hover:bg-black/80 font-semibold border border-white/30"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
          <Button 
            onClick={onRetake}
            className="px-6 bg-black/70 text-white hover:bg-black/80 border border-white/30"
          >
            Retake
          </Button>
        </div>
        
        {/* Image preview below buttons */}
        <img 
          src={capturedImage} 
          alt="Captured nutrition label" 
          className="w-full rounded-lg shadow-lg"
        />
      </CardContent>
    </Card>
  );
};

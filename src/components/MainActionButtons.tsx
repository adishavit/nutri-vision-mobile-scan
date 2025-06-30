
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload } from 'lucide-react';

interface MainActionButtonsProps {
  onOpenCamera: () => void;
  onOpenFileUpload: () => void;
}

export const MainActionButtons = ({ onOpenCamera, onOpenFileUpload }: MainActionButtonsProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white max-w-md mx-auto">
      <CardContent className="pt-8 pb-8 text-center">
        <Camera className="w-20 h-20 mx-auto mb-6 text-white/80" />
        <h2 className="text-xl font-semibold mb-4">Ready to Scan</h2>
        <p className="text-white/80 mb-6">
          Take a photo or upload an image of any nutrition label
        </p>
        <div className="space-y-3">
          <Button 
            onClick={onOpenCamera}
            className="w-full bg-black/70 text-white hover:bg-black/80 font-semibold py-3 border border-white/30"
            size="lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            Open Camera
          </Button>
          <Button 
            onClick={onOpenFileUpload}
            className="w-full bg-black/70 text-white hover:bg-black/80 font-semibold py-3 border border-white/30"
            size="lg"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Image
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

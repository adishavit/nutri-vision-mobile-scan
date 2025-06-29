
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onUpload: (imageDataUrl: string) => void;
  onClose: () => void;
}

export const FileUpload = ({ onUpload, onClose }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onUpload(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-6">
      <CardContent className="pt-6 text-center">
        <div className="flex justify-end mb-4">
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <Upload className="w-20 h-20 mx-auto mb-6 text-white/80" />
        <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
        <p className="text-white/80 mb-6">
          Select a photo of a nutrition label from your device
        </p>
        
        <Button 
          onClick={triggerFileSelect}
          className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold py-3"
          size="lg"
        >
          <Upload className="w-5 h-5 mr-2" />
          Choose File
        </Button>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  );
};


import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, X, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to any available camera
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
        setStream(fallbackStream);
      } catch (fallbackError) {
        console.error('Fallback camera access failed:', fallbackError);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(imageDataUrl);
      }
    }
  };

  const switchCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user');
  };

  return (
    <Card className="bg-black/90 backdrop-blur-sm border-white/20 mb-6">
      <CardContent className="p-0 relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          
          {/* Camera overlay - vertical label frame */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="border-2 border-white/50 rounded-lg w-3/5 h-4/5 flex items-center justify-center">
              <div className="text-white/70 text-center">
                <Camera className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Position nutrition label here</p>
              </div>
            </div>
          </div>

          {/* Camera controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
            <Button
              onClick={onClose}
              size="icon"
              variant="outline"
              className="rounded-full bg-black/50 border-white/30 text-white hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={capturePhoto}
              size="icon"
              className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90"
            >
              <Camera className="w-6 h-6" />
            </Button>
            
            <Button
              onClick={switchCamera}
              size="icon"
              variant="outline"
              className="rounded-full bg-black/50 border-white/30 text-white hover:bg-black/70"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

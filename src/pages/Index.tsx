
import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CameraCapture } from '@/components/CameraCapture';
import { FileUpload } from '@/components/FileUpload';
import { EditableNutritionDisplay } from '@/components/EditableNutritionDisplay';
import { KetoCalculator } from '@/components/KetoCalculator';
import { ApiKeyManager } from '@/components/ApiKeyManager';
import { MainActionButtons } from '@/components/MainActionButtons';
import { CapturedImagePreview } from '@/components/CapturedImagePreview';
import { useNutritionScanner } from '@/hooks/useNutritionScanner';

const Index = () => {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  const {
    capturedImage,
    nutritionData,
    isAnalyzing,
    showCamera,
    showFileUpload,
    apiKey,
    setShowCamera,
    setShowFileUpload,
    setApiKey,
    handleImageCapture,
    handleFileUpload,
    analyzeImage,
    resetApp,
    handleNutritionDataChange,
  } = useNutritionScanner();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-blue-600">
      <div className="container mx-auto px-4 py-6 pb-32 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">NutriScan</h1>
          <p className="text-white/80">Scan nutrition labels instantly</p>
          
          <ApiKeyManager 
            apiKey={apiKey}
            setApiKey={setApiKey}
            showApiKeyInput={showApiKeyInput}
            setShowApiKeyInput={setShowApiKeyInput}
          />
        </div>

        {/* Camera Component */}
        {showCamera && (
          <div className="max-w-md mx-auto">
            <CameraCapture
              onCapture={handleImageCapture}
              onClose={() => setShowCamera(false)}
            />
          </div>
        )}

        {/* File Upload Component */}
        {showFileUpload && (
          <div className="max-w-md mx-auto">
            <FileUpload
              onUpload={handleFileUpload}
              onClose={() => setShowFileUpload(false)}
            />
          </div>
        )}

        {/* Main Content */}
        {!capturedImage && !showCamera && !showFileUpload && !showApiKeyInput && (
          <MainActionButtons 
            onOpenCamera={() => setShowCamera(true)}
            onOpenFileUpload={() => setShowFileUpload(true)}
          />
        )}

        {/* Captured Image Preview */}
        {capturedImage && !nutritionData && !showApiKeyInput && (
          <CapturedImagePreview 
            capturedImage={capturedImage}
            isAnalyzing={isAnalyzing}
            onAnalyze={analyzeImage}
            onRetake={resetApp}
          />
        )}

        {/* Results */}
        {nutritionData && !showApiKeyInput && (
          <div className="space-y-6">
            {/* Take Another Photo button at the top */}
            <div className="flex justify-center">
              <Button 
                onClick={resetApp}
                className="bg-black/70 text-white hover:bg-black/80 font-semibold border border-white/30"
                size="lg"
              >
                Take Another Photo
              </Button>
            </div>
            
            <EditableNutritionDisplay 
              data={nutritionData}
              image={capturedImage}
              onDataChange={handleNutritionDataChange}
            />
            <KetoCalculator nutritionData={nutritionData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;

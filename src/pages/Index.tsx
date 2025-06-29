
import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, Calculator, Zap, Key, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CameraCapture } from '@/components/CameraCapture';
import { FileUpload } from '@/components/FileUpload';
import { EditableNutritionDisplay } from '@/components/EditableNutritionDisplay';
import { KetoCalculator } from '@/components/KetoCalculator';
import { analyzeNutritionImage, promptForApiKey } from '@/services/nutritionAnalysis';
import { toast } from '@/hooks/use-toast';

export interface NutritionData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: string;
  productName?: string;
}

const Index = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleImageCapture = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setShowCamera(false);
    setShowFileUpload(false);
    console.log('Image captured, starting analysis...');
  };

  const handleFileUpload = (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setShowCamera(false);
    setShowFileUpload(false);
    console.log('File uploaded, starting analysis...');
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    // Check if we need an API key
    if (!localStorage.getItem('openai_api_key')) {
      const key = promptForApiKey();
      if (!key) {
        toast({
          title: "API Key Required",
          description: "Using demo data instead. Add your OpenAI API key for real analysis.",
        });
      }
    }

    setIsAnalyzing(true);
    try {
      console.log('Analyzing nutrition information...');
      const data = await analyzeNutritionImage(capturedImage);
      setNutritionData(data);
      console.log('Analysis complete:', data);
      
      const isDemo = !localStorage.getItem('openai_api_key');
      toast({
        title: isDemo ? "Demo Analysis Complete!" : "Analysis Complete!",
        description: isDemo 
          ? "Showing demo data. Add your OpenAI API key for real analysis."
          : "Nutritional information has been extracted from your image.",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Please try again with a clearer image of the nutrition label.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "Your OpenAI API key has been saved locally.",
      });
    }
  };

  const resetApp = () => {
    setCapturedImage(null);
    setNutritionData(null);
    setShowCamera(false);
    setShowFileUpload(false);
  };

  const handleNutritionDataChange = (data: NutritionData) => {
    setNutritionData(data);
  };

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
          
          {/* API Key Button */}
          <Button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            variant="ghost"
            size="sm"
            className="mt-2 text-white hover:text-white hover:bg-white/20 border border-white/30"
          >
            <Key className="w-4 h-4 mr-2" />
            {apiKey ? 'API Key Set' : 'Set API Key'}
          </Button>
        </div>

        {/* API Key Input */}
        {showApiKeyInput && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white mb-6 max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-lg">OpenAI API Key</CardTitle>
              <p className="text-white/80 text-sm">
                Get your key from{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  platform.openai.com
                </a>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apikey" className="text-white/90">API Key</Label>
                <Input
                  id="apikey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={saveApiKey} className="flex-1 bg-white text-gray-900 hover:bg-gray-100 border border-gray-300">
                  Save Key
                </Button>
                <Button 
                  onClick={() => setShowApiKeyInput(false)}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
              </div>
              <p className="text-xs text-white/60">
                Your API key is stored locally in your browser and never shared.
              </p>
            </CardContent>
          </Card>
        )}

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
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <Camera className="w-20 h-20 mx-auto mb-6 text-white/80" />
              <h2 className="text-xl font-semibold mb-4">Ready to Scan</h2>
              <p className="text-white/80 mb-6">
                Take a photo or upload an image of any nutrition label
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => setShowCamera(true)}
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 border border-gray-300"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Open Camera
                </Button>
                <Button 
                  onClick={() => setShowFileUpload(true)}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/20 font-semibold py-3"
                  size="lg"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Captured Image Preview */}
        {capturedImage && !nutritionData && !showApiKeyInput && (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-6 max-w-md mx-auto">
            <CardContent className="pt-6">
              {/* Action buttons at the top */}
              <div className="flex gap-3 mb-4">
                <Button 
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                  className="flex-1 bg-white text-gray-900 hover:bg-gray-100 font-semibold border border-gray-300"
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
                  onClick={resetApp}
                  variant="outline"
                  className="px-6 border-white/30 text-white hover:bg-white/20"
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
        )}

        {/* Results */}
        {nutritionData && !showApiKeyInput && (
          <div className="space-y-6">
            {/* Take Another Photo button at the top */}
            <div className="flex justify-center">
              <Button 
                onClick={resetApp}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/20 font-semibold"
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

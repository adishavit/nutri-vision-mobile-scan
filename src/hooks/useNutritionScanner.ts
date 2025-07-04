import { useState, useEffect } from 'react';
import { NutritionData } from '@/types/nutrition';
import { analyzeNutritionImage } from '@/services/nutritionAnalysis';
import { processNutritionLabelImage } from '@/utils/imageProcessing';
import { toast } from '@/hooks/use-toast';

export const useNutritionScanner = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nutritionData, setNutritionData] = useState<NutritionData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleImageCapture = async (imageDataUrl: string) => {
    console.log('Image captured, processing...');
    const processedImage = await processNutritionLabelImage(imageDataUrl);
    
    setCapturedImage(processedImage);
    setShowCamera(false);
    setShowFileUpload(false);
    console.log('Image processed, ready for analysis...');
  };

  const handleFileUpload = async (imageDataUrl: string) => {
    console.log('File uploaded, processing...');
    const processedImage = await processNutritionLabelImage(imageDataUrl);
    
    setCapturedImage(processedImage);
    setShowCamera(false);
    setShowFileUpload(false);
    console.log('Image processed, ready for analysis...');
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    try {
      console.log('Analyzing nutrition information...');
      const data = await analyzeNutritionImage(capturedImage);
      setNutritionData(data);
      console.log('Analysis complete:', data);
      
      toast({
        title: "Analysis Complete!",
        description: "Nutritional information has been extracted from your image.",
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Check if it's a serving weight issue
      if (errorMessage.includes('serving weight') || errorMessage.includes('clearer photo')) {
        toast({
          title: "Serving Weight Not Found",
          description: "Take a clearer photo showing the serving size with weight (e.g., '30 g' or '2 tbsp (30 mL)').",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: errorMessage,
          variant: "destructive"
        });
      }
    } finally {
      setIsAnalyzing(false);
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

  return {
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
  };
};

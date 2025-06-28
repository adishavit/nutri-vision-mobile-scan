
import { NutritionData } from '@/pages/Index';

const OPENAI_API_KEY = localStorage.getItem('openai_api_key');

export const analyzeNutritionImage = async (imageDataUrl: string): Promise<NutritionData> => {
  // Check if API key exists
  if (!OPENAI_API_KEY) {
    // For demo purposes, return mock data
    console.log('No OpenAI API key found, returning mock data');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      productName: "Sample Nutrition Label",
      servingSize: "1 cup (240g)",
      calories: 150,
      protein: 8.0,
      carbs: 20.0,
      fat: 5.0,
      fiber: 3.0,
      sugar: 12.0,
      sodium: 300
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this nutrition label image and extract the nutritional information. Return ONLY valid JSON with these exact fields: productName, servingSize, calories, protein, carbs, fat, fiber, sugar, sodium. Use numbers for nutritional values (no units), and strings for productName and servingSize. If a value is not visible, omit that field.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageDataUrl
                }
              }
            ]
          }
        ],
        max_tokens: 500,
        temperature: 0.1
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // Parse the JSON response
    const nutritionData = JSON.parse(content);
    console.log('Parsed nutrition data:', nutritionData);
    
    return nutritionData;
  } catch (error) {
    console.error('Error analyzing nutrition image:', error);
    throw new Error('Failed to analyze nutrition information. Please try again.');
  }
};

// Function to prompt user for API key
export const promptForApiKey = (): string | null => {
  const apiKey = prompt(
    'To analyze nutrition labels, please enter your OpenAI API key:\n\n' +
    'You can get one from: https://platform.openai.com/api-keys\n\n' +
    'Note: Your key will be stored locally in your browser.'
  );
  
  if (apiKey) {
    localStorage.setItem('openai_api_key', apiKey.trim());
    return apiKey.trim();
  }
  
  return null;
};

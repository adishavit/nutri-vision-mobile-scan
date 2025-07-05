
import { NutritionData } from '@/types/nutrition';
import { parseServingWeight } from '@/utils/servingParser';

interface AnalysisResult {
  nutritionData: NutritionData;
  orientation: 'upright' | 'rotated_90' | 'rotated_180' | 'rotated_270';
}

export const analyzeNutritionImage = async (imageDataUrl: string): Promise<NutritionData> => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    throw new Error('OpenAI API key is required. Please set your API key in the settings.');
  }

  console.log('Analyzing nutrition information...');

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Return ONLY a JSON object:
{
  "nutritionData": {
    "productName": "...",
    "servingSize": "...",           // e.g. "2 tbsp (30 mL)" or "30 g"
    "calories": 0,
    "fat": 0,
    "satFat": 0,
    "transFat": 0,
    "protein": 0,
    "carbs": 0,
    "fiber": 0,
    "sugar": 0,
    "sugarAlcohol": 0,
    "sodium": 0
  },
  "orientation": "upright" | "rotated_90" | "rotated_180" | "rotated_270"
}`
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
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your OpenAI API key.');
      }
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from OpenAI API');
    }

    console.log('Raw API response:', content);

    // Extract JSON from the response
    let jsonString = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    console.log('Extracted JSON string:', jsonString);
    
    try {
      const analysisResult: AnalysisResult = JSON.parse(jsonString);
      console.log('Parsed analysis result:', analysisResult);
      
      // Store the orientation for the image processing utility
      if (analysisResult.orientation) {
        localStorage.setItem('detected_orientation', analysisResult.orientation);
        console.log('Stored orientation:', analysisResult.orientation);
      }
      
      // Parse serving weight
      const nutritionData = analysisResult.nutritionData || analysisResult as NutritionData;
      nutritionData.servingWeightG = parseServingWeight(nutritionData.servingSize || '');
      
      if (nutritionData.servingWeightG === null) {
        throw new Error('Serving weight not found – take clearer photo.');
      }
      
      return nutritionData;
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error('Failed to parse nutrition data from API response');
    }
  } catch (error) {
    console.error('Error analyzing nutrition image:', error);
    throw error;
  }
};

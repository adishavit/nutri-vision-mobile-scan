
import { NutritionData } from '@/types/nutrition';

interface AnalysisResult {
  nutritionData: NutritionData;
  orientation: 'upright' | 'rotated_90' | 'rotated_180' | 'rotated_270';
}

export const analyzeNutritionImage = async (imageDataUrl: string): Promise<NutritionData> => {
  const apiKey = localStorage.getItem('openai_api_key');
  
  if (!apiKey) {
    throw new Error('API key is required for nutrition analysis');
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
                text: `Analyze this nutrition label image and extract the nutritional information. Also determine the orientation of the nutrition table.

Return ONLY a JSON object with the following structure:
{
  "nutritionData": {
    "productName": "string",
    "servingSize": "string", 
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "fiber": number,
    "sugar": number,
    "sodium": number
  },
  "orientation": "upright" | "rotated_90" | "rotated_180" | "rotated_270"
}

Important notes:
- Return ONLY the JSON object, no additional text or markdown formatting
- Use numbers for all nutritional values (not strings)
- If a value is not found or unclear, use 0
- Product name and serving size should be strings
- For orientation: "upright" means readable normally, "rotated_90" means rotated 90° clockwise, "rotated_180" means upside down, "rotated_270" means rotated 90° counter-clockwise
- Focus on extracting accurate numbers from the label`
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
      }
      
      return analysisResult.nutritionData || analysisResult as NutritionData;
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error('Failed to parse nutrition data from API response');
    }
  } catch (error) {
    console.error('Error analyzing nutrition image:', error);
    throw error;
  }
};

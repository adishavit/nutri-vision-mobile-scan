
export const processNutritionLabelImage = async (imageDataUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Check if we have a detected orientation from OpenAI
      const detectedOrientation = localStorage.getItem('detected_orientation');
      console.log('Processing image with orientation:', detectedOrientation);
      
      // Set canvas size based on rotation
      if (detectedOrientation === 'rotated_90' || detectedOrientation === 'rotated_270') {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }
      
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Apply rotation based on detected orientation
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        switch (detectedOrientation) {
          case 'rotated_90':
            ctx.rotate(-Math.PI / 2); // Rotate counter-clockwise to fix clockwise rotation
            break;
          case 'rotated_180':
            ctx.rotate(Math.PI);
            break;
          case 'rotated_270':
            ctx.rotate(Math.PI / 2); // Rotate clockwise to fix counter-clockwise rotation
            break;
          case 'upright':
          default:
            // No rotation needed
            break;
        }
        
        // Draw image centered
        if (detectedOrientation === 'rotated_90' || detectedOrientation === 'rotated_270') {
          ctx.drawImage(img, -img.height / 2, -img.width / 2);
        } else {
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
        }
        
        ctx.restore();
        
        // Clean up the stored orientation
        localStorage.removeItem('detected_orientation');
      }
      
      // Return processed image
      const processedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(processedDataUrl);
    };
    
    img.src = imageDataUrl;
  });
};

import { GoogleGenAI } from "@google/genai";

let geminiClient: GoogleGenAI | null = null;

/**
 * Returns a singleton instance of the Gemini client.
 * The API key is sourced from process.env.API_KEY5 OR process.env.API_KEY.
 * Public environment variables (NEXT_PUBLIC_*) are intentionally avoided for security.
 */
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.API_KEY5 || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please ensure secure key injection is available via API_KEY5 or API_KEY.");
    }
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

/**
 * Analyzes media using the Gemini API.
 */
export async function analyzeMedia(
  base64Data: string,
  mimeType: string,
  prompt: string
) {
  const client = getGeminiClient();

  try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash', // Efficient model for media analysis
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Data
                    }
                },
                { text: prompt }
            ]
        }
      });
      return response.text;
  } catch (error) {
      console.error("Error analyzing media:", error);
      throw error;
  }
}

/**
 * Generates an image based on a text prompt using Gemini.
 */
export async function generateImage(prompt: string): Promise<string> {
    const client = getGeminiClient();
    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            // Note: responseMimeType and responseSchema are not supported for image generation models
        });

        // Iterate through parts to find the image part
        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
            if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        
        throw new Error("No image data returned from Gemini.");
    } catch (error) {
        console.error("Image generation failed:", error);
        throw error;
    }
}
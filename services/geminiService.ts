import { GoogleGenAI } from "@google/genai";

/**
 * Helper to get a fresh client instance with the latest API key.
 * We do not cache the client to allow for API key updates during the session.
 */
function getClient(): GoogleGenAI {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Gemini API key is missing. Please ensure API_KEY is available in your environment.");
    }
    return new GoogleGenAI({ apiKey });
}

/**
 * Analyzes media using the Gemini API.
 */
export async function analyzeMedia(
  base64Data: string,
  mimeType: string,
  prompt: string
) {
  const client = getClient();

  try {
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash', 
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
    const client = getClient();
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
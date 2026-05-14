import { GoogleGenAI, Type } from "@google/genai";
import { ChecklistItem } from "../types";

export async function analyzeChecklist(
  imageData: string,
  mimeType: string,
  checklist: ChecklistItem[]
): Promise<{ missingItems: string[]; suggestions: string }> {
  // Use the API key from the environment
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Format the checklist for the prompt
  const checklistStr = checklist
    .filter(item => !item.completed)
    .map(item => `- ${item.name} (${item.category})`)
    .join("\n");

  const prompt = `
    You are a travel packing assistant. 
    Analyze this image of an open suitcase/bag.
    Compare the contents with the following list of items that are NOT YET CHECKED:
    
    ${checklistStr}
    
    Based on the image, identify which items from the list above appear to be MISSING.
    Also, provide any helpful packing suggestions or safety tips for a business trip.
    
    Return the result in JSON format with two fields:
    - "missingItems": An array of strings (the names of the missing items from the checklist)
    - "suggestions": A string containing your overall observations and tips.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { data: imageData, mimeType } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missingItems: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of missing items identified from the checklist."
            },
            suggestions: {
              type: Type.STRING,
              description: "General advice and observations."
            }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      missingItems: result.missingItems || [],
      suggestions: result.suggestions || "사진 분석 결과가 없습니다."
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}

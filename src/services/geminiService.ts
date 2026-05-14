import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { ChecklistItem } from "../types";

export async function analyzeChecklist(
    imageData: string,
    mimeType: string,
    checklist: ChecklistItem[]
  ): Promise<{ missingItems: string[]; suggestions: string }> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
          throw new Error("GEMINI_API_KEY is not defined.");
    }

  const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash-latest",
          generationConfig: {
                  responseMimeType: "application/json",
                  responseSchema: {
                            type: SchemaType.OBJECT,
                            properties: {
                                        missingItems: {
                                                      type: SchemaType.ARRAY,
                                                      items: { type: SchemaType.STRING },
                                        },
                                        suggestions: {
                                                      type: SchemaType.STRING,
                                        },
                            },
                  },
          },
    });

  const checklistStr = checklist
      .filter(item => !item.completed)
      .map(item => `- \${item.name} (\${item.category})`)
      .join("\n");

  const prompt = `
      You are a travel packing assistant specialized in business trips. 
          Analyze this image of an open suitcase or bag.
              Compare the visible contents with the following list of items that are NOT YET CHECKED by the user:

                      \${checklistStr}

                              Based on the image, identify which items from the list above appear to be MISSING.
                                  Also, provide helpful, concise packing suggestions or safety tips specific to the items and a general business trip context.

                                          Return the result in JSON format with exactly these two fields:
                                              - "missingItems": An array of strings (the names of the missing items from the checklist provided).
                                                  - "suggestions": A string containing your overall observations, encouragement, and professional tips.
                                                    `;

  try {
        const result = await model.generateContent([
                prompt,
          {
                    inlineData: {
                                data: imageData,
                                mimeType
                    }
          }
              ]);

      const response = await result.response;
        const text = response.text();
        const parsedResult = JSON.parse(text || "{}");

      return {
              missingItems: parsedResult.missingItems || [],
              suggestions: parsedResult.suggestions || "No analysis result."
      };
  } catch (error) {
        console.error("Gemini Analysis Error:", error);
        throw error;
  }
}

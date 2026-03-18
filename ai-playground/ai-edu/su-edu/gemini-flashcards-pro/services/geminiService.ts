
import { GoogleGenAI, Type } from "@google/genai";
import { Flashcard } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFlashcards = async (categoryName: string): Promise<Flashcard[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am studying: "${categoryName}". 
      Generate 10 educational flashcards to help me memorize the most important concepts, technical terms, and highlighted highlights likely covered in this topic. 
      Keep questions challenging but answers concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique ID" },
              question: { type: Type.STRING, description: "The concept or question" },
              answer: { type: Type.STRING, description: "The definition or answer" }
            },
            required: ["id", "question", "answer"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as Flashcard[];
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error;
  }
};

export type VideoInfo = {
  type: 'youtube' | 'bilibili' | 'native' | null;
  idOrUrl: string | null;
};

/**
 * Universal video parser for multiple platforms
 */
export const extractVideoInfo = (url: string): VideoInfo => {
  // Bilibili
  const bvidMatch = url.match(/BV[a-zA-Z0-9]{10}/);
  if (bvidMatch) return { type: 'bilibili', idOrUrl: bvidMatch[0] };

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  if (youtubeMatch) return { type: 'youtube', idOrUrl: youtubeMatch[1] };

  // YouTube Shorts
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^"&?\/\s]{11})/);
  if (shortsMatch) return { type: 'youtube', idOrUrl: shortsMatch[1] };

  // Native Video Files (Direct Links)
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return { type: 'native', idOrUrl: url };
  }

  return { type: null, idOrUrl: null };
};

/**
 * Legacy support for BVid extraction
 */
export const extractBVid = (url: string): string | null => {
  const match = url.match(/BV[a-zA-Z0-9]{10}/);
  return match ? match[0] : null;
};

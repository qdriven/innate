import { GoogleGenerativeAI } from "@google/generative-ai";
import { Flashcard } from "@/types";
import { generateId } from "@/lib/utils";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function generateFlashcards(topic: string, count: number = 10): Promise<Flashcard[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate ${count} educational flashcards for the topic "${topic}".
Each flashcard should have a clear question and a concise answer suitable for parents and children learning together.
Format the response as a JSON array of objects with "question" and "answer" properties.
Example format:
[
  {"question": "What is X?", "answer": "X is..."},
  {"question": "How does Y work?", "answer": "Y works by..."}
]

Only output the JSON array, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No valid JSON array found in response");
    }
    
    const cards = JSON.parse(jsonMatch[0]);
    
    return cards.map((card: { question: string; answer: string }) => ({
      id: generateId(),
      question: card.question,
      answer: card.answer,
    }));
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw new Error("Failed to generate flashcards. Please check your API key and try again.");
  }
}

export async function generateTopicContent(topic: string, type: "explanation" | "quiz" = "explanation"): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompts = {
    explanation: `Create an educational explanation for the topic "${topic}" suitable for parents and children learning together.
The content should be:
- Clear and engaging
- Include real-world examples
- Have sections for different learning levels (beginner, intermediate)
- Include fun facts or activities
Format the response in Markdown.`,
    quiz: `Generate a quiz for the topic "${topic}" with 5 multiple-choice questions.
Each question should have 4 options and indicate the correct answer.
Format as JSON array:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correct": 0,
    "explanation": "..."
  }
]`
  };

  try {
    const result = await model.generateContent(prompts[type]);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content. Please try again.");
  }
}

export async function generateVisualizationCode(topic: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Generate a complete HTML file with Three.js for an interactive 3D visualization of "${topic}".
The visualization should:
- Be educational and interactive
- Use Three.js from CDN (https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js)
- Include OrbitControls for mouse/touch interaction
- Have a clean, modern design with Tailwind CSS
- Include labels and explanations
- Support both desktop and mobile

Output only the complete HTML code, no explanations.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating visualization:", error);
    throw new Error("Failed to generate visualization. Please try again.");
  }
}

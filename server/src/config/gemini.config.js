import { GoogleGenAI } from '@google/genai';

const generateContent = async (prompt) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    throw error;
  }
};

export { generateContent };
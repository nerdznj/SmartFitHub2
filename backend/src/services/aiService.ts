import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWorkoutPlan = async (userProfile: any) => {
  // Using smart algorithms to generate plan
  const prompt = `
    Create a personalized weekly workout plan (JSON format) based on:
    - Gender: ${userProfile.gender}
    - Age: ${userProfile.age}
    - Weight: ${userProfile.weight}kg
    - Height: ${userProfile.height}cm
    - Body Type: ${userProfile.bodyType}
    - Goal: ${userProfile.fitnessGoal}
    
    Structure: { "monday": [...], "tuesday": [...], ..., "nutrition": "..." }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Expert fitness algorithm.",
        responseMimeType: 'application/json'
      }
    });

    return response.text;
  } catch (error) {
    console.error("Plan Generation Error:", error);
    throw new Error("Unable to generate plan at this time.");
  }
};
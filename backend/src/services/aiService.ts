
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateWorkoutPlan = async (userProfile: any) => {
  const prompt = `
    Create a personalized weekly workout plan (JSON format) for a user with the following stats:
    - Gender: ${userProfile.gender}
    - Age: ${userProfile.age}
    - Weight: ${userProfile.weight}kg
    - Height: ${userProfile.height}cm
    - Body Type: ${userProfile.bodyType}
    - Goal: ${userProfile.fitnessGoal}
    
    The plan should include exercises, sets, reps, and nutrition advice.
    Format: { "monday": [...], "tuesday": [...], ..., "nutrition": "..." }
    Ensure the tone is professional and motivating.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are an expert elite fitness trainer." }, { role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Service Error:", error);
    throw new Error("Failed to generate training plan.");
  }
};

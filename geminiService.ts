
import { GoogleGenAI } from "@google/genai";
import { DayLog } from "../types";

export const getCoachAdvice = async (logs: DayLog[], userMessage: string) => {
  // Always create a new instance right before the call to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const completedCount = logs.filter(l => l.isNoBeerDay).length;
  const target = 120;
  
  const systemPrompt = `You are a supportive, motivational, and insightful health coach for a user participating in the "Beer-Free 120" challenge in 2026.
  The goal is to have 120 days of no beer throughout the year.
  Current progress: ${completedCount}/${target} days completed.
  
  User history overview: ${JSON.stringify(logs.slice(-10))} (last 10 entries).
  
  Your tone should be:
  - Encouraging but firm.
  - Informative about the benefits of reducing alcohol.
  - Practical (suggesting alternatives like mocktails).
  
  Keep responses concise (under 150 words). If the user feels tempted, provide immediate distraction techniques.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "I'm here to support you, but I'm having trouble connecting right now. Stay strong!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I hit a snag, but remember: one day at a time! You've got this.";
  }
};

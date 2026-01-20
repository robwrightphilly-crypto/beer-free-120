import { GoogleGenAI } from "@google/genai";

export const getCoachAdvice = async (logs, userMessage) => {
  // Defensive check for the API key to prevent app-wide crashes
  let apiKey = '';
  try {
    apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || '';
  } catch (e) {
    console.warn("Could not access process.env", e);
  }

  if (!apiKey) {
    return "I'm currently in 'offline mode' because the API Key isn't set up yet. Please follow the instructions to add your API_KEY to Vercel!";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const completedCount = logs.filter(l => l.isNoBeerDay).length;
  const target = 120;
  
  const systemPrompt = `You are a supportive health coach for the "Beer-Free 120" challenge in 2026.
  Goal: 120 days of no beer.
  Current progress: ${completedCount}/${target} days.
  Tone: Encouraging, practical, firm.
  Keep responses under 100 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    return response.text || "I'm here for you! Stay strong.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting to my brain, but you're doing great! Keep it up.";
  }
};
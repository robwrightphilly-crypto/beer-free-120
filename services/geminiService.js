import { GoogleGenerativeAI } from "@google/generative-ai";

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

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const completedCount = logs.filter(l => l.isNoBeerDay).length;
  const target = 120;
  
  const systemPrompt = `You are a supportive health coach for the "Beer-Free 120" challenge in 2026.
  Goal: 120 days of no beer.
  Current progress: ${completedCount}/${target} days.
  Tone: Encouraging, practical, firm.
  Keep responses under 100 words.`;

  try {
    const result = await model.generateContent(systemPrompt + "\n\nUser: " + userMessage);
    const response = await result.response;
    return response.text() || "I'm here for you! Stay strong.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting to my brain, but you're doing great! Keep it up.";
  }
};

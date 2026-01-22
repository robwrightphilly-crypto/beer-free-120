import { GoogleGenerativeAI } from "@google/generative-ai";

export const getCoachAdvice = async (logs, userMessage) => {
  // Defensive check for the API key to prevent app-wide crashes
  let apiKey = '';
  try {
    apiKey = import.meta.env.VITE_API_KEY || '';
  } catch (e) {
    console.warn("Could not access environment variables", e);
  }

  if (!apiKey) {
    return "I'm currently in 'offline mode' because the API Key isn't set up yet. To enable AI coaching, add your VITE_API_KEY environment variable in Vercel settings.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const completedCount = logs.filter(l => l.isNoBeerDay).length;
  const target = 120;
  
  const systemPrompt = `You are a supportive health coach for the "Beer-Free 120" challenge in 2026.
Goal: 120 days of no beer.
Current progress: ${completedCount}/${target} days.
Tone: Encouraging, practical, firm.
Keep responses under 100 words.

User: ${userMessage}`;

  try {
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text() || "I'm here for you! Stay strong.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having a little trouble connecting to my brain, but you're doing great! Keep it up.";
  }
};
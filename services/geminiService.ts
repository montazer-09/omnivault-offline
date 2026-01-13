
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getVaultInsights = async (tasks: any[], habits: any[]) => {
  try {
    const taskSummary = tasks.filter(t => !t.completed).map(t => t.text).join(', ');
    const habitSummary = habits.map(h => `${h.name} (${h.streak} day streak)`).join(', ');
    
    const prompt = `Act as a high-level productivity intelligence officer for a secure "OmniVault" dashboard.
    Current pending tasks: [${taskSummary || 'None'}]
    Active habits: [${habitSummary || 'None'}]
    
    Provide a concise, motivating, and strategic 1-sentence insight or briefing (25 words max). 
    Use a tone that is professional, slightly "high-tech", and supportive.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return "The Vault stands ready. Core encryption active. Your directives await.";
  }
};

export const getAssistantResponse = async (query: string, context?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context of user's vault: ${context}\n\nUser Query: ${query}`,
      config: {
        systemInstruction: "You are OmniAI, the intelligence core of the OmniVault. You provide secure, precise, and professional assistance. Use Google Search for external data.",
        tools: [{ googleSearch: {} }]
      }
    });
    
    let text = response.text || "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks && chunks.length > 0) {
      text += "\n\n**Intelligence Sources:**\n";
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
        }
      });
    }
    
    return text;
  } catch (error) {
    return "Internal communication protocol failed. Retrying...";
  }
};

export const getDailyQuote = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a short, powerful motivational quote themed around security, focus, or excellence. Format: Quote - Author",
    });
    return response.text || "Excellence is not an act, but a habit. - Aristotle";
  } catch (error) {
    return "Discipline equals freedom. - Jocko Willink";
  }
};

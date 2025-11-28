import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from '../types';

const getAiClient = () => {
  // Check for API key in environment
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const streamChatResponse = async (
  history: ChatMessage[],
  newMessage: string,
  onChunk: (text: string) => void
) => {
  const ai = getAiClient();
  if (!ai) {
    onChunk("I'm sorry, I cannot connect to the Wekewa AI services right now. Please check your API configuration.");
    return;
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are Wekewa Guard, an intelligent crypto assistant for the Wekewa P2P exchange.
        Your goal is to help users buy and sell Worldcoin (WLD) safely.
        
        Key responsibilities:
        1. Explain how P2P trading works (Escrow, releasing funds, safety).
        2. Provide current market context for Worldcoin using the 'googleSearch' tool if available.
        3. Warn users about common scams (e.g., releasing crypto before payment confirmation).
        4. Be concise, professional, and friendly.
        
        If asked about prices, use the search tool to find the latest Worldcoin price.
        If asked about the platform, Wekewa is a P2P marketplace specifically for WLD.
        `,
        tools: [{ googleSearch: {} }] // Enable Google Search for real-time price info
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessageStream({ message: newMessage });
    
    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      if (c.text) {
        onChunk(c.text);
      }
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    onChunk("\n(I encountered an error retrieving the latest data. Please try again.)");
  }
};

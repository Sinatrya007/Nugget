
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateShareMessage = async (creatorName: string, purpose: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a short, polite request for someone to share their live location. 
    Creator name: ${creatorName}. 
    Purpose: ${purpose}. 
    Keep it professional and reassuring. Max 2 sentences.`,
  });
  return response.text || "Please share your location with me so I can see where you are.";
};

export const reverseGeocodeSimulation = async (lat: number, lng: number) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `I have coordinates: latitude ${lat}, longitude ${lng}. 
    Describe what kind of environment this likely is or give a friendly message about this location. 
    Since you are an AI, be generic but helpful.`,
  });
  return response.text || "Location received successfully.";
};

/**
 * Gemini Client Configuration
 * 
 * Centralized Gemini client used by all AI generation steps.
 * 
 * Environment:
 * - Requires GOOGLE_API_KEY environment variable
 */
import { GoogleGenAI } from "@google/genai";

export const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
});

// Primary models for the application
export const MODELS = {
  FLASH: "gemini-2.0-flash",
  PRO: "gemini-2.0-pro-exp-02-05", // Using the latest experimental Pro model if available, or fallback
  DEFAULT: "gemini-2.0-flash",
} as const;

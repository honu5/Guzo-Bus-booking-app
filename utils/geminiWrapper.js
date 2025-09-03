
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load system instructions
const infoFilePath = path.join(__dirname, "info.txt");
const systemInstructions = fs.readFileSync(infoFilePath, "utf-8");
let lang = "english";
let language = `respond in ${lang} now`;

export function setLanguage(newLang) {
  lang = newLang;
  language = `respond in ${lang} now`;
}

export function getLanguage() {
  return lang;
}


const genAI = new GoogleGenerativeAI("AIzaSyDV34GiCLEsh5kJwii_CpWZcGxjMxxIFG8");

export async function getGeminiResponse(userMessage, conversationHistory = []) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  // Convert past conversation into Gemini's content format
  const historyContent = conversationHistory.flatMap(entry => [
    { role: "user", parts: [{ text: entry.message }] },
    { role: "model", parts: [{ text: entry.response }] }
  ]);

  // Build full conversation with system-like instructions at the start
  const contents = [
    { role: "user", parts: [{ text: systemInstructions + "  " + language }] }, // acts as system prompt
    ...historyContent,
    { role: "user", parts: [{ text: userMessage }] }
  ];

  try {
    const result = await model.generateContent({ contents });
    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || 
                 "No response from model.";
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I couldn't get a response right now.";
  }
}

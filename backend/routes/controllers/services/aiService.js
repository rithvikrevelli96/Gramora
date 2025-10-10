import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateAIContent = async (prompt) => {
  const fullPrompt = `Write a catchy Instagram caption and 10 trending hashtags for: ${prompt}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: fullPrompt }],
  });
  return response.choices[0].message.content;
};

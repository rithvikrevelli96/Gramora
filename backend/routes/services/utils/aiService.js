import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("⚠️ Missing GEMINI_API_KEY in .env");
}

// 🔹 Unified Caption + Hashtag Generator
export const generateContentBundle = async (idea, segment) => {
  try {
    console.log("📤 Gemini request received with idea:", idea, "segment:", segment);

    const prompt = `
Generate 8 creative Instagram captions and 15 relevant hashtags for a post about "${idea}" in the "${segment}" category.
Return captions as a list, and hashtags as a list starting with #.
Example format:
Captions:
- Caption 1
- Caption 2
- Caption 3
- Caption 4
- Caption 5
- Caption 6
- Caption 7
- Caption 8

Hashtags:
#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10 #tag11 #tag12 #tag13 #tag14 #tag15
`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error("❌ Gemini API error:", response.status, raw);
      throw new Error(`Gemini API failed with status ${response.status}`);
    }

    const data = JSON.parse(raw);
    const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const captions = output.match(/(?:^|\n)- (.+)/g)?.map(line => line.replace(/^- /, "").trim()) || [];
    const hashtags = output.match(/#\w+/g) || [];

    console.log("✅ Captions:", captions);
    console.log("✅ Hashtags:", hashtags);

    return { captions, hashtags };
  } catch (err) {
    console.error("❌ Gemini content error:", err.message);
    return {
      captions: ["⚠️ Failed to generate captions."],
      hashtags: ["#Gramora"]
    };
  }
};
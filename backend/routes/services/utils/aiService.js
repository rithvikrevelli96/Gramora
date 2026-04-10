import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
  console.warn("⚠️ Missing GROQ_API_KEY in .env");
}

// 🔹 Unified Caption + Hashtag Generator
export const generateContentBundle = async (idea, segment) => {
  try {
    console.log("📤 Groq request received with idea:", idea, "segment:", segment);

    const prompt = `Generate 8 creative Instagram captions and 15 relevant hashtags for a post about "${idea}" in the "${segment}" category.
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
#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10 #tag11 #tag12 #tag13 #tag14 #tag15`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error("❌ Groq API error:", response.status, raw);
      throw new Error(`Groq API failed with status ${response.status}`);
    }

    const data = JSON.parse(raw);
    const output = data?.choices?.[0]?.message?.content || "";

    const captions = output.match(/(?:^|\n)- (.+)/g)?.map(line => line.replace(/^- /, "").trim()) || [];
    const hashtags = output.match(/#\w+/g) || [];

    console.log("✅ Captions:", captions);
    console.log("✅ Hashtags:", hashtags);

    return { captions, hashtags };
  } catch (err) {
    console.error("❌ Groq content error:", err.message);
    return {
      captions: ["⚠️ Failed to generate captions."],
      hashtags: ["#Gramora"]
    };
  }
};
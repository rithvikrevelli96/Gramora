import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function testGroq() {
    try {
        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [
                    {
                        role: "user",
                        content: "Write a funny Instagram caption for a sunrise photo."
                    }
                ]
            })
        });

        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        console.log("✅ Groq response:", text);
    } catch (err) {
        console.error("❌ Groq test failed:", err.message);
    }
}

testGroq();
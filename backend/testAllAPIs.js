import dotenv from "dotenv";
import fetch from "node-fetch";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("\n========== GRAMORA BACKEND API TEST ==========\n");

// 1. Environment Variables Check
console.log("1️⃣ Environment Variables Check:");
const requiredVars = [
    "PORT",
    "GROQ_API_KEY",
    "INSTAGRAM_ACCESS_TOKEN",
    "MONGODB_URI",
    "CLOUD_NAME",
    "CLOUD_API_KEY",
];

const envStatus = {};
requiredVars.forEach((key) => {
    const value = process.env[key];
    if (value) {
        const masked =
            value.substring(0, 8) + "..." + value.substring(value.length - 5);
        console.log(`  ✅ ${key}: Present (${masked})`);
        envStatus[key] = true;
    } else {
        console.log(`  ❌ ${key}: MISSING`);
        envStatus[key] = false;
    }
});

// 2. MongoDB Connection Test
console.log("\n2️⃣ MongoDB Connection Test:");
try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("  ✅ MongoDB: Connected successfully");
    await mongoose.connection.close();
} catch (err) {
    console.log(`  ❌ MongoDB: Connection failed - ${err.message}`);
}

// 3. Test Groq API Direct Call
console.log("\n3️⃣ Groq API Direct Test:");
try {
    const groqResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: "Hello, say hi!" }],
                max_tokens: 10,
            }),
        }
    );

    if (groqResponse.ok) {
        const data = await groqResponse.json();
        const message = data?.choices?.[0]?.message?.content;
        console.log(`  ✅ Groq API: Working correctly`);
        console.log(`  📝 Response: ${message}`);
    } else {
        const error = await groqResponse.text();
        console.log(
            `  ❌ Groq API: Error ${groqResponse.status} - ${error.substring(0, 100)}`
        );
    }
} catch (err) {
    console.log(`  ❌ Groq API: Connection failed - ${err.message}`);
}

// 4. Test Caption Generation with Groq
console.log("\n4️⃣ Caption Generation Test (Groq API):");
try {
    const prompt = `Generate 5 creative Instagram captions for a post about "sunrise photography" in the "travel" category. 
Return only the captions, one per line, numbered.`;

    const generateResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 300,
            }),
        }
    );

    if (generateResponse.ok) {
        const data = await generateResponse.json();
        const captions = data?.choices?.[0]?.message?.content;
        console.log(`  ✅ Caption Generation: Success`);
        console.log(`\n  Generated Captions:\n`);
        console.log(captions);
    } else {
        const error = await generateResponse.text();
        console.log(
            `  ❌ Caption Generation: Error ${generateResponse.status} - ${error}`
        );
    }
} catch (err) {
    console.log(`  ❌ Caption Generation: Failed - ${err.message}`);
}

// 5. Test Hashtag Generation
console.log("\n5️⃣ Hashtag Generation Test (Groq API):");
try {
    const hashtagPrompt = `Generate 15 relevant Instagram hashtags for a post about "sunrise photography" in the "travel" category.
Return only hashtags starting with # separated by spaces.`;

    const hashtagResponse = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{ role: "user", content: hashtagPrompt }],
                max_tokens: 100,
            }),
        }
    );

    if (hashtagResponse.ok) {
        const data = await hashtagResponse.json();
        const hashtags = data?.choices?.[0]?.message?.content;
        console.log(`  ✅ Hashtag Generation: Success`);
        console.log(`\n  Generated Hashtags:\n`);
        console.log(hashtags);
    } else {
        const error = await hashtagResponse.text();
        console.log(
            `  ❌ Hashtag Generation: Error ${hashtagResponse.status} - ${error}`
        );
    }
} catch (err) {
    console.log(`  ❌ Hashtag Generation: Failed - ${err.message}`);
}

// 6. Test Cloudinary API
console.log("\n6️⃣ Cloudinary API Test:");
try {
    const cloudResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/image?max_results=1`,
        {
            method: "GET",
            headers: {
                Authorization: `Basic ${Buffer.from(
                    `${process.env.CLOUD_API_KEY}:${process.env.CLOUD_API_SECRET}`
                ).toString("base64")}`,
            },
        }
    );

    if (cloudResponse.ok || cloudResponse.status === 200) {
        console.log("  ✅ Cloudinary API: Credentials valid");
    } else {
        console.log(`  ❌ Cloudinary API: Error ${cloudResponse.status}`);
    }
} catch (err) {
    console.log(`  ❌ Cloudinary API: Connection failed - ${err.message}`);
}

// 7. Test Instagram API
console.log("\n7️⃣ Instagram API Test:");
try {
    const igResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );

    if (igResponse.ok) {
        const data = await igResponse.json();
        console.log("  ✅ Instagram API: Token is valid");
        console.log(`  👤 Username: ${data.username}`);
    } else {
        const error = await igResponse.json();
        console.log(
            `  ⚠️ Instagram API: ${error.error?.message || "Error " + igResponse.status}`
        );
    }
} catch (err) {
    console.log(`  ❌ Instagram API: Connection failed - ${err.message}`);
}

console.log("\n========== TEST COMPLETE ==========\n");

import dotenv from "dotenv";
import fetch from "node-fetch";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("🔍 API Keys Verification Test\n");

// 1. Check Environment Variables
console.log("1️⃣ Environment Variables Check:");
const requiredVars = [
    "GROQ_API_KEY",
    "INSTAGRAM_ACCESS_TOKEN",
    "MONGODB_URI",
    "CLOUD_NAME",
    "CLOUD_API_KEY"
];

requiredVars.forEach(key => {
    const value = process.env[key];
    if (value) {
        const masked = value.substring(0, 10) + "..." + value.substring(value.length - 5);
        console.log(`  ✅ ${key}: Present (${masked})`);
    } else {
        console.log(`  ❌ ${key}: MISSING`);
    }
});

// 2. Test Groq API
console.log("\n2️⃣ Groq API Test:");
try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: [{ role: "user", content: "Hello" }],
            max_tokens: 1
        })
    });

    if (groqResponse.ok) {
        console.log("  ✅ Groq API: Working correctly");
    } else {
        const error = await groqResponse.text();
        console.log(`  ❌ Groq API: Error ${groqResponse.status}`, error.substring(0, 100));
    }
} catch (err) {
    console.log(`  ❌ Groq API: Connection failed - ${err.message}`);
}

// 3. Test MongoDB Connection
console.log("\n3️⃣ MongoDB Connection Test:");
try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("  ✅ MongoDB: Connected successfully");
    await mongoose.connection.close();
} catch (err) {
    console.log(`  ❌ MongoDB: Connection failed - ${err.message}`);
}

// 4. Test Cloudinary API
console.log("\n4️⃣ Cloudinary API Test:");
try {
    const cloudResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/image`, {
        method: "GET",
        headers: {
            "Authorization": `Basic ${Buffer.from(
                `${process.env.CLOUD_API_KEY}:${process.env.CLOUD_API_SECRET}`
            ).toString("base64")}`
        }
    });

    if (cloudResponse.ok || cloudResponse.status === 200) {
        console.log("  ✅ Cloudinary API: Credentials valid");
    } else {
        console.log(`  ❌ Cloudinary API: Error ${cloudResponse.status}`);
    }
} catch (err) {
    console.log(`  ❌ Cloudinary API: Connection failed - ${err.message}`);
}

// 5. Test Instagram API
console.log("\n5️⃣ Instagram API Test:");
try {
    const igResponse = await fetch(
        `https://graph.instagram.com/me?access_token=${process.env.INSTAGRAM_ACCESS_TOKEN}`
    );

    if (igResponse.ok) {
        const data = await igResponse.json();
        console.log("  ✅ Instagram API: Token is valid");
    } else {
        console.log(`  ❌ Instagram API: Error ${igResponse.status}`);
    }
} catch (err) {
    console.log(`  ❌ Instagram API: Connection failed - ${err.message}`);
}

console.log("\n✅ Test Complete!");

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

import instagramRoutes from './routes/instagramRoutes.js';
import { generateContentBundle } from './routes/services/utils/aiService.js';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({ origin: "*", methods: ["GET", "POST"], credentials: true }));
app.use(express.json());

// ====== Cloudinary ======
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ====== MongoDB ======
const MONGODB_URI = process.env.MONGODB_URI;

try {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB Atlas");
} catch (err) {
  console.error("❌ MongoDB connection failed:", err.message);
}

// ====== Auth ======
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();
    console.log(`✅ User created: ${username} (${email})`);
    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    console.log(`✅ User logged in: ${user.username} (${email})`);
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ====== Android content routes ======
app.post("/api/upload", async (req, res) => {
  const { idea, caption, imageUrl } = req.body;
  if (!idea || !caption || !imageUrl) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const post = new Post({ idea, content: caption, imageUrl });
    await post.save();
    res.status(200).json({ success: true, message: "Post received", id: post._id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/generate", async (req, res) => {
  const { idea, segment } = req.body;
  if (!idea || !segment) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const { captions, hashtags } = await generateContentBundle(idea, segment);
    res.status(200).json({ captions, hashtags });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate captions" });
  }
});

app.post("/api/generateHashtag", async (req, res) => {
  const { idea, segment } = req.body;
  if (!idea || !segment) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const { hashtags } = await generateContentBundle(idea, segment);
    console.log("🔗 Hashtags only:", hashtags);
    res.status(200).json({ hashtags });
  } catch (error) {
    console.error("❌ Hashtag generation error:", error.message);
    res.status(500).json({ error: "Failed to generate hashtags" });
  }
});

// ====== Instagram API routes ======
app.use("/api/instagram", instagramRoutes);

app.post("/api/instagram/upload", upload.single("image"), async (req, res) => {
  const { caption } = req.body;
  const accessToken = process.env.IG_ACCESS_TOKEN;
  const igUserId = process.env.IG_USER_ID;

  try {
    const cloudStream = cloudinary.uploader.upload_stream(
      { resource_type: "image" },
      async (error, result) => {
        if (error) throw error;
        const imageUrl = result.secure_url;

        const containerRes = await fetch(
          `https://graph.facebook.com/v19.0/${igUserId}/media`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image_url: imageUrl,
              caption,
              access_token: accessToken,
            }),
          }
        );
        const containerData = await containerRes.json();
        if (!containerData.id) throw new Error("Failed to create media container");

        const publishRes = await fetch(
          `https://graph.facebook.com/v19.0/${igUserId}/media_publish`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              creation_id: containerData.id,
              access_token: accessToken,
            }),
          }
        );
        const publishData = await publishRes.json();
        res.json({ success: true, publishData });
      }
    );

    req.file.stream.pipe(cloudStream);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ====== Health check ======
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/api/ping", (req, res) => res.json({ pong: true }));

const PORT = process.env.PORT || 5002;
app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
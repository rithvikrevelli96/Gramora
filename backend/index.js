import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fetch from 'node-fetch';

import instagramRoutes from './routes/instagramRoutes.js';
import { generateContentBundle } from './routes/services/utils/aiService.js';

dotenv.config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use(cors({
  origin: "*", // ✅ Allow all origins for Android access
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ✅ Android upload route
app.post("/api/upload", async (req, res) => {
  const { idea, caption, imageUrl } = req.body;
  if (!idea || !caption || !imageUrl) {
    return res.status(400).json({ error: "Missing fields" });
  }
  console.log("📦 Android Post Received:", { idea, caption, imageUrl });
  res.status(200).json({ success: true, message: "Post received" });
});

// ✅ Caption + Hashtag generation route
app.post("/api/generate", async (req, res) => {
  const { idea, segment } = req.body;
  if (!idea || !segment) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    const { captions, hashtags } = await generateContentBundle(idea, segment);
    console.log("🧠 Gemini generated:", { captions, hashtags });
    res.status(200).json({ captions, hashtags });
  } catch (error) {
    console.error("❌ Gemini error:", error.message);
    res.status(500).json({ error: "Failed to generate captions" });
  }
});

// ✅ Hashtag-only route for Android
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

// ✅ Instagram API routes
app.use("/api/instagram", instagramRoutes);

// ✅ Instagram upload route
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

// ✅ Health check
app.get("/health", (req, res) => res.json({ ok: true }));
app.get("/api/ping", (req, res) => res.json({ pong: true }));

const PORT = process.env.PORT || 5002;
app.listen(PORT, "0.0.0.0", () => console.log(`✅ Server running on port ${PORT}`));
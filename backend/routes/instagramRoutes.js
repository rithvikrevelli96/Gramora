import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

router.get("/", (req, res) => {
  res.send("Instagram API is working!");
});

import {
  generatePostContent,
  generateInstagramPost,
  uploadToInstagram,
  createPost,
} from "./controllers/instagramController.js";

router.post("/generate", generatePostContent);
router.post("/post", uploadToInstagram);
router.post("/create", createPost);
router.post("/generate-instagram", generateInstagramPost);

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "gramora", resource_type: "image" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

router.post("/upload", upload.single("image"), async (req, res) => {
  const { caption } = req.body;
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID;

  try {
    if (!req.file || !req.file.buffer || !caption) {
      return res.status(400).json({
        success: false,
        error: "Image and caption are required.",
      });
    }

    const result = await streamUpload(req.file.buffer);
    const imageUrl = result.secure_url;
    console.log("🌐 Cloudinary URL:", imageUrl);

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
    console.log("📦 Media container response:", containerData);

    if (!containerData.id) {
      console.error("❌ Media container creation failed:", containerData);
      return res.status(500).json({
        success: false,
        error: "Failed to create media container.",
        details: containerData,
      });
    }

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
    console.log("🚀 Publish response:", publishData);

    if (!publishData.id) {
      console.error("❌ Media publish failed:", publishData);
      return res.status(500).json({
        success: false,
        error: "Failed to publish media.",
        details: publishData,
      });
    }

    res.status(200).json({ success: true, postId: publishData.id });
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
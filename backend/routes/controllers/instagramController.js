import { generateContentBundle } from '../services/utils/aiService.js';
import {
  createInstagramMedia,
  publishInstagramMedia,
  savePostToDB,
} from '../services/instagramService.js';

import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single('image');

// 🔹 Unified caption + hashtag generation
export const generatePostContent = async (req, res) => {
  try {
    const { idea, segment } = req.body;
    const { captions, hashtags } = await generateContentBundle(idea, segment);
    res.status(200).json({ captions, hashtags });
  } catch (error) {
    res.status(500).json({ error: 'Content generation failed', details: error.message });
  }
};

// 🔹 NEW: Hashtag-only generation for Android
export const generateHashtagOnly = async (req, res) => {
  try {
    const { idea, segment } = req.body;

    if (!idea || !segment) {
      return res.status(400).json({ error: 'Missing idea or segment' });
    }

    const { hashtags } = await generateContentBundle(idea, segment);
    res.status(200).json({ hashtags });
  } catch (error) {
    console.error("❌ Hashtag generation error:", error.message);
    res.status(500).json({ error: 'Hashtag generation failed', details: error.message });
  }
};

export const generateInstagramPost = (req, res) => {
  res.send('Instagram post generated!');
};

export const uploadToInstagram = async (req, res) => {
  try {
    const imageFile = req.file;
    const caption = req.body.caption;

    console.log("📤 Upload request received:", {
      filename: imageFile?.originalname,
      caption,
    });

    if (!imageFile || !caption) {
      return res.status(400).json({ success: false, error: 'Image and caption are required' });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'gramora', resource_type: 'image' },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(imageFile.buffer).pipe(stream);
      });

    const result = await streamUpload();
    const imageUrl = result.secure_url;
    console.log("🌐 Hosted image URL:", imageUrl);

    const creationId = await createInstagramMedia({ imageUrl, caption });
    console.log("📦 Media container ID:", creationId);

    const postId = await publishInstagramMedia(creationId);
    console.log("🚀 Media published with ID:", postId);

    res.status(200).json({ success: true, postId });
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
    res.status(500).json({ success: false, error: 'Upload failed', details: error.message });
  }
};

export const createPost = async (req, res) => {
  try {
    console.log("📝 Create post request:", req.body);

    const saveResult = await savePostToDB({
      content: req.body.content,
      author: req.body.author,
    });

    if (!saveResult.success) {
      return res.status(500).json({ error: 'Failed to save post', details: saveResult.error.message });
    }

    console.log("✅ Post saved:", saveResult.post);
    res.status(201).json(saveResult.post);
  } catch (err) {
    console.error("❌ Create post error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
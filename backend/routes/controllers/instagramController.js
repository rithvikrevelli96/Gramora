import { generateAIContent } from "./services/aiService.js";
import { postToInstagram } from "./services/instagramService.js";

export const generateCaption = async (req, res) => {
  try {
    const { prompt } = req.body;
    const aiResponse = await generateAIContent(prompt);
    res.json({ caption: aiResponse });
  } catch (error) {
    res.status(500).json({ error: "AI generation failed", details: error.message });
  }
};

export const uploadToInstagram = async (req, res) => {
  try {
    const { image_url, caption, post_type } = req.body;
    if (!image_url || !caption) {
      return res.status(400).json({ error: "image_url and caption are required" });
    }
    const result = await postToInstagram({ imageUrl: image_url, caption, postType: post_type || "post" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
};
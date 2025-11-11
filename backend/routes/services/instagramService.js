import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

import Post from "../../models/Post.js";

const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID } = process.env;

// 🔹 Step A: Create Media Container
export async function createInstagramMedia({ imageUrl, caption }) {
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    throw new Error("Missing Instagram credentials in environment variables.");
  }

  const uploadUrl = `https://graph.facebook.com/v19.0/${INSTAGRAM_USER_ID}/media`;

  try {
    const uploadResponse = await axios.post(
      uploadUrl,
      {
        image_url: imageUrl,
        caption,
        access_token: INSTAGRAM_ACCESS_TOKEN,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { id: creationId } = uploadResponse.data;
    console.log("✅ Media container created:", creationId);
    return creationId;
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    console.error("❌ Error creating media container:", errMsg);
    throw new Error(`Media container creation failed: ${JSON.stringify(errMsg)}`);
  }
}

// 🔹 Step B: Publish Media
export async function publishInstagramMedia(creationId) {
  if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
    throw new Error("Missing Instagram credentials in environment variables.");
  }

  const publishUrl = `https://graph.facebook.com/v19.0/${INSTAGRAM_USER_ID}/media_publish`;

  try {
    const publishResponse = await axios.post(
      publishUrl,
      {
        creation_id: creationId,
        access_token: INSTAGRAM_ACCESS_TOKEN,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("🚀 Media published:", publishResponse.data.id);
    return publishResponse.data.id;
  } catch (error) {
    const errMsg = error.response?.data || error.message;
    console.error("❌ Error publishing media:", errMsg);
    throw new Error(`Media publish failed: ${JSON.stringify(errMsg)}`);
  }
}

// 🔹 Combined Flow
export async function postToInstagram({ imageUrl, caption }) {
  try {
    const creationId = await createInstagramMedia({ imageUrl, caption });
    const postId = await publishInstagramMedia(creationId);
    return { success: true, post_id: postId };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 🔹 Save to DB
export async function savePostToDB(postData) {
  try {
    const newPost = new Post(postData);
    await newPost.save();
    return { success: true, post: newPost };
  } catch (error) {
    console.error("❌ Error saving post to DB:", error);
    return { success: false, error };
  }
}
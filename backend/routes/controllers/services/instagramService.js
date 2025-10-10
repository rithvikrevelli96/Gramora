import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const { INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID } = process.env;

export const postToInstagram = async ({ imageUrl, caption, postType = "post" }) => {
  const uploadUrl = `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media`;
  const publishUrl = `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`;

  // Step A: Media Creation
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

  // Step B: Media Publishing
  const publishResponse = await axios.post(
    publishUrl,
    {
      creation_id: creationId,
      access_token: INSTAGRAM_ACCESS_TOKEN,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return { success: true, post_id: publishResponse.data.id };
};

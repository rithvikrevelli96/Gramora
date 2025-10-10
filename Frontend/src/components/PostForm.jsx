import React, { useState } from "react";
import axios from "axios";
import { API } from "../Api";

export default function PostForm() {
  const [prompt, setPrompt] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [postType, setPostType] = useState("post");
  const [loading, setLoading] = useState(false);

  const generateCaption = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API}/generate`, { prompt });
      setCaption(res.data.caption);
    } catch (err) {
      alert("Error generating caption");
    } finally {
      setLoading(false);
    }
  };

  const uploadPost = async () => {
    if (!imageUrl) return alert("Enter a public image URL.");
    if (!caption) return alert("Generate or enter a caption.");
    try {
      const res = await axios.post(`${API}/upload`, {
        image_url: imageUrl,
        caption,
        post_type: postType,
      });
      if (res.data && res.data.success) {
        alert(`✅ Post published! ID: ${res.data.post_id}`);
      } else {
        alert("Uploaded, but unexpected response.");
      }
    } catch (err) {
      alert("❌ Upload failed");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <textarea
        rows="3"
        placeholder="Enter post idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem" }}
      />
      <button onClick={generateCaption} disabled={loading}>
        {loading ? "Generating..." : "Generate Caption"}
      </button>

      {caption && (
        <>
          <p><strong>Generated Caption:</strong></p>
          <textarea value={caption} readOnly style={{ width: "100%" }} />
        </>
      )}

      <div style={{ marginTop: "1rem" }}>
        <input
          type="url"
          placeholder="Public image URL (https://...)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />
        <select
          value={postType}
          onChange={(e) => setPostType(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        >
          <option value="post">Post</option>
        </select>
        <button onClick={uploadPost}>Upload to Instagram</button>
      </div>
    </div>
  );
}
 

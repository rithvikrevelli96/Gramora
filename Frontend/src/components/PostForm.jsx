import React, { useState } from "react";
import axios from "axios";
import { API } from "../api";

export default function PostForm() {
  const [prompt, setPrompt] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
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
    if (!image) return alert("Select an image first!");
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      await axios.post(`${API}/upload`, formData);
      alert("✅ Post uploaded successfully!");
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

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <br />
      <button onClick={uploadPost}>Upload to Instagram</button>
    </div>
  );
}
 

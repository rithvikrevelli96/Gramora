import React, { useState } from 'react';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const [idea, setIdea] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setIdea(e.target.value);

  const handleImageImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleGenerate = async (type) => {
    if (!idea && !imageFile) {
      alert('Please enter a prompt or import an image.');
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        type === 'caption'
          ? 'http://localhost:5002/api/instagram/generate-caption'
          : 'http://localhost:5002/api/instagram/generate-hashtag';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: idea || 'Instagram image post' }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('❌ JSON parse error:', err.message);
        console.error('📦 Raw response:', text);
        setOutput('⚠️ Failed to parse response.');
        setLoading(false);
        return;
      }

      setOutput(type === 'caption' ? data.caption : data.hashtags);
    } catch (err) {
      console.error(`Error generating ${type}:`, err);
      setOutput('⚠️ Failed to generate content.');
    }
    setLoading(false);
  };

  const handleUpload = () => {
    alert('✅ Upload to Instagram triggered!');
    // Optional: Add actual upload logic here
  };

  return (
    <div className="login-bg">
      <div className="dashboard-card">
        <div className="image-preview">
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Imported"
              className="preview-img"
            />
          )}
        </div>

        <label className="login-label">Describe the idea for your post:</label>
        <input
          className="login-input"
          type="text"
          value={idea}
          onChange={handleChange}
          placeholder="A motivational quote"
        />

        <div className="dashboard-buttons-row">
          <input
            type="file"
            accept="image/*"
            id="image-upload"
            style={{ display: 'none' }}
            onChange={handleImageImport}
          />
          <label htmlFor="image-upload" className="btn-blue">
            IMPORT IMAGE
          </label>
        </div>

        <div className="dashboard-buttons-row">
          <button className="btn-blue" onClick={() => handleGenerate('caption')}>
            GENERATE CAPTION
          </button>
          <button className="btn-blue" onClick={() => handleGenerate('hashtag')}>
            GENERATE HASHTAGS
          </button>
        </div>

        {loading && <p className="loading-text">⏳ Generating...</p>}

        {output && (
          <div className="generated-output">
            <h3>Generated Output:</h3>
            <p>{output}</p>
          </div>
        )}

        {output && (
          <div className="upload-button-wrapper">
            <button className="btn-yellow" onClick={handleUpload}>
              UPLOAD TO INSTAGRAM
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
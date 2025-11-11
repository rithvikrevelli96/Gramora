import React, { useState, useEffect, useRef } from 'react';
import '../styles/DashboardPage.css';
import logo from '../assets/logo.png';

const DashboardPage = () => {
  const [idea, setIdea] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [output, setOutput] = useState('');
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef(null);

  const speakIfUnmuted = (text) => {
    if (!muted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => { });
    }

    speakIfUnmuted("AI Activated. Let’s create something awesome..");

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
      if (!muted) {
        speechSynthesis.cancel();
      }
    }
  };

  const handleChange = (e) => {
    setIdea(e.target.value);
  };

  const handleImageImport = (e) => {
    const file = e.target.files?.[0];
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
        setCaptions([]);
        setLoading(false);
        return;
      }

      if (type === 'caption') {
        const result = data.caption;
        setOutput(result);

        const lines = result
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        setCaptions(lines);
      } else {
        const hashtags = Array.isArray(data.hashtags)
          ? data.hashtags.join(' ')
          : typeof data.hashtags === 'string'
            ? data.hashtags
            : '⚠️ No hashtags found.';
        setOutput(hashtags);
        speakIfUnmuted(`Generated hashtags: ${hashtags}`);
      }
    } catch (err) {
      console.error(`Error generating ${type}:`, err);
      setOutput('⚠️ Failed to generate content.');
      setCaptions([]);
    }
    setLoading(false);
  };

  const redirectToInstagram = () => {
    if (!imageFile || !selectedCaption) {
      alert('Please select a caption and import an image first.');
      return;
    }

    speakIfUnmuted('Redirecting to Instagram...');
    alert('📲 Redirecting to Instagram. Paste your caption manually.');

    setTimeout(() => {
      window.location.href = 'https://www.instagram.com/';
    }, 1500);

    window.location.href = 'instagram://app';
  };

  return (
    <div className="dashboard-container fade-in">
      <audio ref={audioRef} src="/sounds/ambient-loop.mp3" />
      <button className="mute-toggle" onClick={toggleMute}>
        {muted ? '🔇' : '🔊'}
      </button>

      <div className="ambient-glow" />
      <div className="fog-layer" />
      <div className="grid-layer" />
      <div className="texture-overlay" />
      <div className="mesh-background">
        <svg className="mesh-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#00ffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {Array.from({ length: 25 }).map((_, i) => (
            <path
              key={i}
              className="mesh-path"
              d={`M0,${30 + i * 2} Q25,${10 + i} 50,${30 + i * 2} T100,${30 + i * 2}`}
            />
          ))}
        </svg>
      </div>

      <img src={logo} alt="Gramora Logo" className="dashboard-logo" />

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
          placeholder="Start with a prompt. We’ll handle the rest..."
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

        {captions.length > 0 && (
          <>
            <div className="generated-output">
              <h3>Generated Captions:</h3>
              <ul>
                {captions.map((caption, index) => (
                  <li key={index}>
                    <strong>{index + 1}.</strong> {caption}
                  </li>
                ))}
              </ul>
            </div>

            <div className="caption-selector">
              <label className="login-label">Select a caption to post:</label>
              <select
                className="login-input"
                value={selectedCaption}
                onChange={(e) => {
                  setSelectedCaption(e.target.value);
                  speakIfUnmuted(`Caption selected: ${e.target.value}`);
                }}
              >
                <option value="">-- Choose a caption --</option>
                {captions.map((caption, index) => (
                  <option key={index} value={caption}>
                    {caption}
                  </option>
                ))}
              </select>
            </div>

            <div className="upload-button-wrapper">
              <button className="btn-yellow" onClick={redirectToInstagram}>
                UPLOAD CAPTION POST
              </button>
            </div>
          </>
        )}

        {output && !loading && captions.length === 0 && (
          <>
            <div className="generated-output">
              <h3>Generated Hashtags:</h3>
              <div className="hashtag-block">
                {output.split(' ').map((tag, index) => (
                  <span key={index} className="hashtag-pill">{tag}</span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
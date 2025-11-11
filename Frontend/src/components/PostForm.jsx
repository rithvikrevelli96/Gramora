import React, { useState } from 'react';

function PostForm() {
  const [prompt, setPrompt] = useState('');
  const [caption, setCaption] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [error, setError] = useState('');

  const handleGenerateCaption = async () => {
    try {
      const res = await fetch('http://localhost:5000/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setCaption(data.caption);
        setError('');
      } else {
        setError(data.error || 'Caption generation failed');
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    }
  };

  const handleGenerateHashtags = async () => {
    try {
      const res = await fetch('http://localhost:5000/generate-hashtag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setHashtags(data.hashtags);
        setError('');
      } else {
        setError(data.error || 'Hashtag generation failed');
      }
    } catch (err) {
      setError('Server error: ' + err.message);
    }
  };

  return (
    <div className="post-form">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the idea for your post..."
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={handleGenerateCaption}>Generate Caption</button>
      <button onClick={handleGenerateHashtags}>Generate Hashtags</button>

      <div className="output">
        <h3>Generated Output:</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {caption && <p><strong>Caption:</strong> {caption}</p>}
        {hashtags && <p><strong>Hashtags:</strong> {hashtags}</p>}
      </div>
    </div>
  );
}

export default PostForm;
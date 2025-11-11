import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';
import logo from '../assets/logo.png';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => { });
    }

    const greet = new SpeechSynthesisUtterance(
      "Please login to continue your journey."
    );
    greet.rate = 1;
    greet.pitch = 1.2;
    greet.volume = 0.8;
    speechSynthesis.speak(greet);

    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    speak("Logging you in now");
    // ✅ Navigate to dashboard after login
    navigate('/dashboard');
  };

  return (
    <div className="login-container fade-in">
      <audio ref={audioRef} src="/sounds/ambient-loop.mp3" />
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

      {/* ✅ Logo outside the card */}
      <img src={logo} alt="Gramora Logo" className="login-logo" />

      <div className="login-card">
        <h2 className="hero-title">WELCOME BACK</h2>
        <p className="hero-subtitle">Login to continue your journey</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="glow-button">LOGIN</button>
        </form>

        <p className="signup-link">
          Don't have an account? <span onClick={() => {
            speak("Navigating to signup page");
            navigate('/signup');
          }}>Sign up</span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
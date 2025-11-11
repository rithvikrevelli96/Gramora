import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SignupPage.css';
import logo from '../assets/logo.png';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => { });
    }

    const greet = new SpeechSynthesisUtterance(
      "Create your account to join the network."
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
    speak("Signing you up now");
    navigate('/dashboard');
  };

  return (
    <div className="signup-container fade-in">
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

      <img src={logo} alt="Gramora Logo" className="signup-logo" />

      <div className="signup-card">
        <h2 className="hero-title">CREATE YOUR ACCOUNT</h2>
        <p className="hero-subtitle">Join the network and unleash your digital form</p>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
          <button type="submit" className="glow-button">SIGN UP</button>
        </form>

        <p className="login-link">
          Already have an account? <span onClick={() => {
            speak("Navigating to login page");
            navigate('/login');
          }}>Login</span>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;
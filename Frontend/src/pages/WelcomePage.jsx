import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomePage.css';
import logo from '../assets/logo.png';

function WelcomePage() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [avatarResponse, setAvatarResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef(null);
  const recognitionRef = useRef(null);
  const isRecognitionStarted = useRef(false);

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
    const mesh = document.querySelector('.mesh-background');
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      mesh.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);

    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => { });
    }

    speakIfUnmuted("Welcome to Gramora. signup or Login. to create your contents with AI assistance.");

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const userSpeech = event.results[0][0].transcript;
        handleUserInput(userSpeech);
        isRecognitionStarted.current = false;
      };

      recognition.onerror = (err) => {
        console.error("SpeechRecognition error:", err);
        isRecognitionStarted.current = false;
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("⚠️ SpeechRecognition not supported in this browser.");
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      speechSynthesis.cancel();
    };
  }, []);

  const playSound = (src) => {
    const audio = new Audio(src);
    audio.volume = 0.3;
    audio.play();
  };

  const handleClick = (route) => {
    playSound('/sounds/click.mp3');
    speakIfUnmuted(route.includes('login') ? 'login' : 'sign up');
    document.querySelector('.welcome-container').classList.add('fade-out');
    setTimeout(() => navigate(route), 600);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
      if (!muted) {
        speechSynthesis.cancel();
      }
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isRecognitionStarted.current) {
      recognitionRef.current.start();
      isRecognitionStarted.current = true;
    }
  };

  const handleUserInput = (text) => {
    setIsTyping(true);
    let response = "I'm here to help. Try saying 'login' or 'sign up'.";
    if (text.toLowerCase().includes('login')) response = "Sure, taking you to login.";
    if (text.toLowerCase().includes('sign up')) response = "Great, let's get you signed up.";

    setTimeout(() => {
      setAvatarResponse(response);
      setIsTyping(false);
      speakIfUnmuted(response);
      if (response.includes('login')) setTimeout(() => navigate('/login'), 1500);
      if (response.includes('sign up')) setTimeout(() => navigate('/signup'), 1500);
    }, 1200);
  };

  return (
    <div className="welcome-container fade-in">
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

        <div className="nodes">
          {[
            { top: '20%', left: '10%' },
            { top: '40%', left: '30%' },
            { top: '50%', left: '50%' },
            { top: '60%', left: '70%' },
            { top: '80%', left: '90%' },
          ].map((pos, i) => (
            <div
              key={i}
              className="node-wrapper"
              style={{ top: pos.top, left: pos.left }}
              onMouseEnter={() => playSound('/sounds/hover.mp3')}
            >
              <div className="node interactive" />
              <div className="ring" />
              <div className="ring delay" />
            </div>
          ))}
        </div>
      </div>

      <img src={logo} alt="Gramora Logo" className="welcome-logo" />
      <h2 className="hero-title">POWER YOUR POSTS</h2>
      <p className="hero-subtitle">Your creativity—amplified by AI..</p>

      <div className="button-row">
        <button className="glow-button" onClick={() => handleClick('/login')}>LOGIN</button>
        <button className="glow-button" onClick={() => handleClick('/signup')}>SIGN UP</button>
      </div>

      <button className="mute-toggle" onClick={toggleMute}>
        {muted ? '🔇' : '🔊'}
      </button>

      <div className={`ai-avatar ${isTyping ? 'speaking' : ''}`} onClick={startListening}>
        🤖
        <div className="avatar-bubble">
          {isTyping ? (
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          ) : (
            avatarResponse
          )}
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
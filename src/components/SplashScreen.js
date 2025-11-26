import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onComplete, isReturning = false }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Play Spooky Loop music
    const spookyMusic = new Audio(`${process.env.PUBLIC_URL}/Spooky_Loop.mp3`);
    spookyMusic.volume = 0.3;
    spookyMusic.loop = true;
    spookyMusic.setAttribute('playsinline', 'true');
    spookyMusic.setAttribute('webkit-playsinline', 'true');
    spookyMusic.preload = 'auto';
    
    const playPromise = spookyMusic.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('✅ Spooky Loop music playing');
        })
        .catch(err => {
          console.log('⏸️ Music autoplay prevented:', err);
        });
    }

    // Show "press any button" prompt immediately if returning from quit, otherwise after 2 seconds
    const promptTimer = setTimeout(() => {
      setShowPrompt(true);
    }, isReturning ? 0 : 2000);

    return () => {
      clearTimeout(promptTimer);
      // Stop music when leaving splash screen
      spookyMusic.pause();
      spookyMusic.currentTime = 0;
    };
  }, [isReturning]);

  const handleContinue = () => {
    if (!fadeOut) {
      // Play success sound
      const successSound = new Audio(`${process.env.PUBLIC_URL}/mixkit-game-success-alert-2039.wav`);
      successSound.volume = 0.5;      successSound.setAttribute('playsinline', 'true');
      successSound.setAttribute('webkit-playsinline', 'true');      successSound.play().catch(err => console.log('Sound play prevented:', err));
      
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only respond to user input if the prompt is showing
      if (showPrompt) {
        handleContinue();
      }
    };

    const handleClick = () => {
      // Only respond to user input if the prompt is showing
      if (showPrompt) {
        handleContinue();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [fadeOut, showPrompt]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* Animated Logo */}
        <div className="splash-logo">
          <div className="logo-cards">
            <div className="splash-card card-left">
              <span className="card-emoji">🔥</span>
            </div>
            <div className="splash-card card-center">
              <span className="card-emoji">⚡</span>
            </div>
            <div className="splash-card card-right">
              <span className="card-emoji">❄️</span>
            </div>
          </div>
          
          <div className="energy-circle">
            <div className="energy-ring"></div>
            <div className="energy-ring-2"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="splash-title">
          <span className="title-word word-elemental">ELEMENTAL</span>
          <span className="title-word word-battle">BATTLE</span>
        </h1>

        {/* Subtitle */}
        <p className="splash-subtitle">Master the Elements • Conquer the Arena</p>

        {/* Loading Animation */}
        <div className="loading-container">
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Element Icons */}
        <div className="element-showcase">
          <span className="element-icon" style={{'--delay': '0s'}}>🔥</span>
          <span className="element-icon" style={{'--delay': '0.1s'}}>❄️</span>
          <span className="element-icon" style={{'--delay': '0.2s'}}>💧</span>
          <span className="element-icon" style={{'--delay': '0.3s'}}>⚡</span>
          <span className="element-icon" style={{'--delay': '0.4s'}}>🌍</span>
          <span className="element-icon" style={{'--delay': '0.5s'}}>💪</span>
          <span className="element-icon" style={{'--delay': '0.6s'}}>✨</span>
          <span className="element-icon" style={{'--delay': '0.7s'}}>🌑</span>
          <span className="element-icon" style={{'--delay': '0.8s'}}>⚪</span>
          <span className="element-icon" style={{'--delay': '0.9s'}}>🤖</span>
        </div>

        {/* Press Any Button Prompt */}
        {showPrompt && (
          <div className="press-button-prompt">
            <p className="prompt-text">PRESS ANY BUTTON TO CONTINUE</p>
            <div className="prompt-indicator">▼</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;

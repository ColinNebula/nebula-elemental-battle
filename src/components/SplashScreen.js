import React, { useEffect, useState, useRef } from 'react';
import './SplashScreen.css';
import soundManager from '../utils/sounds';

const SplashScreen = ({ onComplete, isReturning = false }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const spookyMusicRef = useRef(null);
  const autoPlayAttemptedRef = useRef(false);

  // Initialize audio element
  useEffect(() => {
    // Get saved music volume from soundManager
    const musicVolume = soundManager?.musicVolume || 0.3;
    
    spookyMusicRef.current = new Audio(`${process.env.PUBLIC_URL}/Spooky_Loop.mp3`);
    spookyMusicRef.current.volume = musicVolume;
    spookyMusicRef.current.loop = true;
    spookyMusicRef.current.setAttribute('playsinline', 'true');
    spookyMusicRef.current.setAttribute('webkit-playsinline', 'true');
    spookyMusicRef.current.preload = 'auto';

    // Try to auto-play music immediately (works if user has previously interacted)
    const attemptAutoPlay = () => {
      if (!autoPlayAttemptedRef.current && spookyMusicRef.current) {
        autoPlayAttemptedRef.current = true;
        spookyMusicRef.current.play()
          .then(() => {
            console.log('✅ Splash music auto-playing');
            setMusicStarted(true);
          })
          .catch(err => {
            console.log('⏸️ Auto-play prevented (will play on interaction):', err.message);
          });
      }
    };

    // Attempt auto-play after a short delay to let audio load
    const autoPlayTimer = setTimeout(attemptAutoPlay, 100);

    // Show "press any button" prompt immediately if returning from quit, otherwise after 2 seconds
    const promptTimer = setTimeout(() => {
      setShowPrompt(true);
    }, isReturning ? 0 : 2000);

    return () => {
      clearTimeout(promptTimer);
      clearTimeout(autoPlayTimer);
      // Stop music when leaving splash screen
      if (spookyMusicRef.current) {
        spookyMusicRef.current.pause();
        spookyMusicRef.current.currentTime = 0;
      }
    };
  }, [isReturning]);

  // Function to start music on user interaction
  const startMusic = () => {
    if (!musicStarted && spookyMusicRef.current) {
      spookyMusicRef.current.play()
        .then(() => {
          console.log('✅ Spooky Loop music playing');
          setMusicStarted(true);
        })
        .catch(err => {
          console.log('⏸️ Music play prevented:', err);
        });
    }
  };

  const handleContinue = () => {
    if (!fadeOut) {
      // Play success sound
      const successSound = new Audio(`${process.env.PUBLIC_URL}/mixkit-game-success-alert-2039.mp3`);
      successSound.volume = 0.5;
      successSound.setAttribute('playsinline', 'true');
      successSound.setAttribute('webkit-playsinline', 'true');
      successSound.play().catch(err => console.log('Sound play prevented:', err));
      
      // Stop splash music
      if (spookyMusicRef.current) {
        spookyMusicRef.current.pause();
      }
      
      setFadeOut(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Start music on any user interaction
      startMusic();
      
      // Only proceed to next screen if the prompt is showing
      if (showPrompt) {
        handleContinue();
      }
    };

    const handleClick = () => {
      // Start music on any user interaction
      startMusic();
      
      // Only proceed to next screen if the prompt is showing
      if (showPrompt) {
        handleContinue();
      }
    };

    const handleTouch = () => {
      // Start music on touch for mobile
      startMusic();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouch, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [fadeOut, showPrompt, musicStarted]);

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

        {/* Music indicator */}
        <div className={`music-indicator ${musicStarted ? 'playing' : 'waiting'}`}>
          {musicStarted ? (
            <span className="music-icon">🎵</span>
          ) : (
            <span className="music-icon muted">🔇 Click to enable music</span>
          )}
        </div>

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
            <p className="prompt-text">{musicStarted ? 'PRESS ANY BUTTON TO CONTINUE' : 'TAP OR CLICK TO START'}</p>
            <div className="prompt-indicator">▼</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;

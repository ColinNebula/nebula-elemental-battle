import React, { useState, useEffect } from 'react';
import './CoinToss.css';
import soundManager from '../utils/sounds';

const CoinToss = ({ onComplete, playerName, playerAvatar, opponentName, opponentAvatar }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [particles, setParticles] = useState([]);
  const [showSparkles, setShowSparkles] = useState(false);

  useEffect(() => {
    // Auto-start coin toss after 1 second
    const timer = setTimeout(() => {
      startCoinToss();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const startCoinToss = () => {
    setIsFlipping(true);
    setShowResult(false);

    // Play coin flip sound
    if (soundManager) {
      soundManager.playSound('cardDraw'); // Use card draw as coin flip sound
    }

    // Simulate coin toss (50/50 chance)
    const winner = Math.random() < 0.5;
    
    // Generate particles during flip
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 1
    }));
    setParticles(newParticles);
    
    setTimeout(() => {
      setIsFlipping(false);
      setResult(winner ? 'heads' : 'tails');
      setPlayerWon(winner);
      setShowResult(true);
      setShowSparkles(true);
      
      // Play result sound
      if (soundManager) {
        soundManager.playSound(winner ? 'victory' : 'roundStart');
      }
      
      // Clear particles
      setTimeout(() => setParticles([]), 1000);
      
      // Auto-proceed after showing result for 3 seconds
      setTimeout(() => {
        onComplete(winner); // true = player goes first, false = opponent goes first
      }, 3000);
    }, 2500); // Coin flips for 2.5 seconds
  };

  return (
    <div className="coin-toss">
      {/* Floating particles */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="coin-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`
            }}
          />
        ))}
      </div>
      
      <div className="coin-toss-content">
        <div className="coin-toss-header">
          <h1 className="animated-title">🪙 Coin Toss</h1>
          <p className="subtitle-pulse">Determining who goes first...</p>
        </div>

        <div className="players-display">
          <div className={`player-side ${playerWon && showResult ? 'winner' : ''}`}>
            <div className="player-avatar">
              {playerAvatar && !playerAvatar.startsWith('👤') && !playerAvatar.includes('emoji') ? (
                <img 
                  src={`${process.env.PUBLIC_URL}/${playerAvatar}`} 
                  alt={playerName}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <span style={{ display: playerAvatar && !playerAvatar.startsWith('👤') ? 'none' : 'flex' }}>
                {playerAvatar || '👤'}
              </span>
            </div>
            <div className="player-name">{playerName}</div>
            <div className="coin-choice">HEADS</div>
          </div>
          
          <div className="vs-divider">VS</div>
          
          <div className={`player-side ${!playerWon && showResult ? 'winner' : ''}`}>
            <div className="player-avatar">
              {opponentAvatar && opponentAvatar.endsWith('.png') ? (
                <img 
                  src={`${process.env.PUBLIC_URL}/${opponentAvatar}`} 
                  alt={opponentName}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
              ) : null}
              <span style={{ display: opponentAvatar && opponentAvatar.endsWith('.png') ? 'none' : 'flex' }}>
                {opponentAvatar || '🤖'}
              </span>
            </div>
            <div className="player-name">{opponentName}</div>
            <div className="coin-choice">TAILS</div>
          </div>
        </div>

        <div className="coin-container">
          {showSparkles && (
            <div className="sparkles">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="sparkle"
                  style={{
                    '--angle': `${i * 30}deg`,
                    '--delay': `${i * 0.1}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          )}
          <div className={`coin ${isFlipping ? 'flipping' : ''} ${result || ''}`}>
            <div className="coin-side heads">
              <div className="coin-inner">
                <span className="coin-symbol">👑</span>
                <span className="coin-text">HEADS</span>
              </div>
            </div>
            <div className="coin-side tails">
              <div className="coin-inner">
                <span className="coin-symbol">🛡️</span>
                <span className="coin-text">TAILS</span>
              </div>
            </div>
          </div>
        </div>

        {showResult && (
          <div className="result-announcement">
            <div className="result-glow"></div>
            <div className={`result-text ${playerWon ? 'player-wins' : 'opponent-wins'}`}>
              {playerWon ? (
                <>🎉 {playerName} goes first! 🎉</>
              ) : (
                <>🤖 {opponentName} goes first! 🤖</>
              )}
            </div>
            <div className="result-subtext">
              ⚡ Prepare for Epic Combat! ⚡
            </div>
            <div className="countdown-bar">
              <div className="countdown-fill"></div>
            </div>
          </div>
        )}

        {!showResult && !isFlipping && (
          <div className="coin-toss-instruction">
            <p>Flipping coin...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinToss;
import React, { useState, useEffect } from 'react';
import './CoinToss.css';

const CoinToss = ({ onComplete, playerName, opponentName }) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);

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

    // Simulate coin toss (50/50 chance)
    const winner = Math.random() < 0.5;
    
    setTimeout(() => {
      setIsFlipping(false);
      setResult(winner ? 'heads' : 'tails');
      setPlayerWon(winner);
      setShowResult(true);
      
      // Auto-proceed after showing result for 3 seconds
      setTimeout(() => {
        onComplete(winner); // true = player goes first, false = opponent goes first
      }, 3000);
    }, 2000); // Coin flips for 2 seconds
  };

  return (
    <div className="coin-toss">
      <div className="coin-toss-content">
        <div className="coin-toss-header">
          <h1>🪙 Coin Toss</h1>
          <p>Determining who goes first...</p>
        </div>

        <div className="players-display">
          <div className={`player-side ${playerWon && showResult ? 'winner' : ''}`}>
            <div className="player-avatar">👤</div>
            <div className="player-name">{playerName}</div>
            <div className="coin-choice">HEADS</div>
          </div>
          
          <div className="vs-divider">VS</div>
          
          <div className={`player-side ${!playerWon && showResult ? 'winner' : ''}`}>
            <div className="player-avatar">🤖</div>
            <div className="player-name">{opponentName}</div>
            <div className="coin-choice">TAILS</div>
          </div>
        </div>

        <div className="coin-container">
          <div className={`coin ${isFlipping ? 'flipping' : ''} ${result || ''}`}>
            <div className="coin-side heads">
              <span className="coin-symbol">👑</span>
              <span className="coin-text">HEADS</span>
            </div>
            <div className="coin-side tails">
              <span className="coin-symbol">🛡️</span>
              <span className="coin-text">TAILS</span>
            </div>
          </div>
        </div>

        {showResult && (
          <div className="result-announcement">
            <div className={`result-text ${playerWon ? 'player-wins' : 'opponent-wins'}`}>
              {playerWon ? (
                <>🎉 {playerName} goes first! 🎉</>
              ) : (
                <>🤖 {opponentName} goes first! 🤖</>
              )}
            </div>
            <div className="result-subtext">
              The battle begins in 3 seconds...
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
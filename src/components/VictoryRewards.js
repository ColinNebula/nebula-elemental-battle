import React, { useState, useEffect } from 'react';
import './VictoryRewards.css';

const VictoryRewards = ({ coinsEarned, totalCoins, playerWon, onContinue }) => {
  const [animateCoins, setAnimateCoins] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);

  useEffect(() => {
    // Start coin animation after component mounts
    setTimeout(() => setAnimateCoins(true), 500);
    
    // Animate coin counter
    if (coinsEarned > 0) {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = coinsEarned / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= coinsEarned) {
          setCurrentCount(coinsEarned);
          clearInterval(timer);
        } else {
          setCurrentCount(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [coinsEarned]);

  return (
    <div className="victory-rewards-overlay">
      <div className="victory-rewards-container">
        {/* Victory/Defeat Header */}
        <h1 className={`rewards-title ${playerWon ? 'victory' : 'defeat'}`}>
          {playerWon ? '🏆 VICTORY! 🏆' : playerWon === false ? '💀 DEFEAT' : '🤝 TIE!'}
        </h1>

        {/* Coin Sack Image */}
        <div className={`coin-sack ${animateCoins ? 'shake' : ''}`}>
          <img 
            src={`${process.env.PUBLIC_URL}/coin-sack.png`} 
            alt="Coin Sack"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="coin-sack-fallback" style={{ display: 'none' }}>
            💰
          </div>
        </div>

        {/* Coins Earned Display */}
        <div className="coins-earned-display">
          {coinsEarned > 0 ? (
            <>
              <div className="coins-earned-label">GOLD EARNED</div>
              <div className="coins-earned-amount">
                <span className="coin-icon">🪙</span>
                <span className="coin-count">{currentCount}</span>
              </div>
              <div className="total-coins">
                Total Gold: {totalCoins} 🪙
              </div>
            </>
          ) : (
            <>
              <div className="coins-earned-label">NO GOLD EARNED</div>
              <div className="no-coins-message">
                {playerWon === false ? 'Victory earns rewards!' : 'Better luck next time!'}
              </div>
            </>
          )}
        </div>

        {/* Floating Coins Animation */}
        {animateCoins && coinsEarned > 0 && (
          <div className="floating-coins">
            {[...Array(Math.min(coinsEarned, 15))].map((_, i) => (
              <div 
                key={i} 
                className="floating-coin"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${2 + Math.random()}s`
                }}
              >
                🪙
              </div>
            ))}
          </div>
        )}

        {/* Continue Button */}
        <button className="rewards-continue-button" onClick={onContinue}>
          CONTINUE
        </button>

        {/* Reward Stats */}
        {playerWon && (
          <div className="reward-stats">
            <div className="stat-item">
              <span className="stat-icon">⭐</span>
              <span className="stat-label">Victory Bonus</span>
            </div>
            {coinsEarned >= 100 && (
              <div className="stat-item">
                <span className="stat-icon">💎</span>
                <span className="stat-label">Perfect Score!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VictoryRewards;

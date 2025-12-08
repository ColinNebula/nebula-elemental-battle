import React, { useEffect, useState, useMemo } from 'react';
import './VictoryScreen.css';
import '../utils/premiumEffects.css';
import Card from './Card';

const VictoryScreen = ({ 
  winner,
  playerName,
  playerScore,
  opponentName,
  opponentScore,
  playerCards = [],
  opponentCards = [],
  playerAvatar,
  opponentAvatar,
  roundsPlayed,
  onPlayAgain,
  onQuit,
  isStoryMode = false
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const [showMVP, setShowMVP] = useState(false);

  const isPlayerWinner = winner === playerName;
  const isTie = winner === 'Tie';

  // Calculate MVP card (highest strength played card on winning side)
  const mvpCard = useMemo(() => {
    const winnerCards = isPlayerWinner ? playerCards : opponentCards;
    if (!winnerCards || winnerCards.length === 0) return null;
    
    return winnerCards.reduce((mvp, card) => {
      const cardStrength = card.modifiedStrength || card.strength || 0;
      const mvpStrength = mvp?.modifiedStrength || mvp?.strength || 0;
      return cardStrength > mvpStrength ? card : mvp;
    }, winnerCards[0]);
  }, [isPlayerWinner, playerCards, opponentCards]);

  // Calculate battle statistics
  const stats = useMemo(() => {
    const playerTotal = playerCards.reduce((sum, c) => sum + (c.modifiedStrength || c.strength || 0), 0);
    const opponentTotal = opponentCards.reduce((sum, c) => sum + (c.modifiedStrength || c.strength || 0), 0);
    
    // Find highest card for each side
    const playerBest = playerCards.reduce((best, c) => {
      const str = c.modifiedStrength || c.strength || 0;
      return str > (best?.modifiedStrength || best?.strength || 0) ? c : best;
    }, playerCards[0]);
    
    const opponentBest = opponentCards.reduce((best, c) => {
      const str = c.modifiedStrength || c.strength || 0;
      return str > (best?.modifiedStrength || best?.strength || 0) ? c : best;
    }, opponentCards[0]);

    return {
      playerTotal,
      opponentTotal,
      playerAvg: playerCards.length ? (playerTotal / playerCards.length).toFixed(1) : 0,
      opponentAvg: opponentCards.length ? (opponentTotal / opponentCards.length).toFixed(1) : 0,
      playerBest,
      opponentBest,
      playerCardsPlayed: playerCards.length,
      opponentCardsPlayed: opponentCards.length
    };
  }, [playerCards, opponentCards]);

  // Animation sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setAnimationPhase(1), 500),   // Flash
      setTimeout(() => setAnimationPhase(2), 1500),  // Title
      setTimeout(() => setAnimationPhase(3), 2500),  // Scores
      setTimeout(() => setShowStats(true), 3500),    // Stats
      setTimeout(() => setShowMVP(true), 4500),      // MVP
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`victory-screen ${isPlayerWinner ? 'victory' : isTie ? 'tie' : 'defeat'}`}>
      {/* Background effects */}
      <div className="victory-bg-effects">
        {/* Radial burst */}
        <div className={`radial-burst ${animationPhase >= 1 ? 'active' : ''}`}></div>
        
        {/* Confetti for victory */}
        {isPlayerWinner && animationPhase >= 2 && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div 
                key={i} 
                className="confetti"
                style={{
                  '--x': `${Math.random() * 100}vw`,
                  '--delay': `${Math.random() * 2}s`,
                  '--rotation': `${Math.random() * 360}deg`,
                  '--color': ['#ffd700', '#ff6b6b', '#4caf50', '#2196f3', '#e91e63'][i % 5]
                }}
              />
            ))}
          </div>
        )}

        {/* Defeat particles */}
        {!isPlayerWinner && !isTie && animationPhase >= 2 && (
          <div className="defeat-particles">
            {[...Array(30)].map((_, i) => (
              <div 
                key={i} 
                className="ember"
                style={{
                  '--x': `${Math.random() * 100}vw`,
                  '--delay': `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className={`victory-content ${animationPhase >= 2 ? 'visible' : ''}`}>
        {/* Trophy / Skull */}
        <div className={`result-icon ${animationPhase >= 1 ? 'visible' : ''}`}>
          {isPlayerWinner ? '🏆' : isTie ? '🤝' : '💀'}
        </div>

        {/* Title */}
        <h1 className={`victory-title ${animationPhase >= 2 ? 'visible' : ''}`}>
          {isPlayerWinner ? 'VICTORY!' : isTie ? "IT'S A TIE!" : 'DEFEAT'}
        </h1>

        <h2 className={`winner-name ${animationPhase >= 2 ? 'visible' : ''}`}>
          {isTie ? 'Well Fought!' : `${winner} Wins!`}
        </h2>

        {/* Score display */}
        <div className={`score-display ${animationPhase >= 3 ? 'visible' : ''}`}>
          <div className={`score-card ${isPlayerWinner ? 'winner' : ''}`}>
            <div className="score-avatar">
              {playerAvatar?.image ? (
                <img src={`${process.env.PUBLIC_URL}/${playerAvatar.image}`} alt={playerName} />
              ) : (
                <span>{playerAvatar?.icon || '👤'}</span>
              )}
            </div>
            <div className="score-info">
              <span className="score-name">{playerName}</span>
              <span className="score-value">{playerScore}</span>
            </div>
            {isPlayerWinner && <div className="winner-crown">👑</div>}
          </div>

          <div className="vs-divider">VS</div>

          <div className={`score-card ${!isPlayerWinner && !isTie ? 'winner' : ''}`}>
            <div className="score-avatar">
              {opponentAvatar?.image ? (
                <img src={`${process.env.PUBLIC_URL}/${opponentAvatar.image}`} alt={opponentName} />
              ) : (
                <span>{opponentAvatar?.icon || '🤖'}</span>
              )}
            </div>
            <div className="score-info">
              <span className="score-name">{opponentName}</span>
              <span className="score-value">{opponentScore}</span>
            </div>
            {!isPlayerWinner && !isTie && <div className="winner-crown">👑</div>}
          </div>
        </div>

        {/* Battle Statistics */}
        <div className={`battle-statistics ${showStats ? 'visible' : ''}`}>
          <h3>📊 Battle Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">⚔️</span>
              <span className="stat-label">Total Strength</span>
              <span className="stat-compare">
                <span className={isPlayerWinner ? 'highlight' : ''}>{stats.playerTotal}</span>
                <span className="stat-vs">vs</span>
                <span className={!isPlayerWinner && !isTie ? 'highlight' : ''}>{stats.opponentTotal}</span>
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📈</span>
              <span className="stat-label">Avg Strength</span>
              <span className="stat-compare">
                <span>{stats.playerAvg}</span>
                <span className="stat-vs">vs</span>
                <span>{stats.opponentAvg}</span>
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎴</span>
              <span className="stat-label">Cards Played</span>
              <span className="stat-compare">
                <span>{stats.playerCardsPlayed}</span>
                <span className="stat-vs">vs</span>
                <span>{stats.opponentCardsPlayed}</span>
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🔄</span>
              <span className="stat-label">Rounds</span>
              <span className="stat-single">{roundsPlayed}</span>
            </div>
          </div>
        </div>

        {/* MVP Card Showcase */}
        {mvpCard && !isTie && (
          <div className={`mvp-showcase ${showMVP ? 'visible' : ''}`}>
            <h3>⭐ MVP CARD ⭐</h3>
            <div className="mvp-card-container">
              <div className="mvp-glow"></div>
              <Card card={mvpCard} isPlayable={false} />
              <div className="mvp-label">
                {mvpCard.name || mvpCard.element} - Power {mvpCard.modifiedStrength || mvpCard.strength}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className={`victory-buttons ${showStats ? 'visible' : ''}`}>
          <button className="btn-play-again" onClick={onPlayAgain}>
            <span className="btn-icon">🔄</span>
            {isStoryMode ? 'Continue Story' : 'Play Again'}
          </button>
          <button className="btn-quit" onClick={onQuit}>
            <span className="btn-icon">🚪</span>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;

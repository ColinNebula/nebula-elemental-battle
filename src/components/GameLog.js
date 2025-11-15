import React from 'react';
import './GameLog.css';

const GameLog = ({ gameState }) => {
  const getRecentPlays = () => {
    if (!gameState?.players) return [];
    
    const plays = [];
    const maxRounds = gameState.roundsPlayed || 0;
    const startRound = Math.max(0, maxRounds - 5);
    
    for (let i = startRound; i < maxRounds; i++) {
      const player1 = gameState.players[0];
      const player2 = gameState.players[1];
      
      if (player1?.playedCards?.[i] && player2?.playedCards?.[i]) {
        const card1 = player1.playedCards[i];
        const card2 = player2.playedCards[i];
        const strength1 = card1.modifiedStrength || card1.strength;
        const strength2 = card2.modifiedStrength || card2.strength;
        
        plays.push({
          round: i + 1,
          player1Card: card1,
          player2Card: card2,
          player1Strength: strength1,
          player2Strength: strength2,
          winner: strength1 > strength2 ? player1.name : 
                  strength2 > strength1 ? player2.name : 'Tie'
        });
      }
    }
    
    return plays.reverse(); // Show most recent first
  };

  const recentPlays = getRecentPlays();

  const getElementIcon = (element) => {
    const icons = {
      'FIRE': '🔥', 'ICE': '❄️', 'WATER': '💧', 'ELECTRICITY': '⚡',
      'EARTH': '🌍', 'POWER': '⭐', 'LIGHT': '☀️', 'DARK': '🌙', 'NEUTRAL': '🔮'
    };
    return icons[element] || '?';
  };

  return (
    <div className="game-log">
      <h3>📜 Game Log</h3>
      <div className="log-entries">
        {recentPlays.length === 0 ? (
          <div className="log-empty">No plays yet</div>
        ) : (
          recentPlays.map((play, idx) => (
            <div key={idx} className="log-entry">
              <div className="log-round">Round {play.round}</div>
              <div className="log-cards">
                <div className="log-card player1">
                  <span className="log-element">{getElementIcon(play.player1Card.element)}</span>
                  <span className="log-strength">{play.player1Strength}</span>
                </div>
                <div className="log-vs">VS</div>
                <div className="log-card player2">
                  <span className="log-element">{getElementIcon(play.player2Card.element)}</span>
                  <span className="log-strength">{play.player2Strength}</span>
                </div>
              </div>
              <div className={`log-result ${play.winner === 'Tie' ? 'tie' : 'winner'}`}>
                {play.winner === 'Tie' ? '⚖️ Tie' : `🏆 ${play.winner}`}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GameLog;

import React from 'react';
import './ScoreTracker.css';

const ScoreTracker = ({ gameState }) => {
  if (!gameState?.players) return null;

  const player1 = gameState.players[0];
  const player2 = gameState.players[1];
  
  const totalCards = (player1?.playedCards?.length || 0) + (player1?.hand?.length || 0);
  const player1Progress = totalCards > 0 ? (player1?.score / totalCards) * 100 : 0;
  const player2Progress = totalCards > 0 ? (player2?.score / totalCards) * 100 : 0;

  return (
    <div className="score-tracker">
      <div className="score-player player1-score">
        <div className="player-info">
          <div className="player-avatar">👤</div>
          <div className="player-details">
            <div className="player-name">{player1?.name || 'Player 1'}</div>
            <div className="player-score-value">{player1?.score || 0} wins</div>
          </div>
        </div>
        <div className="score-bar-container">
          <div 
            className="score-bar player1-bar" 
            style={{ width: `${player1Progress}%` }}
          >
            <span className="score-percentage">{Math.round(player1Progress)}%</span>
          </div>
        </div>
        <div className="player-stats">
          <span>💪 {player1?.totalStrength || 0}</span>
          <span>🃏 {player1?.cardCount || 0}</span>
        </div>
      </div>

      <div className="score-divider">
        <div className="score-vs">VS</div>
        <div className="round-counter">Round {(gameState.roundsPlayed || 0) + 1}</div>
      </div>

      <div className="score-player player2-score">
        <div className="player-info">
          <div className="player-avatar">🤖</div>
          <div className="player-details">
            <div className="player-name">{player2?.name || 'Player 2'}</div>
            <div className="player-score-value">{player2?.score || 0} wins</div>
          </div>
        </div>
        <div className="score-bar-container">
          <div 
            className="score-bar player2-bar" 
            style={{ width: `${player2Progress}%` }}
          >
            <span className="score-percentage">{Math.round(player2Progress)}%</span>
          </div>
        </div>
        <div className="player-stats">
          <span>💪 {player2?.totalStrength || 0}</span>
          <span>🃏 {player2?.cardCount || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreTracker;

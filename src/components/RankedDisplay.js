import React, { useState, useEffect } from 'react';
import { rankedLadder, RANKS, LEAGUES } from '../utils/rankedLadder';
import './RankedDisplay.css';

/**
 * RankedDisplay - Shows player's current rank and progress
 */
const RankedDisplay = ({ compact = false, showStats = false }) => {
  const [rankInfo, setRankInfo] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const updateRankInfo = () => {
      const info = rankedLadder.getCurrentRankInfo();
      setRankInfo(info);
    };

    updateRankInfo();
    
    // Update when localStorage changes
    window.addEventListener('storage', updateRankInfo);
    return () => window.removeEventListener('storage', updateRankInfo);
  }, []);

  if (!rankInfo) return null;

  const league = LEAGUES[rankInfo.tier];

  if (compact) {
    return (
      <div 
        className="ranked-display-compact"
        onClick={() => setShowDetails(!showDetails)}
        style={{ '--rank-color': rankInfo.color }}
      >
        <span className="rank-icon">{rankInfo.icon}</span>
        <span className="rank-name">{rankInfo.name}</span>
        <span className="rank-points">{rankInfo.points} RP</span>
      </div>
    );
  }

  return (
    <div className="ranked-display" style={{ '--rank-color': rankInfo.color }}>
      <div className="ranked-header">
        <div className="rank-badge">
          <span className="rank-icon-large">{rankInfo.icon}</span>
          <div className="rank-info">
            <span className="rank-name">{rankInfo.name}</span>
            <span className="rank-tier">{league?.name} League</span>
          </div>
        </div>
        <div className="rank-points-display">
          <span className="points-value">{rankInfo.points}</span>
          <span className="points-label">RP</span>
        </div>
      </div>

      <div className="rank-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${rankInfo.progress}%`, backgroundColor: rankInfo.color }}
          />
        </div>
        <div className="progress-labels">
          <span>{rankInfo.name}</span>
          {rankInfo.pointsToNext > 0 && (
            <span>{rankInfo.pointsToNext} RP to next rank</span>
          )}
        </div>
      </div>

      {rankInfo.isPromotion && (
        <div className="promotion-shield">
          🛡️ Promotion Shield Active
        </div>
      )}

      {showStats && (
        <div className="ranked-stats">
          <div className="stat-item">
            <span className="stat-label">Win Rate</span>
            <span className="stat-value">{rankInfo.winRate}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Current Streak</span>
            <span className="stat-value">{rankedLadder.data.winStreak} 🔥</span>
          </div>
        </div>
      )}

      {showDetails && (
        <RankedDetailsModal 
          onClose={() => setShowDetails(false)}
          rankInfo={rankInfo}
        />
      )}
    </div>
  );
};

/**
 * RankedDetailsModal - Full ranked stats modal
 */
const RankedDetailsModal = ({ onClose, rankInfo }) => {
  const stats = rankedLadder.getStats();
  const leaderboard = rankedLadder.getLeaderboard();

  return (
    <div className="ranked-modal-overlay" onClick={onClose}>
      <div className="ranked-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>🏆 Ranked Stats</h2>
        
        <div className="modal-section">
          <h3>{rankInfo.icon} {rankInfo.name}</h3>
          <p className="season-label">Season: {stats.currentSeason}</p>
          
          <div className="stats-grid">
            <div className="stat-box">
              <span className="stat-value">{stats.gamesPlayed}</span>
              <span className="stat-label">Games</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{stats.wins}</span>
              <span className="stat-label">Wins</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{stats.losses}</span>
              <span className="stat-label">Losses</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{stats.winRate}</span>
              <span className="stat-label">Win Rate</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{stats.maxWinStreak} 🔥</span>
              <span className="stat-label">Best Streak</span>
            </div>
            <div className="stat-box">
              <span className="stat-value">{stats.peakRank.icon}</span>
              <span className="stat-label">Peak Rank</span>
            </div>
          </div>
        </div>

        <div className="modal-section">
          <h3>📊 Leaderboard</h3>
          <div className="leaderboard">
            {leaderboard.slice(0, 10).map((player, index) => (
              <div 
                key={index} 
                className={`leaderboard-row ${player.isPlayer ? 'is-player' : ''}`}
              >
                <span className="position">#{player.position}</span>
                <span className="player-name">{player.name}</span>
                <span className="player-rank">{RANKS[player.rank]?.icon}</span>
                <span className="player-points">{player.points} RP</span>
              </div>
            ))}
          </div>
        </div>

        {stats.recentMatches.length > 0 && (
          <div className="modal-section">
            <h3>📜 Recent Matches</h3>
            <div className="match-history">
              {stats.recentMatches.slice(0, 5).map((match, index) => (
                <div 
                  key={index} 
                  className={`match-row ${match.won ? 'win' : 'loss'}`}
                >
                  <span className="match-result">{match.won ? '✅ Win' : '❌ Loss'}</span>
                  <span className="match-points">
                    {match.pointsChange > 0 ? '+' : ''}{match.pointsChange} RP
                  </span>
                  <span className="match-score">
                    {match.roundsWon} - {match.roundsLost}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * RankedResultDisplay - Shows ranked result after a game
 */
export const RankedResultDisplay = ({ result, inline = false }) => {
  if (!result) return null;

  return (
    <div className={`ranked-result-display ${inline ? 'inline' : ''}`}>
      <h3>🏆 Ranked Update</h3>
      
      <div className="result-content">
        <div className="rank-change">
          <span className="rank-icon">{result.newRank?.icon || '🏆'}</span>
          <span className="rank-name">{result.newRank?.name || 'Unknown'}</span>
        </div>
        
        <div className={`points-change ${result.pointsChange >= 0 ? 'positive' : 'negative'}`}>
          {result.pointsChange >= 0 ? '+' : ''}{result.pointsChange} RP
        </div>

        <div className="new-total">
          Total: {result.newPoints} RP
        </div>

        {result.winStreak > 1 && (
          <div className="streak-bonus">
            🔥 {result.winStreak} Win Streak!
          </div>
        )}

        {result.events?.map((event, index) => (
          <div key={index} className={`event-item event-${event.type}`}>
            {event.type === 'promoted' && `🎉 Promoted to ${RANKS[event.newRank]?.name}!`}
            {event.type === 'demoted' && `📉 Demoted to ${RANKS[event.newRank]?.name}`}
            {event.type === 'perfect' && '⭐ Perfect Game Bonus!'}
            {event.type === 'underdog' && '💪 Underdog Bonus!'}
            {event.type === 'domination' && '👑 Domination Bonus!'}
            {event.type === 'combo' && `🎯 Combo Bonus: +${event.points}`}
            {event.type === 'streak' && `🔥 Streak Bonus: +${event.points}`}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankedDisplay;

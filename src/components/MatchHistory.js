import React, { useState, useEffect, useMemo } from 'react';
import { getMatchHistory, getMatchStats, calculateRank, RANKS } from '../utils/gameEnhancements';
import './MatchHistory.css';

const MatchHistory = ({ isVisible, onClose }) => {
  const [matches, setMatches] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('history'); // 'history', 'stats', 'rank'
  const [rankPoints, setRankPoints] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setMatches(getMatchHistory(20));
      setStats(getMatchStats());
      
      // Load rank points from localStorage
      const savedPoints = parseInt(localStorage.getItem('rankPoints') || '0', 10);
      setRankPoints(savedPoints);
    }
  }, [isVisible]);

  const currentRank = useMemo(() => calculateRank(rankPoints), [rankPoints]);

  const formatDuration = (ms) => {
    if (!ms) return '--:--';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getOutcomeClass = (outcome) => {
    switch (outcome) {
      case 'WIN': return 'win';
      case 'LOSS': return 'loss';
      case 'TIE': return 'tie';
      default: return '';
    }
  };

  const getElementIcon = (element) => {
    const icons = {
      FIRE: '🔥', ICE: '❄️', WATER: '💧', EARTH: '🌍',
      ELECTRICITY: '⚡', LIGHT: '✨', DARK: '🌑',
      TECHNOLOGY: '🔧', POWER: '💪', METEOR: '☄️', NEUTRAL: '⚪'
    };
    return icons[element] || '❓';
  };

  if (!isVisible) return null;

  return (
    <div className="match-history-overlay">
      <div className="match-history-modal">
        <div className="match-history-header">
          <h2>Battle Records</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Tab Navigation */}
        <div className="match-history-tabs">
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            📜 History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Stats
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rank' ? 'active' : ''}`}
            onClick={() => setActiveTab('rank')}
          >
            🏆 Rank
          </button>
        </div>

        <div className="match-history-content">
          {/* Match History Tab */}
          {activeTab === 'history' && (
            <div className="history-list">
              {matches.length === 0 ? (
                <div className="no-matches">
                  <span className="no-matches-icon">🎮</span>
                  <p>No matches played yet!</p>
                  <p className="no-matches-hint">Play some games to see your history here.</p>
                </div>
              ) : (
                matches.map((match, index) => (
                  <div key={match.id || index} className={`match-card ${getOutcomeClass(match.outcome)}`}>
                    <div className="match-outcome">
                      <span className="outcome-badge">{match.outcome}</span>
                      {match.rankChange !== 0 && (
                        <span className={`rank-change ${match.rankChange > 0 ? 'positive' : 'negative'}`}>
                          {match.rankChange > 0 ? '+' : ''}{match.rankChange} RP
                        </span>
                      )}
                    </div>
                    
                    <div className="match-details">
                      <div className="match-players">
                        <span className="player-name">You</span>
                        <span className="vs">vs</span>
                        <span className="opponent-name">{match.opponent?.name || 'AI'}</span>
                      </div>
                      
                      <div className="match-score">
                        <span className="score">{match.player?.score || 0}</span>
                        <span className="score-divider">-</span>
                        <span className="score">{match.opponent?.score || 0}</span>
                      </div>
                      
                      <div className="match-elements">
                        {match.player?.elements?.map((el, i) => (
                          <span key={i} className="element-icon" title={el}>
                            {getElementIcon(el)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="match-meta">
                      <span className="match-duration">⏱️ {formatDuration(match.duration)}</span>
                      <span className="match-date">{formatDate(match.timestamp)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Stats Tab */}
          {activeTab === 'stats' && stats && (
            <div className="stats-container">
              {/* Win Rate Circle */}
              <div className="win-rate-display">
                <div className="win-rate-circle">
                  <svg viewBox="0 0 100 100">
                    <circle 
                      className="win-rate-bg" 
                      cx="50" cy="50" r="45"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle 
                      className="win-rate-fill" 
                      cx="50" cy="50" r="45"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${stats.winRate * 2.83} ${283 - stats.winRate * 2.83}`}
                      strokeDashoffset="70.75"
                    />
                  </svg>
                  <div className="win-rate-text">
                    <span className="win-rate-value">{stats.winRate}%</span>
                    <span className="win-rate-label">Win Rate</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-icon">🎮</span>
                  <span className="stat-value">{stats.totalGames}</span>
                  <span className="stat-label">Games Played</span>
                </div>
                <div className="stat-item wins">
                  <span className="stat-icon">🏆</span>
                  <span className="stat-value">{stats.wins}</span>
                  <span className="stat-label">Victories</span>
                </div>
                <div className="stat-item losses">
                  <span className="stat-icon">💔</span>
                  <span className="stat-value">{stats.losses}</span>
                  <span className="stat-label">Defeats</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">🤝</span>
                  <span className="stat-value">{stats.ties}</span>
                  <span className="stat-label">Ties</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon">📈</span>
                  <span className="stat-value">{stats.avgScore}</span>
                  <span className="stat-label">Avg Score</span>
                </div>
                <div className="stat-item streak">
                  <span className="stat-icon">🔥</span>
                  <span className="stat-value">{stats.longestWinStreak}</span>
                  <span className="stat-label">Best Streak</span>
                </div>
              </div>

              {/* Favorite Element */}
              {stats.favoriteElement && (
                <div className="favorite-element">
                  <span className="favorite-label">Favorite Element</span>
                  <div className="favorite-display">
                    <span className="favorite-icon">{getElementIcon(stats.favoriteElement)}</span>
                    <span className="favorite-name">{stats.favoriteElement}</span>
                  </div>
                </div>
              )}

              {/* Current Streak */}
              {stats.currentStreak > 0 && (
                <div className="current-streak">
                  <span className="streak-flame">🔥</span>
                  <span className="streak-text">{stats.currentStreak} Win Streak!</span>
                </div>
              )}
            </div>
          )}

          {/* Rank Tab */}
          {activeTab === 'rank' && (
            <div className="rank-container">
              {/* Current Rank Display */}
              <div className="current-rank-display">
                <div className="rank-emblem" style={{ borderColor: currentRank.rankData.color }}>
                  <span className="rank-icon">{currentRank.rankData.icon}</span>
                </div>
                <div className="rank-info">
                  <span className="rank-name" style={{ color: currentRank.rankData.color }}>
                    {currentRank.displayName}
                  </span>
                  <span className="rank-points">{rankPoints} RP</span>
                </div>
              </div>

              {/* Progress to Next Division */}
              <div className="rank-progress">
                <div className="progress-label">
                  <span>Progress to next division</span>
                  <span>{currentRank.pointsToNextDivision} RP needed</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${100 - (currentRank.pointsToNextDivision / 25) * 100}%`,
                      background: currentRank.rankData.color
                    }}
                  />
                </div>
              </div>

              {/* Rank Ladder */}
              <div className="rank-ladder">
                <h4>All Ranks</h4>
                <div className="ladder-list">
                  {Object.entries(RANKS).map(([key, rank]) => (
                    <div 
                      key={key}
                      className={`ladder-item ${currentRank.rank === key ? 'current' : ''} ${rankPoints >= rank.minPoints ? 'achieved' : ''}`}
                    >
                      <span className="ladder-icon">{rank.icon}</span>
                      <span className="ladder-name" style={{ color: rank.color }}>{rank.name}</span>
                      <span className="ladder-points">{rank.minPoints}+ RP</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchHistory;

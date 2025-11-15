import React from 'react';
import { getStats, getWinRate, getFavoriteElement, resetStats } from '../utils/statistics';
import './Statistics.css';

const Statistics = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const stats = getStats();
  const winRate = getWinRate();
  const favoriteElement = getFavoriteElement();

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleDateString();
  };

  const getElementIcon = (element) => {
    const icons = {
      'FIRE': '🔥',
      'ICE': '❄️',
      'WATER': '💧',
      'ELECTRICITY': '⚡',
      'EARTH': '🌍',
      'POWER': '⭐'
    };
    return icons[element] || '?';
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
      resetStats();
      window.location.reload();
    }
  };

  return (
    <div className="stats-overlay" onClick={onClose}>
      <div className="stats-container" onClick={(e) => e.stopPropagation()}>
        <div className="stats-header">
          <h2>📊 Game Statistics</h2>
          <button className="stats-close" onClick={onClose}>✕</button>
        </div>

        <div className="stats-content">
          {/* Overall Stats */}
          <div className="stats-section">
            <h3>🎮 Overall Performance</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.gamesPlayed}</div>
                <div className="stat-label">Games Played</div>
              </div>
              <div className="stat-item highlight">
                <div className="stat-value">{stats.gamesWon}</div>
                <div className="stat-label">Wins</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.gamesLost}</div>
                <div className="stat-label">Losses</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.gamesTied}</div>
                <div className="stat-label">Ties</div>
              </div>
            </div>
          </div>

          {/* Win Rate */}
          <div className="stats-section">
            <h3>📈 Statistics</h3>
            <div className="stats-grid">
              <div className="stat-item highlight">
                <div className="stat-value">{winRate}%</div>
                <div className="stat-label">Win Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.longestWinStreak}</div>
                <div className="stat-label">Best Streak</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.currentWinStreak}</div>
                <div className="stat-label">Current Streak</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.highestScore}</div>
                <div className="stat-label">Highest Score</div>
              </div>
            </div>
          </div>

          {/* Element Stats */}
          <div className="stats-section">
            <h3>🎴 Element Performance</h3>
            <div className="element-stats">
              {Object.entries(stats.elementStats).map(([element, data]) => (
                <div key={element} className="element-stat-row">
                  <div className="element-name">
                    {getElementIcon(element)} {element}
                  </div>
                  <div className="element-bar">
                    <div 
                      className="element-bar-fill"
                      style={{ width: `${data.played > 0 ? (data.won / data.played) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="element-stats-text">
                    {data.won}/{data.played}
                  </div>
                </div>
              ))}
            </div>
            <div className="favorite-element">
              <strong>Favorite Element:</strong> {getElementIcon(favoriteElement)} {favoriteElement}
            </div>
          </div>

          {/* Misc Stats */}
          <div className="stats-section">
            <h3>🎯 Achievements</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.totalCardsPlayed}</div>
                <div className="stat-label">Cards Played</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.matchBonusCount}</div>
                <div className="stat-label">Match Bonuses</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.specialAbilitiesUsed}</div>
                <div className="stat-label">Abilities Used</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{formatTime(stats.fastestWin)}</div>
                <div className="stat-label">Fastest Win</div>
              </div>
            </div>
          </div>

          {/* Last Played */}
          <div className="stats-footer-info">
            <p>Last played: {formatDate(stats.lastPlayed)}</p>
          </div>
        </div>

        <div className="stats-footer">
          <button className="reset-stats-button" onClick={handleReset}>
            🔄 Reset Statistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

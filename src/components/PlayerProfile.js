import React, { useState } from 'react';
import './PlayerProfile.css';

const PlayerProfile = ({ player, isAI, stats }) => {
  const [activeTab, setActiveTab] = useState('stats');
  
  if (!player) return null;

  const getWinRate = () => {
    const totalGames = stats?.totalGames || 0;
    const wins = stats?.wins || 0;
    return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  };

  const getLevel = () => {
    const totalGames = stats?.totalGames || 0;
    return Math.floor(totalGames / 5) + 1; // Level up every 5 games
  };

  const getExperience = () => {
    const totalGames = stats?.totalGames || 0;
    const currentLevelGames = totalGames % 5;
    return { current: currentLevelGames, max: 5 };
  };

  const getAvatar = () => {
    if (isAI) {
      const aiAvatars = ['🤖', '👾', '🎮', '💻', '🦾'];
      return aiAvatars[Math.floor(Math.random() * aiAvatars.length)];
    }
    return stats?.avatar || '👤';
  };

  const getRank = () => {
    const winRate = getWinRate();
    const level = getLevel();
    
    if (level >= 20 && winRate >= 80) return { name: 'Grandmaster', icon: '👑', color: '#ffd700', description: 'Elite Champion' };
    if (level >= 15 && winRate >= 70) return { name: 'Master', icon: '💎', color: '#00bcd4', description: 'Legendary Warrior' };
    if (winRate >= 60) return { name: 'Expert', icon: '⭐', color: '#2196f3', description: 'Skilled Fighter' };
    if (winRate >= 40) return { name: 'Skilled', icon: '🌟', color: '#4caf50', description: 'Competent Player' };
    if (winRate >= 20) return { name: 'Novice', icon: '🎯', color: '#ff9800', description: 'Learning Fast' };
    return { name: 'Beginner', icon: '🔰', color: '#9e9e9e', description: 'Starting Journey' };
  };

  const getFavoriteElement = () => {
    const elements = {
      FIRE: { icon: '🔥', name: 'Fire', color: '#ff6b6b' },
      ICE: { icon: '❄️', name: 'Ice', color: '#4ecdc4' },
      WATER: { icon: '💧', name: 'Water', color: '#45b7d1' },
      ELECTRICITY: { icon: '⚡', name: 'Electricity', color: '#f7b731' },
      EARTH: { icon: '🌍', name: 'Earth', color: '#5f27cd' },
      POWER: { icon: '⭐', name: 'Power', color: '#ffd700' },
      LIGHT: { icon: '☀️', name: 'Light', color: '#fff59d' },
      DARK: { icon: '🌙', name: 'Dark', color: '#5e35b1' }
    };
    
    const mostUsed = stats?.favoriteElement || 'FIRE';
    return elements[mostUsed] || elements.FIRE;
  };

  const getRecentMatches = () => {
    return stats?.recentMatches || [
      { result: 'win', opponent: 'Terra', score: '15-12' },
      { result: 'loss', opponent: 'Ember', score: '10-14' },
      { result: 'win', opponent: 'Zephyr', score: '16-9' }
    ];
  };

  const rank = getRank();
  const level = getLevel();
  const exp = getExperience();
  const favoriteElement = getFavoriteElement();

  return (
    <div className={`player-profile ${isAI ? 'ai-profile' : 'human-profile'}`}>
      {/* Profile Header with Avatar and Basic Info */}
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar-large">{getAvatar()}</div>
          <div className="profile-level-badge">
            <span className="level-icon">⚡</span>
            <span className="level-number">{level}</span>
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name">{player.name}</div>
          <div className="profile-rank" style={{ color: rank.color }}>
            {rank.icon} {rank.name}
          </div>
          <div className="profile-rank-description">{rank.description}</div>
          
          {/* Experience Bar */}
          <div className="exp-container">
            <div className="exp-label">Level Progress</div>
            <div className="exp-bar">
              <div className="exp-bar-fill" style={{ width: `${(exp.current / exp.max) * 100}%` }}>
                <span className="exp-text">{exp.current}/{exp.max}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Element Banner */}
      <div className="favorite-element" style={{ borderColor: favoriteElement.color }}>
        <span className="element-icon">{favoriteElement.icon}</span>
        <div className="element-info">
          <div className="element-label">Favorite Element</div>
          <div className="element-name" style={{ color: favoriteElement.color }}>{favoriteElement.name}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Stats
        </button>
        <button 
          className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Awards
        </button>
        <button 
          className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          📜 History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'stats' && (
          <div className="profile-stats">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎮</div>
                <div className="stat-info">
                  <div className="stat-label">Total Games</div>
                  <div className="stat-value">{stats?.totalGames || 0}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🏆</div>
                <div className="stat-info">
                  <div className="stat-label">Victories</div>
                  <div className="stat-value win-value">{stats?.wins || 0}</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">💔</div>
                <div className="stat-info">
                  <div className="stat-label">Defeats</div>
                  <div className="stat-value loss-value">{stats?.losses || 0}</div>
                </div>
              </div>
              
              <div className="stat-card highlight">
                <div className="stat-icon">📈</div>
                <div className="stat-info">
                  <div className="stat-label">Win Rate</div>
                  <div className="stat-value">{getWinRate()}%</div>
                </div>
                <div className="stat-bar">
                  <div className="stat-bar-fill" style={{ width: `${getWinRate()}%` }}></div>
                </div>
              </div>
            </div>

            <div className="additional-stats">
              <div className="stat-row">
                <span className="stat-row-label">🔥 Win Streak:</span>
                <span className="stat-row-value">{stats?.winStreak || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-row-label">⭐ Best Score:</span>
                <span className="stat-row-value">{stats?.highScore || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-row-label">🎴 Cards Played:</span>
                <span className="stat-row-value">{stats?.cardsPlayed || 0}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="profile-achievements">
            <div className="achievements-grid">
              {stats?.firstWin && (
                <div className="achievement-badge unlocked" title="First Victory">
                  <div className="badge-icon">🎉</div>
                  <div className="badge-name">First Win</div>
                </div>
              )}
              {stats?.perfectGame && (
                <div className="achievement-badge unlocked" title="Perfect Game">
                  <div className="badge-icon">💯</div>
                  <div className="badge-name">Perfect</div>
                </div>
              )}
              {stats?.winStreak >= 3 && (
                <div className="achievement-badge unlocked" title="Win Streak">
                  <div className="badge-icon">🔥</div>
                  <div className="badge-name">Hot Streak</div>
                </div>
              )}
              {stats?.legendaryPlayed && (
                <div className="achievement-badge unlocked" title="Legendary Player">
                  <div className="badge-icon">⭐</div>
                  <div className="badge-name">Legendary</div>
                </div>
              )}
              {getLevel() >= 10 && (
                <div className="achievement-badge unlocked" title="Veteran">
                  <div className="badge-icon">🎖️</div>
                  <div className="badge-name">Veteran</div>
                </div>
              )}
              {getWinRate() >= 80 && (
                <div className="achievement-badge unlocked" title="Champion">
                  <div className="badge-icon">👑</div>
                  <div className="badge-name">Champion</div>
                </div>
              )}
              
              {/* Locked achievements */}
              {!stats?.firstWin && (
                <div className="achievement-badge locked" title="Play your first game">
                  <div className="badge-icon">🔒</div>
                  <div className="badge-name">First Win</div>
                </div>
              )}
              {!stats?.perfectGame && (
                <div className="achievement-badge locked" title="Win with full HP">
                  <div className="badge-icon">🔒</div>
                  <div className="badge-name">Perfect</div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="match-history">
            {getRecentMatches().length > 0 ? (
              getRecentMatches().map((match, index) => (
                <div key={index} className={`match-card ${match.result}`}>
                  <div className="match-result-icon">
                    {match.result === 'win' ? '🏆' : '💔'}
                  </div>
                  <div className="match-info">
                    <div className="match-opponent">vs {match.opponent}</div>
                    <div className="match-score">{match.score}</div>
                  </div>
                  <div className={`match-result-badge ${match.result}`}>
                    {match.result === 'win' ? 'VICTORY' : 'DEFEAT'}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-matches">No match history yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;

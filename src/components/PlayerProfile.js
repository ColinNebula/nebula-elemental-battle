import React from 'react';
import './PlayerProfile.css';

const PlayerProfile = ({ player, isAI, stats }) => {
  if (!player) return null;

  const getWinRate = () => {
    const totalGames = stats?.totalGames || 0;
    const wins = stats?.wins || 0;
    return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
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
    if (winRate >= 80) return { name: 'Master', icon: '👑', color: '#ffd700' };
    if (winRate >= 60) return { name: 'Expert', icon: '💎', color: '#2196f3' };
    if (winRate >= 40) return { name: 'Skilled', icon: '⭐', color: '#4caf50' };
    if (winRate >= 20) return { name: 'Novice', icon: '🌟', color: '#ff9800' };
    return { name: 'Beginner', icon: '🎯', color: '#9e9e9e' };
  };

  const rank = getRank();

  return (
    <div className={`player-profile ${isAI ? 'ai-profile' : 'human-profile'}`}>
      <div className="profile-header">
        <div className="profile-avatar-large">{getAvatar()}</div>
        <div className="profile-info">
          <div className="profile-name">{player.name}</div>
          <div className="profile-rank" style={{ color: rank.color }}>
            {rank.icon} {rank.name}
          </div>
        </div>
      </div>
      
      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-label">Win Rate</div>
          <div className="stat-value">{getWinRate()}%</div>
          <div className="stat-bar">
            <div className="stat-bar-fill" style={{ width: `${getWinRate()}%` }}></div>
          </div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Total Games</div>
          <div className="stat-value">{stats?.totalGames || 0}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Total Wins</div>
          <div className="stat-value win-value">{stats?.wins || 0}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Total Losses</div>
          <div className="stat-value loss-value">{stats?.losses || 0}</div>
        </div>
      </div>

      <div className="profile-achievements">
        <div className="achievement-label">🏆 Achievements</div>
        <div className="achievements-grid">
          {stats?.firstWin && <div className="achievement-badge" title="First Victory">🎉</div>}
          {stats?.perfectGame && <div className="achievement-badge" title="Perfect Game">💯</div>}
          {stats?.winStreak >= 3 && <div className="achievement-badge" title="Win Streak">🔥</div>}
          {stats?.legendaryPlayed && <div className="achievement-badge" title="Legendary Player">⭐</div>}
          {!stats?.firstWin && !stats?.perfectGame && !stats?.winStreak && !stats?.legendaryPlayed && (
            <div className="no-achievements">No achievements yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;

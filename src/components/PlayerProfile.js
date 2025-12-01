import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './PlayerProfile.css';
import userPreferences from '../utils/userPreferences';

const PlayerProfile = ({ player, isAI, stats, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [avatarCategory, setAvatarCategory] = useState('heroes');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(player?.name || 'Player');
  const [saveMessage, setSaveMessage] = useState(null);
  
  const avatarCategories = {
    heroes: {
      name: '⚔️ Heroes',
      avatars: ['👤', '🧙', '🧙‍♂️', '🧙‍♀️', '🧝', '🧝‍♂️', '🧝‍♀️', '🧚', '🧚‍♂️', '🧚‍♀️', '🦸', '🦸‍♂️', '🦸‍♀️', '🦹', '🦹‍♂️', '🦹‍♀️', '🥷', '🤴', '👸', '👑']
    },
    warriors: {
      name: '⚔️ Warriors',
      avatars: ['⚔️', '🗡️', '🛡️', '🏹', '🪓', '⚡', '🔱', '🎯', '🏹', '💣', '🧨', '💥', '⚔️', '🗡️', '🔫', '🏴‍☠️', '☠️', '💀', '👹', '👺']
    },
    elements: {
      name: '🌟 Elements',
      avatars: ['🔥', '❄️', '💧', '🌊', '⚡', '🌍', '💨', '🌪️', '☄️', '⭐', '✨', '💫', '🌟', '💎', '🔮', '☀️', '🌙', '⚡', '🌈', '🌠']
    },
    creatures: {
      name: '🐉 Creatures',
      avatars: ['🐉', '🐲', '🦄', '🦅', '🦊', '🐺', '🦁', '🐯', '🐻', '🐼', '🦇', '🦉', '🦚', '🐍', '🦎', '🐢', '🦈', '🐙', '🦀', '🦑']
    },
    mythical: {
      name: '✨ Mythical',
      avatars: ['👻', '👽', '🤖', '👾', '🎃', '👹', '👺', '🧛', '🧛‍♂️', '🧛‍♀️', '🧟', '🧟‍♂️', '🧟‍♀️', '🎭', '🗿', '🏺', '⚱️', '🔱', '☯️', '♾️']
    },
    cosmic: {
      name: '🌌 Cosmic',
      avatars: ['🌌', '🪐', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌚', '🌝', '🌞', '⭐', '🌟', '✨', '💫', '☄️', '🌠', '🔭']
    }
  };
  
  if (!player) return null;

  const getWinRate = () => {
    const totalGames = stats?.totalGames || 0;
    const wins = stats?.wins || 0;
    return totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  };

  const getLevel = () => {
    const totalGames = stats?.totalGames || 0;
    const cardsPlayed = stats?.cardsPlayed || 0;
    const wins = stats?.wins || 0;
    // More comprehensive XP system: games + cards + bonus for wins
    const xp = totalGames * 100 + cardsPlayed * 10 + wins * 150;
    return Math.floor(Math.pow(xp / 500, 0.7)) + 1;
  };

  const getExperience = () => {
    const totalGames = stats?.totalGames || 0;
    const cardsPlayed = stats?.cardsPlayed || 0;
    const wins = stats?.wins || 0;
    const xp = totalGames * 100 + cardsPlayed * 10 + wins * 150;
    const level = getLevel();
    const xpForCurrentLevel = Math.pow((level - 1) * 500, 1 / 0.7);
    const xpForNextLevel = Math.pow(level * 500, 1 / 0.7);
    const current = Math.floor(xp - xpForCurrentLevel);
    const max = Math.floor(xpForNextLevel - xpForCurrentLevel);
    return { current, max, total: xp };
  };

  const getAvatar = () => {
    if (isAI) {
      const aiAvatars = ['🤖', '👾', '🎮', '💻', '🦾'];
      return aiAvatars[Math.floor(Math.random() * aiAvatars.length)];
    }
    // Check for selectedAvatar object first (from character selection)
    const selectedAvatar = stats?.selectedAvatar || player?.selectedAvatar;
    if (selectedAvatar && selectedAvatar.icon) {
      return selectedAvatar.icon;
    }
    // Also check userPreferences
    const prefsAvatar = userPreferences.getAvatar();
    if (prefsAvatar && prefsAvatar.icon) {
      return prefsAvatar.icon;
    }
    // Fallback to localStorage directly
    try {
      const savedAvatar = localStorage.getItem('savedAvatar');
      if (savedAvatar) {
        const parsed = JSON.parse(savedAvatar);
        if (parsed && parsed.icon) {
          return parsed.icon;
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
    return stats?.avatar || player?.avatar || '👤';
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
  
  const getElementMastery = () => {
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
    
    const elementStats = stats?.elementStats || {};
    return Object.keys(elements).map(elem => {
      const data = elementStats[elem] || { played: 0, won: 0 };
      const winRate = data.played > 0 ? Math.round((data.won / data.played) * 100) : 0;
      const masteryLevel = data.played >= 50 ? 'Master' : data.played >= 20 ? 'Expert' : data.played >= 10 ? 'Skilled' : 'Novice';
      return {
        ...elements[elem],
        type: elem,
        played: data.played,
        won: data.won,
        winRate,
        masteryLevel
      };
    }).sort((a, b) => b.played - a.played);
  };

  const getRecentMatches = () => {
    const matches = stats?.recentMatches || [
      { result: 'win', opponent: 'Terra', score: '15-12', timestamp: Date.now() - 86400000, duration: 420 },
      { result: 'loss', opponent: 'Ember', score: '10-14', timestamp: Date.now() - 172800000, duration: 380 },
      { result: 'win', opponent: 'Zephyr', score: '16-9', timestamp: Date.now() - 259200000, duration: 310 }
    ];
    return matches.map(m => ({
      ...m,
      timeAgo: getTimeAgo(m.timestamp),
      durationText: formatDuration(m.duration)
    }));
  };
  
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };
  
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAvatarChange = (newAvatar) => {
    if (!isAI) {
      // Create proper avatar object
      const avatarData = {
        id: 'custom',
        name: 'Custom Avatar',
        icon: newAvatar,
        element: 'NEUTRAL'
      };
      
      // Save to userPreferences immediately
      userPreferences.updateAvatar(avatarData);
      
      // Also save directly to localStorage for redundancy
      localStorage.setItem('savedAvatar', JSON.stringify(avatarData));
      
      console.log('🎭 [PROFILE] Avatar saved:', avatarData);
      
      // Update parent component
      if (onUpdateProfile) {
        onUpdateProfile({ avatar: newAvatar, selectedAvatar: avatarData });
      }
      
      setShowAvatarSelector(false);
      
      // Show confirmation
      setSaveMessage('✅ Avatar saved!');
      setTimeout(() => setSaveMessage(null), 2000);
    }
  };

  const handleNameEdit = () => {
    if (!isAI) {
      setIsEditingName(true);
      setEditedName(player?.name || 'Player');
    }
  };

  const handleNameSave = () => {
    if (editedName.trim() && editedName.trim() !== player.name) {
      userPreferences.updatePlayerName(editedName.trim());
      // Also save directly to localStorage for persistence
      localStorage.setItem('playerName', editedName.trim());
      if (onUpdateProfile) {
        onUpdateProfile({ name: editedName.trim() });
      }
    }
    setIsEditingName(false);
  };

  // Save all settings to ensure persistence
  const saveAllSettings = () => {
    try {
      // Get current avatar
      const currentAvatar = userPreferences.getAvatar() || stats?.selectedAvatar;
      const currentName = editedName.trim() || player?.name || 'Player';
      
      // Save name
      userPreferences.updatePlayerName(currentName);
      localStorage.setItem('playerName', currentName);
      
      // Save avatar if exists
      if (currentAvatar) {
        userPreferences.updateAvatar(currentAvatar);
        localStorage.setItem('savedAvatar', JSON.stringify(currentAvatar));
      }
      
      // Update profile
      if (onUpdateProfile) {
        onUpdateProfile({ name: currentName });
      }
      
      // Show success message
      setSaveMessage('✅ Settings saved!');
      setTimeout(() => setSaveMessage(null), 3000);
      
      console.log('💾 All settings saved:', { name: currentName, avatar: currentAvatar });
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage('❌ Error saving settings');
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const handleNameCancel = () => {
    setEditedName(player?.name || 'Player');
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      handleNameCancel();
    }
  };
  
  const getAllAchievements = () => {
    return [
      { id: 'firstWin', icon: '🎉', name: 'First Victory', description: 'Win your first game', unlocked: stats?.firstWin },
      { id: 'perfectGame', icon: '💯', name: 'Perfect Game', description: 'Win without losing a round', unlocked: stats?.perfectGame },
      { id: 'hotStreak', icon: '🔥', name: 'Hot Streak', description: 'Win 3 games in a row', unlocked: stats?.winStreak >= 3 },
      { id: 'legendary', icon: '⭐', name: 'Legendary', description: 'Play a legendary card', unlocked: stats?.legendaryPlayed },
      { id: 'veteran', icon: '🎖️', name: 'Veteran', description: 'Reach level 10', unlocked: getLevel() >= 10 },
      { id: 'champion', icon: '👑', name: 'Champion', description: 'Achieve 80% win rate', unlocked: getWinRate() >= 80 },
      { id: 'centurion', icon: '💯', name: 'Centurion', description: 'Win 100 games', unlocked: (stats?.wins || 0) >= 100 },
      { id: 'elementMaster', icon: '🌟', name: 'Element Master', description: 'Master 5 elements', unlocked: getElementMastery().filter(e => e.played >= 50).length >= 5 },
      { id: 'speedster', icon: '⚡', name: 'Speedster', description: 'Win in under 2 minutes', unlocked: stats?.fastestWin && stats.fastestWin < 120 },
      { id: 'cardShark', icon: '🎴', name: 'Card Shark', description: 'Play 500 cards', unlocked: (stats?.cardsPlayed || 0) >= 500 },
      { id: 'elite', icon: '💎', name: 'Elite', description: 'Reach level 20', unlocked: getLevel() >= 20 },
      { id: 'grandmaster', icon: '🏆', name: 'Grandmaster', description: 'Reach Grandmaster rank', unlocked: getRank().name === 'Grandmaster' }
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
          <div 
            className="profile-avatar-large" 
            onClick={() => !isAI && setShowAvatarSelector(!showAvatarSelector)}
            style={{ cursor: isAI ? 'default' : 'pointer' }}
            title={isAI ? '' : 'Click to change avatar'}
          >
            {getAvatar()}
          </div>
          {showAvatarSelector && !isAI && ReactDOM.createPortal(
            <>
              <div className="avatar-selector-backdrop" onClick={() => setShowAvatarSelector(false)} />
              <div className="avatar-selector-enhanced">
                <div className="avatar-selector-header">
                  <h3>Choose Your Avatar</h3>
                  <button className="avatar-close-btn" onClick={() => setShowAvatarSelector(false)}>✕</button>
                </div>
              
              <div className="avatar-categories">
                {Object.keys(avatarCategories).map((catKey) => (
                  <button
                    key={catKey}
                    className={`category-btn ${avatarCategory === catKey ? 'active' : ''}`}
                    onClick={() => setAvatarCategory(catKey)}
                  >
                    {avatarCategories[catKey].name}
                  </button>
                ))}
              </div>
              
              <div className="avatar-grid">
                {avatarCategories[avatarCategory].avatars.map((avatar, idx) => (
                  <div 
                    key={idx} 
                    className={`avatar-option ${getAvatar() === avatar ? 'selected' : ''}`}
                    onClick={() => handleAvatarChange(avatar)}
                    title="Click to select"
                  >
                    {avatar}
                  </div>
                ))}
              </div>
              </div>
            </>,
            document.body
          )}
          <div className="profile-level-badge">
            <span className="level-icon">⚡</span>
            <span className="level-number">{level}</span>
          </div>
        </div>
        <div className="profile-info">
          <div className="profile-name-container">
            {isEditingName && !isAI ? (
              <div className="name-edit-wrapper">
                <input
                  type="text"
                  className="profile-name-input"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={handleNameKeyDown}
                  onBlur={handleNameSave}
                  maxLength={20}
                  autoFocus
                  placeholder="Enter your name"
                />
                <div className="name-edit-buttons">
                  <button className="name-save-btn" onClick={handleNameSave} title="Save">✓</button>
                  <button className="name-cancel-btn" onClick={handleNameCancel} title="Cancel">✕</button>
                </div>
              </div>
            ) : (
              <>
                <div className="profile-name">{player.name}</div>
                {!isAI && (
                  <button 
                    className="name-edit-btn" 
                    onClick={handleNameEdit}
                    title="Edit name"
                  >
                    ✏️
                  </button>
                )}
              </>
            )}
          </div>
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
          className={`tab-button ${activeTab === 'mastery' ? 'active' : ''}`}
          onClick={() => setActiveTab('mastery')}
        >
          ✨ Mastery
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
                <span className="stat-row-label">🏅 Best Streak:</span>
                <span className="stat-row-value">{stats?.longestWinStreak || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-row-label">⭐ Best Score:</span>
                <span className="stat-row-value">{stats?.highScore || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-row-label">🎴 Cards Played:</span>
                <span className="stat-row-value">{stats?.cardsPlayed || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-row-label">⚡ Total XP:</span>
                <span className="stat-row-value">{exp.total || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-row-label">⏱️ Fastest Win:</span>
                <span className="stat-row-value">{stats?.fastestWin ? formatDuration(stats.fastestWin) : 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mastery' && (
          <div className="element-mastery">
            <div className="mastery-header">
              <h3>Element Mastery</h3>
              <p className="mastery-description">Track your proficiency with each element</p>
            </div>
            <div className="mastery-list">
              {getElementMastery().map((element, idx) => (
                <div key={idx} className="mastery-card" style={{ borderLeftColor: element.color }}>
                  <div className="mastery-icon">{element.icon}</div>
                  <div className="mastery-info">
                    <div className="mastery-name" style={{ color: element.color }}>
                      {element.name}
                      <span className="mastery-level">{element.masteryLevel}</span>
                    </div>
                    <div className="mastery-stats">
                      <span>Played: {element.played}</span>
                      <span>Won: {element.won}</span>
                      <span>Win Rate: {element.winRate}%</span>
                    </div>
                    <div className="mastery-bar">
                      <div 
                        className="mastery-bar-fill" 
                        style={{ 
                          width: `${Math.min(element.played * 2, 100)}%`,
                          background: `linear-gradient(90deg, ${element.color}, ${element.color}88)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="profile-achievements">
            <div className="achievements-summary">
              <div className="achievement-progress">
                <span className="progress-text">
                  {getAllAchievements().filter(a => a.unlocked).length} / {getAllAchievements().length} Unlocked
                </span>
                <div className="progress-bar-mini">
                  <div 
                    className="progress-bar-mini-fill" 
                    style={{ width: `${(getAllAchievements().filter(a => a.unlocked).length / getAllAchievements().length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="achievements-grid">
              {getAllAchievements().map((achievement, idx) => (
                <div 
                  key={idx} 
                  className={`achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                  title={achievement.description}
                >
                  <div className="badge-icon">{achievement.unlocked ? achievement.icon : '🔒'}</div>
                  <div className="badge-name">{achievement.name}</div>
                  {!achievement.unlocked && (
                    <div className="badge-description">{achievement.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Settings Button */}
        {!isAI && (
          <div className="save-settings-container">
            <button className="save-settings-btn" onClick={saveAllSettings}>
              💾 Save Settings
            </button>
            {saveMessage && (
              <span className="save-message">{saveMessage}</span>
            )}
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
                    <div className="match-header">
                      <div className="match-opponent">vs {match.opponent}</div>
                      <div className="match-time">{match.timeAgo}</div>
                    </div>
                    <div className="match-details">
                      <span className="match-score">{match.score}</span>
                      <span className="match-duration">⏱️ {match.durationText}</span>
                    </div>
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

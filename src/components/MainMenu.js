import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import './MainMenu.css';

// Event/seasonal banners
const eventBanners = [
  { id: 'summer', text: '🌟 Season 3 Now Live!', color: '#ffd700', active: true },
  { id: 'weekend', text: '🎁 Double XP Weekend!', color: '#4caf50', active: false },
];

// Avatar color themes with gradient definitions (same as PlayerProfile)
const avatarColors = {
  default: { 
    primary: '#4caf50', 
    glow: 'rgba(76, 175, 80, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0.1) 100%)'
  },
  fire: { 
    primary: '#ff6b35', 
    glow: 'rgba(255, 107, 53, 0.6)',
    gradient: 'linear-gradient(135deg, rgba(255, 107, 53, 0.4) 0%, rgba(255, 87, 34, 0.2) 100%)'
  },
  ice: { 
    primary: '#00bcd4', 
    glow: 'rgba(0, 188, 212, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(0, 188, 212, 0.4) 0%, rgba(77, 208, 225, 0.2) 100%)'
  },
  electric: { 
    primary: '#ffeb3b', 
    glow: 'rgba(255, 235, 59, 0.6)',
    gradient: 'linear-gradient(135deg, rgba(255, 235, 59, 0.4) 0%, rgba(255, 241, 118, 0.2) 100%)'
  },
  dark: { 
    primary: '#9c27b0', 
    glow: 'rgba(156, 39, 176, 0.6)',
    gradient: 'linear-gradient(135deg, rgba(156, 39, 176, 0.4) 0%, rgba(186, 104, 200, 0.2) 100%)'
  },
  light: { 
    primary: '#ffc107', 
    glow: 'rgba(255, 193, 7, 0.6)',
    gradient: 'linear-gradient(135deg, rgba(255, 193, 7, 0.4) 0%, rgba(255, 236, 179, 0.2) 100%)'
  },
  ocean: { 
    primary: '#2196f3', 
    glow: 'rgba(33, 150, 243, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(33, 150, 243, 0.4) 0%, rgba(100, 181, 246, 0.2) 100%)'
  },
  earth: { 
    primary: '#795548', 
    glow: 'rgba(121, 85, 72, 0.5)',
    gradient: 'linear-gradient(135deg, rgba(121, 85, 72, 0.4) 0%, rgba(161, 136, 127, 0.2) 100%)'
  },
  ruby: { 
    primary: '#e91e63', 
    glow: 'rgba(233, 30, 99, 0.6)',
    gradient: 'linear-gradient(135deg, rgba(233, 30, 99, 0.4) 0%, rgba(244, 143, 177, 0.2) 100%)'
  },
  cosmic: { 
    primary: '#673ab7', 
    glow: 'rgba(103, 58, 183, 0.6)',
    gradient: 'linear-gradient(135deg, rgba(103, 58, 183, 0.4) 0%, rgba(179, 157, 219, 0.2) 100%)'
  },
  emerald: { 
    primary: '#00e676', 
    glow: 'rgba(0, 230, 118, 0.6)',
    gradient: 'linear-gradient(135deg, rgba(0, 230, 118, 0.4) 0%, rgba(105, 240, 174, 0.2) 100%)'
  },
  sunset: { 
    primary: '#ff7043', 
    glow: 'rgba(255, 112, 67, 0.6)',
    gradient: 'linear-gradient(135deg, rgba(255, 112, 67, 0.4) 0%, rgba(255, 171, 145, 0.2) 100%)'
  }
};

const MainMenu = ({ 
  onPlayGame,
  onStoryMode,
  onTutorialMode,
  onShowTutorial, 
  onShowStats, 
  onShowProfile,
  onShowThemeShop,
  onShowInventory,
  onShowDeckManager,
  onShowSettings,
  onShowNews,
  onShowMatchHistory,
  onShowDailyQuests,
  onQuit,
  playerAvatar: propAvatar,
  playerName: propName,
  rankInfo,
  dailyQuestProgress,
  playerStats: propPlayerStats
}) => {
  const menuMusicRef = useRef(null);
  const [expandedSection, setExpandedSection] = useState('gameplay');
  const [unreadNewsCount, setUnreadNewsCount] = useState(0);
  const [avatarColor, setAvatarColor] = useState('default');
  const [avatarStyle, setAvatarStyle] = useState('standard');
  const [avatarIcon, setAvatarIcon] = useState(null);
  const [shootingStars, setShootingStars] = useState([]);
  const [playerStats, setPlayerStats] = useState(propPlayerStats || null);
  
  // Active event banner
  const activeEvent = useMemo(() => {
    return eventBanners.find(e => e.active) || null;
  }, []);
  
  // Use prop avatar if provided, otherwise fall back to default
  const playerAvatar = propAvatar || { icon: '👤', name: 'Player', id: 'default' };
  const playerName = propName || 'Player';
  
  // Load avatar settings from localStorage (icon, color, style)
  useEffect(() => {
    const loadAvatarFromStorage = () => {
      try {
        const savedAvatar = localStorage.getItem('savedAvatar');
        if (savedAvatar) {
          const parsed = JSON.parse(savedAvatar);
          if (parsed?.icon) {
            setAvatarIcon(parsed.icon);
          }
          if (parsed?.color && avatarColors[parsed.color]) {
            setAvatarColor(parsed.color);
          }
          if (parsed?.style) {
            setAvatarStyle(parsed.style);
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    };
    
    // Load initially
    loadAvatarFromStorage();
    
    // Listen for avatar updates
    const handleStorageChange = (e) => {
      if (e.key === 'savedAvatar') {
        loadAvatarFromStorage();
      }
    };
    
    const handleAvatarUpdate = () => {
      loadAvatarFromStorage();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userPreferencesUpdated', handleAvatarUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userPreferencesUpdated', handleAvatarUpdate);
    };
  }, [propAvatar]);
  
  // Determine which icon to display - prefer localStorage, fallback to prop
  const displayIcon = avatarIcon || playerAvatar.icon || playerAvatar.name?.charAt(0) || '👤';
  
  // Get current avatar color theme
  const currentColor = avatarColors[avatarColor] || avatarColors.default;

  const playSelectSound = () => {
    const selectSound = new Audio(`${process.env.PUBLIC_URL}/mixkit-arcade-player-select-2036.mp3`);
    selectSound.volume = 0.5;    selectSound.setAttribute('playsinline', 'true');
    selectSound.setAttribute('webkit-playsinline', 'true');    selectSound.play().catch(err => console.log('Sound play prevented:', err));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    // Check for unread news
    const checkUnreadNews = async () => {
      try {
        const newsData = await import('../data/news.json');
        const readNews = JSON.parse(localStorage.getItem('readNews') || '[]');
        const unread = newsData.default.news.filter(n => !readNews.includes(n.id)).length;
        setUnreadNewsCount(unread);
      } catch (error) {
        console.error('Error loading news:', error);
      }
    };
    checkUnreadNews();
  }, []);

  useEffect(() => {
    // Play menu music when component mounts
    if (!menuMusicRef.current) {
      menuMusicRef.current = new Audio(`${process.env.PUBLIC_URL}/Cooler_Heads_Prevail.mp3`);
      menuMusicRef.current.volume = 0.3;
      menuMusicRef.current.loop = true;
      menuMusicRef.current.setAttribute('playsinline', 'true');
      menuMusicRef.current.setAttribute('webkit-playsinline', 'true');
      menuMusicRef.current.preload = 'auto';
      
      menuMusicRef.current.play().catch(error => {
        console.log('Menu music autoplay prevented:', error);
      });
      
      console.log('🎵 Main Menu: Playing Sunrise in Megalopolis');
    }

    // Cleanup: stop music when leaving menu
    return () => {
      if (menuMusicRef.current) {
        menuMusicRef.current.pause();
        menuMusicRef.current.currentTime = 0;
        menuMusicRef.current = null;
      }
    };
  }, []);

  // Shooting stars effect
  useEffect(() => {
    const createShootingStar = () => {
      const id = Date.now() + Math.random();
      const star = {
        id,
        left: Math.random() * 100,
        top: Math.random() * 40,
        duration: 1 + Math.random() * 1.5,
        delay: 0
      };
      setShootingStars(prev => [...prev.slice(-5), star]);
      
      // Remove star after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(s => s.id !== id));
      }, star.duration * 1000 + 500);
    };
    
    // Create shooting stars periodically
    const interval = setInterval(createShootingStar, 3000 + Math.random() * 4000);
    createShootingStar(); // Initial star
    
    return () => clearInterval(interval);
  }, []);
  
  // Load player stats
  useEffect(() => {
    if (propPlayerStats) {
      setPlayerStats(propPlayerStats);
      return;
    }
    
    // Try to load from localStorage
    try {
      const savedStats = localStorage.getItem('gameStats');
      if (savedStats) {
        const parsed = JSON.parse(savedStats);
        setPlayerStats({
          wins: parsed.wins || 0,
          losses: parsed.losses || 0,
          streak: parsed.currentStreak || 0,
          level: parsed.level || 1
        });
      }
    } catch (e) {
      console.log('Could not load player stats');
    }
  }, [propPlayerStats]);
  
  // Button hover sound
  const playHoverSound = useCallback(() => {
    try {
      const hoverSound = new Audio(`${process.env.PUBLIC_URL}/audio/sfx/hover.mp3`);
      hoverSound.volume = 0.15;
      hoverSound.play().catch(() => {});
    } catch (e) {}
  }, []);
  
  // Calculate win rate
  const winRate = useMemo(() => {
    if (!playerStats) return null;
    const total = (playerStats.wins || 0) + (playerStats.losses || 0);
    if (total === 0) return 0;
    return Math.round((playerStats.wins / total) * 100);
  }, [playerStats]);

  return (
    <div className="main-menu">
      {/* Background image from public folder */}
      <div 
        className="menu-bg-image"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/slpashscreen-1.png)` }}
      />
      <div className="menu-background">
        <div className="cosmic-particles">
          {Array(50).fill(null).map((_, i) => (
            <div key={i} className="cosmic-particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}></div>
          ))}
        </div>
        
        {/* Shooting Stars */}
        <div className="shooting-stars-container">
          {shootingStars.map(star => (
            <div 
              key={star.id} 
              className="shooting-star"
              style={{
                left: `${star.left}%`,
                top: `${star.top}%`,
                animationDuration: `${star.duration}s`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Event Banner */}
      {activeEvent && (
        <div className="event-banner" style={{ '--event-color': activeEvent.color }}>
          <span className="event-text">{activeEvent.text}</span>
          <div className="event-sparkles">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="event-sparkle" style={{ animationDelay: `${i * 0.2}s` }}>✦</span>
            ))}
          </div>
        </div>
      )}

      <div className="menu-content">
        <div className="game-title">
          {/* Enhanced Title with Sparkles */}
          <h1 className="title-text">
            <span className="title-elemental">
              ELEMENTAL
              <span className="title-sparkles">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="title-sparkle" style={{ 
                    left: `${10 + i * 15}%`,
                    animationDelay: `${i * 0.3}s`
                  }}>✦</span>
                ))}
              </span>
            </span>
            <span className="title-battle">BATTLE</span>
          </h1>
          <p className="title-subtitle">Master the Elements • Conquer the Arena</p>
          
          {/* Player Info - Avatar, Name, and Quick Stats */}
          {playerAvatar && (
            <div className="player-info-banner" onClick={onShowProfile} onMouseEnter={playHoverSound} title="View Profile">
              <div 
                className={`player-avatar-display avatar-style-${avatarStyle}`}
                style={{
                  background: currentColor.gradient,
                  borderColor: `${currentColor.primary}88`,
                  boxShadow: `0 0 15px ${currentColor.glow}, 0 0 25px ${currentColor.glow}`
                }}
              >
                {displayIcon}
              </div>
              <div className="player-info-details">
                <div className="player-name-display">{playerName}</div>
                {playerStats && (
                  <div className="player-quick-stats">
                    <span className="quick-stat" title="Win Rate">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-value">{winRate}%</span>
                    </span>
                    <span className="quick-stat" title="Current Streak">
                      <span className="stat-icon">🔥</span>
                      <span className="stat-value">{playerStats.streak || 0}</span>
                    </span>
                    <span className="quick-stat" title="Level">
                      <span className="stat-icon">⭐</span>
                      <span className="stat-value">Lv.{playerStats.level || 1}</span>
                    </span>
                  </div>
                )}
              </div>
              <span className="banner-arrow">▶</span>
            </div>
          )}
          
          {/* News Alert Button */}
          <button className="news-alert-btn" onClick={onShowNews} onMouseEnter={playHoverSound} title="What's New">
            <span className="news-icon">📰</span>
            <span className="news-text">What's New</span>
            {unreadNewsCount > 0 && (
              <span className="news-badge">{unreadNewsCount}</span>
            )}
          </button>
        </div>

        <div className="menu-accordion">
          {/* Gameplay Section */}
          <div className="accordion-section">
            <button 
              className={`accordion-header ${expandedSection === 'gameplay' ? 'active' : ''}`}
              onClick={() => toggleSection('gameplay')}
            >
              <span className="accordion-icon">⚔️</span>
              <span className="accordion-title">GAMEPLAY</span>
              <span className="accordion-arrow">{expandedSection === 'gameplay' ? '▼' : '▶'}</span>
            </button>
            <div className={`accordion-content ${expandedSection === 'gameplay' ? 'expanded' : ''}`}>
              <button className="menu-btn primary-btn" onClick={() => { playSelectSound(); onPlayGame(); }} onMouseEnter={playHoverSound}>
                <span className="btn-icon">⚔️</span>
                <span className="btn-text">QUICK PLAY</span>
                <span className="btn-subtitle">Single Match</span>
              </button>

              <button className="menu-btn story-btn" onClick={() => { playSelectSound(); onStoryMode(); }} onMouseEnter={playHoverSound}>
                <span className="btn-icon">📜</span>
                <span className="btn-text">STORY MODE</span>
                <span className="btn-subtitle">Epic Campaign</span>
              </button>

              <button className="menu-btn tutorial-btn" onClick={() => { playSelectSound(); onTutorialMode(); }} onMouseEnter={playHoverSound}>
                <span className="btn-icon">🎓</span>
                <span className="btn-text">TUTORIAL MODE</span>
                <span className="btn-subtitle">Learn By Playing</span>
              </button>

              <button className="menu-btn" onClick={() => { playSelectSound(); onShowTutorial(); }} onMouseEnter={playHoverSound}>
                <span className="btn-icon">📖</span>
                <span className="btn-text">HOW TO PLAY</span>
                <span className="btn-subtitle">Quick Guide</span>
              </button>
            </div>
          </div>

          {/* Player Progress Section */}
          <div className="accordion-section">
            <button 
              className={`accordion-header ${expandedSection === 'progress' ? 'active' : ''}`}
              onClick={() => toggleSection('progress')}
            >
              <span className="accordion-icon">👤</span>
              <span className="accordion-title">PLAYER PROGRESS</span>
              <span className="accordion-arrow">{expandedSection === 'progress' ? '▼' : '▶'}</span>
            </button>
            <div className={`accordion-content ${expandedSection === 'progress' ? 'expanded' : ''}`}>
              <button className="menu-btn" onClick={() => { playSelectSound(); onShowProfile(); }}>
                <span className="btn-icon">👤</span>
                <span className="btn-text">PROFILE</span>
                <span className="btn-subtitle">Player Info</span>
              </button>

              <button className="menu-btn" onClick={() => { playSelectSound(); onShowStats(); }}>
                <span className="btn-icon">📊</span>
                <span className="btn-text">STATISTICS</span>
                <span className="btn-subtitle">View Your Records</span>
              </button>

              <button className="menu-btn match-history-btn" onClick={() => { playSelectSound(); onShowMatchHistory && onShowMatchHistory(); }}>
                <span className="btn-icon">📜</span>
                <span className="btn-text">MATCH HISTORY</span>
                <span className="btn-subtitle">Battle Records & Rank</span>
                {rankInfo && (
                  <span className="rank-badge" style={{ color: rankInfo.color }}>
                    {rankInfo.icon} {rankInfo.division}
                  </span>
                )}
              </button>

              <button className="menu-btn daily-quests-btn" onClick={() => { playSelectSound(); onShowDailyQuests && onShowDailyQuests(); }}>
                <span className="btn-icon">📋</span>
                <span className="btn-text">DAILY QUESTS</span>
                <span className="btn-subtitle">Challenges & Rewards</span>
                {dailyQuestProgress && dailyQuestProgress.available > 0 && (
                  <span className="quest-badge">{dailyQuestProgress.completed}/{dailyQuestProgress.available}</span>
                )}
              </button>
            </div>
          </div>

          {/* Customization Section */}
          <div className="accordion-section">
            <button 
              className={`accordion-header ${expandedSection === 'custom' ? 'active' : ''}`}
              onClick={() => toggleSection('custom')}
            >
              <span className="accordion-icon">🎨</span>
              <span className="accordion-title">CUSTOMIZATION</span>
              <span className="accordion-arrow">{expandedSection === 'custom' ? '▼' : '▶'}</span>
            </button>
            <div className={`accordion-content ${expandedSection === 'custom' ? 'expanded' : ''}`}>
              <button className="menu-btn inventory-btn" onClick={() => { playSelectSound(); onShowInventory(); }}>
                <span className="btn-icon">📦</span>
                <span className="btn-text">INVENTORY</span>
                <span className="btn-subtitle">Power-Ups & Equipment</span>
              </button>

              <button className="menu-btn deck-manager-btn" onClick={() => { playSelectSound(); onShowDeckManager && onShowDeckManager(); }}>
                <span className="btn-icon">🎴</span>
                <span className="btn-text">DECK MANAGER</span>
                <span className="btn-subtitle">Create & Save Custom Decks</span>
              </button>

              <button className="menu-btn theme-shop-btn" onClick={() => { playSelectSound(); onShowThemeShop(); }}>
                <span className="btn-icon">🎨</span>
                <span className="btn-text">THEME SHOP</span>
                <span className="btn-subtitle">Customize Appearance</span>
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="accordion-section">
            <button 
              className={`accordion-header ${expandedSection === 'settings' ? 'active' : ''}`}
              onClick={() => toggleSection('settings')}
            >
              <span className="accordion-icon">⚙️</span>
              <span className="accordion-title">SETTINGS</span>
              <span className="accordion-arrow">{expandedSection === 'settings' ? '▼' : '▶'}</span>
            </button>
            <div className={`accordion-content ${expandedSection === 'settings' ? 'expanded' : ''}`}>
              <button className="menu-btn" onClick={() => { playSelectSound(); onShowSettings(); }}>
                <span className="btn-icon">⚙️</span>
                <span className="btn-text">SETTINGS</span>
                <span className="btn-subtitle">Audio & Controls</span>
              </button>

              <button className="menu-btn quit-btn" onClick={onQuit}>
                <span className="btn-icon">🚪</span>
                <span className="btn-text">QUIT</span>
                <span className="btn-subtitle">Exit Game</span>
              </button>
            </div>
          </div>
        </div>

        <div className="menu-footer">
          <div className="element-icons">
            <span className="footer-icon fire">🔥</span>
            <span className="footer-icon ice">❄️</span>
            <span className="footer-icon water">💧</span>
            <span className="footer-icon electricity">⚡</span>
            <span className="footer-icon earth">🌍</span>
            <span className="footer-icon power">⭐</span>
            <span className="footer-icon light">☀️</span>
            <span className="footer-icon dark">🌙</span>
            <span className="footer-icon neutral">🔮</span>
            <span className="footer-icon meteor">☄️</span>
          </div>
          <p className="version-text">v2.1.0 • © 2025</p>
        </div>
      </div>
      
      {/* Floating Daily Quests Button */}
      <button 
        className="floating-quests-btn"
        onClick={() => { playSelectSound(); onShowDailyQuests && onShowDailyQuests(); }}
        title="Daily Quests"
      >
        <span className="quests-icon">📋</span>
        <span className="quests-label">Quests</span>
        {dailyQuestProgress && dailyQuestProgress.available > 0 && (
          <span className="quests-count">{dailyQuestProgress.completed}/{dailyQuestProgress.available}</span>
        )}
      </button>
    </div>
  );
};

export default MainMenu;

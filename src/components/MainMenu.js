import React, { useEffect, useRef, useState } from 'react';
import './MainMenu.css';

const MainMenu = ({ 
  onPlayGame,
  onStoryMode,
  onTutorialMode,
  onShowTutorial, 
  onShowStats, 
  onShowProfile,
  onShowThemeShop,
  onShowInventory,
  onShowSettings,
  onQuit 
}) => {
  const menuMusicRef = useRef(null);
  const [expandedSection, setExpandedSection] = useState('gameplay');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    // Play menu music when component mounts
    if (!menuMusicRef.current) {
      menuMusicRef.current = new Audio(`${process.env.PUBLIC_URL}/Sunrise_in_Megalopolis.mp3`);
      menuMusicRef.current.volume = 0.3;
      menuMusicRef.current.loop = true;
      
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

  return (
    <div className="main-menu">
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
      </div>

      <div className="menu-content">
        <div className="game-title">
          <h1 className="title-text">
            <span className="title-elemental">ELEMENTAL</span>
            <span className="title-battle">BATTLE</span>
          </h1>
          <p className="title-subtitle">Master the Elements • Conquer the Arena</p>
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
              <button className="menu-btn primary-btn" onClick={onPlayGame}>
                <span className="btn-icon">⚔️</span>
                <span className="btn-text">QUICK PLAY</span>
                <span className="btn-subtitle">Single Match</span>
              </button>

              <button className="menu-btn story-btn" onClick={onStoryMode}>
                <span className="btn-icon">📜</span>
                <span className="btn-text">STORY MODE</span>
                <span className="btn-subtitle">Epic Campaign</span>
              </button>

              <button className="menu-btn tutorial-btn" onClick={onTutorialMode}>
                <span className="btn-icon">🎓</span>
                <span className="btn-text">TUTORIAL MODE</span>
                <span className="btn-subtitle">Learn By Playing</span>
              </button>

              <button className="menu-btn" onClick={onShowTutorial}>
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
              <button className="menu-btn" onClick={onShowProfile}>
                <span className="btn-icon">👤</span>
                <span className="btn-text">PROFILE</span>
                <span className="btn-subtitle">Player Info</span>
              </button>

              <button className="menu-btn" onClick={onShowStats}>
                <span className="btn-icon">📊</span>
                <span className="btn-text">STATISTICS</span>
                <span className="btn-subtitle">View Your Records</span>
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
              <button className="menu-btn inventory-btn" onClick={onShowInventory}>
                <span className="btn-icon">📦</span>
                <span className="btn-text">INVENTORY</span>
                <span className="btn-subtitle">Power-Ups & Equipment</span>
              </button>

              <button className="menu-btn theme-shop-btn" onClick={onShowThemeShop}>
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
              <button className="menu-btn" onClick={onShowSettings}>
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
          <p className="version-text">v1.0.0 • © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;

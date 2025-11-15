import React, { useState, useEffect } from 'react';
import { getCurrentThemes, COLOR_THEMES, HAND_THEMES, purchaseTheme, applyTheme, applyColorTheme, applyHandTheme } from '../utils/themes';
import './ThemeShop.css';

const ThemeShop = ({ onClose }) => {
  const [currentThemes, setCurrentThemes] = useState(() => getCurrentThemes());
  const [activeTab, setActiveTab] = useState('color');
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // Apply current themes on component mount
    applyColorTheme(currentThemes.colorTheme);
    applyHandTheme(currentThemes.handTheme);
  }, []);

  const handlePurchase = (themeType, themeId) => {
    const result = purchaseTheme(themeType, themeId, currentThemes);
    
    if (result.success) {
      setCurrentThemes(result.updatedThemes);
      setNotification(`Success! ${result.message}`);
    } else {
      setNotification(`Error: ${result.message}`);
    }
    
    setTimeout(() => setNotification(''), 3000);
  };

  const handleApplyTheme = (themeType, themeId) => {
    const result = applyTheme(themeType, themeId, currentThemes);
    
    if (result.success) {
      setCurrentThemes(result.updatedThemes);
      setNotification(`Success! ${themeType === 'color' ? 'Color' : 'Hand'} theme applied!`);
    } else {
      setNotification(`Error: ${result.message}`);
    }
    
    setTimeout(() => setNotification(''), 2000);
  };

  const renderColorThemes = () => {
    return Object.entries(COLOR_THEMES).map(([id, theme]) => {
      const isOwned = currentThemes.ownedThemes.includes(id);
      const isActive = currentThemes.colorTheme === id;
      const canAfford = currentThemes.coins >= theme.cost;
      
      return (
        <div key={id} className={`theme-card color-theme ${isActive ? 'active' : ''}`}>
          <div 
            className="theme-preview"
            style={{ background: theme.background }}
          >
            <div className="preview-elements">
              <div 
                className="preview-card"
                style={{ 
                  border: `2px solid ${theme.cardBorder}`,
                  color: theme.textColor 
                }}
              >
                Card
              </div>
              <div 
                className="preview-button"
                style={{ 
                  backgroundColor: theme.primary,
                  color: theme.textColor 
                }}
              >
                Button
              </div>
            </div>
          </div>
          
          <div className="theme-info">
            <h3 style={{ color: theme.textColor }}>{theme.name}</h3>
            {theme.premium && (
              <div className="theme-cost">
                <span className="coin-icon">Coin</span>
                {theme.cost}
              </div>
            )}
          </div>
          
          <div className="theme-actions">
            {isOwned ? (
              <button 
                className={`apply-btn ${isActive ? 'active' : ''}`}
                onClick={() => !isActive && handleApplyTheme('color', id)}
                disabled={isActive}
              >
                {isActive ? 'Active' : 'Apply'}
              </button>
            ) : theme.premium ? (
              <button 
                className={`purchase-btn ${canAfford ? '' : 'disabled'}`}
                onClick={() => canAfford && handlePurchase('color', id)}
                disabled={!canAfford}
              >
                {canAfford ? 'Purchase' : 'Need More Coins'}
              </button>
            ) : (
              <button className="free-btn" onClick={() => handleApplyTheme('color', id)}>
                Free
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  const renderHandThemes = () => {
    return Object.entries(HAND_THEMES).map(([id, theme]) => {
      const isOwned = currentThemes.ownedThemes.includes(id);
      const isActive = currentThemes.handTheme === id;
      const canAfford = currentThemes.coins >= theme.cost;
      
      return (
        <div key={id} className={`theme-card hand-theme ${isActive ? 'active' : ''}`}>
          <div className="hand-theme-preview">
            <div 
              className="preview-hand"
              style={{ 
                background: theme.handBackground,
                boxShadow: theme.glowEffect
              }}
            >
              <div 
                className="preview-hand-card"
                style={{ background: theme.cardBack }}
              >
                Card1
              </div>
              <div 
                className="preview-hand-card"
                style={{ background: theme.cardBack }}
              >
                Card2
              </div>
              <div 
                className="preview-hand-card"
                style={{ background: theme.cardBack }}
              >
                Card3
              </div>
            </div>
          </div>
          
          <div className="theme-info">
            <h3>{theme.name}</h3>
            {theme.premium && (
              <div className="theme-cost">
                <span className="coin-icon">Coin</span>
                {theme.cost}
              </div>
            )}
          </div>
          
          <div className="theme-actions">
            {isOwned ? (
              <button 
                className={`apply-btn ${isActive ? 'active' : ''}`}
                onClick={() => !isActive && handleApplyTheme('hand', id)}
                disabled={isActive}
              >
                {isActive ? 'Active' : 'Apply'}
              </button>
            ) : theme.premium ? (
              <button 
                className={`purchase-btn ${canAfford ? '' : 'disabled'}`}
                onClick={() => canAfford && handlePurchase('hand', id)}
                disabled={!canAfford}
              >
                {canAfford ? 'Purchase' : 'Need More Coins'}
              </button>
            ) : (
              <button className="free-btn" onClick={() => handleApplyTheme('hand', id)}>
                Free
              </button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="theme-shop-overlay">
      <div className="theme-shop-container">
        <div className="theme-shop-header">
          <h2>Theme Shop</h2>
          <div className="coin-display">
            <span className="coin-icon">Coins</span>
            <span className="coin-count">{currentThemes.coins}</span>
          </div>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
        
        <div className="theme-tabs">
          <button 
            className={`tab-btn ${activeTab === 'color' ? 'active' : ''}`}
            onClick={() => setActiveTab('color')}
          >
            Color Themes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'hand' ? 'active' : ''}`}
            onClick={() => setActiveTab('hand')}
          >
            Hand Themes
          </button>
        </div>
        
        <div className="themes-grid">
          {activeTab === 'color' ? renderColorThemes() : renderHandThemes()}
        </div>
        
        <div className="coin-info">
          <p><strong>Earn coins by winning games!</strong></p>
          <ul>
            <li>Win: 10 coins (+5 for dominating wins)</li>
            <li>Perfect Game: +10 bonus coins</li>
            <li>Story Mode: +5 bonus coins</li>
            <li>Tie: 3 coins</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ThemeShop;
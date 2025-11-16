import React, { useState, useEffect } from 'react';
import './Card.css';
import { getElementColor, getElementDisplay, ELEMENT_LABELS } from '../utils/accessibility';

const Card = ({ card, onClick, isPlayable, keyboardKey, onPlayed }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    colorblindMode: 'none',
    showElementIcons: true,
    highContrast: false
  });

  // Load accessibility settings
  useEffect(() => {
    const loadSettings = () => {
      const colorblindMode = localStorage.getItem('colorblindMode') || 'none';
      const showElementIcons = localStorage.getItem('showElementIcons') !== 'false';
      const highContrast = localStorage.getItem('highContrast') === 'true';
      setAccessibilitySettings({ colorblindMode, showElementIcons, highContrast });
    };
    
    loadSettings();
    
    // Listen for settings changes
    const handleSettingsChange = () => loadSettings();
    window.addEventListener('storage', handleSettingsChange);
    window.addEventListener('settingsUpdated', handleSettingsChange);
    
    return () => {
      window.removeEventListener('storage', handleSettingsChange);
      window.removeEventListener('settingsUpdated', handleSettingsChange);
    };
  }, []);

  // Guard against undefined card
  if (!card) {
    return null;
  }

  const getElementColorLocal = (element) => {
    return getElementColor(element, accessibilitySettings.colorblindMode);
  };

  const getElementIcon = (element) => {
    return getElementDisplay(element, accessibilitySettings.showElementIcons);
  };

  const getTierColor = (tier) => {
    const colors = {
      'COMMON': '#9e9e9e',
      'UNCOMMON': '#4caf50',
      'RARE': '#2196f3',
      'LEGENDARY': '#ff9800'
    };
    return colors[tier] || '#9e9e9e';
  };

  const getAbilityDescription = () => {
    const descriptions = {
      'FIRE': 'Burn opponent\'s weakest card',
      'ICE': 'Freeze opponent\'s next turn',
      'WATER': 'Reduce opponent\'s score by 1',
      'ELECTRICITY': 'Damage opponent\'s strongest card',
      'EARTH': 'Draw a card from reserve deck',
      'POWER': 'Copy opponent\'s last card',
      'LIGHT': '+2 strength vs DARK',
      'DARK': '+2 strength vs LIGHT',
      'METEOR': 'Attack all EARTH cards (-1 per meteor)',
      'NEUTRAL': card.neutralAbility === 'COPY' ? 
        'Copy opponent\'s element' : 
        'Boost strength by +3',
      'TECHNOLOGY': card.techAbility === 'SHIELD' ?
        'Gain shield equal to half strength' :
        'Create a random card + Damage all opponent cards'
    };
    return descriptions[card.element] || 'Unknown ability';
  };

  const getRarityBorder = () => {
    const tier = card.tier || 'COMMON';
    const borderWidths = {
      'COMMON': '3px',
      'UNCOMMON': '3px',
      'RARE': '4px',
      'LEGENDARY': '5px'
    };
    return borderWidths[tier];
  };

  const getCardBackgroundImage = () => {
    const elementImages = {
      'ELECTRICITY': `${process.env.PUBLIC_URL}/electricity-card.png`,
      'FIRE': `${process.env.PUBLIC_URL}/fire card.png`,
      'ICE': `${process.env.PUBLIC_URL}/ice-card.png`,
      'WATER': `${process.env.PUBLIC_URL}/water-card.png`,
      'EARTH': `${process.env.PUBLIC_URL}/earth_card.png`,
      'DARK': `${process.env.PUBLIC_URL}/moon-card.png`,
      'LIGHT': `${process.env.PUBLIC_URL}/star-card.png`,
      'TECHNOLOGY': `${process.env.PUBLIC_URL}/tech-card.png`,
      'METEOR': `${process.env.PUBLIC_URL}/meteor.png`
    };
    return elementImages[card.element] || null;
  };

  const handleClick = () => {
    if (onClick && isPlayable) {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 600);
      onClick(); // Call onClick directly without passing card
    }
  };

  const backgroundImage = getCardBackgroundImage();

  return (
    <div 
      className={`card ${isPlayable ? 'playable' : ''} ${card.tier?.toLowerCase() || 'common'} ${card.isLegendary ? 'legendary' : ''} ${isPlaying ? 'playing' : ''} ${backgroundImage ? 'has-background-image' : ''}`}
      onClick={handleClick}
      style={{ 
        borderColor: getElementColorLocal(card.element),
        borderWidth: getRarityBorder(),
        '--element-color': getElementColorLocal(card.element),
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      data-key={keyboardKey || ''}
      data-element={card.element}
      data-colorblind={accessibilitySettings.colorblindMode !== 'none' ? 'true' : 'false'}
      role="button"
      tabIndex={isPlayable ? 0 : -1}
      aria-label={`${card.element} card with strength ${card.modifiedStrength || card.strength}`}
    >
      {card.isLegendary && <div className="legendary-glow"></div>}
      {accessibilitySettings.colorblindMode !== 'none' && (
        <div className="element-label-overlay">
          {ELEMENT_LABELS[card.element] || '???'}
        </div>
      )}
      
      <div className="card-header">
        <div className="card-element" style={{ color: getElementColorLocal(card.element) }}>
          {getElementIcon(card.element)}
        </div>
        <div className="card-strength" style={{ 
          background: card.modifiedStrength ? `linear-gradient(135deg, ${getTierColor(card.tier)} 0%, #fff 100%)` : undefined 
        }}>
          {card.modifiedStrength || card.strength}
          {card.modifiedStrength && card.modifiedStrength !== card.strength && (
            <span className="strength-modifier">+{card.modifiedStrength - card.strength}</span>
          )}
        </div>
      </div>
      
      <div className="card-center">
        <span className="element-icon-large" style={{ color: getElementColorLocal(card.element) }}>
          {getElementIcon(card.element)}
        </span>
        <div className="strength-large">{card.modifiedStrength || card.strength}</div>
        {card.tier && (
          <div className="card-tier" style={{ color: getTierColor(card.tier) }}>
            {card.tier}
          </div>
        )}
        {card.isCounter && (
          <div className="counter-badge">⚔️ COUNTER!</div>
        )}
        {card.evolved && (
          <div className="evolution-badge">🔗 EVOLVED!</div>
        )}
        {card.meteorDamage && card.meteorDamage > 0 && (
          <div className="meteor-damage-badge">☄️ -{card.meteorDamage}</div>
        )}
      </div>
      
      <div className="card-footer">
        <div className="element-name">{card.element}</div>
        {card.element === 'NEUTRAL' && card.neutralAbility && (
          <div className="neutral-ability">
            {card.neutralAbility === 'COPY' ? '📋 Copy' : '💪 Boost'}
          </div>
        )}
        {card.element === 'TECHNOLOGY' && card.techAbility && (
          <div className="tech-ability">
            {card.techAbility === 'SHIELD' ? '🛡️ Shield' : '⚙️ Create'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;

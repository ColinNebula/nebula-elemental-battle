import React, { useState, useEffect } from 'react';
import './CardZoom.css';
import { getElementColor, getElementDisplay } from '../utils/accessibility';
import { getCardLore, getTierColor, getTierIcon } from '../utils/cardLore';

const CardZoom = ({ card, onClose, position = 'center' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState('enter');
  const [showOriginStory, setShowOriginStory] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto-close after 5 seconds if no interaction
    const autoCloseTimer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(autoCloseTimer);
  }, []);

  const handleClose = () => {
    setAnimationPhase('exit');
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  if (!card) return null;

  const strength = card.modifiedStrength || card.strength;
  const elementColor = getElementColor(card.element);
  const elementIcon = getElementDisplay(card.element);
  
  // Get card lore data
  const lore = getCardLore(card);

  // Generate card description based on element
  const getCardDescription = () => {
    const descriptions = {
      FIRE: 'Unleashes burning flames that scorch all in their path. Burns opponent\'s weakest card.',
      ICE: 'Channels the bitter cold of winter. Freezes opponent\'s next turn.',
      WATER: 'Summons the power of the ocean depths. Reduces opponent\'s score.',
      ELECTRICITY: 'Crackles with raw electrical energy. Damages opponent\'s strongest card.',
      EARTH: 'Commands the very ground itself. Draw a card from reserve.',
      POWER: 'Pure cosmic energy incarnate. Copy opponent\'s last card ability.',
      LIGHT: 'Radiates divine brilliance. Bonus damage vs DARK.',
      DARK: 'Embraces the void. Bonus damage vs LIGHT.',
      METEOR: 'A fragment of destruction from the stars. Damages all EARTH cards.',
      NEUTRAL: 'Adapts to any situation. Copy element or boost strength.',
      TECHNOLOGY: 'Advanced mechanical construct. Shield or create cards.'
    };
    return descriptions[card.element] || 'A mysterious card with unknown power.';
  };

  const getRarityClass = () => {
    if (card.rarity) return card.rarity.toLowerCase();
    if (strength >= 9) return 'legendary';
    if (strength >= 7) return 'epic';
    if (strength >= 5) return 'rare';
    return 'common';
  };

  const getRarityLabel = () => {
    const rarity = getRarityClass();
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  return (
    <div 
      className={`card-zoom-overlay ${isVisible ? 'visible' : ''} ${animationPhase}`}
      onClick={handleClose}
    >
      <div 
        className={`card-zoom-container ${position}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background effects */}
        <div className="zoom-bg-effects">
          <div className="zoom-glow" style={{ background: elementColor }}></div>
          <div className="zoom-particles">
            {[...Array(20)].map((_, i) => (
              <span 
                key={i} 
                className="zoom-particle"
                style={{
                  '--delay': `${Math.random() * 2}s`,
                  '--x': `${Math.random() * 100 - 50}px`,
                  '--y': `${Math.random() * 100 - 50}px`,
                  background: elementColor
                }}
              />
            ))}
          </div>
        </div>

        {/* Card showcase */}
        <div className={`zoomed-card ${getRarityClass()}`} style={{ borderColor: elementColor }}>
          {/* Rarity badge */}
          <div className={`rarity-badge ${getRarityClass()}`}>
            {getRarityLabel()}
          </div>

          {/* Card header */}
          <div className="zoom-card-header">
            <span className="zoom-element-icon" style={{ color: elementColor }}>
              {elementIcon}
            </span>
            <span className="zoom-card-name">{card.name || card.element}</span>
          </div>

          {/* Card art area */}
          <div className="zoom-card-art">
            <div className="zoom-element-large" style={{ color: elementColor }}>
              {elementIcon}
            </div>
            {card.isLegendary && <div className="legendary-aura"></div>}
            {card.isFusion && <div className="fusion-aura"></div>}
          </div>

          {/* Card stats */}
          <div className="zoom-card-stats">
            <div className="zoom-strength">
              <span className="strength-label">POWER</span>
              <span className="strength-value" style={{ color: elementColor }}>{strength}</span>
            </div>
          </div>

          {/* Card description */}
          <div className="zoom-card-description">
            <p>{getCardDescription()}</p>
          </div>

          {/* Card Lore Section */}
          {lore && (
            <div className="zoom-lore-section" data-tier={lore.tier}>
              <div className="zoom-lore-header">
                <span className="zoom-lore-icon" style={{ color: getTierColor(lore.tier) }}>
                  {getTierIcon(lore.tier)}
                </span>
                <span className="zoom-lore-title">{lore.loreTitle}</span>
              </div>
              <div className="zoom-flavor-text">
                <span className="zoom-quote-mark">"</span>
                {lore.flavorText}
                <span className="zoom-quote-mark">"</span>
              </div>
              <button 
                className="zoom-origin-toggle"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOriginStory(!showOriginStory);
                }}
              >
                {showOriginStory ? '▲ Hide Origin Story' : '▼ Read Origin Story'}
              </button>
              {showOriginStory && (
                <div className="zoom-origin-story">
                  {lore.originStory}
                </div>
              )}
            </div>
          )}

          {/* Card footer - special abilities */}
          <div className="zoom-card-footer">
            {card.evolved && <span className="card-tag evolved">🔗 Evolved</span>}
            {card.counter && <span className="card-tag counter">⚔️ Counter</span>}
            {card.trap && <span className="card-tag trap">🕸️ Trap</span>}
            {card.isFusion && <span className="card-tag fusion">🔮 Fusion</span>}
            {card.isLegendary && <span className="card-tag legendary">⭐ Legendary</span>}
          </div>
        </div>

        {/* Close hint */}
        <div className="zoom-close-hint">
          Tap anywhere to close
        </div>
      </div>
    </div>
  );
};

export default CardZoom;

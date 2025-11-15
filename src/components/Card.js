import React, { useState } from 'react';
import './Card.css';

const Card = ({ card, onClick, isPlayable, keyboardKey, onPlayed }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Guard against undefined card
  if (!card) {
    return null;
  }

  const getElementColor = (element) => {
    const colors = {
      'FIRE': '#ff4444',
      'ICE': '#44ccff',
      'WATER': '#4444ff',
      'ELECTRICITY': '#ffff00',
      'EARTH': '#8b4513',
      'POWER': '#ff00ff',
      'LIGHT': '#ffeb3b',
      'DARK': '#9c27b0',
      'NEUTRAL': '#9e9e9e',
      'TECHNOLOGY': '#00ffff',
      'METEOR': '#ff6600'
    };
    return colors[element] || '#666';
  };

  const getElementIcon = (element) => {
    const icons = {
      'FIRE': '🔥',
      'ICE': '❄️',
      'WATER': '💧',
      'ELECTRICITY': '⚡',
      'EARTH': '🌍',
      'POWER': '⭐',
      'LIGHT': '☀️',
      'DARK': '🌙',
      'NEUTRAL': '🔮',
      'TECHNOLOGY': '🤖',
      'METEOR': '☄️'
    };
    return icons[element] || '?';
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

  const handleClick = () => {
    if (onClick && isPlayable) {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 600);
      onClick(); // Call onClick directly without passing card
    }
  };

  return (
    <div 
      className={`card ${isPlayable ? 'playable' : ''} ${card.tier?.toLowerCase() || 'common'} ${card.isLegendary ? 'legendary' : ''} ${isPlaying ? 'playing' : ''}`}
      onClick={handleClick}
      style={{ 
        borderColor: getElementColor(card.element),
        borderWidth: getRarityBorder()
      }}
      data-key={keyboardKey || ''}
    >
      {card.isLegendary && <div className="legendary-glow"></div>}
      
      <div className="card-header">
        <div className="card-element" style={{ color: getElementColor(card.element) }}>
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
        <span className="element-icon-large" style={{ color: getElementColor(card.element) }}>
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

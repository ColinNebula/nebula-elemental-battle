import React, { useState } from 'react';
import './CardTooltip.css';
import { getCardLore, getTierColor, getTierIcon } from '../utils/cardLore';

const CardTooltip = ({ card, position }) => {
  const [showFullLore, setShowFullLore] = useState(false);
  
  if (!card) return null;

  const elementMatchups = {
    FIRE: { strong: ['ICE', 'EARTH'], weak: ['WATER', 'METEOR'] },
    ICE: { strong: ['WATER', 'ELECTRICITY'], weak: ['FIRE', 'LIGHT'] },
    WATER: { strong: ['FIRE', 'EARTH'], weak: ['ELECTRICITY', 'ICE'] },
    ELECTRICITY: { strong: ['WATER', 'TECHNOLOGY'], weak: ['EARTH', 'ICE'] },
    EARTH: { strong: ['ELECTRICITY', 'METEOR'], weak: ['WATER', 'FIRE'] },
    POWER: { strong: ['DARK', 'NEUTRAL'], weak: ['LIGHT'] },
    LIGHT: { strong: ['DARK', 'ICE'], weak: ['POWER', 'METEOR'] },
    DARK: { strong: ['LIGHT', 'TECHNOLOGY'], weak: ['POWER', 'FIRE'] },
    NEUTRAL: { strong: [], weak: [] },
    TECHNOLOGY: { strong: ['ELECTRICITY', 'LIGHT'], weak: ['DARK', 'METEOR'] },
    METEOR: { strong: ['EARTH', 'LIGHT', 'TECHNOLOGY'], weak: ['WATER'] }
  };

  const matchup = elementMatchups[card.element] || { strong: [], weak: [] };
  const strength = card.modifiedStrength || card.strength;
  
  // Get card lore data
  const lore = getCardLore(card);

  // Determine strength tier for display
  let tier = 'Common';
  let tierColor = '#9e9e9e';
  if (strength >= 9) {
    tier = 'Legendary';
    tierColor = '#ffd700';
  } else if (strength >= 6) {
    tier = 'Rare';
    tierColor = '#9b59b6';
  } else if (strength >= 4) {
    tier = 'Uncommon';
    tierColor = '#3498db';
  }

  return (
    <div 
      className="card-tooltip"
      data-placement={position?.placement || 'top'}
      style={{
        left: position?.x || 0,
        top: position?.y || 0
      }}
    >
      <div className="tooltip-header">
        <span className="tooltip-element">{card.element}</span>
        <span className="tooltip-tier" style={{ color: tierColor }}>{tier}</span>
      </div>
      
      <div className="tooltip-stats">
        <div className="stat-row">
          <span className="stat-label">Base Strength:</span>
          <span className="stat-value">{card.strength}</span>
        </div>
        {card.modifiedStrength && card.modifiedStrength !== card.strength && (
          <div className="stat-row modified">
            <span className="stat-label">Modified:</span>
            <span className="stat-value">{card.modifiedStrength}</span>
          </div>
        )}
      </div>

      {(matchup.strong.length > 0 || matchup.weak.length > 0) && (
        <div className="tooltip-matchups">
          {matchup.strong.length > 0 && (
            <div className="matchup-row strong">
              <span className="matchup-label">✓ Strong vs:</span>
              <span className="matchup-elements">{matchup.strong.join(', ')}</span>
            </div>
          )}
          {matchup.weak.length > 0 && (
            <div className="matchup-row weak">
              <span className="matchup-label">✗ Weak vs:</span>
              <span className="matchup-elements">{matchup.weak.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      <div className="tooltip-description">
        {card.element === 'NEUTRAL' && 'Balanced element with no strengths or weaknesses.'}
        {card.element === 'FIRE' && 'Burns through ice and scorches earth.'}
        {card.element === 'ICE' && 'Freezes water and conducts electricity poorly.'}
        {card.element === 'WATER' && 'Extinguishes fire and erodes earth.'}
        {card.element === 'ELECTRICITY' && 'Electrifies water and disrupts technology.'}
        {card.element === 'EARTH' && 'Grounds electricity and withstands meteors.'}
        {card.element === 'POWER' && 'Overwhelms darkness with raw force.'}
        {card.element === 'LIGHT' && 'Pierces darkness and melts ice.'}
        {card.element === 'DARK' && 'Absorbs light and corrupts technology.'}
        {card.element === 'TECHNOLOGY' && 'Harnesses electricity and analyzes light.'}
        {card.element === 'METEOR' && 'Devastating impact crushes earth and destroys technology.'}
      </div>
      
      {/* Card Lore & Flavor Text Section */}
      {lore && (
        <div className="tooltip-lore-section" data-tier={lore.tier}>
          <div className="lore-divider">
            <span className="lore-divider-icon">📜</span>
          </div>
          
          <div className="lore-title">
            <span className="lore-tier-icon" style={{ color: getTierColor(lore.tier) }}>
              {getTierIcon(lore.tier)}
            </span>
            {lore.loreTitle}
          </div>
          
          <div className="flavor-text">
            <span className="flavor-quote">"</span>
            {lore.flavorText}
            <span className="flavor-quote">"</span>
          </div>
          
          <button 
            className="lore-expand-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowFullLore(!showFullLore);
            }}
          >
            {showFullLore ? '▲ Hide Origin' : '▼ Origin Story'}
          </button>
          
          {showFullLore && (
            <div className="origin-story">
              {lore.originStory}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CardTooltip;

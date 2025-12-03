import React, { useState, useEffect } from 'react';
import { comboTracker, COMBOS, COMBO_TIERS } from '../utils/comboSystem';
import './ComboDisplay.css';

/**
 * ComboNotification - Shows when a combo is achieved
 */
export const ComboNotification = ({ combo, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Guard against undefined combo or invalid tier
  const tier = combo?.tier ? COMBO_TIERS[combo.tier] : null;

  useEffect(() => {
    // If no valid combo data, complete immediately
    if (!combo || !tier) {
      if (onComplete) onComplete();
      return;
    }
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [combo, tier, onComplete]);

  // If no valid combo data, don't render
  if (!combo || !tier || !isVisible) return null;

  return (
    <div 
      className="combo-notification"
      style={{ '--combo-color': tier.color }}
    >
      <div className="combo-icon">{combo.icon}</div>
      <div className="combo-info">
        <div className="combo-name">{combo.name}</div>
        <div className="combo-tier">
          {tier.icon} {tier.name} Combo
        </div>
      </div>
      <div className="combo-message">{combo.reward?.message}</div>
    </div>
  );
};

/**
 * ComboTracker Display - Shows current combo progress
 */
export const ComboTrackerDisplay = ({ compact = false }) => {
  const [progress, setProgress] = useState([]);
  const [activeBuffs, setActiveBuffs] = useState([]);

  useEffect(() => {
    const updateProgress = () => {
      setProgress(comboTracker.getComboProgress());
      setActiveBuffs([...comboTracker.activeBuffs]);
    };

    updateProgress();
    
    // Update periodically
    const interval = setInterval(updateProgress, 500);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    // Show only active combos progress
    const nearComplete = progress.filter(c => !c.achieved && c.progress >= 50);
    
    if (nearComplete.length === 0 && activeBuffs.length === 0) {
      return null;
    }

    return (
      <div className="combo-tracker-compact">
        {activeBuffs.length > 0 && (
          <div className="active-buffs-compact">
            {activeBuffs.map((buff, index) => (
              <span key={index} className="buff-icon">
                {buff.type === 'strength' && '💪'}
                {buff.type === 'damage_multiplier' && '⚔️'}
                +{buff.value}
              </span>
            ))}
          </div>
        )}
        {nearComplete.slice(0, 2).map((combo, index) => (
          <div key={index} className="combo-progress-compact">
            <span>{combo.icon}</span>
            <div className="mini-progress">
              <div 
                className="mini-progress-fill"
                style={{ 
                  width: `${combo.progress}%`,
                  backgroundColor: COMBO_TIERS[combo.tier].color 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="combo-tracker-display">
      <h4>🎯 Combo Tracker</h4>
      
      {activeBuffs.length > 0 && (
        <div className="active-buffs">
          <h5>Active Buffs</h5>
          {activeBuffs.map((buff, index) => (
            <div key={index} className="buff-item">
              {buff.type === 'strength' && `💪 +${buff.value} Strength`}
              {buff.type === 'damage_multiplier' && `⚔️ ${buff.value}x Damage`}
              <span className="buff-duration">({buff.duration} turns)</span>
            </div>
          ))}
        </div>
      )}

      <div className="combo-list">
        {progress.slice(0, 5).map((combo, index) => (
          <div 
            key={index} 
            className={`combo-item ${combo.achieved ? 'achieved' : ''}`}
            style={{ '--combo-color': COMBO_TIERS[combo.tier].color }}
          >
            <div className="combo-header">
              <span className="combo-icon">{combo.icon}</span>
              <span className="combo-name">{combo.name}</span>
              <span className="combo-tier-badge">
                {COMBO_TIERS[combo.tier].icon}
              </span>
            </div>
            <div className="combo-progress-bar">
              <div 
                className="combo-progress-fill"
                style={{ width: `${combo.progress}%` }}
              />
            </div>
            <div className="combo-description">{combo.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ComboGameSummary - Shows combo stats at end of game
 */
export const ComboGameSummary = ({ summary, inline = false }) => {
  if (!summary) return null;

  return (
    <div className={`combo-game-summary ${inline ? 'inline' : ''}`}>
      <h3>🎯 Combo Summary</h3>
      
      <div className="summary-stats">
        <div className="stat">
          <span className="value">{summary.totalCardsPlayed || 0}</span>
          <span className="label">Cards Played</span>
        </div>
        <div className="stat">
          <span className="value">{summary.uniqueElementsUsed || 0}</span>
          <span className="label">Elements Used</span>
        </div>
        <div className="stat">
          <span className="value">{summary.maxWinStreak || 0} 🔥</span>
          <span className="label">Max Streak</span>
        </div>
        <div className="stat">
          <span className="value">{summary.underdogWins || 0}</span>
          <span className="label">Underdog Wins</span>
        </div>
      </div>

      {summary.combosAchieved?.length > 0 && (
        <div className="achieved-combos">
          <h4>Combos Achieved</h4>
          {summary.combosAchieved.map((combo, index) => (
            <div 
              key={index} 
              className="achieved-combo-item"
              style={{ borderColor: COMBO_TIERS[combo.tier]?.color || '#888' }}
            >
              <span className="combo-icon">{combo.icon}</span>
              <div className="combo-details">
                <span className="combo-name">{combo.name}</span>
                <span className="combo-tier">{COMBO_TIERS[combo.tier]?.name || 'Unknown'}</span>
              </div>
              {combo.reward?.strengthBonus && (
                <span className="bonus">+{combo.reward.strengthBonus}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="multiplier-info">
        <span className="multiplier-label">XP Multiplier:</span>
        <span className="multiplier-value">
          {(summary.xpMultiplier || 1).toFixed(1)}x
        </span>
      </div>

      <div className="total-bonus">
        <span>Total Combo Bonus:</span>
        <span className="bonus-value">+{summary.totalComboBonus}</span>
      </div>
    </div>
  );
};

export default ComboNotification;

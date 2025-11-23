import React, { useEffect, useState } from 'react';
import './ManaDisplay.css';

const ManaDisplay = ({ 
  current, 
  max, 
  regenRate, 
  surgeActive = false, 
  emergencyRegen = false,
  overdrafted = false,
  lastComboBonus = 0 
}) => {
  const manaPercentage = (current / max) * 100;
  const [showSurge, setShowSurge] = useState(false);
  const [showCombo, setShowCombo] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  
  // Show surge notification
  useEffect(() => {
    if (surgeActive) {
      setShowSurge(true);
      const timer = setTimeout(() => setShowSurge(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [surgeActive]);
  
  // Show combo bonus notification
  useEffect(() => {
    if (lastComboBonus > 0) {
      setShowCombo(true);
      const timer = setTimeout(() => setShowCombo(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastComboBonus]);
  
  // Show emergency regen notification
  useEffect(() => {
    if (emergencyRegen) {
      setShowEmergency(true);
      const timer = setTimeout(() => setShowEmergency(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [emergencyRegen]);
  
  const displayClass = `mana-display ${surgeActive ? 'surge-active' : ''} ${overdrafted ? 'overdrafted' : ''} ${current <= 2 ? 'low-mana' : ''}`;
  
  return (
    <div className={displayClass}>
      <div className="mana-icon">💎</div>
      <div className="mana-info">
        <div className="mana-label">
          {overdrafted ? '⚠️ OVERDRAFTED' : 'Mana'}
        </div>
        <div className="mana-values">
          <span className="current-mana">{current}</span>
          <span className="mana-separator">/</span>
          <span className="max-mana">{max}</span>
        </div>
        <div className="mana-bar-container">
          <div 
            className={`mana-bar-fill ${surgeActive ? 'surge' : ''}`}
            style={{ width: `${manaPercentage}%` }}
          />
        </div>
        <div className="mana-regen">
          {overdrafted ? '⚠️ No regen next turn' : `+${regenRate} per turn`}
        </div>
      </div>
      
      {/* Floating notifications */}
      {showSurge && (
        <div className="mana-notification surge">
          ⚡ SURGE! +2
        </div>
      )}
      {showCombo && (
        <div className="mana-notification combo">
          🔥 COMBO! +{lastComboBonus}
        </div>
      )}
      {showEmergency && (
        <div className="mana-notification emergency">
          🆘 BOOST! +1
        </div>
      )}
    </div>
  );
};

export default ManaDisplay;

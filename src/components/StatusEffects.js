import React from 'react';
import './StatusEffects.css';

const StatusEffects = ({ effects = [], playerName, availableEffects = {} }) => {
  if (!effects || effects.length === 0) return null;

  // Separate buffs and debuffs
  const buffs = effects.filter(e => {
    const def = availableEffects[e.type];
    return def?.type === 'buff';
  });
  
  const debuffs = effects.filter(e => {
    const def = availableEffects[e.type];
    return def?.type === 'debuff';
  });

  const renderEffect = (effect) => {
    const effectDef = availableEffects[effect.type];
    if (!effectDef) return null;

    let description = effectDef.description
      .replace('{value}', effect.value)
      .replace('{duration}', effect.turnsRemaining)
      .replace('{element}', effect.element || '');

    // Add total damage for DoT effects
    if (effect.totalDamageDealt > 0) {
      description += ` (Total: ${effect.totalDamageDealt})`;
    }

    return (
      <div 
        key={effect.id} 
        className={`status-effect ${effectDef.type}`}
        title={description}
      >
        <span className="effect-icon">{effectDef.icon}</span>
        <div className="effect-details">
          <span className="effect-name">{effectDef.name}</span>
          {effect.turnsRemaining > 0 && (
            <span className="effect-duration">{effect.turnsRemaining}</span>
          )}
          {effect.value > 0 && effect.type !== 'SHIELD' && (
            <span className="effect-value">
              {['WEAKNESS', 'CURSE', 'BURN', 'POISON', 'BLEED'].includes(effect.type) ? '-' : '+'}
              {effect.value}
            </span>
          )}
          {effect.type === 'SHIELD' && (
            <span className="effect-value shield-value">{effect.value}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="status-effects-container">
      {buffs.length > 0 && (
        <div className="effects-section buffs">
          <div className="effects-label">Buffs</div>
          <div className="effects-list">
            {buffs.map(renderEffect)}
          </div>
        </div>
      )}
      
      {debuffs.length > 0 && (
        <div className="effects-section debuffs">
          <div className="effects-label">Debuffs</div>
          <div className="effects-list">
            {debuffs.map(renderEffect)}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusEffects;

import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import CardTooltip from './CardTooltip';
import './Card.css';
import '../utils/visualEffects.css';
import '../utils/advancedCardMechanics.css';
import { getElementColor, getElementDisplay, ELEMENT_LABELS } from '../utils/accessibility';
import advancedMechanics from '../utils/advancedCardMechanics';

const Card = memo(({ card, onClick, isPlayable, keyboardKey, onPlayed, manaCost, canAfford = true, canOverdraft = false, onLongPress, isRecommended = false }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    colorblindMode: 'none',
    showElementIcons: true,
    highContrast: false
  });
  
  // Long press detection for card zoom
  const longPressTimer = useRef(null);
  const isLongPress = useRef(false);

  const handleTouchStart = (e) => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      // Trigger long press callback for card zoom
      if (onLongPress && card) {
        onLongPress(card);
      }
    }, 500); // 500ms hold = long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleTouchMove = () => {
    // Cancel long press if user moves finger
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const handleMouseEnter = (e) => {
    if (card) {
      const rect = e.currentTarget.getBoundingClientRect();
      // Calculate tooltip position, ensuring it stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Position tooltip to the right of the card if near top, otherwise above
      const spaceAbove = rect.top;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceRight = viewportWidth - rect.right;
      
      let x = rect.left + rect.width / 2;
      let y = rect.top;
      let placement = 'top'; // Default placement
      
      // If not enough space above, place below or to the side
      if (spaceAbove < 200) {
        if (spaceBelow > 200) {
          y = rect.bottom;
          placement = 'bottom';
        } else if (spaceRight > 320) {
          x = rect.right + 10;
          y = rect.top + rect.height / 2;
          placement = 'right';
        }
      }
      
      setTooltipPosition({
        x,
        y,
        placement
      });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

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

  // Generate card name based on element and strength
  const getCardName = () => {
    const strength = card.modifiedStrength || card.strength;
    const names = {
      FIRE: {
        low: ['Spark', 'Ember', 'Flame'],
        mid: ['Blaze', 'Inferno', 'Pyre'],
        high: ['Phoenix', 'Infernal Lord', 'Solar Flare']
      },
      ICE: {
        low: ['Frost', 'Chill', 'Snowflake'],
        mid: ['Glacier', 'Blizzard', 'Freeze'],
        high: ['Frost Titan', 'Eternal Winter', 'Ice Queen']
      },
      WATER: {
        low: ['Droplet', 'Stream', 'Ripple'],
        mid: ['Wave', 'Torrent', 'Cascade'],
        high: ['Tidal Wave', 'Leviathan', 'Ocean King']
      },
      ELECTRICITY: {
        low: ['Static', 'Spark', 'Charge'],
        mid: ['Bolt', 'Thunder', 'Storm'],
        high: ['Thunderlord', 'Zeus Strike', 'Lightning God']
      },
      EARTH: {
        low: ['Pebble', 'Stone', 'Rock'],
        mid: ['Boulder', 'Quake', 'Tremor'],
        high: ['Mountain', 'Earth Titan', 'Avalanche']
      },
      POWER: {
        low: ['Energy', 'Force', 'Pulse'],
        mid: ['Surge', 'Nova', 'Burst'],
        high: ['Supernova', 'Cosmic Force', 'Star Power']
      },
      LIGHT: {
        low: ['Gleam', 'Glow', 'Shine'],
        mid: ['Radiance', 'Beam', 'Flash'],
        high: ['Solar Flare', 'Holy Light', 'Divine Ray']
      },
      DARK: {
        low: ['Shadow', 'Shade', 'Gloom'],
        mid: ['Eclipse', 'Void', 'Abyss'],
        high: ['Black Hole', 'Dark Matter', 'Oblivion']
      },
      METEOR: {
        low: ['Asteroid', 'Comet', 'Rock'],
        mid: ['Meteor', 'Fireball', 'Impact'],
        high: ['Extinction', 'Armageddon', 'Planet Killer']
      },
      NEUTRAL: {
        low: ['Echo', 'Mimic', 'Copy'],
        mid: ['Adapter', 'Shifter', 'Mirror'],
        high: ['Omni Card', 'Versatile', 'Universal']
      },
      TECHNOLOGY: {
        low: ['Bot', 'Drone', 'Circuit'],
        mid: ['Android', 'Cyborg', 'Mech'],
        high: ['AI Core', 'Omega', 'Tech Lord']
      }
    };

    const elementNames = names[card.element] || names.NEUTRAL;
    let tier;
    
    if (strength <= 4) {
      tier = 'low';
    } else if (strength <= 8) {
      tier = 'mid';
    } else {
      tier = 'high';
    }

    const tierNames = elementNames[tier] || elementNames.mid;
    const index = Math.abs(card.id?.charCodeAt(0) || 0) % tierNames.length;
    return tierNames[index];
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
    const basePath = process.env.PUBLIC_URL || '';
    
    // Check if card has a custom image (for fusion cards, etc.)
    if (card?.image) {
      console.log(`✅ Using custom card image for ${card.name || 'card'}: ${card.image}`);
      return `${basePath}/${card.image}`;
    }
    
    // Log when a fusion card doesn't have an image (shouldn't happen)
    if (card?.isFusion || card?.fusion) {
      console.warn(`⚠️ Fusion card ${card.name} missing image property!`, card);
    }
    
    const elementImages = {
      'ELECTRICITY': `${basePath}/electricity-card.png`,
      'FIRE': `${basePath}/fire card.png`,
      'ICE': `${basePath}/ice-card.png`,
      'WATER': `${basePath}/water-card.png`,
      'EARTH': `${basePath}/earth-card.png`,
      'DARK': `${basePath}/dark-card.png`,
      'LIGHT': `${basePath}/star-card.png`,
      'TECHNOLOGY': `${basePath}/tech-card.png`,
      'METEOR': `${basePath}/meteor.png`,
      'NATURE': `${basePath}/nature-card.png`,
      'POWER': `${basePath}/power-card.png`,
      'NEUTRAL': `${basePath}/shifter-card.png`
    };
    
    const element = card?.element || null;
    const imagePath = elementImages[element] !== undefined ? elementImages[element] : null;
    
    // Debug logging
    if (element) {
      if (imagePath) {
        console.log(`✅ Card ${card.name || element} - Image found: ${imagePath}`);
      } else {
        console.log(`⚠️ Card ${card.name || element} - No image found for element: ${element}`);
      }
    }
    
    return imagePath;
  };

  const handleClick = () => {
    // Don't trigger click if this was a long press
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }
    if (onClick && isPlayable) {
      setIsPlaying(true);
      setTimeout(() => {
        setIsPlaying(false);
      }, 600);
      onClick(); // Call onClick directly without passing card
    }
  };

  const backgroundImage = getCardBackgroundImage();

  // Determine rarity class based on power or existing rarity
  const getRarityClass = () => {
    // Use existing rarity if present
    if (card.rarity) return card.rarity.toLowerCase();
    
    // Otherwise determine from advancedMechanics
    const rarity = advancedMechanics.determineRarity(card);
    return rarity.toLowerCase();
  };

  // Determine if card is high power (for enhanced glow)
  const isHighPower = (card.modifiedStrength || card.strength) >= 7;

  return (
    <>
      <div 
        className={`card ${isPlayable ? 'playable' : ''} ${isPlayable && isHighPower ? 'high-power' : ''} ${isPlayable && isRecommended ? 'recommended' : ''} ${getRarityClass()} ${card.isLegendary ? 'legendary' : ''} ${isPlaying ? 'playing' : ''} ${backgroundImage ? 'has-background-image' : ''} ${manaCost !== undefined && !canAfford ? (canOverdraft ? 'overdraft-available' : 'unaffordable-card') : ''} ${card.evolved ? 'evolved' : ''} ${card.counter ? 'counter' : ''} ${card.trap ? 'trap-card' : ''} ${card.isTrapSelected ? 'trap-selected' : ''}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        style={{ 
          borderColor: getElementColorLocal(card.element),
          borderWidth: getRarityBorder(),
          '--element-color': getElementColorLocal(card.element),
          '--card-bg-image': backgroundImage ? `url('${backgroundImage}')` : 'none'
        }}
        data-key={keyboardKey || ''}
        data-element={card.element}
        data-colorblind={accessibilitySettings.colorblindMode !== 'none' ? 'true' : 'false'}
        data-fusion={(card.isFusion || card.fusion) ? 'true' : 'false'}
        role="button"
        tabIndex={isPlayable ? 0 : -1}
        aria-label={`${card.element} card with strength ${card.modifiedStrength || card.strength}`}
      >
      {/* Playable card glow ring */}
      {isPlayable && <div className="playable-ring"></div>}
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
          {manaCost !== undefined && (
            <div className={`mana-cost-badge ${!canAfford ? 'unaffordable' : ''}`}>
              💎 {manaCost}
            </div>
          )}
          {card.evolved && (
            <div className="evolution-badge" title="Evolved Card">
              🔗
            </div>
          )}
          {card.counter && (
            <div className="counter-badge" title={`Counter: ${card.counterType}`}>
              ⚔️
            </div>
          )}
          {card.fusion && (
            <div className="fusion-badge" title="Fusion Card">
              🔮
            </div>
          )}
        </div>
      <div className="card-center">
        <span className="element-icon-large" style={{ color: getElementColorLocal(card.element) }}>
          {getElementIcon(card.element)}
        </span>
        <div className="card-name">{getCardName()}</div>
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
        {card.persistentAbility && card.abilityDuration > 0 && (
          <>
            <div className="persistent-ability-icon" title={`${card.persistentAbility} (${card.abilityDuration} turns left)`}>
              🌟
            </div>
            <div className="ability-duration-bar">
              <div 
                className="ability-duration-fill" 
                style={{ width: `${(card.abilityDuration / (card.maxAbilityDuration || 3)) * 100}%` }}
              />
            </div>
          </>
        )}
      </div>
    </div>
    {showTooltip && isPlayable && (
      <CardTooltip card={card} position={tooltipPosition} />
    )}
    </>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  // Only re-render if these props change
  return (
    prevProps.card?.id === nextProps.card?.id &&
    prevProps.card?.strength === nextProps.card?.strength &&
    prevProps.card?.modifiedStrength === nextProps.card?.modifiedStrength &&
    prevProps.isPlayable === nextProps.isPlayable &&
    prevProps.canAfford === nextProps.canAfford &&
    prevProps.canOverdraft === nextProps.canOverdraft &&
    prevProps.manaCost === nextProps.manaCost
  );
});

export default Card;

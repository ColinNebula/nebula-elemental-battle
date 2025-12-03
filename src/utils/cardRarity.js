/**
 * Enhanced Card Rarity System
 * Provides visual styling, drop rates, and rarity-based effects
 */

// Rarity Definitions with enhanced styling
export const CARD_RARITY = {
  COMMON: {
    id: 'common',
    name: 'Common',
    icon: '⚪',
    color: '#9E9E9E',
    borderColor: '#757575',
    glowColor: 'rgba(158, 158, 158, 0.3)',
    backgroundColor: 'linear-gradient(135deg, #424242 0%, #616161 100%)',
    dropRate: 0.50,
    strengthRange: { min: 2, max: 4 },
    maxKeywords: 1,
    sellValue: 10,
    craftCost: 40,
    dustValue: 5,
    animation: 'none'
  },
  UNCOMMON: {
    id: 'uncommon',
    name: 'Uncommon',
    icon: '🟢',
    color: '#4CAF50',
    borderColor: '#388E3C',
    glowColor: 'rgba(76, 175, 80, 0.4)',
    backgroundColor: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
    dropRate: 0.30,
    strengthRange: { min: 4, max: 6 },
    maxKeywords: 1,
    sellValue: 25,
    craftCost: 100,
    dustValue: 15,
    animation: 'subtle-glow'
  },
  RARE: {
    id: 'rare',
    name: 'Rare',
    icon: '🔵',
    color: '#2196F3',
    borderColor: '#1976D2',
    glowColor: 'rgba(33, 150, 243, 0.5)',
    backgroundColor: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
    dropRate: 0.15,
    strengthRange: { min: 6, max: 8 },
    maxKeywords: 2,
    sellValue: 50,
    craftCost: 200,
    dustValue: 30,
    animation: 'pulse-glow'
  },
  EPIC: {
    id: 'epic',
    name: 'Epic',
    icon: '🟣',
    color: '#9C27B0',
    borderColor: '#7B1FA2',
    glowColor: 'rgba(156, 39, 176, 0.6)',
    backgroundColor: 'linear-gradient(135deg, #6A1B9A 0%, #BA68C8 100%)',
    dropRate: 0.04,
    strengthRange: { min: 8, max: 10 },
    maxKeywords: 2,
    sellValue: 150,
    craftCost: 400,
    dustValue: 100,
    animation: 'shimmer'
  },
  LEGENDARY: {
    id: 'legendary',
    name: 'Legendary',
    icon: '🟠',
    color: '#FF9800',
    borderColor: '#F57C00',
    glowColor: 'rgba(255, 152, 0, 0.7)',
    backgroundColor: 'linear-gradient(135deg, #E65100 0%, #FFB74D 100%)',
    dropRate: 0.01,
    strengthRange: { min: 8, max: 10 },
    maxKeywords: 3,
    sellValue: 400,
    craftCost: 1600,
    dustValue: 400,
    animation: 'legendary-shine'
  },
  MYTHIC: {
    id: 'mythic',
    name: 'Mythic',
    icon: '💎',
    color: '#E91E63',
    borderColor: '#C2185B',
    glowColor: 'rgba(233, 30, 99, 0.8)',
    backgroundColor: 'linear-gradient(135deg, #AD1457 0%, #F48FB1 50%, #AD1457 100%)',
    dropRate: 0.001,
    strengthRange: { min: 10, max: 12 },
    maxKeywords: 3,
    sellValue: 1000,
    craftCost: 3200,
    dustValue: 1000,
    animation: 'mythic-rainbow'
  }
};

// Mapping from old tier names to new rarity system
export const TIER_TO_RARITY = {
  'COMMON': 'COMMON',
  'UNCOMMON': 'UNCOMMON', 
  'RARE': 'RARE',
  'LEGENDARY': 'LEGENDARY'
};

/**
 * Get rarity based on weighted random roll
 */
export function rollRarity(luckBonus = 0) {
  const roll = Math.random() * (1 - luckBonus);
  
  let cumulative = 0;
  for (const [rarityKey, rarity] of Object.entries(CARD_RARITY)) {
    cumulative += rarity.dropRate;
    if (roll <= cumulative) {
      return rarityKey;
    }
  }
  
  return 'COMMON';
}

/**
 * Get rarity info by key
 */
export function getRarity(rarityKey) {
  return CARD_RARITY[rarityKey] || CARD_RARITY.COMMON;
}

/**
 * Get CSS styles for rarity
 */
export function getRarityStyles(rarityKey) {
  const rarity = getRarity(rarityKey);
  
  return {
    border: `2px solid ${rarity.borderColor}`,
    boxShadow: `0 0 10px ${rarity.glowColor}, inset 0 0 20px ${rarity.glowColor}`,
    background: rarity.backgroundColor,
    animation: rarity.animation !== 'none' ? `${rarity.animation} 2s infinite` : 'none'
  };
}

/**
 * Get CSS class name for rarity
 */
export function getRarityClassName(rarityKey) {
  return `rarity-${(rarityKey || 'common').toLowerCase()}`;
}

/**
 * Generate strength based on rarity
 */
export function generateStrengthForRarity(rarityKey) {
  const rarity = getRarity(rarityKey);
  const { min, max } = rarity.strengthRange;
  return min + Math.floor(Math.random() * (max - min + 1));
}

/**
 * Get rarity display with icon
 */
export function getRarityDisplay(rarityKey) {
  const rarity = getRarity(rarityKey);
  return `${rarity.icon} ${rarity.name}`;
}

/**
 * Calculate dust value for disenchanting
 */
export function getDisenchantValue(rarityKey) {
  const rarity = getRarity(rarityKey);
  return rarity.dustValue;
}

/**
 * Calculate craft cost
 */
export function getCraftCost(rarityKey) {
  const rarity = getRarity(rarityKey);
  return rarity.craftCost;
}

/**
 * Check if a card is rare or better
 */
export function isRareOrBetter(rarityKey) {
  const rarityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];
  const rareIndex = rarityOrder.indexOf('RARE');
  const cardIndex = rarityOrder.indexOf(rarityKey);
  return cardIndex >= rareIndex;
}

/**
 * Compare rarity levels
 */
export function compareRarity(rarity1, rarity2) {
  const rarityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];
  return rarityOrder.indexOf(rarity1) - rarityOrder.indexOf(rarity2);
}

/**
 * Get upgrade rarity (for crafting/evolving)
 */
export function getUpgradeRarity(currentRarity) {
  const rarityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];
  const currentIndex = rarityOrder.indexOf(currentRarity);
  if (currentIndex < rarityOrder.length - 1) {
    return rarityOrder[currentIndex + 1];
  }
  return null;
}

/**
 * CSS Animations for card rarities
 */
export const RARITY_CSS = `
  /* Common - No special effects */
  .rarity-common {
    border: 2px solid #757575;
  }

  /* Uncommon - Subtle glow */
  .rarity-uncommon {
    border: 2px solid #388E3C;
    box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
  }

  /* Rare - Pulsing glow */
  .rarity-rare {
    border: 2px solid #1976D2;
    animation: rare-pulse 2s infinite;
  }
  @keyframes rare-pulse {
    0%, 100% { box-shadow: 0 0 8px rgba(33, 150, 243, 0.5); }
    50% { box-shadow: 0 0 16px rgba(33, 150, 243, 0.8); }
  }

  /* Epic - Shimmer effect */
  .rarity-epic {
    border: 2px solid #7B1FA2;
    background: linear-gradient(135deg, #6A1B9A 0%, #BA68C8 100%);
    animation: epic-shimmer 3s infinite;
    position: relative;
    overflow: hidden;
  }
  @keyframes epic-shimmer {
    0% { box-shadow: 0 0 10px rgba(156, 39, 176, 0.6); }
    50% { box-shadow: 0 0 20px rgba(156, 39, 176, 0.9); }
    100% { box-shadow: 0 0 10px rgba(156, 39, 176, 0.6); }
  }
  .rarity-epic::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 40%,
      rgba(255, 255, 255, 0.1) 50%,
      transparent 60%
    );
    animation: epic-shine 3s infinite linear;
  }
  @keyframes epic-shine {
    from { transform: translateX(-100%) rotate(45deg); }
    to { transform: translateX(100%) rotate(45deg); }
  }

  /* Legendary - Golden shine */
  .rarity-legendary {
    border: 3px solid #F57C00;
    background: linear-gradient(135deg, #E65100 0%, #FFB74D 50%, #E65100 100%);
    animation: legendary-glow 2s infinite;
    position: relative;
  }
  @keyframes legendary-glow {
    0%, 100% { 
      box-shadow: 0 0 15px rgba(255, 152, 0, 0.7),
                  0 0 30px rgba(255, 152, 0, 0.4);
    }
    50% { 
      box-shadow: 0 0 25px rgba(255, 152, 0, 0.9),
                  0 0 50px rgba(255, 152, 0, 0.6);
    }
  }
  .rarity-legendary::after {
    content: '✨';
    position: absolute;
    top: -5px;
    right: -5px;
    font-size: 16px;
    animation: sparkle 1.5s infinite;
  }
  @keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  /* Mythic - Rainbow effect */
  .rarity-mythic {
    border: 3px solid transparent;
    background: linear-gradient(#1a1a2e, #1a1a2e) padding-box,
                linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff) border-box;
    animation: mythic-rainbow 3s linear infinite, mythic-pulse 2s infinite;
    position: relative;
  }
  @keyframes mythic-rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
  @keyframes mythic-pulse {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(233, 30, 99, 0.8),
                  0 0 40px rgba(156, 39, 176, 0.6),
                  0 0 60px rgba(103, 58, 183, 0.4);
    }
    50% { 
      box-shadow: 0 0 30px rgba(233, 30, 99, 1),
                  0 0 60px rgba(156, 39, 176, 0.8),
                  0 0 90px rgba(103, 58, 183, 0.6);
    }
  }
  .rarity-mythic::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 70%
    );
    animation: mythic-shine 2s infinite linear;
  }
  @keyframes mythic-shine {
    from { transform: translateX(-100%); }
    to { transform: translateX(100%); }
  }
  .rarity-mythic::after {
    content: '💎';
    position: absolute;
    top: -8px;
    right: -8px;
    font-size: 18px;
    animation: mythic-gem 2s infinite;
  }
  @keyframes mythic-gem {
    0%, 100% { transform: rotate(-10deg) scale(1); }
    50% { transform: rotate(10deg) scale(1.2); }
  }

  /* Rarity indicator badge */
  .rarity-badge {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    padding: 2px 8px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .rarity-badge-common { background: #757575; color: white; }
  .rarity-badge-uncommon { background: #4CAF50; color: white; }
  .rarity-badge-rare { background: #2196F3; color: white; }
  .rarity-badge-epic { background: #9C27B0; color: white; }
  .rarity-badge-legendary { background: linear-gradient(90deg, #E65100, #FFB74D); color: #1a1a1a; }
  .rarity-badge-mythic { background: linear-gradient(90deg, #E91E63, #9C27B0, #673AB7); color: white; }
`;

/**
 * Inject rarity CSS into document
 */
export function injectRarityStyles() {
  if (typeof document !== 'undefined') {
    const styleId = 'rarity-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = RARITY_CSS;
      document.head.appendChild(styleElement);
    }
  }
}

export default {
  CARD_RARITY,
  TIER_TO_RARITY,
  rollRarity,
  getRarity,
  getRarityStyles,
  getRarityClassName,
  generateStrengthForRarity,
  getRarityDisplay,
  getDisenchantValue,
  getCraftCost,
  isRareOrBetter,
  compareRarity,
  getUpgradeRarity,
  RARITY_CSS,
  injectRarityStyles
};

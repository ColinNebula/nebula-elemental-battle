/**
 * Card Keywords & Abilities System
 * Adds CCG-style keyword abilities to cards for deeper strategic gameplay
 */

// Keyword Definitions with effects and descriptions
export const KEYWORDS = {
  // Combat Keywords
  TAUNT: {
    id: 'taunt',
    name: 'Taunt',
    icon: '🛡️',
    description: 'Must be targeted first',
    category: 'combat',
    color: '#795548',
    effect: 'force_target',
    tooltip: 'Enemy must attack this card before others'
  },
  LIFESTEAL: {
    id: 'lifesteal',
    name: 'Lifesteal',
    icon: '💉',
    description: 'Heal for damage dealt',
    category: 'combat',
    color: '#E91E63',
    effect: 'heal_on_damage',
    tooltip: 'Restore HP equal to damage dealt to opponent'
  },
  PIERCING: {
    id: 'piercing',
    name: 'Piercing',
    icon: '🗡️',
    description: 'Ignores shields',
    category: 'combat',
    color: '#FF5722',
    effect: 'ignore_shield',
    tooltip: 'Damage ignores opponent shield effects'
  },
  DOUBLE_STRIKE: {
    id: 'double_strike',
    name: 'Double Strike',
    icon: '⚔️',
    description: 'Attacks twice',
    category: 'combat',
    color: '#F44336',
    effect: 'attack_twice',
    tooltip: 'This card attacks twice in one turn'
  },
  RETALIATE: {
    id: 'retaliate',
    name: 'Retaliate',
    icon: '💢',
    description: 'Deals damage when hit',
    category: 'combat',
    color: '#9C27B0',
    effect: 'damage_on_hit',
    tooltip: 'Deals 2 damage to attacker when damaged'
  },

  // Trigger Keywords
  BATTLECRY: {
    id: 'battlecry',
    name: 'Battlecry',
    icon: '📣',
    description: 'Effect when played',
    category: 'trigger',
    color: '#FF9800',
    effect: 'on_play',
    tooltip: 'Triggers a special effect when this card is played'
  },
  DEATHRATTLE: {
    id: 'deathrattle',
    name: 'Deathrattle',
    icon: '💀',
    description: 'Effect when destroyed',
    category: 'trigger',
    color: '#607D8B',
    effect: 'on_death',
    tooltip: 'Triggers a special effect when this card is destroyed'
  },
  INSPIRE: {
    id: 'inspire',
    name: 'Inspire',
    icon: '✨',
    description: 'Boost allies when played',
    category: 'trigger',
    color: '#FFEB3B',
    effect: 'buff_allies',
    tooltip: 'Gives +1 strength to all cards in your hand'
  },
  AMBUSH: {
    id: 'ambush',
    name: 'Ambush',
    icon: '🥷',
    description: 'Surprise attack bonus',
    category: 'trigger',
    color: '#3F51B5',
    effect: 'first_strike_bonus',
    tooltip: '+3 strength if played first in the round'
  },

  // Status Keywords
  DIVINE_SHIELD: {
    id: 'divine_shield',
    name: 'Divine Shield',
    icon: '🔰',
    description: 'Blocks first hit',
    category: 'status',
    color: '#FFC107',
    effect: 'ignore_first_damage',
    tooltip: 'Ignores the first instance of damage'
  },
  STEALTH: {
    id: 'stealth',
    name: 'Stealth',
    icon: '👤',
    description: 'Cannot be targeted',
    category: 'status',
    color: '#424242',
    effect: 'untargetable',
    tooltip: 'Cannot be targeted by opponent abilities'
  },
  FROZEN: {
    id: 'frozen',
    name: 'Frozen',
    icon: '🧊',
    description: 'Cannot attack',
    category: 'status',
    color: '#00BCD4',
    effect: 'skip_attack',
    tooltip: 'This card cannot attack next turn'
  },
  POISONED: {
    id: 'poisoned',
    name: 'Poisoned',
    icon: '☠️',
    description: 'Loses strength over time',
    category: 'status',
    color: '#8BC34A',
    effect: 'dot_damage',
    tooltip: 'Loses 1 strength at the end of each turn'
  },
  BLESSED: {
    id: 'blessed',
    name: 'Blessed',
    icon: '😇',
    description: 'Extra strength',
    category: 'status',
    color: '#FFFFFF',
    effect: 'strength_buff',
    tooltip: '+2 strength for 2 turns'
  },

  // Special Keywords
  RUSH: {
    id: 'rush',
    name: 'Rush',
    icon: '💨',
    description: 'Can attack immediately',
    category: 'special',
    color: '#4CAF50',
    effect: 'immediate_attack',
    tooltip: 'Can attack the same turn it\'s played'
  },
  EVOLVE: {
    id: 'evolve',
    name: 'Evolve',
    icon: '🔄',
    description: 'Transforms when conditions met',
    category: 'special',
    color: '#673AB7',
    effect: 'transform_on_condition',
    tooltip: 'Transforms into a stronger form when winning'
  },
  ECHO: {
    id: 'echo',
    name: 'Echo',
    icon: '🔊',
    description: 'Can be played again',
    category: 'special',
    color: '#2196F3',
    effect: 'repeat_play',
    tooltip: 'Returns to hand after being played (once)'
  },
  VOLATILE: {
    id: 'volatile',
    name: 'Volatile',
    icon: '💥',
    description: 'Explodes on death',
    category: 'special',
    color: '#FF5722',
    effect: 'aoe_on_death',
    tooltip: 'Deals 3 damage to all when destroyed'
  },
  ADAPT: {
    id: 'adapt',
    name: 'Adapt',
    icon: '🦎',
    description: 'Changes element',
    category: 'special',
    color: '#009688',
    effect: 'element_shift',
    tooltip: 'Changes to counter the opponent\'s element'
  },
  DRAIN: {
    id: 'drain',
    name: 'Drain',
    icon: '🌀',
    description: 'Steals strength',
    category: 'special',
    color: '#9C27B0',
    effect: 'steal_strength',
    tooltip: 'Steals 2 strength from the opponent\'s card'
  }
};

// Keyword assignment by rarity and element
const KEYWORD_POOLS = {
  // Common cards get 0-1 basic keywords
  COMMON: {
    pool: ['TAUNT', 'RUSH', 'AMBUSH'],
    maxKeywords: 1,
    chance: 0.3
  },
  // Uncommon cards get 1 keyword
  UNCOMMON: {
    pool: ['TAUNT', 'LIFESTEAL', 'BATTLECRY', 'RUSH', 'DIVINE_SHIELD', 'AMBUSH'],
    maxKeywords: 1,
    chance: 0.6
  },
  // Rare cards get 1-2 keywords
  RARE: {
    pool: ['TAUNT', 'LIFESTEAL', 'PIERCING', 'BATTLECRY', 'DEATHRATTLE', 'INSPIRE', 
           'DIVINE_SHIELD', 'STEALTH', 'RUSH', 'ECHO', 'AMBUSH'],
    maxKeywords: 2,
    chance: 0.8
  },
  // Epic cards get 2 keywords
  EPIC: {
    pool: ['LIFESTEAL', 'PIERCING', 'DOUBLE_STRIKE', 'BATTLECRY', 'DEATHRATTLE', 
           'INSPIRE', 'DIVINE_SHIELD', 'STEALTH', 'EVOLVE', 'ECHO', 'ADAPT', 'DRAIN'],
    maxKeywords: 2,
    chance: 1.0
  },
  // Legendary cards get 2-3 powerful keywords
  LEGENDARY: {
    pool: ['LIFESTEAL', 'PIERCING', 'DOUBLE_STRIKE', 'RETALIATE', 'BATTLECRY', 
           'DEATHRATTLE', 'INSPIRE', 'DIVINE_SHIELD', 'EVOLVE', 'VOLATILE', 'ADAPT', 'DRAIN'],
    maxKeywords: 3,
    chance: 1.0
  }
};

// Element-specific keyword affinities
const ELEMENT_KEYWORDS = {
  FIRE: ['VOLATILE', 'DOUBLE_STRIKE', 'PIERCING', 'RETALIATE'],
  ICE: ['FROZEN', 'DIVINE_SHIELD', 'STEALTH'],
  WATER: ['LIFESTEAL', 'ADAPT', 'ECHO'],
  ELECTRICITY: ['RUSH', 'DOUBLE_STRIKE', 'AMBUSH'],
  EARTH: ['TAUNT', 'DIVINE_SHIELD', 'RETALIATE'],
  NATURE: ['LIFESTEAL', 'EVOLVE', 'INSPIRE', 'BLESSED'],
  LIGHT: ['DIVINE_SHIELD', 'INSPIRE', 'BLESSED', 'BATTLECRY'],
  DARK: ['DRAIN', 'DEATHRATTLE', 'STEALTH', 'POISONED'],
  NEUTRAL: ['ADAPT', 'ECHO', 'EVOLVE'],
  POWER: ['DOUBLE_STRIKE', 'PIERCING', 'VOLATILE'],
  TECHNOLOGY: ['DIVINE_SHIELD', 'ECHO', 'BATTLECRY'],
  METEOR: ['VOLATILE', 'PIERCING', 'RETALIATE']
};

/**
 * Assign keywords to a card based on its rarity and element
 */
export function assignKeywords(card) {
  const rarity = card.tier || 'COMMON';
  const element = card.element || 'NEUTRAL';
  const rarityConfig = KEYWORD_POOLS[rarity] || KEYWORD_POOLS.COMMON;
  
  // Check if we should assign keywords
  if (Math.random() > rarityConfig.chance) {
    return { ...card, keywords: [] };
  }
  
  const keywords = [];
  const numKeywords = Math.min(
    rarityConfig.maxKeywords,
    1 + Math.floor(Math.random() * rarityConfig.maxKeywords)
  );
  
  // Build weighted pool with element affinities
  const elementAffinity = ELEMENT_KEYWORDS[element] || [];
  const pool = [...rarityConfig.pool];
  
  // Add extra copies of element-affinity keywords for higher chance
  elementAffinity.forEach(kw => {
    if (pool.includes(kw)) {
      pool.push(kw, kw); // Triple chance for element-matching keywords
    }
  });
  
  // Select keywords
  const usedKeywords = new Set();
  for (let i = 0; i < numKeywords && pool.length > 0; i++) {
    let attempts = 0;
    let selectedKeyword;
    
    do {
      selectedKeyword = pool[Math.floor(Math.random() * pool.length)];
      attempts++;
    } while (usedKeywords.has(selectedKeyword) && attempts < 10);
    
    if (!usedKeywords.has(selectedKeyword)) {
      usedKeywords.add(selectedKeyword);
      keywords.push(selectedKeyword);
    }
  }
  
  return {
    ...card,
    keywords: keywords.map(k => KEYWORDS[k])
  };
}

/**
 * Apply keyword effects during battle
 */
export function applyKeywordEffect(keyword, context) {
  const { card, opponent, player, room } = context;
  
  switch (keyword.id) {
    case 'lifesteal':
      return {
        type: 'heal',
        value: Math.floor(card.strength / 2),
        target: 'player',
        message: `${keyword.icon} Lifesteal heals for ${Math.floor(card.strength / 2)} HP`
      };
      
    case 'piercing':
      return {
        type: 'pierce',
        ignoreShield: true,
        message: `${keyword.icon} Piercing ignores shields!`
      };
      
    case 'double_strike':
      return {
        type: 'attack_modifier',
        multiplier: 2,
        message: `${keyword.icon} Double Strike! Attacks twice!`
      };
      
    case 'battlecry':
      return {
        type: 'buff',
        value: 2,
        target: 'next_card',
        message: `${keyword.icon} Battlecry! Next card gets +2 strength`
      };
      
    case 'deathrattle':
      return {
        type: 'on_death',
        effect: 'draw_card',
        message: `${keyword.icon} Deathrattle: Draw a card when destroyed`
      };
      
    case 'inspire':
      return {
        type: 'buff_hand',
        value: 1,
        message: `${keyword.icon} Inspire! All cards in hand get +1 strength`
      };
      
    case 'divine_shield':
      return {
        type: 'absorb',
        absorbAmount: 1,
        message: `${keyword.icon} Divine Shield absorbs first hit!`
      };
      
    case 'stealth':
      return {
        type: 'untargetable',
        duration: 1,
        message: `${keyword.icon} Stealth! Cannot be targeted`
      };
      
    case 'rush':
      return {
        type: 'immediate',
        bonusStrength: 1,
        message: `${keyword.icon} Rush! Immediate attack with +1 strength`
      };
      
    case 'evolve':
      if (context.won) {
        return {
          type: 'transform',
          strengthIncrease: 2,
          message: `${keyword.icon} Evolve! Card grows stronger (+2 strength)`
        };
      }
      return null;
      
    case 'echo':
      return {
        type: 'return_to_hand',
        message: `${keyword.icon} Echo! Card returns to hand`
      };
      
    case 'volatile':
      return {
        type: 'aoe_damage',
        damage: 3,
        trigger: 'on_death',
        message: `${keyword.icon} Volatile! Explodes for 3 damage to all`
      };
      
    case 'adapt':
      return {
        type: 'element_change',
        newElement: context.opponentElement,
        message: `${keyword.icon} Adapt! Changes element to counter opponent`
      };
      
    case 'drain':
      return {
        type: 'steal_strength',
        amount: 2,
        message: `${keyword.icon} Drain! Steals 2 strength from opponent`
      };
      
    case 'ambush':
      if (context.playedFirst) {
        return {
          type: 'bonus_strength',
          value: 3,
          message: `${keyword.icon} Ambush! +3 surprise attack bonus`
        };
      }
      return null;
      
    case 'taunt':
      return {
        type: 'force_target',
        message: `${keyword.icon} Taunt! Must be targeted first`
      };
      
    case 'retaliate':
      return {
        type: 'damage_on_hit',
        damage: 2,
        message: `${keyword.icon} Retaliate! Deals 2 damage when hit`
      };
      
    default:
      return null;
  }
}

/**
 * Get keyword display string for a card
 */
export function getKeywordDisplay(card) {
  if (!card.keywords || card.keywords.length === 0) {
    return '';
  }
  
  return card.keywords.map(k => `${k.icon} ${k.name}`).join(' • ');
}

/**
 * Get keyword icons only
 */
export function getKeywordIcons(card) {
  if (!card.keywords || card.keywords.length === 0) {
    return '';
  }
  
  return card.keywords.map(k => k.icon).join(' ');
}

/**
 * Check if card has a specific keyword
 */
export function hasKeyword(card, keywordId) {
  return card.keywords?.some(k => k.id === keywordId) || false;
}

/**
 * Get all keywords by category
 */
export function getKeywordsByCategory(category) {
  return Object.values(KEYWORDS).filter(k => k.category === category);
}

export default {
  KEYWORDS,
  assignKeywords,
  applyKeywordEffect,
  getKeywordDisplay,
  getKeywordIcons,
  hasKeyword,
  getKeywordsByCategory
};

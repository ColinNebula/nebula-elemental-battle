// Power-Up System - Boosters, Ultimates, Sideboard, and Equipment

// ============================================================================
// TEMPORARY BOOSTERS
// ============================================================================

export const BOOSTERS = {
  STRENGTH_SURGE: {
    id: 'strength_surge',
    name: 'Strength Surge',
    icon: '💪',
    duration: 3,
    cost: 2,
    effect: {
      type: 'STAT_BOOST',
      stat: 'strength',
      value: 3
    },
    description: '+3 strength to all cards for 3 turns'
  },
  SHIELD_BARRIER: {
    id: 'shield_barrier',
    name: 'Shield Barrier',
    icon: '🛡️',
    duration: 2,
    cost: 3,
    effect: {
      type: 'DAMAGE_REDUCTION',
      value: 0.5
    },
    description: 'Reduce incoming damage by 50% for 2 turns'
  },
  MANA_BURST: {
    id: 'mana_burst',
    name: 'Mana Burst',
    icon: '✨',
    duration: 1,
    cost: 1,
    effect: {
      type: 'MANA_BOOST',
      value: 5
    },
    description: 'Gain 5 extra mana immediately'
  },
  CARD_DRAW: {
    id: 'card_draw',
    name: 'Card Draw',
    icon: '🎴',
    duration: 1,
    cost: 2,
    effect: {
      type: 'DRAW_CARDS',
      value: 2
    },
    description: 'Draw 2 additional cards'
  },
  ELEMENT_MASTERY: {
    id: 'element_mastery',
    name: 'Element Mastery',
    icon: '🔥',
    duration: 4,
    cost: 3,
    effect: {
      type: 'ELEMENT_BOOST',
      value: 2
    },
    description: 'All elemental bonuses increased by 2 for 4 turns'
  },
  DOUBLE_DAMAGE: {
    id: 'double_damage',
    name: 'Double Damage',
    icon: '⚡',
    duration: 1,
    cost: 4,
    effect: {
      type: 'DAMAGE_MULTIPLIER',
      value: 2.0
    },
    description: 'Next attack deals double damage'
  },
  LIFE_DRAIN: {
    id: 'life_drain',
    name: 'Life Drain',
    icon: '🧛',
    duration: 2,
    cost: 3,
    effect: {
      type: 'LIFESTEAL',
      value: 0.3
    },
    description: 'Heal for 30% of damage dealt for 2 turns'
  },
  TIME_WARP: {
    id: 'time_warp',
    name: 'Time Warp',
    icon: '⏰',
    duration: 1,
    cost: 5,
    effect: {
      type: 'EXTRA_TURN'
    },
    description: 'Take an additional turn after this one'
  }
};

export const initializeBoosterSystem = () => ({
  activeBoosts: [],
  usedBoosters: [],
  availableBoosters: Object.keys(BOOSTERS)
});

export const activateBooster = (boosterSystem, boosterId, playerId) => {
  const booster = BOOSTERS[boosterId];
  if (!booster) return boosterSystem;

  const newBoost = {
    id: `boost_${Date.now()}`,
    boosterId,
    playerId,
    turnsRemaining: booster.duration,
    activatedAt: Date.now(),
    boosterData: booster
  };

  return {
    ...boosterSystem,
    activeBoosts: [...boosterSystem.activeBoosts, newBoost],
    usedBoosters: [...boosterSystem.usedBoosters, boosterId]
  };
};

export const tickBoosterSystem = (boosterSystem) => {
  const activeBoosts = boosterSystem.activeBoosts
    .map(boost => ({
      ...boost,
      turnsRemaining: boost.turnsRemaining - 1
    }))
    .filter(boost => boost.turnsRemaining > 0);

  return {
    ...boosterSystem,
    activeBoosts
  };
};

export const applyBoosterEffects = (card, boosterSystem, playerId) => {
  let modifiedCard = { ...card };
  const playerBoosts = boosterSystem.activeBoosts.filter(b => b.playerId === playerId);

  playerBoosts.forEach(boost => {
    const effect = boost.boosterData.effect;

    switch (effect.type) {
      case 'STAT_BOOST':
        if (effect.stat === 'strength') {
          modifiedCard.strength = (modifiedCard.strength || 0) + effect.value;
          modifiedCard.modifiedStrength = modifiedCard.strength;
        }
        break;
      case 'ELEMENT_BOOST':
        if (modifiedCard.elementalBonus) {
          modifiedCard.elementalBonus += effect.value;
        }
        break;
      case 'DAMAGE_MULTIPLIER':
        modifiedCard.strength = Math.floor((modifiedCard.strength || 0) * effect.value);
        modifiedCard.modifiedStrength = modifiedCard.strength;
        break;
    }
  });

  return modifiedCard;
};

// ============================================================================
// ULTIMATE ABILITIES
// ============================================================================

export const ULTIMATE_ABILITIES = {
  METEOR_STRIKE: {
    id: 'meteor_strike',
    name: 'Meteor Strike',
    icon: '☄️',
    cooldown: 5,
    manaCost: 8,
    effect: {
      type: 'AOE_DAMAGE',
      damage: 15,
      targets: 'ALL_ENEMIES'
    },
    description: 'Deal 15 damage to all opponent cards'
  },
  PHOENIX_REBIRTH: {
    id: 'phoenix_rebirth',
    name: 'Phoenix Rebirth',
    icon: '🔥',
    cooldown: 7,
    manaCost: 10,
    effect: {
      type: 'REVIVE',
      value: 1
    },
    description: 'Revive your last defeated card with full strength'
  },
  VOID_COLLAPSE: {
    id: 'void_collapse',
    name: 'Void Collapse',
    icon: '🌑',
    cooldown: 6,
    manaCost: 9,
    effect: {
      type: 'BANISH',
      targets: 1
    },
    description: 'Remove target opponent card from the game'
  },
  DIVINE_INTERVENTION: {
    id: 'divine_intervention',
    name: 'Divine Intervention',
    icon: '✨',
    cooldown: 8,
    manaCost: 12,
    effect: {
      type: 'HEAL_ALL',
      value: 20
    },
    description: 'Heal all your cards by 20 HP'
  },
  ELEMENTAL_FURY: {
    id: 'elemental_fury',
    name: 'Elemental Fury',
    icon: '💥',
    cooldown: 4,
    manaCost: 6,
    effect: {
      type: 'ELEMENT_CHAIN',
      multiplier: 1.5
    },
    description: 'All elemental combos deal 50% more damage this turn'
  },
  TIME_FREEZE: {
    id: 'time_freeze',
    name: 'Time Freeze',
    icon: '❄️',
    cooldown: 6,
    manaCost: 8,
    effect: {
      type: 'SKIP_TURN',
      targets: 'OPPONENT'
    },
    description: 'Opponent skips their next turn'
  },
  CARD_SHUFFLE: {
    id: 'card_shuffle',
    name: 'Card Shuffle',
    icon: '🔄',
    cooldown: 3,
    manaCost: 4,
    effect: {
      type: 'REPLACE_HAND',
      value: 3
    },
    description: 'Replace up to 3 cards in your hand with new ones'
  },
  MIRROR_IMAGE: {
    id: 'mirror_image',
    name: 'Mirror Image',
    icon: '👥',
    cooldown: 5,
    manaCost: 7,
    effect: {
      type: 'DUPLICATE_CARD'
    },
    description: 'Create a copy of your strongest card'
  }
};

export const initializeUltimateSystem = (ultimateId = null) => ({
  selectedUltimate: ultimateId,
  currentCooldown: 0,
  maxCooldown: ultimateId ? ULTIMATE_ABILITIES[ultimateId]?.cooldown || 0 : 0,
  isReady: false,
  timesUsed: 0
});

export const tickUltimateCooldown = (ultimateSystem) => {
  if (ultimateSystem.currentCooldown > 0) {
    const newCooldown = ultimateSystem.currentCooldown - 1;
    return {
      ...ultimateSystem,
      currentCooldown: newCooldown,
      isReady: newCooldown === 0
    };
  }
  return ultimateSystem;
};

export const useUltimate = (ultimateSystem, currentPlayer, opponentPlayer, gameState) => {
  if (ultimateSystem.currentCooldown > 0) {
    return { success: false, message: 'Ultimate not ready' };
  }

  const ultimateId = ultimateSystem.selectedUltimate || ultimateSystem.id || 'meteor_strike';
  const ultimate = ULTIMATE_ABILITIES[ultimateId.toUpperCase()];
  
  if (!ultimate) {
    return { success: false, message: 'Invalid ultimate' };
  }

  // Apply ultimate effects
  let effects = [];
  
  switch (ultimate.effect.type) {
    case 'AOE_DAMAGE':
      // Meteor Strike: Damage all opponent cards
      if (opponentPlayer?.hand) {
        opponentPlayer.hand.forEach((card, index) => {
          if (card) {
            const newStrength = Math.max(1, (card.strength || 0) - ultimate.effect.damage);
            card.strength = newStrength;
            card.modifiedStrength = newStrength;
            effects.push({ type: 'DAMAGE', target: 'opponent_hand', index, amount: ultimate.effect.damage });
          }
        });
      }
      break;
      
    case 'DRAW_CARDS':
      // Card Shuffle: Draw extra cards
      effects.push({ type: 'DRAW', amount: ultimate.effect.value || 3 });
      break;
      
    case 'EXTRA_TURN':
      effects.push({ type: 'EXTRA_TURN' });
      break;
      
    case 'SKIP_TURN':
      effects.push({ type: 'SKIP_OPPONENT_TURN' });
      break;
      
    case 'ELEMENT_CHAIN':
      effects.push({ type: 'BOOST_ELEMENTALS', multiplier: ultimate.effect.multiplier });
      break;
  }
  
  return {
    success: true,
    effect: ultimate.effect,
    effects,
    ultimateData: ultimate,
    updatedSystem: {
      ...ultimateSystem,
      currentCooldown: ultimate.cooldown,
      isReady: false,
      timesUsed: (ultimateSystem.timesUsed || 0) + 1
    }
  };
};

// ============================================================================
// SIDEBOARD SYSTEM
// ============================================================================

export const initializeSideboard = () => ({
  sideboardCards: [],
  maxSideboardSize: 5,
  swapsUsed: 0,
  maxSwapsPerGame: 3
});

export const addToSideboard = (sideboard, card) => {
  if (sideboard.sideboardCards.length >= sideboard.maxSideboardSize) {
    return { success: false, message: 'Sideboard is full' };
  }

  return {
    success: true,
    sideboard: {
      ...sideboard,
      sideboardCards: [...sideboard.sideboardCards, card]
    }
  };
};

export const swapCardFromSideboard = (sideboard, hand, handCardIndex, sideboardCardIndex) => {
  if (sideboard.swapsUsed >= sideboard.maxSwapsPerGame) {
    return { success: false, message: 'No swaps remaining' };
  }

  if (!sideboard.sideboardCards[sideboardCardIndex]) {
    return { success: false, message: 'Invalid sideboard card' };
  }

  if (!hand[handCardIndex]) {
    return { success: false, message: 'Invalid hand card' };
  }

  const newHand = [...hand];
  const newSideboard = [...sideboard.sideboardCards];

  // Swap cards
  const temp = newHand[handCardIndex];
  newHand[handCardIndex] = newSideboard[sideboardCardIndex];
  newSideboard[sideboardCardIndex] = temp;

  return {
    success: true,
    hand: newHand,
    sideboard: {
      ...sideboard,
      sideboardCards: newSideboard,
      swapsUsed: sideboard.swapsUsed + 1
    }
  };
};

// ============================================================================
// EQUIPMENT SYSTEM
// ============================================================================

export const EQUIPMENT_ITEMS = {
  POWER_GAUNTLET: {
    id: 'power_gauntlet',
    name: 'Power Gauntlet',
    icon: '🥊',
    rarity: 'RARE',
    slot: 'HAND',
    stats: {
      strength: 2,
      critChance: 0.1
    },
    passive: {
      type: 'CRIT_DAMAGE',
      value: 1.5
    },
    description: '+2 strength, 10% crit chance, 50% crit damage'
  },
  CRYSTAL_PENDANT: {
    id: 'crystal_pendant',
    name: 'Crystal Pendant',
    icon: '💎',
    rarity: 'EPIC',
    slot: 'NECK',
    stats: {
      manaRegen: 1,
      cooldownReduction: 0.15
    },
    passive: {
      type: 'MANA_EFFICIENCY',
      value: 0.2
    },
    description: '+1 mana/turn, -15% cooldowns, -20% mana costs'
  },
  DRAGON_SCALES: {
    id: 'dragon_scales',
    name: 'Dragon Scales',
    icon: '🐉',
    rarity: 'LEGENDARY',
    slot: 'BODY',
    stats: {
      defense: 5,
      fireResist: 0.3
    },
    passive: {
      type: 'DAMAGE_REFLECT',
      value: 0.2
    },
    description: '+5 defense, 30% fire resistance, reflect 20% damage'
  },
  SWIFT_BOOTS: {
    id: 'swift_boots',
    name: 'Swift Boots',
    icon: '👢',
    rarity: 'RARE',
    slot: 'FEET',
    stats: {
      drawSpeed: 1
    },
    passive: {
      type: 'FIRST_TURN_BONUS',
      value: 2
    },
    description: 'Draw 1 extra card, +2 strength on first turn'
  },
  RING_OF_ELEMENTS: {
    id: 'ring_of_elements',
    name: 'Ring of Elements',
    icon: '💍',
    rarity: 'EPIC',
    slot: 'RING',
    stats: {
      elementalBonus: 3
    },
    passive: {
      type: 'ELEMENT_MASTERY',
      elements: ['FIRE', 'ICE', 'WATER', 'ELECTRICITY']
    },
    description: '+3 to all elemental bonuses'
  },
  LUCKY_CHARM: {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    icon: '🍀',
    rarity: 'RARE',
    slot: 'TRINKET',
    stats: {
      luck: 0.15
    },
    passive: {
      type: 'BONUS_REWARDS',
      value: 1.25
    },
    description: '15% better card draws, 25% bonus rewards'
  },
  CROWN_OF_POWER: {
    id: 'crown_of_power',
    name: 'Crown of Power',
    icon: '👑',
    rarity: 'LEGENDARY',
    slot: 'HEAD',
    stats: {
      strength: 3,
      manaRegen: 2,
      defense: 3
    },
    passive: {
      type: 'REGAL_PRESENCE',
      value: 1.1
    },
    description: '+3 str, +2 mana/turn, +3 def, 10% all bonuses'
  },
  STAFF_OF_WISDOM: {
    id: 'staff_of_wisdom',
    name: 'Staff of Wisdom',
    icon: '🪄',
    rarity: 'EPIC',
    slot: 'WEAPON',
    stats: {
      spellPower: 4
    },
    passive: {
      type: 'SPELL_ECHO',
      value: 0.25
    },
    description: '+4 spell power, 25% chance to cast twice'
  }
};

export const EQUIPMENT_SLOTS = ['HEAD', 'NECK', 'BODY', 'HAND', 'RING', 'FEET', 'WEAPON', 'TRINKET'];

export const initializeEquipment = () => ({
  slots: EQUIPMENT_SLOTS.reduce((acc, slot) => ({ ...acc, [slot]: null }), {}),
  inventory: [],
  unlockedItems: ['power_gauntlet', 'swift_boots', 'lucky_charm'], // Starting items
  gold: 100
});

export const unlockEquipment = (equipment, itemId, cost = 0) => {
  if (equipment.unlockedItems.includes(itemId)) {
    return { success: false, message: 'Already unlocked' };
  }
  
  if (equipment.gold < cost) {
    return { success: false, message: 'Not enough gold' };
  }
  
  return {
    success: true,
    equipment: {
      ...equipment,
      unlockedItems: [...equipment.unlockedItems, itemId],
      gold: equipment.gold - cost
    }
  };
};

export const awardEquipmentReward = (equipment, itemId = null, goldAmount = 0) => {
  let updates = { ...equipment, gold: equipment.gold + goldAmount };
  
  if (itemId && !equipment.unlockedItems.includes(itemId)) {
    updates.unlockedItems = [...equipment.unlockedItems, itemId];
  }
  
  return { success: true, equipment: updates, itemUnlocked: itemId, goldEarned: goldAmount };
};

export const equipItem = (equipment, itemId) => {
  const item = EQUIPMENT_ITEMS[itemId];
  if (!item) return { success: false, message: 'Invalid item' };
  
  if (!equipment.unlockedItems.includes(itemId)) {
    return { success: false, message: 'Item not unlocked' };
  }

  const slot = item.slot;
  const previousItem = equipment.slots[slot];

  return {
    success: true,
    equipment: {
      ...equipment,
      slots: {
        ...equipment.slots,
        [slot]: itemId
      }
    },
    unequippedItem: previousItem
  };
};

export const unequipItem = (equipment, slot) => {
  if (!EQUIPMENT_SLOTS.includes(slot)) {
    return { success: false, message: 'Invalid slot' };
  }

  const unequippedItem = equipment.slots[slot];

  return {
    success: true,
    equipment: {
      ...equipment,
      slots: {
        ...equipment.slots,
        [slot]: null
      }
    },
    unequippedItem
  };
};

export const calculateEquipmentStats = (equipment) => {
  const stats = {
    strength: 0,
    defense: 0,
    manaRegen: 0,
    elementalBonus: 0,
    critChance: 0,
    drawSpeed: 0,
    spellPower: 0,
    luck: 0,
    cooldownReduction: 0
  };

  const slots = equipment?.slots || equipment;
  EQUIPMENT_SLOTS.forEach(slot => {
    const itemId = slots[slot];
    if (itemId) {
      const item = EQUIPMENT_ITEMS[itemId];
      if (item && item.stats) {
        Object.keys(item.stats).forEach(stat => {
          if (stats.hasOwnProperty(stat)) {
            stats[stat] += item.stats[stat];
          }
        });
      }
    }
  });

  return stats;
};

export const applyEquipmentEffects = (card, equipment, context = {}) => {
  let modifiedCard = { ...card };
  const stats = calculateEquipmentStats(equipment);

  // Apply basic stat bonuses
  modifiedCard.strength = (modifiedCard.strength || 0) + stats.strength;
  modifiedCard.modifiedStrength = modifiedCard.strength;

  // Apply elemental bonus
  if (stats.elementalBonus > 0 && modifiedCard.elementalBonus) {
    modifiedCard.elementalBonus += stats.elementalBonus;
  }

  // Apply passive effects
  EQUIPMENT_SLOTS.forEach(slot => {
    const itemId = equipment[slot];
    if (itemId) {
      const item = EQUIPMENT_ITEMS[itemId];
      if (item && item.passive) {
        modifiedCard = applyPassiveEffect(modifiedCard, item.passive, context);
      }
    }
  });

  return modifiedCard;
};

const applyPassiveEffect = (card, passive, context) => {
  let modifiedCard = { ...card };

  switch (passive.type) {
    case 'CRIT_DAMAGE':
      if (context.isCritical) {
        modifiedCard.strength = Math.floor((modifiedCard.strength || 0) * passive.value);
      }
      break;
    case 'FIRST_TURN_BONUS':
      if (context.turnNumber === 1) {
        modifiedCard.strength = (modifiedCard.strength || 0) + passive.value;
      }
      break;
    case 'DAMAGE_REFLECT':
      modifiedCard.damageReflect = passive.value;
      break;
  }

  return modifiedCard;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Boosters
  BOOSTERS,
  initializeBoosterSystem,
  activateBooster,
  tickBoosterSystem,
  applyBoosterEffects,
  
  // Ultimates
  ULTIMATE_ABILITIES,
  initializeUltimateSystem,
  tickUltimateCooldown,
  useUltimate,
  
  // Sideboard
  initializeSideboard,
  addToSideboard,
  swapCardFromSideboard,
  
  // Equipment
  EQUIPMENT_ITEMS,
  EQUIPMENT_SLOTS,
  initializeEquipment,
  equipItem,
  unequipItem,
  unlockEquipment,
  awardEquipmentReward,
  calculateEquipmentStats,
  applyEquipmentEffects
};

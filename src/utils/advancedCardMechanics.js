/**
 * Advanced Card & Battle Mechanics
 * Enhanced card systems for deeper strategic gameplay
 */

// ============================================================================
// CARD RARITY SYSTEM
// ============================================================================

export const CARD_RARITY = {
  COMMON: {
    name: 'Common',
    dropRate: 0.6,
    powerMultiplier: 1.0,
    color: '#9e9e9e',
    glow: 'rgba(158, 158, 158, 0.3)',
    border: 2,
    effectChance: 0.1
  },
  RARE: {
    name: 'Rare',
    dropRate: 0.25,
    powerMultiplier: 1.15,
    color: '#2196f3',
    glow: 'rgba(33, 150, 243, 0.6)',
    border: 3,
    effectChance: 0.25,
    bonusAbility: true
  },
  EPIC: {
    name: 'Epic',
    dropRate: 0.12,
    powerMultiplier: 1.3,
    color: '#9c27b0',
    glow: 'rgba(156, 39, 176, 0.8)',
    border: 4,
    effectChance: 0.4,
    bonusAbility: true,
    specialEffect: true
  },
  LEGENDARY: {
    name: 'Legendary',
    dropRate: 0.03,
    powerMultiplier: 1.5,
    color: '#ff9800',
    glow: 'rgba(255, 152, 0, 1)',
    border: 5,
    effectChance: 0.6,
    bonusAbility: true,
    specialEffect: true,
    guaranteed: true
  }
};

export const determineRarity = (baseStrength, forcedRarity = null) => {
  if (forcedRarity) return forcedRarity;
  
  const roll = Math.random();
  let cumulative = 0;
  
  // Higher strength cards more likely to be rare
  const strengthBonus = Math.min(baseStrength / 15, 0.3);
  
  if (roll < CARD_RARITY.LEGENDARY.dropRate + strengthBonus * 0.5) return 'LEGENDARY';
  cumulative += CARD_RARITY.LEGENDARY.dropRate;
  
  if (roll < cumulative + CARD_RARITY.EPIC.dropRate + strengthBonus * 0.3) return 'EPIC';
  cumulative += CARD_RARITY.EPIC.dropRate;
  
  if (roll < cumulative + CARD_RARITY.RARE.dropRate + strengthBonus * 0.2) return 'RARE';
  
  return 'COMMON';
};

export const applyRarityBonus = (card) => {
  const rarity = CARD_RARITY[card.rarity] || CARD_RARITY.COMMON;
  const bonusStrength = Math.floor(card.strength * (rarity.powerMultiplier - 1));
  
  return {
    ...card,
    baseStrength: card.strength,
    strength: card.strength + bonusStrength,
    rarityBonus: bonusStrength,
    rarityData: rarity
  };
};

// ============================================================================
// CARD EVOLUTION SYSTEM
// ============================================================================

export const EVOLUTION_CONDITIONS = {
  PLAY_COUNT: { threshold: 3, type: 'playCount' },
  CONSECUTIVE_WINS: { threshold: 2, type: 'wins' },
  STRENGTH_THRESHOLD: { threshold: 8, type: 'strength' },
  COMBO_CHAIN: { threshold: 3, type: 'combo' },
  DAMAGE_DEALT: { threshold: 20, type: 'damage' },
  SURVIVE_ROUNDS: { threshold: 5, type: 'survival' }
};

export const initializeEvolutionTracker = () => ({
  playCount: {},
  consecutiveWins: {},
  totalDamage: {},
  comboChains: {},
  survivalRounds: {}
});

export const checkEvolution = (card, tracker, gameState) => {
  if (card.evolved || card.evolutionLocked) return null;
  
  const cardKey = `${card.element}_${card.baseStrength || card.strength}`;
  
  // Check various evolution conditions
  const conditions = [
    // Played multiple times
    tracker.playCount[cardKey] >= 3,
    // Won consecutive battles
    tracker.consecutiveWins[cardKey] >= 2,
    // High combo chain
    tracker.comboChains[cardKey] >= 3,
    // Total damage dealt
    tracker.totalDamage[cardKey] >= 20
  ];
  
  const metConditions = conditions.filter(Boolean).length;
  
  // Need at least 2 conditions met for evolution
  if (metConditions >= 2) {
    return {
      canEvolve: true,
      evolution: calculateEvolution(card),
      reason: `Met ${metConditions} evolution conditions`
    };
  }
  
  return null;
};

export const calculateEvolution = (card) => {
  const evolutionBonus = Math.ceil((card.baseStrength || card.strength) * 0.3);
  
  return {
    ...card,
    evolved: true,
    evolutionLevel: (card.evolutionLevel || 0) + 1,
    strength: card.strength + evolutionBonus,
    evolutionBonus,
    visualEffect: 'evolution-glow',
    evolutionTime: Date.now()
  };
};

export const updateEvolutionTracker = (tracker, card, action, value) => {
  const cardKey = `${card.element}_${card.baseStrength || card.strength}`;
  
  switch (action) {
    case 'play':
      tracker.playCount[cardKey] = (tracker.playCount[cardKey] || 0) + 1;
      break;
    case 'win':
      tracker.consecutiveWins[cardKey] = (tracker.consecutiveWins[cardKey] || 0) + 1;
      break;
    case 'lose':
      tracker.consecutiveWins[cardKey] = 0;
      break;
    case 'damage':
      tracker.totalDamage[cardKey] = (tracker.totalDamage[cardKey] || 0) + value;
      break;
    case 'combo':
      tracker.comboChains[cardKey] = value;
      break;
  }
  
  return tracker;
};

// ============================================================================
// ELEMENTAL COMBO SYSTEM
// ============================================================================

export const ELEMENTAL_COMBOS = {
  // Triple element chains
  INFERNO_CHAIN: {
    elements: ['FIRE', 'FIRE', 'FIRE'],
    bonus: 12,
    effect: 'burn',
    description: 'Triple Fire: +12 strength, burn all opponent cards'
  },
  BLIZZARD_CHAIN: {
    elements: ['ICE', 'ICE', 'ICE'],
    bonus: 10,
    effect: 'freeze',
    description: 'Triple Ice: +10 strength, freeze opponent for 2 turns'
  },
  STORM_CHAIN: {
    elements: ['ELECTRICITY', 'WATER', 'ELECTRICITY'],
    bonus: 15,
    effect: 'shock',
    description: 'Storm Combo: +15 strength, shock damage to all cards'
  },
  EARTHQUAKE: {
    elements: ['EARTH', 'EARTH', 'POWER'],
    bonus: 13,
    effect: 'shatter',
    description: 'Earthquake: +13 strength, destroy shields'
  },
  DIVINE_LIGHT: {
    elements: ['LIGHT', 'LIGHT', 'POWER'],
    bonus: 14,
    effect: 'cleanse',
    description: 'Divine Light: +14 strength, remove all debuffs'
  },
  VOID_DARKNESS: {
    elements: ['DARK', 'DARK', 'DARK'],
    bonus: 11,
    effect: 'drain',
    description: 'Void: +11 strength, drain opponent strength'
  },
  
  // Weakness exploitation combos
  FIRE_STORM: {
    elements: ['FIRE', 'ELECTRICITY'],
    bonus: 8,
    effect: 'ignite',
    description: 'Fire Storm: +8 strength vs ICE'
  },
  FROST_LIGHTNING: {
    elements: ['ICE', 'ELECTRICITY'],
    bonus: 8,
    effect: 'paralyze',
    description: 'Frozen Lightning: +8 strength vs WATER'
  },
  NATURE_WATER: {
    elements: ['EARTH', 'WATER'],
    bonus: 7,
    effect: 'growth',
    description: 'Nature Growth: +7 strength, heal'
  }
};

export const detectCombo = (recentCards) => {
  if (!recentCards || recentCards.length < 2) return null;
  
  const lastThree = recentCards.slice(-3).map(c => c.element);
  const lastTwo = recentCards.slice(-2).map(c => c.element);
  
  // Check triple combos first
  for (const [comboName, combo] of Object.entries(ELEMENTAL_COMBOS)) {
    if (combo.elements.length === 3 && arraysEqual(lastThree, combo.elements)) {
      return { name: comboName, ...combo, multiplier: 3 };
    }
  }
  
  // Check double combos
  for (const [comboName, combo] of Object.entries(ELEMENTAL_COMBOS)) {
    if (combo.elements.length === 2 && arraysEqual(lastTwo, combo.elements)) {
      return { name: comboName, ...combo, multiplier: 2 };
    }
  }
  
  return null;
};

const arraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((val, idx) => val === arr2[idx]);
};

export const applyComboEffect = (card, combo, opponent) => {
  let modifiedCard = { ...card, strength: card.strength + combo.bonus };
  let effects = [];
  
  switch (combo.effect) {
    case 'burn':
      effects.push({ type: 'BURN', duration: 3, damage: 2, target: 'opponent_all' });
      break;
    case 'freeze':
      effects.push({ type: 'FREEZE', duration: 2, target: 'opponent' });
      break;
    case 'shock':
      effects.push({ type: 'SHOCK', damage: 3, target: 'opponent_all' });
      break;
    case 'shatter':
      effects.push({ type: 'SHATTER_SHIELDS', target: 'opponent_all' });
      break;
    case 'cleanse':
      effects.push({ type: 'CLEANSE', target: 'player' });
      modifiedCard.strength += 3;
      break;
    case 'drain':
      effects.push({ type: 'DRAIN', amount: 5, target: 'opponent' });
      break;
    case 'paralyze':
      effects.push({ type: 'STUN', duration: 1, target: 'opponent' });
      break;
    case 'growth':
      effects.push({ type: 'HEAL', amount: 5, target: 'player' });
      break;
  }
  
  return { modifiedCard, effects };
};

// ============================================================================
// COUNTER CARDS
// ============================================================================

export const COUNTER_TYPES = {
  REFLECT: {
    name: 'Reflect Counter',
    trigger: 'onAttacked',
    effect: 'reflect_damage',
    power: 0.5,
    description: 'Reflects 50% of damage back to attacker'
  },
  NULLIFY: {
    name: 'Nullify',
    trigger: 'onSpecialAbility',
    effect: 'cancel_ability',
    description: 'Cancels opponent special ability'
  },
  REVENGE: {
    name: 'Revenge Strike',
    trigger: 'onDamaged',
    effect: 'bonus_strength',
    power: 5,
    description: 'Gains +5 strength when damaged'
  },
  BARRIER: {
    name: 'Barrier Counter',
    trigger: 'onTargeted',
    effect: 'shield',
    power: 8,
    description: 'Creates 8 point shield when targeted'
  },
  MIRROR: {
    name: 'Mirror Force',
    trigger: 'onHighStrength',
    threshold: 10,
    effect: 'copy_strength',
    description: 'Copies opponent strength if > 10'
  }
};

export const checkCounterActivation = (counterCard, trigger, context = {}) => {
  if (!counterCard.counterType) return null;
  
  const counter = COUNTER_TYPES[counterCard.counterType];
  if (!counter || counter.trigger !== trigger) return null;
  
  // Check threshold conditions
  if (counter.threshold && context.value < counter.threshold) return null;
  
  return {
    activated: true,
    counter,
    effect: counter.effect,
    power: counter.power,
    description: counter.description
  };
};

export const applyCounterEffect = (counter, target, source) => {
  const effects = [];
  
  switch (counter.effect) {
    case 'reflect_damage':
      const reflectDamage = Math.floor(target.damage * counter.power);
      effects.push({ 
        type: 'DAMAGE', 
        amount: reflectDamage, 
        target: 'opponent',
        message: `Reflected ${reflectDamage} damage!`
      });
      break;
      
    case 'cancel_ability':
      effects.push({ 
        type: 'CANCEL_ABILITY', 
        target: 'opponent',
        message: 'Ability nullified!'
      });
      break;
      
    case 'bonus_strength':
      effects.push({ 
        type: 'STRENGTH_BOOST', 
        amount: counter.power, 
        target: 'self',
        message: `Revenge! +${counter.power} strength!`
      });
      break;
      
    case 'shield':
      effects.push({ 
        type: 'SHIELD', 
        amount: counter.power, 
        target: 'self',
        message: `Barrier activated! ${counter.power} shield!`
      });
      break;
      
    case 'copy_strength':
      effects.push({ 
        type: 'COPY_STRENGTH', 
        target: 'opponent',
        message: 'Mirror Force! Copying strength!'
      });
      break;
  }
  
  return effects;
};

// ============================================================================
// TRAP CARDS
// ============================================================================

export const TRAP_TYPES = {
  EXPLOSIVE: {
    name: 'Explosive Trap',
    activation: 'onPlay',
    damage: 8,
    description: 'Deals 8 damage when opponent plays a card'
  },
  WEAKNESS: {
    name: 'Weakness Trap',
    activation: 'onPlay',
    effect: 'weaken',
    power: -5,
    duration: 2,
    description: 'Weakens opponent cards by -5 for 2 turns'
  },
  STEAL: {
    name: 'Card Steal',
    activation: 'onHighCard',
    threshold: 9,
    description: 'Steals opponent card if strength > 9'
  },
  SWAP: {
    name: 'Position Swap',
    activation: 'onTurnStart',
    description: 'Swaps positions with opponent card'
  },
  DRAIN: {
    name: 'Mana Drain',
    activation: 'onAbility',
    power: 3,
    description: 'Drains 3 mana when opponent uses ability'
  }
};

export const initializeTrapSystem = () => ({
  activeTraps: [],
  triggeredTraps: []
});

export const setTrap = (trapSystem, trapCard, position, owner) => {
  // Determine trap type from card (if card has trap property) or default to EXPLOSIVE
  const trapType = trapCard?.trapType || 'EXPLOSIVE';
  
  const newTrap = {
    id: `trap_${Date.now()}_${Math.random()}`,
    type: trapType,
    owner,
    position,
    hidden: true,
    setTime: Date.now(),
    card: trapCard,
    trapData: TRAP_TYPES[trapType]
  };
  
  return {
    ...trapSystem,
    activeTraps: [...trapSystem.activeTraps, newTrap]
  };
};

export const checkTrapActivation = (trapSystem, trigger, context = {}) => {
  if (!trapSystem || !trapSystem.activeTraps || trapSystem.activeTraps.length === 0) {
    return { activated: false, system: trapSystem, traps: [] };
  }
  
  const activatedTraps = [];
  const remainingTraps = [];
  
  // Normalize trigger to lowercase for comparison
  const normalizedTrigger = trigger.toLowerCase();
  
  for (const trap of trapSystem.activeTraps) {
    const trapData = trap.trapData;
    const trapTrigger = trapData.activation.toLowerCase();
    
    if (trapTrigger === normalizedTrigger) {
      // Check threshold if applicable
      if (trapData.threshold && context.value < trapData.threshold) {
        remainingTraps.push(trap);
        continue;
      }
      
      // Reveal trap and add to activated list
      trap.hidden = false;
      activatedTraps.push(trap);
    } else {
      remainingTraps.push(trap);
    }
  }
  
  // Return updated trap system with activated traps moved to triggered list
  const updatedSystem = {
    activeTraps: remainingTraps,
    triggeredTraps: [...trapSystem.triggeredTraps, ...activatedTraps]
  };
  
  return {
    activated: activatedTraps.length > 0,
    system: updatedSystem,
    traps: activatedTraps,
    trap: activatedTraps[0] // For backward compatibility
  };
};

export const executeTrap = (trap, target) => {
  const trapData = trap.trapData;
  const effects = [];
  
  switch (trap.type) {
    case 'EXPLOSIVE':
      effects.push({
        type: 'DAMAGE',
        amount: trapData.damage,
        target: 'opponent',
        message: `💥 Explosive Trap! ${trapData.damage} damage!`
      });
      break;
      
    case 'WEAKNESS':
      effects.push({
        type: 'DEBUFF',
        debuff: 'WEAKNESS',
        power: trapData.power,
        duration: trapData.duration,
        target: 'opponent',
        message: `🕸️ Weakness Trap activated!`
      });
      break;
      
    case 'STEAL':
      effects.push({
        type: 'STEAL_CARD',
        target: 'opponent',
        message: `🃏 Card stolen by trap!`
      });
      break;
      
    case 'SWAP':
      effects.push({
        type: 'SWAP_POSITIONS',
        message: `🔄 Position Swap activated!`
      });
      break;
      
    case 'DRAIN':
      effects.push({
        type: 'DRAIN_MANA',
        amount: trapData.power,
        target: 'opponent',
        message: `⚡ Mana Drain! -${trapData.power} mana!`
      });
      break;
  }
  
  return { effects, trap };
};

// ============================================================================
// CARD FUSION SYSTEM
// ============================================================================

export const FUSION_RECIPES = {
  ELEMENTAL_TITAN: {
    ingredients: ['FIRE', 'ICE'],
    minStrength: 6,
    result: {
      name: 'Elemental Titan',
      element: 'POWER',
      strengthBonus: 8,
      abilities: ['IMMUNITY', 'DOUBLE_STRIKE'],
      image: 'fire-ice-inferno-card.png'
    }
  },
  STORM_DRAKE: {
    ingredients: ['WATER', 'ELECTRICITY'],
    minStrength: 5,
    result: {
      name: 'Storm Drake',
      element: 'ELECTRICITY',
      strengthBonus: 7,
      abilities: ['FLYING', 'CHAIN_LIGHTNING'],
      image: 'lightning-water-fusion.png'
    }
  },
  SHADOW_PHOENIX: {
    ingredients: ['DARK', 'FIRE'],
    minStrength: 7,
    result: {
      name: 'Shadow Phoenix',
      element: 'DARK',
      strengthBonus: 10,
      abilities: ['REBIRTH', 'BURN']
    }
  },
  CRYSTAL_GUARDIAN: {
    ingredients: ['EARTH', 'LIGHT'],
    minStrength: 6,
    result: {
      name: 'Crystal Guardian',
      element: 'LIGHT',
      strengthBonus: 6,
      abilities: ['SHIELD', 'REGENERATE']
    }
  },
  VOID_DRAGON: {
    ingredients: ['DARK', 'POWER'],
    minStrength: 8,
    result: {
      name: 'Void Dragon',
      element: 'DARK',
      strengthBonus: 12,
      abilities: ['DRAIN', 'IMMUNITY', 'FEAR']
    }
  }
};

export const checkFusionCompatibility = (card1, card2) => {
  if (!card1 || !card2) {
    return { canFuse: false, message: 'Invalid cards' };
  }
  
  for (const [fusionName, recipe] of Object.entries(FUSION_RECIPES)) {
    const elements = [card1.element, card2.element];
    const hasElements = recipe.ingredients.every(ing => elements.includes(ing));
    
    if (hasElements) {
      const totalStrength = (card1.strength || 0) + (card2.strength || 0);
      // Require total strength to meet minimum (not double)
      if (totalStrength >= recipe.minStrength) {
        return { canFuse: true, fusionName, recipe };
      } else {
        return { 
          canFuse: false, 
          message: `Need ${recipe.minStrength} combined strength (currently ${totalStrength})` 
        };
      }
    }
  }
  
  return { canFuse: false, message: 'No compatible fusion recipe found' };
};

export const fuseCards = (card1, card2) => {
  // Check if cards can be fused
  const compatibility = checkFusionCompatibility(card1, card2);
  
  if (!compatibility.canFuse) {
    return { success: false, message: 'Cards cannot be fused together' };
  }
  
  const recipe = compatibility.recipe;
  const totalStrength = (card1.strength || 0) + (card2.strength || 0);
  
  const fusedCard = {
    ...card1,
    name: recipe.result.name,
    element: recipe.result.element,
    strength: totalStrength + recipe.result.strengthBonus,
    baseStrength: totalStrength,
    fusionBonus: recipe.result.strengthBonus,
    abilities: recipe.result.abilities,
    image: recipe.result.image, // Add the custom fusion image
    isFusion: true,
    fusion: true,
    fusedFrom: [card1.element, card2.element],
    rarity: 'LEGENDARY',
    visualEffect: 'fusion-glow'
  };
  
  return { success: true, fusedCard, fusionName: compatibility.fusionName };
};

// ============================================================================
// MULTI-TURN ABILITIES
// ============================================================================

export const PERSISTENT_ABILITIES = {
  AURA_OF_POWER: {
    name: 'Aura of Power',
    duration: 3,
    effect: 'strength_boost',
    power: 2,
    description: '+2 strength to all cards for 3 turns'
  },
  FLAME_BARRIER: {
    name: 'Flame Barrier',
    duration: 4,
    effect: 'burn_damage',
    power: 2,
    description: 'Deal 2 burn damage each turn for 4 turns'
  },
  REGENERATION: {
    name: 'Regeneration',
    duration: 5,
    effect: 'heal',
    power: 3,
    description: 'Heal 3 HP each turn for 5 turns'
  },
  ENERGY_SURGE: {
    name: 'Energy Surge',
    duration: 3,
    effect: 'mana_regen',
    power: 2,
    description: '+2 mana regeneration for 3 turns'
  },
  FORTIFY: {
    name: 'Fortify',
    duration: 4,
    effect: 'shield_generation',
    power: 4,
    description: 'Generate 4 shield each turn for 4 turns'
  },
  CURSE_OF_WEAKNESS: {
    name: 'Curse of Weakness',
    duration: 5,
    effect: 'weaken_opponent',
    power: -3,
    description: 'Opponent cards -3 strength for 5 turns'
  },
  ELEMENTAL_MASTERY: {
    name: 'Elemental Mastery',
    duration: 3,
    effect: 'element_boost',
    power: 4,
    description: 'Boost specific element by +4 for 3 turns'
  }
};

export const initializePersistentAbilities = () => ({
  active: [],
  history: []
});

export const activatePersistentAbility = (abilitySystem, abilityType, owner, options = {}) => {
  // Safety check
  if (!abilitySystem) {
    abilitySystem = initializePersistentAbilities();
  }
  
  const newAbility = {
    id: `ability_${Date.now()}_${Math.random()}`,
    type: abilityType,
    owner,
    data: PERSISTENT_ABILITIES[abilityType],
    remainingTurns: PERSISTENT_ABILITIES[abilityType]?.duration || 3,
    activatedTurn: options.currentTurn || 0,
    targetElement: options.targetElement,
    stackCount: 1
  };
  
  return {
    active: [...abilitySystem.active, newAbility],
    history: abilitySystem.history
  };
};

export const processPersistentAbilities = (abilitySystem, currentTurn) => {
  // Safety check
  if (!abilitySystem || !abilitySystem.active) {
    return { abilities: initializePersistentAbilities(), effects: [] };
  }
  
  const effects = [];
  const expiredAbilities = [];
  
  for (const ability of abilitySystem.active) {
    // Apply effect for this turn
    const abilityEffect = applyPersistentEffect(ability);
    if (abilityEffect) {
      effects.push(abilityEffect);
    }
    
    // Decrease duration
    ability.remainingTurns--;
    
    // Mark expired
    if (ability.remainingTurns <= 0) {
      expiredAbilities.push(ability);
    }
  }
  
  // Remove expired abilities
  abilitySystem.active = abilitySystem.active.filter(
    a => !expiredAbilities.includes(a)
  );
  
  // Add to history
  abilitySystem.history.push(...expiredAbilities);
  
  return { abilities: abilitySystem, effects, expired: expiredAbilities };
};

const applyPersistentEffect = (ability) => {
  const data = ability.data;
  
  switch (data.effect) {
    case 'strength_boost':
      return {
        type: 'PERSISTENT_BUFF',
        stat: 'strength',
        amount: data.power,
        target: ability.owner,
        message: `${data.name}: +${data.power} strength`
      };
      
    case 'burn_damage':
      return {
        type: 'PERSISTENT_DAMAGE',
        damageType: 'BURN',
        amount: data.power,
        target: ability.owner === 'player' ? 'opponent' : 'player',
        message: `${data.name}: ${data.power} burn damage`
      };
      
    case 'heal':
      return {
        type: 'PERSISTENT_HEAL',
        amount: data.power,
        target: ability.owner,
        message: `${data.name}: +${data.power} HP`
      };
      
    case 'mana_regen':
      return {
        type: 'PERSISTENT_MANA',
        amount: data.power,
        target: ability.owner,
        message: `${data.name}: +${data.power} mana`
      };
      
    case 'shield_generation':
      return {
        type: 'PERSISTENT_SHIELD',
        amount: data.power,
        target: ability.owner,
        message: `${data.name}: +${data.power} shield`
      };
      
    case 'weaken_opponent':
      return {
        type: 'PERSISTENT_DEBUFF',
        stat: 'strength',
        amount: data.power,
        target: ability.owner === 'player' ? 'opponent' : 'player',
        message: `${data.name}: ${data.power} strength`
      };
      
    case 'element_boost':
      return {
        type: 'PERSISTENT_ELEMENT_BOOST',
        element: ability.targetElement,
        amount: data.power,
        target: ability.owner,
        message: `${data.name}: +${data.power} to ${ability.targetElement}`
      };
  }
  
  return null;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const generateAdvancedCard = (element, baseStrength, options = {}) => {
  const rarity = determineRarity(baseStrength, options.rarity);
  
  let card = {
    element,
    strength: baseStrength,
    rarity,
    id: `card_${Date.now()}_${Math.random()}`,
    timestamp: Date.now()
  };
  
  // Apply rarity bonuses
  card = applyRarityBonus(card);
  
  // Random chance for counter ability
  if (Math.random() < 0.15 && options.allowCounter) {
    const counterTypes = Object.keys(COUNTER_TYPES);
    card.counterType = counterTypes[Math.floor(Math.random() * counterTypes.length)];
    card.isCounter = true;
  }
  
  // Random chance for persistent ability
  if (Math.random() < 0.1 && options.allowPersistent) {
    const abilityTypes = Object.keys(PERSISTENT_ABILITIES);
    card.persistentAbility = abilityTypes[Math.floor(Math.random() * abilityTypes.length)];
  }
  
  return card;
};

export const calculateFinalStrength = (card, modifiers = {}) => {
  let finalStrength = card.strength;
  
  // Apply evolution bonus
  if (card.evolved && card.evolutionBonus) {
    finalStrength += card.evolutionBonus;
  }
  
  // Apply fusion bonus
  if (card.isFusion && card.fusionBonus) {
    finalStrength += card.fusionBonus;
  }
  
  // Apply rarity bonus
  if (card.rarityBonus) {
    finalStrength += card.rarityBonus;
  }
  
  // Apply temporary modifiers
  if (modifiers.persistent) {
    modifiers.persistent.forEach(effect => {
      if (effect.stat === 'strength') {
        finalStrength += effect.amount;
      }
    });
  }
  
  return Math.max(0, finalStrength);
};

export default {
  // Rarity
  CARD_RARITY,
  determineRarity,
  applyRarityBonus,
  
  // Evolution
  EVOLUTION_CONDITIONS,
  initializeEvolutionTracker,
  checkEvolution,
  calculateEvolution,
  updateEvolutionTracker,
  
  // Combos
  ELEMENTAL_COMBOS,
  detectCombo,
  applyComboEffect,
  
  // Counters
  COUNTER_TYPES,
  checkCounterActivation,
  applyCounterEffect,
  
  // Traps
  TRAP_TYPES,
  initializeTrapSystem,
  setTrap,
  checkTrapActivation,
  executeTrap,
  
  // Fusion
  FUSION_RECIPES,
  checkFusionCompatibility,
  fuseCards,
  
  // Persistent Abilities
  PERSISTENT_ABILITIES,
  initializePersistentAbilities,
  activatePersistentAbility,
  processPersistentAbilities,
  
  // Helpers
  generateAdvancedCard,
  calculateFinalStrength
};

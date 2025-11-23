// Strategic Depth Systems
// Mana, Draft Mode, Deck Building, Positioning, Weather, Terrain

// ===== MANA SYSTEM =====
export const MANA_CONFIG = {
  MAX_MANA: 10,
  STARTING_MANA: 3,
  MANA_PER_TURN: 1,
  MANA_REGEN_CAP: 10,
  SURGE_CHANCE: 0.15, // 15% chance per turn
  SURGE_AMOUNT: 2, // +2 extra mana on surge
  OVERDRAFT_PENALTY: 2, // Lose 2 mana next turn
  COMBO_THRESHOLD: 3, // 3+ card combos grant bonus mana
  COMBO_MANA_BONUS: 1, // +1 mana for combos
  LOW_MANA_THRESHOLD: 2, // Below this triggers faster regen
  EMERGENCY_REGEN: 2 // +1 extra when below threshold
};

export const calculateCardManaCost = (card) => {
  const power = card?.modifiedStrength || card?.strength || 0;
  
  // Mana cost formula: roughly half the power, minimum 1
  if (power <= 2) return 1;
  if (power <= 4) return 2;
  if (power <= 6) return 3;
  if (power <= 8) return 4;
  if (power <= 10) return 5;
  return 6; // Legendary cards
};

export const canAffordCard = (manaState, card) => {
  const cost = calculateCardManaCost(card);
  return manaState.current >= cost;
};

export const canOverdraftCard = (manaState, card) => {
  const cost = calculateCardManaCost(card);
  // Can overdraft if within 2 mana of cost
  return cost > manaState.current && manaState.current + 2 >= cost && !manaState.overdrafted;
};

export const initializeMana = () => ({
  current: MANA_CONFIG.STARTING_MANA,
  max: MANA_CONFIG.MAX_MANA,
  regenRate: MANA_CONFIG.MANA_PER_TURN,
  lastRegenAmount: MANA_CONFIG.MANA_PER_TURN,
  surgeActive: false,
  emergencyRegen: false,
  overdrafted: false,
  lastOverdraft: 0,
  lastComboBonus: 0
});

export const regenerateMana = (manaState) => {
  let regenAmount = manaState.regenRate;
  let surgeTriggered = false;
  let emergencyRegen = false;
  
  // Emergency regen when low on mana
  if (manaState.current <= MANA_CONFIG.LOW_MANA_THRESHOLD) {
    regenAmount += 1;
    emergencyRegen = true;
  }
  
  // Overdraft penalty - skip regen if overdrafted
  if (manaState.overdrafted) {
    return { 
      ...manaState, 
      overdrafted: false,
      lastRegenAmount: 0,
      surgeActive: false,
      emergencyRegen: false
    };
  }
  
  // Random mana surge (15% chance)
  if (Math.random() < MANA_CONFIG.SURGE_CHANCE) {
    regenAmount += MANA_CONFIG.SURGE_AMOUNT;
    surgeTriggered = true;
  }
  
  const newCurrent = Math.min(
    manaState.current + regenAmount,
    manaState.max
  );
  
  return { 
    ...manaState, 
    current: newCurrent,
    lastRegenAmount: regenAmount,
    surgeActive: surgeTriggered,
    emergencyRegen: emergencyRegen
  };
};

export const spendMana = (manaState, amount) => {
  return {
    ...manaState,
    current: Math.max(0, manaState.current - amount)
  };
};

export const awardComboMana = (manaState, comboCount) => {
  if (comboCount >= MANA_CONFIG.COMBO_THRESHOLD) {
    const newCurrent = Math.min(
      manaState.current + MANA_CONFIG.COMBO_MANA_BONUS,
      manaState.max
    );
    return {
      ...manaState,
      current: newCurrent,
      lastComboBonus: MANA_CONFIG.COMBO_MANA_BONUS
    };
  }
  return manaState;
};

export const allowOverdraft = (manaState, cardCost) => {
  // Allow playing cards even with insufficient mana, but apply penalty
  if (cardCost > manaState.current && manaState.current + 2 >= cardCost) {
    return {
      ...manaState,
      current: 0,
      overdrafted: true, // Will skip next regen
      lastOverdraft: cardCost - manaState.current
    };
  }
  return null; // Can't overdraft
};

// ===== CARD DRAFT MODE =====
export const DRAFT_CONFIG = {
  CARDS_PER_PICK: 3,
  TOTAL_PICKS: 10,
  PICK_TIME_LIMIT: 30 // seconds
};

export const generateDraftPool = (allCards, count = 3) => {
  const shuffled = [...allCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const initializeDraftState = () => ({
  currentPick: 0,
  totalPicks: DRAFT_CONFIG.TOTAL_PICKS,
  draftedCards: [],
  currentPool: [],
  timeRemaining: DRAFT_CONFIG.PICK_TIME_LIMIT,
  isDraftComplete: false
});

// ===== DECK BUILDING =====
export const DECK_CONFIG = {
  MIN_DECK_SIZE: 10,
  MAX_DECK_SIZE: 30,
  RECOMMENDED_SIZE: 20,
  MAX_COPIES_PER_CARD: 3
};

export const validateDeck = (deck) => {
  const errors = [];
  
  if (deck.length < DECK_CONFIG.MIN_DECK_SIZE) {
    errors.push(`Deck must have at least ${DECK_CONFIG.MIN_DECK_SIZE} cards`);
  }
  
  if (deck.length > DECK_CONFIG.MAX_DECK_SIZE) {
    errors.push(`Deck cannot exceed ${DECK_CONFIG.MAX_DECK_SIZE} cards`);
  }
  
  // Check for too many copies
  const cardCounts = {};
  deck.forEach(card => {
    const key = `${card.element}_${card.strength}`;
    cardCounts[key] = (cardCounts[key] || 0) + 1;
  });
  
  Object.entries(cardCounts).forEach(([key, count]) => {
    if (count > DECK_CONFIG.MAX_COPIES_PER_CARD) {
      errors.push(`Too many copies of ${key} (max ${DECK_CONFIG.MAX_COPIES_PER_CARD})`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const getElementDistribution = (deck) => {
  const distribution = {};
  deck.forEach(card => {
    distribution[card.element] = (distribution[card.element] || 0) + 1;
  });
  return distribution;
};

export const getDeckStats = (deck) => {
  const totalPower = deck.reduce((sum, card) => sum + (card.strength || 0), 0);
  const avgPower = deck.length > 0 ? (totalPower / deck.length).toFixed(1) : 0;
  const elements = getElementDistribution(deck);
  
  return {
    size: deck.length,
    totalPower,
    avgPower,
    elements,
    manaCurve: calculateManaCurve(deck)
  };
};

export const calculateManaCurve = (deck) => {
  const curve = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, '6+': 0 };
  
  deck.forEach(card => {
    const cost = calculateCardManaCost(card);
    if (cost >= 6) {
      curve['6+']++;
    } else {
      curve[cost]++;
    }
  });
  
  return curve;
};

// ===== CARD POSITIONING SYSTEM =====
export const POSITION_CONFIG = {
  FRONT_ROW: 'front',
  BACK_ROW: 'back'
};

export const getPositionBonus = (card, position) => {
  const power = card?.strength || 0;
  
  // Front row: bonus for low-mid power cards (tanks)
  if (position === POSITION_CONFIG.FRONT_ROW) {
    if (power <= 4) return { strength: 2, description: 'Front Line Defender' };
    if (power <= 6) return { strength: 1, description: 'Front Line' };
  }
  
  // Back row: bonus for high power cards (damage dealers)
  if (position === POSITION_CONFIG.BACK_ROW) {
    if (power >= 8) return { strength: 2, description: 'Back Line Sniper' };
    if (power >= 6) return { strength: 1, description: 'Back Line Support' };
  }
  
  return { strength: 0, description: '' };
};

export const initializePositioning = () => ({
  frontRow: [],
  backRow: [],
  maxPerRow: 5
});

// ===== WEATHER EFFECTS =====
export const WEATHER_TYPES = {
  CLEAR: {
    name: 'Clear',
    icon: '☀️',
    description: 'No special effects',
    modifiers: {}
  },
  RAIN: {
    name: 'Rain',
    icon: '🌧️',
    description: 'Water +2, Fire -1',
    modifiers: {
      WATER: 2,
      FIRE: -1
    }
  },
  STORM: {
    name: 'Storm',
    icon: '⛈️',
    description: 'Lightning +3, Water +1',
    modifiers: {
      LIGHTNING: 3,
      WATER: 1
    }
  },
  DROUGHT: {
    name: 'Drought',
    icon: '🌵',
    description: 'Fire +2, Earth +1, Water -2',
    modifiers: {
      FIRE: 2,
      EARTH: 1,
      WATER: -2
    }
  },
  BLIZZARD: {
    name: 'Blizzard',
    icon: '❄️',
    description: 'Ice +3, Fire -2',
    modifiers: {
      ICE: 3,
      FIRE: -2
    }
  },
  WINDSTORM: {
    name: 'Windstorm',
    icon: '💨',
    description: 'Air +2, Earth -1',
    modifiers: {
      AIR: 2,
      EARTH: -1
    }
  },
  FOG: {
    name: 'Fog',
    icon: '🌫️',
    description: 'All cards -1 strength',
    modifiers: {
      WATER: -1,
      FIRE: -1,
      EARTH: -1,
      AIR: -1,
      ICE: -1,
      LIGHTNING: -1,
      LIGHT: -1,
      DARK: -1
    }
  },
  ECLIPSE: {
    name: 'Eclipse',
    icon: '🌑',
    description: 'Dark +3, Light -2',
    modifiers: {
      DARK: 3,
      LIGHT: -2
    }
  }
};

export const getRandomWeather = () => {
  const weatherKeys = Object.keys(WEATHER_TYPES);
  const randomKey = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
  return WEATHER_TYPES[randomKey];
};

export const applyWeatherModifier = (card, currentWeather) => {
  if (!currentWeather || !currentWeather.modifiers) return 0;
  return currentWeather.modifiers[card.element] || 0;
};

export const initializeWeather = () => ({
  current: WEATHER_TYPES.CLEAR,
  roundsUntilChange: 3,
  history: []
});

export const updateWeather = (weatherState) => {
  const newRoundsUntilChange = weatherState.roundsUntilChange - 1;
  
  if (newRoundsUntilChange <= 0) {
    const newWeather = getRandomWeather();
    return {
      current: newWeather,
      roundsUntilChange: Math.floor(Math.random() * 3) + 2, // 2-4 rounds
      history: [...weatherState.history, weatherState.current]
    };
  }
  
  return {
    ...weatherState,
    roundsUntilChange: newRoundsUntilChange
  };
};

// ===== TERRAIN ADVANTAGES =====
export const TERRAIN_TYPES = {
  VOLCANO: {
    name: 'Volcano',
    icon: '🌋',
    description: 'Fire cards +2 strength',
    bonusElement: 'FIRE',
    bonus: 2,
    background: 'linear-gradient(135deg, #ff5722 0%, #d84315 100%)'
  },
  OCEAN: {
    name: 'Ocean',
    icon: '🌊',
    description: 'Water cards +2 strength',
    bonusElement: 'WATER',
    bonus: 2,
    background: 'linear-gradient(135deg, #2196f3 0%, #1565c0 100%)'
  },
  FOREST: {
    name: 'Forest',
    icon: '🌲',
    description: 'Earth cards +2 strength',
    bonusElement: 'EARTH',
    bonus: 2,
    background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)'
  },
  MOUNTAIN_PEAK: {
    name: 'Mountain Peak',
    icon: '⛰️',
    description: 'Air cards +2 strength',
    bonusElement: 'AIR',
    bonus: 2,
    background: 'linear-gradient(135deg, #90a4ae 0%, #546e7a 100%)'
  },
  GLACIER: {
    name: 'Glacier',
    icon: '🏔️',
    description: 'Ice cards +2 strength',
    bonusElement: 'ICE',
    bonus: 2,
    background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)'
  },
  THUNDERPLAINS: {
    name: 'Thunder Plains',
    icon: '⚡',
    description: 'Lightning cards +2 strength',
    bonusElement: 'LIGHTNING',
    bonus: 2,
    background: 'linear-gradient(135deg, #ffeb3b 0%, #f57f17 100%)'
  },
  SHADOWREALM: {
    name: 'Shadow Realm',
    icon: '🌌',
    description: 'Dark cards +2 strength',
    bonusElement: 'DARK',
    bonus: 2,
    background: 'linear-gradient(135deg, #4a148c 0%, #1a237e 100%)'
  },
  SANCTUARY: {
    name: 'Sanctuary',
    icon: '✨',
    description: 'Light cards +2 strength',
    bonusElement: 'LIGHT',
    bonus: 2,
    background: 'linear-gradient(135deg, #fff9c4 0%, #fbc02d 100%)'
  },
  NEUTRAL: {
    name: 'Neutral Arena',
    icon: '⚔️',
    description: 'No terrain bonuses',
    bonusElement: null,
    bonus: 0,
    background: 'linear-gradient(135deg, #424242 0%, #212121 100%)'
  }
};

export const getRandomTerrain = () => {
  const terrainKeys = Object.keys(TERRAIN_TYPES);
  const randomKey = terrainKeys[Math.floor(Math.random() * terrainKeys.length)];
  return TERRAIN_TYPES[randomKey];
};

export const applyTerrainBonus = (card, currentTerrain) => {
  if (!currentTerrain || !currentTerrain.bonusElement) return 0;
  return card.element === currentTerrain.bonusElement ? currentTerrain.bonus : 0;
};

export const initializeTerrain = () => ({
  current: TERRAIN_TYPES.NEUTRAL,
  isLocked: false // Can be changed between matches
});

// ===== COMBINED MODIFIERS =====
export const calculateTotalModifiers = (card, manaState, position, weather, terrain) => {
  let totalBonus = 0;
  const modifiers = [];
  
  // Position bonus
  const posBonus = getPositionBonus(card, position);
  if (posBonus.strength > 0) {
    totalBonus += posBonus.strength;
    modifiers.push({ type: 'Position', value: posBonus.strength, description: posBonus.description });
  }
  
  // Weather modifier
  const weatherMod = applyWeatherModifier(card, weather);
  if (weatherMod !== 0) {
    totalBonus += weatherMod;
    modifiers.push({ type: 'Weather', value: weatherMod, description: weather.name });
  }
  
  // Terrain bonus
  const terrainBonus = applyTerrainBonus(card, terrain);
  if (terrainBonus > 0) {
    totalBonus += terrainBonus;
    modifiers.push({ type: 'Terrain', value: terrainBonus, description: terrain.name });
  }
  
  return { totalBonus, modifiers };
};

// ===== GAME MODE HELPERS =====
export const GAME_MODES = {
  STANDARD: 'standard',
  DRAFT: 'draft',
  CUSTOM_DECK: 'customDeck',
  STRATEGIC: 'strategic' // All systems enabled
};

export const initializeGameMode = (mode) => {
  const baseState = {
    mode,
    manaEnabled: false,
    draftEnabled: false,
    deckBuildingEnabled: false,
    positioningEnabled: false,
    weatherEnabled: false,
    terrainEnabled: false
  };
  
  switch (mode) {
    case GAME_MODES.DRAFT:
      return {
        ...baseState,
        draftEnabled: true,
        manaEnabled: true
      };
    case GAME_MODES.CUSTOM_DECK:
      return {
        ...baseState,
        deckBuildingEnabled: true,
        manaEnabled: true
      };
    case GAME_MODES.STRATEGIC:
      return {
        ...baseState,
        manaEnabled: true,
        positioningEnabled: true,
        weatherEnabled: true,
        terrainEnabled: true
      };
    default: // STANDARD
      return baseState;
  }
};

// Save/Load deck to localStorage
export const saveDeck = (deckName, deck) => {
  try {
    const decks = JSON.parse(localStorage.getItem('playerDecks') || '{}');
    decks[deckName] = {
      cards: deck,
      lastModified: new Date().toISOString(),
      stats: getDeckStats(deck)
    };
    localStorage.setItem('playerDecks', JSON.stringify(decks));
    return true;
  } catch (error) {
    console.error('Error saving deck:', error);
    return false;
  }
};

export const loadDeck = (deckName) => {
  try {
    const decks = JSON.parse(localStorage.getItem('playerDecks') || '{}');
    return decks[deckName]?.cards || null;
  } catch (error) {
    console.error('Error loading deck:', error);
    return null;
  }
};

export const getAllDecks = () => {
  try {
    return JSON.parse(localStorage.getItem('playerDecks') || '{}');
  } catch (error) {
    console.error('Error loading decks:', error);
    return {};
  }
};

export const deleteDeck = (deckName) => {
  try {
    const decks = JSON.parse(localStorage.getItem('playerDecks') || '{}');
    delete decks[deckName];
    localStorage.setItem('playerDecks', JSON.stringify(decks));
    return true;
  } catch (error) {
    console.error('Error deleting deck:', error);
    return false;
  }
};

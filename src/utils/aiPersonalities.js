// AI Opponent Personalities with unique strategies

export const AI_PERSONALITIES = {
  EMBER: {
    name: 'Ember the Firestarter',
    avatar: '🔥',
    difficulty: 'Easy',
    element: 'FIRE',
    description: 'A hot-headed warrior who loves aggressive plays',
    strategy: {
      preferredElements: ['FIRE', 'EARTH', 'POWER'],
      aggressiveness: 0.8, // High chance to play strongest cards
      conservativeness: 0.2,
      abilityUsage: 0.6,
      counterPriority: 0.4
    },
    quotes: {
      start: "Let's heat things up!",
      win: "Burned to a crisp!",
      lose: "My flames... extinguished...",
      taunt: "Feel the burn!"
    }
  },
  
  FROST: {
    name: 'Frost the Frozen',
    avatar: '❄️',
    difficulty: 'Medium',
    element: 'ICE',
    description: 'A calculated strategist who freezes opponents in their tracks',
    strategy: {
      preferredElements: ['ICE', 'WATER', 'NEUTRAL'],
      aggressiveness: 0.3,
      conservativeness: 0.7, // Saves strong cards
      abilityUsage: 0.8, // Loves using freeze ability
      counterPriority: 0.7
    },
    quotes: {
      start: "Winter is coming...",
      win: "Frozen solid!",
      lose: "The ice... melts...",
      taunt: "Chill out!"
    }
  },
  
  AQUA: {
    name: 'Aqua the Tidekeeper',
    avatar: '💧',
    difficulty: 'Medium',
    element: 'WATER',
    description: 'A flowing fighter who adapts to any situation',
    strategy: {
      preferredElements: ['WATER', 'ICE', 'NEUTRAL'],
      aggressiveness: 0.5,
      conservativeness: 0.5,
      abilityUsage: 0.7,
      counterPriority: 0.6,
      adaptive: true // Changes strategy based on opponent
    },
    quotes: {
      start: "Go with the flow...",
      win: "Washed away!",
      lose: "The tide turns...",
      taunt: "Ride the wave!"
    }
  },
  
  VOLT: {
    name: 'Volt the Electrifier',
    avatar: '⚡',
    difficulty: 'Hard',
    element: 'ELECTRICITY',
    description: 'A shocking speedster with lightning-fast combos',
    strategy: {
      preferredElements: ['ELECTRICITY', 'LIGHT', 'POWER'],
      aggressiveness: 0.7,
      conservativeness: 0.4,
      abilityUsage: 0.9, // Loves chain attacks
      counterPriority: 0.8,
      comboFocus: true // Prioritizes element chains
    },
    quotes: {
      start: "Let's spark things up!",
      win: "Electrifying victory!",
      lose: "Circuit... overloaded...",
      taunt: "Shocking, isn't it?"
    }
  },
  
  TERRA: {
    name: 'Terra the Earthshaker',
    avatar: '🌍',
    difficulty: 'Hard',
    element: 'EARTH',
    description: 'A defensive powerhouse who wears opponents down',
    strategy: {
      preferredElements: ['EARTH', 'FIRE', 'DARK', 'METEOR'],
      aggressiveness: 0.4,
      conservativeness: 0.8,
      abilityUsage: 0.5,
      counterPriority: 0.9, // Master of counters
      defensive: true
    },
    quotes: {
      start: "Solid as a rock!",
      win: "Earth prevails!",
      lose: "Crumbled to dust...",
      taunt: "Unshakeable!"
    }
  },
  
  LUMINA: {
    name: 'Lumina the Radiant',
    avatar: '☀️',
    difficulty: 'Expert',
    element: 'LIGHT',
    description: 'A brilliant tactician with divine powers',
    strategy: {
      preferredElements: ['LIGHT', 'POWER', 'ELECTRICITY'],
      aggressiveness: 0.6,
      conservativeness: 0.6,
      abilityUsage: 0.7,
      counterPriority: 0.8,
      perfectPlay: true // Calculates optimal moves
    },
    quotes: {
      start: "Let there be light!",
      win: "Illuminated to victory!",
      lose: "The light... fades...",
      taunt: "Blinded by brilliance!"
    }
  },
  
  SHADOW: {
    name: 'Shadow the Voidwalker',
    avatar: '🌙',
    difficulty: 'Expert',
    element: 'DARK',
    description: 'A mysterious fighter who exploits weaknesses',
    strategy: {
      preferredElements: ['DARK', 'POWER', 'NEUTRAL'],
      aggressiveness: 0.5,
      conservativeness: 0.7,
      abilityUsage: 0.8,
      counterPriority: 0.9,
      exploitative: true, // Targets player weaknesses
      unpredictable: true
    },
    quotes: {
      start: "Embrace the darkness...",
      win: "Consumed by shadow!",
      lose: "Light... prevails...",
      taunt: "Fear the void!"
    }
  },
  
  NEXUS: {
    name: 'Nexus the Omnipotent',
    avatar: '⭐',
    difficulty: 'Master',
    element: 'POWER',
    description: 'The ultimate champion who masters all elements',
    strategy: {
      preferredElements: ['POWER', 'LEGENDARY'],
      aggressiveness: 0.7,
      conservativeness: 0.7,
      abilityUsage: 0.9,
      counterPriority: 1.0,
      perfectPlay: true,
      adaptive: true,
      comboFocus: true,
      exploitative: true
    },
    quotes: {
      start: "Witness true power!",
      win: "Inevitable victory!",
      lose: "Impossible... defeated...",
      taunt: "Is that all you've got?"
    },
    isBoss: true
  },
  
  CHAOS: {
    name: 'Chaos the Unpredictable',
    avatar: '🔮',
    difficulty: 'Master',
    element: 'NEUTRAL',
    description: 'An erratic wildcard who defies all logic',
    strategy: {
      preferredElements: ['NEUTRAL', 'random', 'METEOR'],
      aggressiveness: 0.5,
      conservativeness: 0.5,
      abilityUsage: 0.5,
      counterPriority: 0.5,
      random: true, // Completely random plays
      unpredictable: true
    },
    quotes: {
      start: "Let chaos reign!",
      win: "Randomness prevails!",
      lose: "Order restored...",
      taunt: "Expect the unexpected!"
    },
    isBoss: true
  }
};

export const STORY_MODE_CAMPAIGN = [
  {
    stage: 1,
    name: 'Trial of Fire',
    opponent: 'EMBER',
    description: 'Face Ember in the volcanic arena to prove your worth',
    reward: 'Unlock: Fire Mastery Badge'
  },
  {
    stage: 2,
    name: 'Frozen Fortress',
    opponent: 'FROST',
    description: 'Battle Frost in the icy tundra to break the freeze',
    reward: 'Unlock: Ice Mastery Badge'
  },
  {
    stage: 3,
    name: 'Tidal Challenge',
    opponent: 'AQUA',
    description: 'Defeat Aqua in the ocean depths to master the flow',
    reward: 'Unlock: Water Mastery Badge'
  },
  {
    stage: 4,
    name: 'Lightning Storm',
    opponent: 'VOLT',
    description: 'Survive Volt\'s shocking assault in the thunderdome',
    reward: 'Unlock: Electricity Mastery Badge'
  },
  {
    stage: 5,
    name: 'Earthquake Arena',
    opponent: 'TERRA',
    description: 'Shake Terra\'s foundation in the mountain stronghold',
    reward: 'Unlock: Earth Mastery Badge'
  },
  {
    stage: 6,
    name: 'Radiant Temple',
    opponent: 'LUMINA',
    description: 'Challenge Lumina in the celestial sanctuary',
    reward: 'Unlock: Light Mastery Badge'
  },
  {
    stage: 7,
    name: 'Void Dimension',
    opponent: 'SHADOW',
    description: 'Confront Shadow in the realm of darkness',
    reward: 'Unlock: Dark Mastery Badge'
  },
  {
    stage: 8,
    name: 'BOSS: Power Nexus',
    opponent: 'NEXUS',
    description: 'Face the ultimate champion in the Grand Arena',
    reward: 'Unlock: Master Champion Title',
    isBoss: true
  },
  {
    stage: 9,
    name: 'FINAL BOSS: Chaos Unleashed',
    opponent: 'CHAOS',
    description: 'Battle the embodiment of chaos itself',
    reward: 'Complete Story Mode - Unlock All',
    isBoss: true,
    finalBoss: true
  }
];

export function getAIStrategy(personalityKey, gameState, playerHistory) {
  const personality = AI_PERSONALITIES[personalityKey];
  if (!personality) return null;

  const strategy = { ...personality.strategy };

  // Adaptive AI adjusts based on player behavior
  if (strategy.adaptive && playerHistory) {
    const playerAvgStrength = playerHistory.avgStrength || 5;
    const playerElementPreference = playerHistory.mostUsedElement;
    
    // Adjust aggressiveness based on player strength
    if (playerAvgStrength > 8) {
      strategy.aggressiveness = Math.min(1.0, strategy.aggressiveness + 0.2);
    }
    
    // Counter player's favorite element
    if (playerElementPreference) {
      strategy.targetElement = playerElementPreference;
    }
  }

  // Exploitative AI targets weaknesses
  if (strategy.exploitative && gameState) {
    const playerScore = gameState.players?.find(p => !p.isAI)?.score || 0;
    const aiScore = gameState.players?.find(p => p.isAI)?.score || 0;
    
    // More aggressive when winning
    if (aiScore > playerScore) {
      strategy.aggressiveness = Math.min(1.0, strategy.aggressiveness + 0.1);
    }
  }

  return strategy;
}

export function selectAICard(hand, strategy, opponentLastCard, gameState) {
  if (!hand || hand.length === 0) return 0;

  // Random AI
  if (strategy.random) {
    return Math.floor(Math.random() * hand.length);
  }

  let scores = hand.map((card, index) => {
    let score = card.strength;

    // Preferred elements
    if (strategy.preferredElements?.includes(card.element)) {
      score += 3;
    }

    // Counter priority
    if (strategy.counterPriority && opponentLastCard) {
      const counters = gameState?.elementCounters || {};
      if (counters[card.element]?.includes(opponentLastCard.element)) {
        score += strategy.counterPriority * 5;
      }
    }

    // Combo focus
    if (strategy.comboFocus && gameState?.players) {
      const aiPlayer = gameState.players.find(p => p.isAI);
      if (aiPlayer?.lastPlayedElement === card.element) {
        score += 4; // Evolution bonus
      }
    }

    // Legendary priority
    if (card.tier === 'LEGENDARY') {
      score += strategy.aggressiveness * 5;
    }

    return { index, score };
  });

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  // Aggressiveness determines if we play best card
  if (Math.random() < strategy.aggressiveness) {
    return scores[0].index; // Play highest scored card
  }

  // Conservativeness: play lower-medium strength
  if (Math.random() < strategy.conservativeness) {
    const midRange = scores.slice(Math.floor(scores.length / 3), Math.floor(scores.length * 2 / 3));
    if (midRange.length > 0) {
      return midRange[Math.floor(Math.random() * midRange.length)].index;
    }
  }

  // Default: somewhat random from top half
  const topHalf = scores.slice(0, Math.ceil(scores.length / 2));
  return topHalf[Math.floor(Math.random() * topHalf.length)].index;
}

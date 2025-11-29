// AI Opponent Personalities with unique strategies

export const AI_PERSONALITIES = {
  DONOVAN_RAGE: {
    name: 'Donovan Rage',
    avatar: '😡',
    avatarImage: 'rage-avatar.png',
    cardImage: 'rage-cards.png',
    difficulty: 'Easy',
    element: 'FIRE',
    description: 'A furious warrior consumed by uncontrollable rage',
    strategy: {
      preferredElements: ['FIRE', 'POWER', 'DARK'],
      aggressiveness: 0.9, // Extremely aggressive
      conservativeness: 0.1,
      abilityUsage: 0.7,
      counterPriority: 0.3
    },
    quotes: {
      start: "FACE MY WRATH!",
      win: "CRUSHED BY RAGE!",
      lose: "My fury... fading...",
      taunt: "YOU WILL SUFFER!"
    }
  },
  
  EMBER: {
    name: 'Ember the Firestarter',
    avatar: '🔥',
    avatarImage: 'ember-the-firestarter-avatar.png',
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
    avatarImage: 'frost-the-frozen-avatar.png',
    cardImage: 'frost-the-frozen-card-back.png',
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
    avatarImage: 'water-avatar.png',
    cardImage: 'aqua-th-tidekeeper-card-back.png',
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
    avatarImage: 'vol- the-electrifier-avatar.png',
    cardBackImage: 'volt- the-electrifier-card-back.png',
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
    avatarImage: 'terra-the-earthshaker-avatar.png',
    cardBackImage: 'earth-card-back.png',
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
    avatarImage: 'lumina-the-radiant-avatar.png',
    cardBackImage: 'lumina-the-radiant-card-back.png',
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
    avatarImage: 'void-walker-avatar.png',
    cardBackImage: 'void-walker-card-back.png',
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
  
  SHADOW_NINJA: {
    name: 'Shadow Ninja',
    avatar: '🥷',
    avatarImage: 'ninja-avatar.png',
    cardBackImage: 'shadow-ninja-card-back.png',
    difficulty: 'Expert',
    element: 'DARK',
    description: 'A silent assassin who strikes from the shadows with lethal precision',
    strategy: {
      preferredElements: ['DARK', 'ELECTRICITY', 'NEUTRAL'],
      aggressiveness: 0.8,
      conservativeness: 0.5,
      abilityUsage: 0.9,
      counterPriority: 0.85,
      exploitative: true,
      unpredictable: true,
      comboFocus: true // Masters swift combo strikes
    },
    quotes: {
      start: "Silent death awaits...",
      win: "The shadows claimed another...",
      lose: "Vanished... into the void...",
      taunt: "You cannot strike what you cannot see!"
    },
    specialCards: ['WIND_STORM'], // Exclusive epic card
    hasWindStorm: true
  },
  
  BLOOD_KNIGHT: {
    name: 'Blood Knight',
    avatar: '⚔️',
    avatarImage: 'blood-avatar.png',
    cardBackImage: 'blood-knight-card-back.png',
    difficulty: 'Master',
    element: 'FIRE',
    description: 'A ruthless warrior who grows stronger with every drop of blood spilled',
    strategy: {
      preferredElements: ['FIRE', 'DARK', 'POWER', 'METEOR'],
      aggressiveness: 0.95,
      conservativeness: 0.2,
      abilityUsage: 0.85,
      counterPriority: 0.75,
      perfectPlay: true,
      adaptive: true,
      bloodlust: true // Gets more aggressive as battle progresses
    },
    quotes: {
      start: "Blood and steel! CHARGE!",
      win: "Baptized in BLOOD!",
      lose: "My blade... grows cold...",
      taunt: "I FEAST ON YOUR WEAKNESS!"
    },
    isBoss: true
  },
  
  NEXUS: {
    name: 'Nexus the Omnipotent',
    avatar: '⭐',
    avatarImage: 'power-nexus--avatar.png',
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
    avatarImage: 'chaos-the-unpredictable-avatar.png',
    difficulty: 'Master',
    element: 'NEUTRAL',
    description: 'An erratic wildcard who defies all logic',
    strategy: {
      preferredElements: ['NEUTRAL', 'random', 'METEOR', 'DARK'],
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
    isBoss: true,
    specialCards: ['BLACKHOLE'], // Exclusive legendary card
    hasBlackhole: true
  }
};

export const STORY_MODE_CAMPAIGN = [
  {
    stage: 1,
    name: 'Trial of Rage',
    opponent: 'DONOVAN_RAGE',
    description: 'Face Donovan Rage in the volcanic arena and survive his fury',
    reward: 'Unlock: Rage Mastery Badge',
    levelImage: 'trial-of-rage.png'
  },
  {
    stage: 2,
    name: 'Frozen Fortress',
    opponent: 'FROST',
    description: 'Battle Frost in the icy tundra to break the freeze',
    reward: 'Unlock: Ice Mastery Badge',
    levelImage: 'frozen-fortress.png'
  },
  {
    stage: 3,
    name: 'Tidal Challenge',
    opponent: 'AQUA',
    description: 'Defeat Aqua in the ocean depths to master the flow',
    reward: 'Unlock: Water Mastery Badge',
    levelImage: 'aqua-the-tidekeeper-level.png'
  },
  {
    stage: 4,
    name: 'Lightning Storm',
    opponent: 'VOLT',
    description: 'Survive Volt\'s shocking assault in the thunderdome',
    reward: 'Unlock: Electricity Mastery Badge',
    levelImage: 'lightning-storm.png'
  },
  {
    stage: 5,
    name: 'Earthquake Arena',
    opponent: 'TERRA',
    description: 'Shake Terra\'s foundation in the mountain stronghold',
    reward: 'Unlock: Earth Mastery Badge',
    levelImage: 'earthquake-arena-level.png'
  },
  {
    stage: 6,
    name: 'Radiant Temple',
    opponent: 'LUMINA',
    description: 'Challenge Lumina in the celestial sanctuary',
    reward: 'Unlock: Light Mastery Badge',
    levelImage: 'mech3.png'
  },
  {
    stage: 7,
    name: 'Void Dimension',
    opponent: 'SHADOW',
    description: 'Confront Shadow in the realm of darkness',
    reward: 'Unlock: Dark Mastery Badge',
    levelImage: 'void-demension.png'
  },
  {
    stage: 8,
    name: 'Shadow Realm',
    opponent: 'SHADOW_NINJA',
    description: 'Face the silent assassin in the realm where shadows come alive',
    reward: 'Unlock: Ninja Mastery Badge',
    levelImage: 'wind-level.png'
  },
  {
    stage: 9,
    name: 'Blood Arena',
    opponent: 'BLOOD_KNIGHT',
    description: 'Battle the ruthless Blood Knight in his crimson domain',
    reward: 'Unlock: Blood Mastery Badge',
    isBoss: true,
    levelImage: 'blood-arena-bg.png'
  },
  {
    stage: 10,
    name: 'BOSS: Power Nexus',
    opponent: 'NEXUS',
    description: 'Face the ultimate champion in the Grand Arena',
    reward: 'Unlock: Master Champion Title',
    isBoss: true,
    levelImage: 'mech3.png'
  },
  {
    stage: 11,
    name: 'FINAL BOSS: Chaos Unleashed',
    opponent: 'CHAOS',
    description: 'Battle the embodiment of chaos itself',
    reward: 'Complete Story Mode - Unlock All',
    isBoss: true,
    finalBoss: true,
    levelImage: 'chaos-unleached-level.png'
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

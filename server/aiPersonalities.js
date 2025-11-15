// AI Opponent Personalities - Server Version (Node.js compatible)

const AI_PERSONALITIES = {
  EMBER: {
    name: 'Ember',
    avatar: '🔥',
    difficulty: 'Easy',
    aggressiveness: 0.8,
    conservativeness: 0.2,
    counterPriority: 0.4,
    preferredElements: ['FIRE', 'EARTH', 'POWER']
  },
  FROST: {
    name: 'Frost',
    avatar: '❄️',
    difficulty: 'Medium',
    aggressiveness: 0.3,
    conservativeness: 0.7,
    counterPriority: 0.7,
    preferredElements: ['ICE', 'WATER', 'NEUTRAL']
  },
  AQUA: {
    name: 'Aqua',
    avatar: '💧',
    difficulty: 'Medium',
    aggressiveness: 0.5,
    conservativeness: 0.5,
    counterPriority: 0.6,
    preferredElements: ['WATER', 'ICE', 'NEUTRAL'],
    adaptive: true
  },
  VOLT: {
    name: 'Volt',
    avatar: '⚡',
    difficulty: 'Hard',
    aggressiveness: 0.7,
    conservativeness: 0.4,
    counterPriority: 0.8,
    preferredElements: ['ELECTRICITY', 'LIGHT', 'POWER'],
    comboFocus: true
  },
  TERRA: {
    name: 'Terra',
    avatar: '🌍',
    difficulty: 'Hard',
    aggressiveness: 0.4,
    conservativeness: 0.8,
    counterPriority: 0.9,
    preferredElements: ['EARTH', 'FIRE', 'DARK'],
    defensive: true
  },
  LUMINA: {
    name: 'Lumina',
    avatar: '☀️',
    difficulty: 'Expert',
    aggressiveness: 0.6,
    conservativeness: 0.6,
    counterPriority: 0.8,
    preferredElements: ['LIGHT', 'POWER', 'ELECTRICITY'],
    perfectPlay: true
  },
  SHADOW: {
    name: 'Shadow',
    avatar: '🌙',
    difficulty: 'Expert',
    aggressiveness: 0.5,
    conservativeness: 0.7,
    counterPriority: 0.9,
    preferredElements: ['DARK', 'POWER', 'NEUTRAL'],
    exploitative: true,
    unpredictable: true
  },
  NEXUS: {
    name: 'Nexus',
    avatar: '⭐',
    difficulty: 'Master',
    aggressiveness: 0.7,
    conservativeness: 0.7,
    counterPriority: 1.0,
    preferredElements: ['POWER', 'LEGENDARY'],
    perfectPlay: true,
    adaptive: true,
    comboFocus: true,
    exploitative: true
  },
  CHAOS: {
    name: 'Chaos',
    avatar: '🔮',
    difficulty: 'Master',
    aggressiveness: 0.5,
    conservativeness: 0.5,
    counterPriority: 0.5,
    preferredElements: ['NEUTRAL', 'random'],
    random: true,
    unpredictable: true
  }
};

const elementCounters = {
  FIRE: ['ICE', 'WATER'],
  ICE: ['ELECTRICITY', 'FIRE'],
  WATER: ['EARTH', 'ELECTRICITY'],
  ELECTRICITY: ['EARTH', 'WATER'],
  EARTH: ['FIRE', 'ICE'],
  LIGHT: ['DARK'],
  DARK: ['LIGHT'],
  METEOR: ['EARTH'],
  POWER: [],
  NEUTRAL: []
};

function selectAICard(hand, personalityKey, gameState) {
  console.log('selectAICard called with:', { handLength: hand?.length, personalityKey, gameStateExists: !!gameState });
  
  if (!hand || hand.length === 0) return 0;

  const personality = AI_PERSONALITIES[personalityKey] || AI_PERSONALITIES.CHAOS;
  console.log('Using personality:', personalityKey, 'with data:', personality);
  
  // Random AI
  if (personality.random) {
    return Math.floor(Math.random() * hand.length);
  }

  const aiPlayer = gameState.players?.find(p => p.isAI);
  const humanPlayer = gameState.players?.find(p => !p.isAI);

  // Safety check - if no valid personality data, fall back to random
  if (!personality.aggressiveness && !personality.conservativeness) {
    console.log('Warning: Invalid AI personality, falling back to random selection');
    return Math.floor(Math.random() * hand.length);
  }

  let scores = hand.map((card, index) => {
    let score = card.strength;

    // Preferred elements
    if (personality.preferredElements?.includes(card.element)) {
      score += 3;
    }

    // Counter priority - check if this card counters opponent's last card
    if (personality.counterPriority && humanPlayer?.chosenCard) {
      const counters = elementCounters[card.element] || [];
      if (counters.includes(humanPlayer.chosenCard.element)) {
        score += personality.counterPriority * 5;
      }
    }

    // Combo focus - bonus for matching last played element
    if (personality.comboFocus && aiPlayer?.lastPlayedElement === card.element) {
      score += 4;
    }

    // Legendary priority
    if (card.tier === 'LEGENDARY') {
      score += personality.aggressiveness * 5;
    }

    // Power cards are valuable
    if (card.element === 'POWER') {
      score += personality.aggressiveness * 3;
    }

    // Exploitative: if winning, play safer; if losing, play aggressive
    if (personality.exploitative && aiPlayer && humanPlayer) {
      if (aiPlayer.score > humanPlayer.score) {
        score *= (1 - personality.conservativeness);
      } else if (aiPlayer.score < humanPlayer.score) {
        score *= (1 + personality.aggressiveness);
      }
    }

    // Defensive: prefer higher strength cards when behind
    if (personality.defensive && aiPlayer && humanPlayer) {
      if (aiPlayer.score < humanPlayer.score) {
        score += card.strength * 0.5;
      }
    }

    return { index, score };
  });

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  // Aggressiveness determines if we play best card
  if (Math.random() < personality.aggressiveness) {
    return scores[0].index; // Play highest scored card
  }

  // Conservativeness: play lower-medium strength
  if (Math.random() < personality.conservativeness) {
    const midRange = scores.slice(Math.floor(scores.length / 3), Math.floor(scores.length * 2 / 3));
    if (midRange.length > 0) {
      return midRange[Math.floor(Math.random() * midRange.length)].index;
    }
  }

  // Perfect play: always choose optimal card
  if (personality.perfectPlay) {
    return scores[0].index;
  }

  // Default: somewhat random from top half
  const topHalf = scores.slice(0, Math.ceil(scores.length / 2));
  const selectedIndex = topHalf[Math.floor(Math.random() * topHalf.length)].index;
  
  // Final safety check - ensure index is within bounds
  if (selectedIndex < 0 || selectedIndex >= hand.length) {
    console.log('Warning: AI selected invalid card index, falling back to 0');
    return 0;
  }
  
  return selectedIndex;
}

module.exports = {
  AI_PERSONALITIES,
  selectAICard
};

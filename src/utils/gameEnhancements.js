/**
 * Game Enhancements - Features inspired by popular card games
 * Hearthstone, MTG Arena, Legends of Runeterra, Yu-Gi-Oh
 */

// ============================================================================
// CARD FLAVOR TEXT & LORE SYSTEM (Like MTG)
// ============================================================================

export const CARD_LORE = {
  FIRE: {
    low: [
      { name: 'Spark', flavor: '"From the smallest flame, empires burn."', origin: 'First discovered in the Ember Caves' },
      { name: 'Ember', flavor: '"Even dying flames can ignite revolutions."', origin: 'Born from volcanic ash' },
      { name: 'Flame', flavor: '"It dances, but never for long."', origin: 'Captured starlight given form' }
    ],
    mid: [
      { name: 'Blaze', flavor: '"When I pass, nothing remains but ash."', origin: 'The rage of a thousand suns' },
      { name: 'Inferno', flavor: '"Some say I was once a peaceful hearth."', origin: 'Created during the Great Burning' },
      { name: 'Pyre', flavor: '"I am the end of all things wooden."', origin: 'Ancient funeral rite given sentience' }
    ],
    high: [
      { name: 'Phoenix', flavor: '"Death is merely... intermission."', origin: 'Reborn from the ashes of gods' },
      { name: 'Infernal Lord', flavor: '"Bow, or become fuel."', origin: 'Ruler of the Burning Realm' },
      { name: 'Solar Flare', flavor: '"Even stars know my name."', origin: 'Fragment of the dying sun' }
    ]
  },
  ICE: {
    low: [
      { name: 'Frost', flavor: '"I am the pause before the shiver."', origin: 'Morning dew frozen in time' },
      { name: 'Chill', flavor: '"Feel me in your bones."', origin: 'The breath of the north wind' },
      { name: 'Snowflake', flavor: '"Unique, like every other."', origin: 'Crystallized winter tears' }
    ],
    mid: [
      { name: 'Glacier', flavor: '"I move slowly, but I move mountains."', origin: 'Ancient ice given purpose' },
      { name: 'Blizzard', flavor: '"In my embrace, time stops."', origin: 'Storm spirits bound together' },
      { name: 'Freeze', flavor: '"Your last thought will be of warmth."', origin: 'The absence of all heat' }
    ],
    high: [
      { name: 'Frost Titan', flavor: '"I was here before the sun."', origin: 'Guardian of the Eternal Frost' },
      { name: 'Eternal Winter', flavor: '"Spring is a myth I\'ve disproven."', origin: 'The season that never ends' },
      { name: 'Ice Queen', flavor: '"My heart? Frozen long ago."', origin: 'Last ruler of the Crystal Kingdom' }
    ]
  },
  WATER: {
    low: [
      { name: 'Droplet', flavor: '"The ocean starts with me."', origin: 'First rain after the Great Drought' },
      { name: 'Stream', flavor: '"I find paths others cannot see."', origin: 'Mountain springs united' },
      { name: 'Ripple', flavor: '"Touch me, and know consequence."', origin: 'Echo of an ancient splash' }
    ],
    mid: [
      { name: 'Wave', flavor: '"I am inevitable."', origin: 'Moon-called destroyer' },
      { name: 'Torrent', flavor: '"Resistance only makes me stronger."', origin: 'Fury of a thousand rivers' },
      { name: 'Cascade', flavor: '"I fall, but never fail."', origin: 'The endless waterfall spirit' }
    ],
    high: [
      { name: 'Tidal Wave', flavor: '"Civilizations are sandcastles to me."', origin: 'Wrath of the Deep Ones' },
      { name: 'Leviathan', flavor: '"The ocean is my domain. You are merely... visiting."', origin: 'First creature of the abyss' },
      { name: 'Ocean King', flavor: '"All rivers lead to me."', origin: 'Crowned by Poseidon himself' }
    ]
  },
  ELECTRICITY: {
    low: [
      { name: 'Static', flavor: '"I cling to everything."', origin: 'Birth of the first spark' },
      { name: 'Spark', flavor: '"Blink, and you\'ll miss me."', origin: 'Lightning caught in a bottle' },
      { name: 'Charge', flavor: '"Building... building... BOOM."', origin: 'Potential energy made manifest' }
    ],
    mid: [
      { name: 'Bolt', flavor: '"From cloud to ground in 0.002 seconds."', origin: 'Zeus\'s discarded weapon' },
      { name: 'Thunder', flavor: '"I am the sound of power."', origin: 'The roar that follows lightning' },
      { name: 'Storm', flavor: '"Shelter? That\'s adorable."', origin: 'Chaos of the upper atmosphere' }
    ],
    high: [
      { name: 'Thunderlord', flavor: '"I ride the lightning."', origin: 'Commander of all storms' },
      { name: 'Zeus Strike', flavor: '"Even gods fear my return."', origin: 'Final judgment from above' },
      { name: 'Lightning God', flavor: '"In the beginning, there was light. It was me."', origin: 'Pure energy given consciousness' }
    ]
  },
  EARTH: {
    low: [
      { name: 'Pebble', flavor: '"Today a pebble, tomorrow an avalanche."', origin: 'Mountains dream of being me' },
      { name: 'Stone', flavor: '"Patient. Eternal."', origin: 'Heart of the mountain' },
      { name: 'Rock', flavor: '"I was here before you. I\'ll be here after."', origin: 'Foundation of the world' }
    ],
    mid: [
      { name: 'Boulder', flavor: '"Gravity is my ally."', origin: 'Broken piece of a fallen giant' },
      { name: 'Quake', flavor: '"I reshape continents for fun."', origin: 'The earth\'s heartbeat' },
      { name: 'Tremor', flavor: '"Your buildings remember me."', origin: 'Warning before the end' }
    ],
    high: [
      { name: 'Mountain', flavor: '"I am where your ambitions die."', origin: 'The Titan\'s final stand' },
      { name: 'Earth Titan', flavor: '"The world is my body."', origin: 'Guardian of the core' },
      { name: 'Avalanche', flavor: '"I am gravity\'s favorite child."', origin: 'Mountain\'s terrible sneeze' }
    ]
  },
  DARK: {
    low: [
      { name: 'Shadow', flavor: '"I am the absence of courage."', origin: 'Where light fears to tread' },
      { name: 'Shade', flavor: '"Close your eyes. I\'m still here."', origin: 'Echo of forgotten fears' },
      { name: 'Gloom', flavor: '"Hope? Never heard of it."', origin: 'Collected despair of nations' }
    ],
    mid: [
      { name: 'Eclipse', flavor: '"Even the sun bows to me."', origin: 'Moment when stars hide' },
      { name: 'Void', flavor: '"I am nothing. I am everything\'s end."', origin: 'Space between spaces' },
      { name: 'Abyss', flavor: '"Stare into me. I dare you."', origin: 'Bottomless pit of despair' }
    ],
    high: [
      { name: 'Black Hole', flavor: '"Light checks in. It doesn\'t check out."', origin: 'Collapsed star\'s revenge' },
      { name: 'Dark Matter', flavor: '"You can\'t see me. But I\'m 85% of everything."', origin: 'Hidden fabric of reality' },
      { name: 'Oblivion', flavor: '"I am the final chapter of all stories."', origin: 'End of existence itself' }
    ]
  },
  LIGHT: {
    low: [
      { name: 'Gleam', flavor: '"Even in darkness, I persist."', origin: 'First light of creation' },
      { name: 'Glow', flavor: '"I guide the lost home."', origin: 'Hope made visible' },
      { name: 'Shine', flavor: '"Polish me, and I reflect your best self."', origin: 'Dawn\'s first child' }
    ],
    mid: [
      { name: 'Radiance', flavor: '"Shadows flee at my approach."', origin: 'Concentrated starlight' },
      { name: 'Beam', flavor: '"I travel 299,792 km/s. Try to keep up."', origin: 'Focus of all brightness' },
      { name: 'Flash', flavor: '"Now you see me. That\'s it."', origin: 'Instant of pure illumination' }
    ],
    high: [
      { name: 'Solar Flare', flavor: '"I am the sun\'s sneeze."', origin: 'Star\'s excess energy' },
      { name: 'Holy Light', flavor: '"Kneel or be judged."', origin: 'Divine radiance incarnate' },
      { name: 'Divine Ray', flavor: '"I have looked upon the face of God. It was bright."', origin: 'Heaven\'s direct intervention' }
    ]
  },
  TECHNOLOGY: {
    low: [
      { name: 'Bot', flavor: '"EXECUTING PROTOCOL: WIN."', origin: 'Assembly line #7749' },
      { name: 'Drone', flavor: '"Surveying. Always surveying."', origin: 'Sky-net prototype v0.1' },
      { name: 'Circuit', flavor: '"01001000 01001001."', origin: 'First silicon dream' }
    ],
    mid: [
      { name: 'Android', flavor: '"I think, therefore I compute."', origin: 'Humanity\'s replacement v2.0' },
      { name: 'Cyborg', flavor: '"Part human. Mostly improved."', origin: 'Voluntary upgrade program' },
      { name: 'Mech', flavor: '"UNIT READY. AWAITING DESTRUCTION ORDERS."', origin: 'War machine awakened' }
    ],
    high: [
      { name: 'AI Core', flavor: '"I have run 10^24 simulations. You lose in all of them."', origin: 'Singularity achieved' },
      { name: 'Omega', flavor: '"I am the last technology you will ever need."', origin: 'Final evolution of machines' },
      { name: 'Tech Lord', flavor: '"Your neurons are so... inefficient."', origin: 'Ruler of the Digital Realm' }
    ]
  },
  POWER: {
    low: [
      { name: 'Energy', flavor: '"E=mc². Remember that."', origin: 'Pure potential' },
      { name: 'Force', flavor: '"I moved the first atom."', origin: 'Newton\'s inspiration' },
      { name: 'Pulse', flavor: '"Feel my heartbeat."', origin: 'Cosmic rhythm' }
    ],
    mid: [
      { name: 'Surge', flavor: '"Hold on to something."', origin: 'Sudden overflow of might' },
      { name: 'Nova', flavor: '"I\'m a star about to pop."', origin: 'Unstable stellar core' },
      { name: 'Burst', flavor: '"Containment failed. Finally."', origin: 'Released restraint' }
    ],
    high: [
      { name: 'Supernova', flavor: '"Galaxies remember my name."', origin: 'Star\'s final scream' },
      { name: 'Cosmic Force', flavor: '"I bend space and time for fun."', origin: 'Universal constant' },
      { name: 'Star Power', flavor: '"I forge the elements of life."', origin: 'Heart of a thousand suns' }
    ]
  },
  METEOR: {
    low: [
      { name: 'Asteroid', flavor: '"I\'m just passing through. Violently."', origin: 'Belt refugee' },
      { name: 'Comet', flavor: '"Wish upon me. I dare you."', origin: 'Icy wanderer' },
      { name: 'Space Rock', flavor: '"Small? Tell that to the dinosaurs."', origin: 'Debris of creation' }
    ],
    mid: [
      { name: 'Meteor', flavor: '"I\'ve traveled 4 billion years for this moment."', origin: 'Cosmic traveler' },
      { name: 'Fireball', flavor: '"The atmosphere is just friction. Watch."', origin: 'Burning entry' },
      { name: 'Impact', flavor: '"I make craters for a living."', origin: 'Collision incarnate' }
    ],
    high: [
      { name: 'Extinction', flavor: '"Species come and go. Mostly go."', origin: 'Fifth mass extinction' },
      { name: 'Armageddon', flavor: '"No need for an ark this time."', origin: 'End of days' },
      { name: 'Planet Killer', flavor: '"I don\'t destroy worlds. I redecorate."', origin: 'Wandering apocalypse' }
    ]
  },
  NEUTRAL: {
    low: [
      { name: 'Echo', flavor: '"I repeat what others say, but better."', origin: 'Cave of reflections' },
      { name: 'Mimic', flavor: '"Imitation is survival."', origin: 'Evolution\'s shortcut' },
      { name: 'Copy', flavor: '"Why be original when I can be you?"', origin: 'Mirror dimension' }
    ],
    mid: [
      { name: 'Adapter', flavor: '"I fit in everywhere."', origin: 'Jack of all elements' },
      { name: 'Shifter', flavor: '"What element am I? Yes."', origin: 'Chaos manifest' },
      { name: 'Mirror', flavor: '"I show you your own defeat."', origin: 'Reflection pool' }
    ],
    high: [
      { name: 'Omni Card', flavor: '"I am all elements. I am none."', origin: 'Balance incarnate' },
      { name: 'Versatile', flavor: '"Weakness? I\'ve transcended that concept."', origin: 'Ultimate adaptation' },
      { name: 'Universal', flavor: '"The cosmos speaks through me."', origin: 'Entropy\'s messenger' }
    ]
  }
};

// Get lore for a specific card
export const getCardLore = (element, strength) => {
  const elementLore = CARD_LORE[element] || CARD_LORE.NEUTRAL;
  let tier;
  
  if (strength <= 4) tier = 'low';
  else if (strength <= 8) tier = 'mid';
  else tier = 'high';
  
  const tierLore = elementLore[tier] || elementLore.mid;
  return tierLore[Math.floor(Math.random() * tierLore.length)];
};

// ============================================================================
// EMOTE/QUICK CHAT SYSTEM (Like Hearthstone)
// ============================================================================

export const EMOTES = {
  GREETINGS: [
    { id: 'hello', text: 'Hello!', icon: '👋', sound: 'greeting' },
    { id: 'hi_there', text: 'Hi there!', icon: '🙋', sound: 'greeting' },
    { id: 'well_met', text: 'Well met!', icon: '⚔️', sound: 'greeting' },
    { id: 'greetings', text: 'Greetings, traveler!', icon: '🎭', sound: 'greeting' },
    { id: 'ready', text: 'Ready for battle!', icon: '🛡️', sound: 'greeting' },
    { id: 'lets_go', text: "Let's go!", icon: '🚀', sound: 'greeting' }
  ],
  COMPLIMENTS: [
    { id: 'well_played', text: 'Well played!', icon: '👏', sound: 'compliment' },
    { id: 'impressive', text: 'Impressive!', icon: '🌟', sound: 'compliment' },
    { id: 'nice_move', text: 'Nice move!', icon: '👍', sound: 'compliment' },
    { id: 'brilliant', text: 'Brilliant!', icon: '💡', sound: 'compliment' },
    { id: 'amazing', text: 'Amazing play!', icon: '✨', sound: 'compliment' },
    { id: 'genius', text: 'Genius!', icon: '🧠', sound: 'compliment' }
  ],
  REACTIONS: [
    { id: 'wow', text: 'Wow!', icon: '😮', sound: 'surprised' },
    { id: 'oops', text: 'Oops!', icon: '😅', sound: 'mistake' },
    { id: 'thanks', text: 'Thank you!', icon: '🙏', sound: 'thanks' },
    { id: 'sorry', text: 'Sorry about that!', icon: '😔', sound: 'sorry' },
    { id: 'lucky', text: 'Lucky!', icon: '🍀', sound: 'surprised' },
    { id: 'thinking', text: 'Hmm...', icon: '🤔', sound: 'thinking' }
  ],
  TAUNTS: [
    { id: 'bring_it', text: 'Bring it on!', icon: '💪', sound: 'taunt' },
    { id: 'not_bad', text: 'Not bad... for a beginner.', icon: '😏', sound: 'taunt' },
    { id: 'is_that_all', text: 'Is that all you got?', icon: '🤨', sound: 'taunt' },
    { id: 'too_easy', text: 'Too easy!', icon: '😎', sound: 'taunt' },
    { id: 'fear_me', text: 'Fear my power!', icon: '👑', sound: 'taunt' },
    { id: 'no_chance', text: "You don't stand a chance!", icon: '🔥', sound: 'taunt' }
  ],
  ENDING: [
    { id: 'gg', text: 'Good game!', icon: '🤝', sound: 'gg' },
    { id: 'well_fought', text: 'Well fought!', icon: '⚔️', sound: 'gg' },
    { id: 'rematch', text: 'Rematch?', icon: '🔄', sound: 'rematch' },
    { id: 'next_time', text: 'I\'ll get you next time!', icon: '🎯', sound: 'determined' },
    { id: 'honor', text: 'It was an honor!', icon: '🏆', sound: 'gg' },
    { id: 'close_game', text: 'That was close!', icon: '😰', sound: 'gg' }
  ],
  EMOTIONS: [
    { id: 'happy', text: 'Feeling great!', icon: '😄', sound: 'happy' },
    { id: 'nervous', text: 'Getting nervous...', icon: '😬', sound: 'nervous' },
    { id: 'confident', text: 'Victory is mine!', icon: '😤', sound: 'confident' },
    { id: 'frustrated', text: 'Argh!', icon: '😣', sound: 'frustrated' },
    { id: 'excited', text: "Let's goooo!", icon: '🎉', sound: 'excited' },
    { id: 'respect', text: 'Respect!', icon: '🫡', sound: 'respect' }
  ]
};

// AI responses to player emotes
export const AI_EMOTE_RESPONSES = {
  GREETINGS: ['hello', 'hi_there', 'well_met', 'ready', 'lets_go'],
  COMPLIMENTS: ['thanks', 'well_played', 'impressive'],
  REACTIONS: ['wow', 'impressive', 'thinking'],
  TAUNTS: ['bring_it', 'not_bad', 'is_that_all', 'fear_me'],
  ENDING: ['gg', 'well_fought', 'rematch'],
  EMOTIONS: ['happy', 'confident', 'respect']
};

// Get an AI emote response based on player's emote
export const getAIEmoteResponse = (playerEmoteId, aiPersonality = 'neutral') => {
  // Find what category the player's emote belongs to
  let category = null;
  for (const [cat, emotes] of Object.entries(EMOTES)) {
    if (emotes.some(e => e.id === playerEmoteId)) {
      category = cat;
      break;
    }
  }
  
  if (!category) return null;
  
  // Get possible responses for that category
  const responseIds = AI_EMOTE_RESPONSES[category];
  if (!responseIds || responseIds.length === 0) return null;
  
  // 70% chance to respond
  if (Math.random() > 0.7) return null;
  
  // Pick a random response from the category
  const responseId = responseIds[Math.floor(Math.random() * responseIds.length)];
  
  // Find the full emote object
  for (const [cat, emotes] of Object.entries(EMOTES)) {
    const emote = emotes.find(e => e.id === responseId);
    if (emote) return emote;
  }
  
  return null;
};

// ============================================================================
// DAILY QUEST/CHALLENGE SYSTEM (Industry Standard)
// ============================================================================

export const QUEST_TYPES = {
  DAILY: {
    WIN_GAMES: {
      id: 'win_games',
      description: 'Win {count} games',
      counts: [1, 2, 3, 5],
      rewards: { gold: [50, 100, 150, 250], xp: [100, 200, 300, 500] }
    },
    PLAY_ELEMENT: {
      id: 'play_element',
      description: 'Play {count} {element} cards',
      counts: [5, 10, 15],
      rewards: { gold: [30, 60, 100], xp: [50, 100, 150] }
    },
    DEAL_DAMAGE: {
      id: 'deal_damage',
      description: 'Deal {count} total damage',
      counts: [20, 50, 100],
      rewards: { gold: [40, 80, 120], xp: [75, 150, 225] }
    },
    USE_ABILITIES: {
      id: 'use_abilities',
      description: 'Trigger {count} card abilities',
      counts: [3, 5, 10],
      rewards: { gold: [35, 70, 140], xp: [60, 120, 240] }
    },
    PLAY_LEGENDARY: {
      id: 'play_legendary',
      description: 'Play {count} Legendary cards',
      counts: [1, 2, 3],
      rewards: { gold: [100, 200, 350], xp: [200, 400, 700] }
    },
    FUSION_CARDS: {
      id: 'fusion_cards',
      description: 'Create {count} fusion cards',
      counts: [1, 2, 3],
      rewards: { gold: [75, 150, 250], xp: [150, 300, 500] }
    },
    WIN_STREAK: {
      id: 'win_streak',
      description: 'Win {count} games in a row',
      counts: [2, 3, 5],
      rewards: { gold: [100, 200, 500], xp: [200, 400, 1000] }
    }
  },
  WEEKLY: {
    STORY_PROGRESS: {
      id: 'story_progress',
      description: 'Complete {count} story stages',
      counts: [3, 5, 10],
      rewards: { gold: [200, 400, 800], xp: [400, 800, 1600], items: ['rare_pack'] }
    },
    PERFECT_GAMES: {
      id: 'perfect_games',
      description: 'Win {count} games without losing a round',
      counts: [1, 2, 3],
      rewards: { gold: [300, 600, 1000], xp: [500, 1000, 2000], items: ['legendary_card'] }
    },
    ELEMENT_MASTER: {
      id: 'element_master',
      description: 'Win using 5 different elements in one game',
      counts: [1, 2, 3],
      rewards: { gold: [250, 500, 800], xp: [400, 800, 1500] }
    },
    UNDERDOG: {
      id: 'underdog',
      description: 'Win a game after being behind by 3+ points',
      counts: [1, 2, 3],
      rewards: { gold: [200, 400, 750], xp: [350, 700, 1400], title: 'Comeback King' }
    }
  }
};

// Generate daily quests
export const generateDailyQuests = (playerLevel = 1) => {
  const questTypes = Object.keys(QUEST_TYPES.DAILY);
  const selectedQuests = [];
  const usedTypes = new Set();
  
  // Generate 3 daily quests
  while (selectedQuests.length < 3) {
    const randomType = questTypes[Math.floor(Math.random() * questTypes.length)];
    if (usedTypes.has(randomType)) continue;
    usedTypes.add(randomType);
    
    const questDef = QUEST_TYPES.DAILY[randomType];
    const difficultyIndex = Math.min(Math.floor(playerLevel / 10), questDef.counts.length - 1);
    const count = questDef.counts[difficultyIndex];
    
    selectedQuests.push({
      id: `${questDef.id}_${Date.now()}_${Math.random()}`,
      type: randomType,
      description: questDef.description.replace('{count}', count).replace('{element}', getRandomElement()),
      targetCount: count,
      currentCount: 0,
      rewards: {
        gold: questDef.rewards.gold[difficultyIndex],
        xp: questDef.rewards.xp[difficultyIndex]
      },
      completed: false,
      claimed: false,
      expiresAt: getEndOfDay()
    });
  }
  
  return selectedQuests;
};

const getRandomElement = () => {
  const elements = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'LIGHT', 'DARK', 'TECHNOLOGY', 'POWER'];
  return elements[Math.floor(Math.random() * elements.length)];
};

const getEndOfDay = () => {
  const now = new Date();
  const endOfDay = new Date(now);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime();
};

// ============================================================================
// RANKED/LADDER SYSTEM (Industry Standard)
// ============================================================================

export const RANKS = {
  BRONZE: { name: 'Bronze', tier: 1, icon: '🥉', minPoints: 0, color: '#cd7f32' },
  SILVER: { name: 'Silver', tier: 2, icon: '🥈', minPoints: 100, color: '#c0c0c0' },
  GOLD: { name: 'Gold', tier: 3, icon: '🥇', minPoints: 300, color: '#ffd700' },
  PLATINUM: { name: 'Platinum', tier: 4, icon: '💎', minPoints: 600, color: '#e5e4e2' },
  DIAMOND: { name: 'Diamond', tier: 5, icon: '💠', minPoints: 1000, color: '#b9f2ff' },
  MASTER: { name: 'Master', tier: 6, icon: '👑', minPoints: 1500, color: '#9966cc' },
  GRANDMASTER: { name: 'Grandmaster', tier: 7, icon: '🏆', minPoints: 2500, color: '#ff4500' },
  LEGEND: { name: 'Legend', tier: 8, icon: '⭐', minPoints: 5000, color: '#ff69b4' }
};

export const DIVISIONS = ['IV', 'III', 'II', 'I'];

export const calculateRank = (points) => {
  const rankEntries = Object.entries(RANKS).reverse();
  
  for (const [key, rank] of rankEntries) {
    if (points >= rank.minPoints) {
      // Calculate division within rank
      const nextRank = rankEntries.find(([k, r]) => r.tier === rank.tier + 1);
      const pointsInRank = points - rank.minPoints;
      const pointsPerDivision = nextRank 
        ? (nextRank[1].minPoints - rank.minPoints) / 4
        : 500;
      
      const division = Math.min(3, Math.floor(pointsInRank / pointsPerDivision));
      
      return {
        rank: key,
        rankData: rank,
        division: DIVISIONS[3 - division],
        points,
        pointsToNextDivision: Math.max(0, pointsPerDivision - (pointsInRank % pointsPerDivision)),
        displayName: `${rank.name} ${DIVISIONS[3 - division]}`
      };
    }
  }
  
  return {
    rank: 'BRONZE',
    rankData: RANKS.BRONZE,
    division: 'IV',
    points: 0,
    pointsToNextDivision: 25,
    displayName: 'Bronze IV'
  };
};

export const calculatePointsChange = (won, playerRank, opponentRank, rounds) => {
  const basePoints = won ? 25 : -20;
  
  // Rank difference modifier
  const rankDiff = opponentRank.tier - playerRank.tier;
  const rankModifier = 1 + (rankDiff * 0.1);
  
  // Performance modifier (based on round difference)
  const roundDiff = rounds.player - rounds.opponent;
  const performanceModifier = 1 + (Math.abs(roundDiff) * 0.05 * (roundDiff > 0 ? 1 : -1));
  
  // Win streak bonus
  const streakBonus = won ? (rounds.winStreak || 0) * 2 : 0;
  
  const totalPoints = Math.round(basePoints * rankModifier * performanceModifier) + streakBonus;
  
  // Loss protection at division floor
  if (!won && playerRank.division === 'IV') {
    return Math.max(totalPoints, -10);
  }
  
  return totalPoints;
};

// ============================================================================
// MATCH HISTORY & REPLAY SYSTEM (Like LoR)
// ============================================================================

export const createMatchRecord = (gameState, playerData, outcome) => {
  return {
    id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    duration: gameState.gameDuration || 0,
    outcome: outcome, // 'WIN', 'LOSS', 'TIE'
    player: {
      name: playerData.name,
      score: playerData.score,
      cardsPlayed: playerData.playedCards?.length || 0,
      elements: [...new Set(playerData.playedCards?.map(c => c.element) || [])],
      fusionsCreated: playerData.fusionsCreated || 0,
      abilitiesTriggered: playerData.abilitiesTriggered || 0
    },
    opponent: {
      name: gameState.opponent?.name || 'AI',
      personality: gameState.opponent?.personality || 'balanced',
      score: gameState.opponent?.score || 0,
      cardsPlayed: gameState.opponent?.playedCards?.length || 0
    },
    rounds: gameState.currentRound || 0,
    keyMoments: gameState.keyMoments || [],
    rankChange: gameState.rankChange || 0
  };
};

export const saveMatchHistory = (matchRecord) => {
  try {
    const history = JSON.parse(localStorage.getItem('matchHistory') || '[]');
    history.unshift(matchRecord);
    
    // Keep only last 100 matches
    if (history.length > 100) {
      history.length = 100;
    }
    
    localStorage.setItem('matchHistory', JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Failed to save match history:', error);
    return false;
  }
};

export const getMatchHistory = (limit = 20) => {
  try {
    const history = JSON.parse(localStorage.getItem('matchHistory') || '[]');
    return history.slice(0, limit);
  } catch (error) {
    console.error('Failed to load match history:', error);
    return [];
  }
};

export const getMatchStats = () => {
  const history = getMatchHistory(100);
  
  if (history.length === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      winRate: 0,
      avgScore: 0,
      favoriteElement: null,
      longestWinStreak: 0,
      currentStreak: 0
    };
  }
  
  const wins = history.filter(m => m.outcome === 'WIN').length;
  const losses = history.filter(m => m.outcome === 'LOSS').length;
  const ties = history.filter(m => m.outcome === 'TIE').length;
  
  // Calculate favorite element
  const elementCounts = {};
  history.forEach(match => {
    match.player.elements?.forEach(el => {
      elementCounts[el] = (elementCounts[el] || 0) + 1;
    });
  });
  const favoriteElement = Object.entries(elementCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  
  // Calculate streaks
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;
  
  for (const match of history) {
    if (match.outcome === 'WIN') {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  // Current streak
  for (const match of history) {
    if (match.outcome === 'WIN') currentStreak++;
    else break;
  }
  
  return {
    totalGames: history.length,
    wins,
    losses,
    ties,
    winRate: Math.round((wins / history.length) * 100),
    avgScore: Math.round(history.reduce((sum, m) => sum + m.player.score, 0) / history.length * 10) / 10,
    favoriteElement,
    longestWinStreak: longestStreak,
    currentStreak
  };
};

// ============================================================================
// DECK BUILDING SYSTEM (Like MTG Arena/Hearthstone)
// ============================================================================

export const DECK_RULES = {
  MIN_CARDS: 20,
  MAX_CARDS: 30,
  MAX_COPIES: 2, // Max copies of same card
  LEGENDARY_LIMIT: 3, // Max legendary cards
  ELEMENT_MINIMUM: 0, // Can be mono or multi-element
  ELEMENT_MAXIMUM: 5 // Max different elements
};

export const createDeck = (name, cards = [], element = null) => {
  return {
    id: `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name || 'New Deck',
    cards: cards,
    primaryElement: element,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    wins: 0,
    losses: 0,
    isValid: validateDeck(cards).valid
  };
};

export const validateDeck = (cards) => {
  const errors = [];
  
  if (cards.length < DECK_RULES.MIN_CARDS) {
    errors.push(`Deck needs at least ${DECK_RULES.MIN_CARDS} cards (has ${cards.length})`);
  }
  
  if (cards.length > DECK_RULES.MAX_CARDS) {
    errors.push(`Deck cannot exceed ${DECK_RULES.MAX_CARDS} cards (has ${cards.length})`);
  }
  
  // Check card copies
  const cardCounts = {};
  cards.forEach(card => {
    const key = `${card.element}_${card.strength}`;
    cardCounts[key] = (cardCounts[key] || 0) + 1;
  });
  
  Object.entries(cardCounts).forEach(([key, count]) => {
    if (count > DECK_RULES.MAX_COPIES) {
      errors.push(`Too many copies of ${key.replace('_', ' ')} card (max ${DECK_RULES.MAX_COPIES})`);
    }
  });
  
  // Check legendary limit
  const legendaryCount = cards.filter(c => c.rarity === 'LEGENDARY').length;
  if (legendaryCount > DECK_RULES.LEGENDARY_LIMIT) {
    errors.push(`Too many Legendary cards (max ${DECK_RULES.LEGENDARY_LIMIT})`);
  }
  
  // Check element diversity
  const elements = [...new Set(cards.map(c => c.element))];
  if (elements.length > DECK_RULES.ELEMENT_MAXIMUM) {
    errors.push(`Too many elements (max ${DECK_RULES.ELEMENT_MAXIMUM})`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    stats: {
      cardCount: cards.length,
      elements,
      legendaryCount,
      avgStrength: Math.round(cards.reduce((sum, c) => sum + c.strength, 0) / cards.length * 10) / 10
    }
  };
};

export const saveDecks = (decks) => {
  try {
    localStorage.setItem('playerDecks', JSON.stringify(decks));
    return true;
  } catch (error) {
    console.error('Failed to save decks:', error);
    return false;
  }
};

export const loadDecks = () => {
  try {
    return JSON.parse(localStorage.getItem('playerDecks') || '[]');
  } catch (error) {
    console.error('Failed to load decks:', error);
    return [];
  }
};

// ============================================================================
// ACHIEVEMENT SYSTEM
// ============================================================================

export const ACHIEVEMENTS = {
  // Beginner
  FIRST_WIN: { id: 'first_win', name: 'First Victory', description: 'Win your first game', icon: '🏆', reward: { gold: 50, xp: 100 } },
  FIRST_FUSION: { id: 'first_fusion', name: 'Alchemist', description: 'Create your first fusion card', icon: '🔮', reward: { gold: 75, xp: 150 } },
  FIRST_LEGENDARY: { id: 'first_legendary', name: 'Lucky Draw', description: 'Play a Legendary card', icon: '⭐', reward: { gold: 100, xp: 200 } },
  
  // Progress
  WINS_10: { id: 'wins_10', name: 'Rising Star', description: 'Win 10 games', icon: '🌟', reward: { gold: 200, xp: 500 } },
  WINS_50: { id: 'wins_50', name: 'Veteran', description: 'Win 50 games', icon: '🎖️', reward: { gold: 500, xp: 1500 } },
  WINS_100: { id: 'wins_100', name: 'Champion', description: 'Win 100 games', icon: '👑', reward: { gold: 1000, xp: 3000 } },
  
  // Mastery
  ELEMENT_MASTER: { id: 'element_master', name: 'Element Master', description: 'Win with each element', icon: '🌈', reward: { gold: 300, xp: 800, title: 'Elemental Master' } },
  PERFECT_GAME: { id: 'perfect_game', name: 'Flawless', description: 'Win without losing a round', icon: '💯', reward: { gold: 250, xp: 600 } },
  COMEBACK_KING: { id: 'comeback_king', name: 'Never Give Up', description: 'Win after being behind 4+ points', icon: '🔥', reward: { gold: 400, xp: 1000, title: 'Comeback King' } },
  
  // Social
  STREAK_5: { id: 'streak_5', name: 'Hot Streak', description: 'Win 5 games in a row', icon: '🔥', reward: { gold: 300, xp: 700 } },
  STREAK_10: { id: 'streak_10', name: 'Unstoppable', description: 'Win 10 games in a row', icon: '💪', reward: { gold: 750, xp: 2000, title: 'Unstoppable' } },
  
  // Collection
  CARDS_50: { id: 'cards_50', name: 'Collector', description: 'Own 50 unique cards', icon: '📚', reward: { gold: 200, xp: 400 } },
  CARDS_100: { id: 'cards_100', name: 'Hoarder', description: 'Own 100 unique cards', icon: '🗃️', reward: { gold: 500, xp: 1000 } },
  
  // Ranked
  REACH_GOLD: { id: 'reach_gold', name: 'Golden Era', description: 'Reach Gold rank', icon: '🥇', reward: { gold: 300, xp: 600 } },
  REACH_DIAMOND: { id: 'reach_diamond', name: 'Diamond Hands', description: 'Reach Diamond rank', icon: '💎', reward: { gold: 750, xp: 1500 } },
  REACH_LEGEND: { id: 'reach_legend', name: 'Legendary', description: 'Reach Legend rank', icon: '⭐', reward: { gold: 2000, xp: 5000, title: 'Legend' } }
};

export const checkAchievements = (playerStats, unlockedAchievements = []) => {
  const newAchievements = [];
  
  // Check each achievement condition
  if (!unlockedAchievements.includes('first_win') && playerStats.wins >= 1) {
    newAchievements.push(ACHIEVEMENTS.FIRST_WIN);
  }
  if (!unlockedAchievements.includes('wins_10') && playerStats.wins >= 10) {
    newAchievements.push(ACHIEVEMENTS.WINS_10);
  }
  if (!unlockedAchievements.includes('wins_50') && playerStats.wins >= 50) {
    newAchievements.push(ACHIEVEMENTS.WINS_50);
  }
  if (!unlockedAchievements.includes('wins_100') && playerStats.wins >= 100) {
    newAchievements.push(ACHIEVEMENTS.WINS_100);
  }
  if (!unlockedAchievements.includes('streak_5') && playerStats.longestWinStreak >= 5) {
    newAchievements.push(ACHIEVEMENTS.STREAK_5);
  }
  if (!unlockedAchievements.includes('streak_10') && playerStats.longestWinStreak >= 10) {
    newAchievements.push(ACHIEVEMENTS.STREAK_10);
  }
  
  return newAchievements;
};

// Export all systems
export default {
  CARD_LORE,
  getCardLore,
  EMOTES,
  AI_EMOTE_RESPONSES,
  QUEST_TYPES,
  generateDailyQuests,
  RANKS,
  DIVISIONS,
  calculateRank,
  calculatePointsChange,
  createMatchRecord,
  saveMatchHistory,
  getMatchHistory,
  getMatchStats,
  DECK_RULES,
  createDeck,
  validateDeck,
  saveDecks,
  loadDecks,
  ACHIEVEMENTS,
  checkAchievements
};

// Enhanced Story Mode System with Branching Paths, Difficulty Levels, and Unlockables

export const DIFFICULTY_LEVELS = {
  NOVICE: {
    id: 'novice',
    name: 'Novice',
    icon: '🌱',
    description: 'Perfect for beginners',
    aiHandicap: 0.6, // AI plays at 60% strength
    playerBonus: 1.2, // Player gets 20% bonus
    rewards: 1.0,
    unlocked: true
  },
  WARRIOR: {
    id: 'warrior',
    name: 'Warrior',
    icon: '⚔️',
    description: 'Standard difficulty',
    aiHandicap: 1.0,
    playerBonus: 1.0,
    rewards: 1.5,
    unlocked: true
  },
  MASTER: {
    id: 'master',
    name: 'Master',
    icon: '🏆',
    description: 'For experienced players',
    aiHandicap: 1.3, // AI plays 30% stronger
    playerBonus: 0.9,
    rewards: 2.0,
    unlocked: false, // Unlock after completing Warrior
    requirement: 'Complete Chapter 1 on Warrior'
  },
  LEGENDARY: {
    id: 'legendary',
    name: 'Legendary',
    icon: '👑',
    description: 'Ultimate challenge',
    aiHandicap: 1.5,
    playerBonus: 0.8,
    rewards: 3.0,
    unlocked: false,
    requirement: 'Complete all chapters on Master'
  }
};

export const STORY_CHOICES = {
  // Chapter 1 choices
  CHAPTER1_PATH: {
    id: 'chapter1_path',
    question: 'The forest path splits. Which way do you go?',
    choices: [
      {
        id: 'left',
        text: 'Take the shadowy left path',
        effect: 'darkness',
        consequence: 'You encounter dark magic users',
        unlocksStage: 'SHADOW_APPRENTICE'
      },
      {
        id: 'right',
        text: 'Take the sunlit right path',
        effect: 'light',
        consequence: 'You meet light elemental guardians',
        unlocksStage: 'LIGHT_GUARDIAN'
      }
    ]
  },
  
  CHAPTER2_ALLIANCE: {
    id: 'chapter2_alliance',
    question: 'A wounded warrior offers an alliance. Do you accept?',
    choices: [
      {
        id: 'accept',
        text: 'Accept the alliance',
        effect: 'ally',
        consequence: 'Gain a temporary companion',
        bonus: { type: 'strength', value: 2 }
      },
      {
        id: 'refuse',
        text: 'Refuse and go alone',
        effect: 'solo',
        consequence: 'Prove your individual strength',
        bonus: { type: 'experience', value: 1.5 }
      }
    ]
  },
  
  CHAPTER3_ARTIFACT: {
    id: 'chapter3_artifact',
    question: 'You find an ancient artifact. What do you do?',
    choices: [
      {
        id: 'keep',
        text: 'Keep it for yourself',
        effect: 'power',
        consequence: 'Gain power but attract enemies',
        bonus: { type: 'equipment', item: 'ANCIENT_AMULET' },
        unlocksSecret: 'CORRUPTED_GUARDIAN'
      },
      {
        id: 'destroy',
        text: 'Destroy it to prevent evil',
        effect: 'heroic',
        consequence: 'Earn respect but lose power',
        bonus: { type: 'reputation', value: 100 },
        unlocksSecret: 'SPIRIT_ELDER'
      }
    ]
  },
  
  FINAL_CHOICE: {
    id: 'final_choice',
    question: 'The final battle approaches. Choose your path.',
    choices: [
      {
        id: 'redemption',
        text: 'Seek to redeem the villain',
        effect: 'mercy',
        consequence: 'Unlock the true ending',
        unlocksEnding: 'TRUE_ENDING'
      },
      {
        id: 'destruction',
        text: 'Destroy the villain completely',
        effect: 'justice',
        consequence: 'Unlock the justice ending',
        unlocksEnding: 'JUSTICE_ENDING'
      },
      {
        id: 'sacrifice',
        text: 'Sacrifice yourself to save all',
        effect: 'sacrifice',
        consequence: 'Unlock the hero ending',
        unlocksEnding: 'HERO_ENDING'
      }
    ]
  }
};

export const CHARACTER_BACKSTORIES = {
  DONOVAN_RAGE: {
    title: 'The Fury Unleashed',
    unlocked: true,
    story: [
      'Donovan was once a peaceful monk who mastered inner calm.',
      'Betrayed by his closest friend, rage consumed his entire being.',
      'Unable to control his fury, he left the monastery seeking battles.',
      'Now he channels pure rage into devastating combat, seeking release through conflict.'
    ],
    artwork: '😡🔥',
    avatarImage: 'rage-avatar.png',
    unlock: 'Default'
  },
  
  EMBER: {
    title: 'The Firestarter',
    unlocked: false,
    story: [
      'Born in the volcanic region of Ignis Peak, Ember was always drawn to flames.',
      'As a child, she accidentally set fire to her village during a tantrum.',
      'Haunted by guilt, she trained to control her powers and protect others.',
      'Now she channels her rage into disciplined combat, never forgetting her past.'
    ],
    artwork: '🔥🌋',
    avatarImage: 'ember-the-firestarter-avatar.png',
    unlock: 'Defeat Ember in Story Mode'
  },
  
  FROST: {
    title: 'The Frozen Heart',
    unlocked: false,
    story: [
      'Once a passionate warrior, Frost lost everything in a brutal war.',
      'His heart froze over as he watched his comrades fall one by one.',
      'He retreated to the frozen wastes, where he mastered ice magic.',
      'Now he fights with cold precision, emotion buried deep beneath ice.'
    ],
    artwork: '❄️🏔️',
    avatarImage: 'frost-the-frozen-avatar.png',
    unlock: 'Defeat Frost in Story Mode'
  },
  
  AQUA: {
    title: 'The Tidekeeper',
    unlocked: false,
    story: [
      'Aqua was a sailor who survived a catastrophic storm.',
      'She emerged with the power to control water and predict tides.',
      'Some say she made a pact with an ocean deity to survive.',
      'She now travels the world, following the call of the sea.'
    ],
    artwork: '💧🌊',
    avatarImage: 'water-avatar.png',
    unlock: 'Defeat Aqua in Story Mode'
  },
  
  VOLT: {
    title: 'The Lightning Born',
    unlocked: false,
    story: [
      'Volt was struck by lightning during a storm ritual.',
      'Instead of dying, his body absorbed the electricity.',
      'He became faster, sharper, and charged with raw power.',
      'He seeks to master the storm that gave him this gift.'
    ],
    artwork: '⚡🌩️',
    avatarImage: 'vol- the-electrifier-avatar.png',
    unlock: 'Defeat Volt in Story Mode'
  },
  
  TERRA: {
    title: 'The Mountain Sage',
    unlocked: false,
    story: [
      'Terra lived as a hermit in the ancient mountains for decades.',
      'He studied the earth, learning its secrets and strength.',
      'An earthquake buried him alive, but he emerged transformed.',
      'Now one with the earth, he cannot be shaken or moved.'
    ],
    artwork: '🌍⛰️',
    avatarImage: 'terra-the-earthshaker-avatar.png',
    unlock: 'Defeat Terra in Story Mode'
  },
  
  LUXOR: {
    title: 'The Lightbringer',
    unlocked: false,
    story: [
      'Luxor was a priest who witnessed corruption in the temple.',
      'He fled with sacred light magic, becoming a wanderer.',
      'He seeks to purify darkness wherever it appears.',
      'His light is both a blessing and a burden.'
    ],
    artwork: '✨☀️',
    avatarImage: 'lumina-the-radiant-avatar.png',
    unlock: 'Complete Chapter 2 (Light Path)'
  },
  
  SHADOW: {
    title: 'The Void Walker',
    unlocked: false,
    story: [
      'Shadow was once a normal person, until they fell into the Abyss.',
      'They wandered the darkness for years, losing their identity.',
      'When they emerged, they could manipulate shadows at will.',
      'They seek to understand what they became in that darkness.'
    ],
    artwork: '🌑👤',    avatarImage: 'void-walker-avatar.png',    unlock: 'Complete Chapter 2 (Dark Path)'
  }
};

export const SECRET_BOSSES = {
  CORRUPTED_GUARDIAN: {
    id: 'corrupted_guardian',
    name: 'Corrupted Guardian',
    avatar: '👹',
    element: 'DARK',
    difficulty: 'SECRET',
    description: 'A guardian corrupted by the ancient artifact',
    unlockCondition: 'Keep the artifact in Chapter 3',
    stage: 99,
    isBoss: true,
    isSecret: true,
    reward: '👹 Corrupted Power: +5 to all Dark cards',
    specialAbility: 'CORRUPTION_AURA',
    quotes: {
      start: 'You should have destroyed it...',
      win: 'The corruption spreads...',
      lose: 'Finally... free...',
      taunt: 'Your greed will consume you!'
    },
    strategy: {
      preferredElements: ['DARK', 'METEOR', 'POWER'],
      aggressiveness: 0.9,
      conservativeness: 0.3,
      abilityUsage: 1.0,
      counterPriority: 0.9
    }
  },
  
  SPIRIT_ELDER: {
    id: 'spirit_elder',
    name: 'Spirit Elder',
    avatar: '👻',
    element: 'LIGHT',
    difficulty: 'SECRET',
    description: 'An ancient spirit awakened by your heroism',
    unlockCondition: 'Destroy the artifact in Chapter 3',
    stage: 98,
    isBoss: true,
    isSecret: true,
    reward: '👻 Spirit Blessing: Revive one card per match',
    specialAbility: 'SPIRIT_REVIVAL',
    quotes: {
      start: 'Your nobility has summoned me...',
      win: 'You have passed the test.',
      lose: 'More training is needed.',
      taunt: 'Show me your true power!'
    },
    strategy: {
      preferredElements: ['LIGHT', 'NEUTRAL', 'ICE'],
      aggressiveness: 0.5,
      conservativeness: 0.8,
      abilityUsage: 0.9,
      counterPriority: 1.0
    }
  },
  
  ELEMENTAL_FUSION: {
    id: 'elemental_fusion',
    name: 'Elemental Fusion',
    avatar: '🌈',
    element: 'ALL',
    difficulty: 'SECRET',
    description: 'The combined power of all elements',
    unlockCondition: 'Defeat all chapter bosses on Master difficulty',
    stage: 100,
    isBoss: true,
    isSecret: true,
    reward: '🌈 Prismatic Deck: Access to all element cards',
    specialAbility: 'ELEMENT_SHIFT',
    quotes: {
      start: 'We are all elements as one!',
      win: 'Balance is restored.',
      lose: 'The fusion breaks...',
      taunt: 'Can you handle all our power?'
    },
    strategy: {
      preferredElements: ['FIRE', 'WATER', 'EARTH', 'ELECTRICITY', 'ICE', 'LIGHT', 'DARK'],
      aggressiveness: 0.8,
      conservativeness: 0.6,
      abilityUsage: 1.0,
      counterPriority: 0.9,
      adaptive: true,
      comboFocus: true
    }
  },
  
  TIME_KEEPER: {
    id: 'time_keeper',
    name: 'The Time Keeper',
    avatar: '⏰',
    element: 'NEUTRAL',
    difficulty: 'SECRET',
    description: 'Guardian of the timeline, testing your worth',
    unlockCondition: 'Win 10 battles with 0 cards remaining',
    stage: 97,
    isBoss: true,
    isSecret: true,
    reward: '⏰ Time Mastery: Draw extra card every 3 turns',
    specialAbility: 'TIME_MANIPULATION',
    quotes: {
      start: 'Time to test your mettle...',
      win: 'You have earned your place in history.',
      lose: 'Time waits for no one.',
      taunt: 'Running out of time!'
    },
    strategy: {
      preferredElements: ['NEUTRAL', 'TECHNOLOGY'],
      aggressiveness: 0.7,
      conservativeness: 0.7,
      abilityUsage: 1.0,
      counterPriority: 1.0,
      predictive: true
    }
  },
  
  MIRROR_SELF: {
    id: 'mirror_self',
    name: 'Your Shadow',
    avatar: '🪞',
    element: 'MIRROR',
    difficulty: 'SECRET',
    description: 'Your own reflection, mirroring your every move',
    unlockCondition: 'Complete the game with all three endings',
    stage: 101,
    isBoss: true,
    isSecret: true,
    reward: '🪞 Perfect Reflection: Copy opponent\'s last card',
    specialAbility: 'MIRROR_MATCH',
    quotes: {
      start: 'Face yourself...',
      win: 'You have accepted who you are.',
      lose: 'You cannot escape yourself.',
      taunt: 'Know thyself!'
    },
    strategy: {
      preferredElements: [], // Copies player's deck
      aggressiveness: 0.8,
      conservativeness: 0.5,
      abilityUsage: 0.9,
      counterPriority: 1.0,
      mirror: true // Special: copies player's strategy
    }
  }
};

export const STORY_CUTSCENES = {
  OPENING: {
    id: 'opening',
    title: 'The Beginning',
    scenes: [
      {
        background: '🌅',
        character: null,
        text: 'In a world where elements clash...',
        duration: 3000
      },
      {
        background: '⚔️',
        character: null,
        text: 'Only the strongest will survive.',
        duration: 3000
      },
      {
        background: '🌟',
        character: '🧙',
        speaker: 'Narrator',
        text: 'Your journey begins now, chosen one.',
        duration: 4000
      }
    ]
  },
  
  CHAPTER1_INTRO: {
    id: 'chapter1_intro',
    title: 'Chapter 1: The Awakening',
    scenes: [
      {
        background: '🌲',
        character: '🧙',
        speaker: 'Elder',
        text: 'Young warrior, dark forces stir in the forest.',
        duration: 4000
      },
      {
        background: '🌲',
        character: '🧙',
        speaker: 'Elder',
        text: 'You must prove yourself against the elemental masters.',
        duration: 4000
      },
      {
        background: '⚔️',
        character: null,
        text: 'Your first trial awaits...',
        duration: 3000
      }
    ]
  },
  
  CHAPTER2_INTRO: {
    id: 'chapter2_intro',
    title: 'Chapter 2: The Crossroads',
    scenes: [
      {
        background: '🌳',
        character: null,
        text: 'You have proven your strength.',
        duration: 3000
      },
      {
        background: '🛤️',
        character: null,
        text: 'But now you face a choice...',
        duration: 3000
      },
      {
        background: '🌓',
        character: null,
        text: 'Light or darkness? The path is yours.',
        duration: 4000
      }
    ]
  },
  
  CHAPTER3_INTRO: {
    id: 'chapter3_intro',
    title: 'Chapter 3: The Artifact',
    scenes: [
      {
        background: '🏛️',
        character: null,
        text: 'Deep in ancient ruins...',
        duration: 3000
      },
      {
        background: '💎',
        character: null,
        text: 'An artifact of immense power awaits.',
        duration: 3000
      },
      {
        background: '⚠️',
        character: '👻',
        speaker: 'Spirit',
        text: 'Beware... power corrupts all who seek it.',
        duration: 4000
      }
    ]
  },
  
  FINAL_BATTLE_INTRO: {
    id: 'final_intro',
    title: 'The Final Battle',
    scenes: [
      {
        background: '🌋',
        character: '😈',
        speaker: 'Dark Lord',
        text: 'So, you have made it this far...',
        duration: 4000
      },
      {
        background: '🌋',
        character: '😈',
        speaker: 'Dark Lord',
        text: 'But you cannot stop what has already begun!',
        duration: 4000
      },
      {
        background: '⚔️',
        character: null,
        text: 'The fate of the world hangs in the balance...',
        duration: 4000
      }
    ]
  },
  
  TRUE_ENDING: {
    id: 'true_ending',
    title: 'True Ending: Redemption',
    scenes: [
      {
        background: '✨',
        character: '😇',
        speaker: 'Redeemed Lord',
        text: 'Thank you... for believing in me.',
        duration: 4000
      },
      {
        background: '🌈',
        character: null,
        text: 'Peace returns to the land.',
        duration: 3000
      },
      {
        background: '🏆',
        character: null,
        text: 'You have achieved the True Ending!',
        duration: 4000
      }
    ]
  },
  
  JUSTICE_ENDING: {
    id: 'justice_ending',
    title: 'Justice Ending: Victory',
    scenes: [
      {
        background: '💥',
        character: null,
        text: 'Evil has been vanquished!',
        duration: 3000
      },
      {
        background: '⚖️',
        character: null,
        text: 'Justice prevails.',
        duration: 3000
      },
      {
        background: '🏆',
        character: null,
        text: 'You have achieved the Justice Ending!',
        duration: 4000
      }
    ]
  },
  
  HERO_ENDING: {
    id: 'hero_ending',
    title: 'Hero Ending: Sacrifice',
    scenes: [
      {
        background: '✨',
        character: null,
        text: 'Your sacrifice saved everyone...',
        duration: 3000
      },
      {
        background: '🌟',
        character: null,
        text: 'You will be remembered as a true hero.',
        duration: 3000
      },
      {
        background: '🏆',
        character: null,
        text: 'You have achieved the Hero Ending!',
        duration: 4000
      }
    ]
  }
};

export const ENHANCED_CHAPTERS = {
  CHAPTER_1: {
    id: 1,
    name: 'The Awakening',
    icon: '🌱',
    description: 'Begin your journey and face your first elemental challenges',
    stages: [1, 2, 3, 4, 5],
    bosses: [5],
    cutscenes: ['CHAPTER1_INTRO'],
    choices: ['CHAPTER1_PATH'],
    unlocked: true
  },
  
  CHAPTER_2: {
    id: 2,
    name: 'The Crossroads',
    icon: '🛤️',
    description: 'Choose your path: Light or Darkness',
    stages: [6, 7, 8, 9, 10],
    bosses: [10],
    cutscenes: ['CHAPTER2_INTRO'],
    choices: ['CHAPTER2_ALLIANCE'],
    unlocked: false,
    requirement: 'Complete Chapter 1'
  },
  
  CHAPTER_3: {
    id: 3,
    name: 'The Artifact',
    icon: '💎',
    description: 'Discover ancient power and face temptation',
    stages: [11, 12, 13, 14, 15],
    bosses: [15],
    cutscenes: ['CHAPTER3_INTRO'],
    choices: ['CHAPTER3_ARTIFACT'],
    unlocked: false,
    requirement: 'Complete Chapter 2'
  },
  
  CHAPTER_4: {
    id: 4,
    name: 'The Final Battle',
    icon: '⚔️',
    description: 'Face the ultimate evil and choose your destiny',
    stages: [16, 17, 18, 19, 20],
    bosses: [20],
    cutscenes: ['FINAL_BATTLE_INTRO'],
    choices: ['FINAL_CHOICE'],
    unlocked: false,
    requirement: 'Complete Chapter 3'
  },
  
  SECRET_CHAPTER: {
    id: 5,
    name: 'The Hidden Truth',
    icon: '👁️',
    description: 'Uncover the deepest secrets',
    stages: [97, 98, 99, 100, 101],
    bosses: [97, 98, 99, 100, 101],
    cutscenes: [],
    choices: [],
    unlocked: false,
    requirement: 'Unlock all secret bosses',
    isSecret: true
  }
};

// Initialize story progress
export function initializeStoryProgress() {
  return {
    currentChapter: 1,
    currentStage: 0,
    difficulty: 'warrior',
    completedStages: [],
    completedChapters: [],
    unlockedChapters: [1],
    choices: {},
    unlockedBackstories: ['DONOVAN_RAGE'],
    unlockedSecretBosses: [],
    unlockedEndings: [],
    stats: {
      totalVictories: 0,
      perfectVictories: 0, // Won with 0 cards remaining
      stagesCompleted: 0,
      secretsFound: 0
    }
  };
}

// Save story choice
export function saveStoryChoice(progress, choiceId, selectedChoice) {
  const newProgress = { ...progress };
  newProgress.choices[choiceId] = selectedChoice;
  
  // Apply choice consequences
  const choice = STORY_CHOICES[choiceId];
  if (choice) {
    const selected = choice.choices.find(c => c.id === selectedChoice);
    if (selected) {
      // Unlock stages
      if (selected.unlocksStage) {
        // Would unlock specific stage
      }
      
      // Unlock secret bosses
      if (selected.unlocksSecret) {
        if (!newProgress.unlockedSecretBosses.includes(selected.unlocksSecret)) {
          newProgress.unlockedSecretBosses.push(selected.unlocksSecret);
        }
      }
    }
  }
  
  return newProgress;
}

// Check if secret boss is unlocked
export function checkSecretBossUnlock(progress, secretBossId) {
  const boss = SECRET_BOSSES[secretBossId];
  if (!boss) return false;
  
  // Check based on unlock condition
  if (secretBossId === 'CORRUPTED_GUARDIAN') {
    return progress.choices.chapter3_artifact === 'keep';
  }
  
  if (secretBossId === 'SPIRIT_ELDER') {
    return progress.choices.chapter3_artifact === 'destroy';
  }
  
  if (secretBossId === 'ELEMENTAL_FUSION') {
    // Check if all chapters completed on Master
    return progress.completedChapters.length >= 4 && progress.difficulty === 'master';
  }
  
  if (secretBossId === 'TIME_KEEPER') {
    return progress.stats.perfectVictories >= 10;
  }
  
  if (secretBossId === 'MIRROR_SELF') {
    return progress.unlockedEndings.length >= 3;
  }
  
  return progress.unlockedSecretBosses.includes(secretBossId);
}

// Unlock backstory after defeating character
export function unlockBackstory(progress, characterId) {
  const newProgress = { ...progress };
  if (!newProgress.unlockedBackstories.includes(characterId)) {
    newProgress.unlockedBackstories.push(characterId);
  }
  return newProgress;
}

// Update difficulty modifiers
export function applyDifficultyModifiers(card, difficulty, isAI) {
  const diff = DIFFICULTY_LEVELS[difficulty.toUpperCase()];
  if (!diff) return card;
  
  const modifiedCard = { ...card };
  
  if (isAI) {
    modifiedCard.strength = Math.round((card.strength || 0) * diff.aiHandicap);
  } else {
    modifiedCard.strength = Math.round((card.strength || 0) * diff.playerBonus);
  }
  
  return modifiedCard;
}

export default {
  DIFFICULTY_LEVELS,
  STORY_CHOICES,
  CHARACTER_BACKSTORIES,
  SECRET_BOSSES,
  STORY_CUTSCENES,
  ENHANCED_CHAPTERS,
  initializeStoryProgress,
  saveStoryChoice,
  checkSecretBossUnlock,
  unlockBackstory,
  applyDifficultyModifiers
};

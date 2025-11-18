// Daily challenges system with special rulesets

export const CHALLENGE_TYPES = {
  ELEMENT_ONLY: 'element_only',
  STRENGTH_LIMIT: 'strength_limit',
  STRENGTH_MINIMUM: 'strength_minimum',
  NO_ELEMENT: 'no_element',
  FAST_GAME: 'fast_game',
  SURVIVAL: 'survival',
  PERFECT_GAME: 'perfect_game'
};

export const DAILY_CHALLENGES = [
  {
    id: 'fire_only',
    name: 'Fire Master',
    description: 'Win using only FIRE element cards',
    type: CHALLENGE_TYPES.ELEMENT_ONLY,
    element: 'FIRE',
    reward: { coins: 150, exp: 50 },
    icon: '🔥'
  },
  {
    id: 'ice_only',
    name: 'Ice Master',
    description: 'Win using only ICE element cards',
    type: CHALLENGE_TYPES.ELEMENT_ONLY,
    element: 'ICE',
    reward: { coins: 150, exp: 50 },
    icon: '❄️'
  },
  {
    id: 'low_strength',
    name: 'Underdog Victory',
    description: 'Win without playing any cards above strength 5',
    type: CHALLENGE_TYPES.STRENGTH_LIMIT,
    maxStrength: 5,
    reward: { coins: 200, exp: 75 },
    icon: '🎯'
  },
  {
    id: 'high_strength',
    name: 'Power Player',
    description: 'Win using only cards with strength 6 or higher',
    type: CHALLENGE_TYPES.STRENGTH_MINIMUM,
    minStrength: 6,
    reward: { coins: 200, exp: 75 },
    icon: '💪'
  },
  {
    id: 'no_fire',
    name: 'Fire Ban',
    description: 'Win without using any FIRE cards',
    type: CHALLENGE_TYPES.NO_ELEMENT,
    element: 'FIRE',
    reward: { coins: 100, exp: 40 },
    icon: '🚫'
  },
  {
    id: 'speed_run',
    name: 'Speed Demon',
    description: 'Win in under 3 minutes',
    type: CHALLENGE_TYPES.FAST_GAME,
    timeLimit: 180,
    reward: { coins: 250, exp: 100 },
    icon: '⚡'
  },
  {
    id: 'perfect',
    name: 'Flawless Victory',
    description: 'Win without losing a single round',
    type: CHALLENGE_TYPES.PERFECT_GAME,
    reward: { coins: 300, exp: 150 },
    icon: '👑'
  },
  {
    id: 'survival',
    name: 'Last Stand',
    description: 'Win with 5 or fewer cards remaining in deck',
    type: CHALLENGE_TYPES.SURVIVAL,
    maxCardsRemaining: 5,
    reward: { coins: 175, exp: 60 },
    icon: '🛡️'
  }
];

export class DailyChallengeSystem {
  constructor() {
    this.challenges = this.loadChallenges();
    this.activeChallenge = null;
  }

  // Load challenges from localStorage
  loadChallenges() {
    const saved = localStorage.getItem('dailyChallenges');
    if (saved) {
      const data = JSON.parse(saved);
      const today = new Date().toDateString();
      
      // Reset if it's a new day
      if (data.date !== today) {
        return this.generateDailyChallenges();
      }
      return data;
    }
    return this.generateDailyChallenges();
  }

  // Generate daily challenges
  generateDailyChallenges() {
    const today = new Date().toDateString();
    const seed = new Date().getDate();
    
    // Select 3 random challenges based on day
    const shuffled = [...DAILY_CHALLENGES].sort(() => {
      return (seed % 2) - 0.5;
    });
    
    const dailyChallenges = shuffled.slice(0, 3).map((challenge, index) => ({
      ...challenge,
      completed: false,
      progress: 0,
      slot: index
    }));

    const data = {
      date: today,
      challenges: dailyChallenges,
      totalCompleted: 0
    };

    localStorage.setItem('dailyChallenges', JSON.stringify(data));
    return data;
  }

  // Save challenges
  saveChallenges() {
    localStorage.setItem('dailyChallenges', JSON.stringify(this.challenges));
  }

  // Start a challenge
  startChallenge(challengeId) {
    const challenge = this.challenges.challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      this.activeChallenge = challenge;
      return challenge;
    }
    return null;
  }

  // Validate game state against challenge rules
  validateChallenge(gameState, playedCards, gameTime, roundsWon, roundsLost) {
    if (!this.activeChallenge) return { valid: true };

    const challenge = this.activeChallenge;
    const violations = [];

    switch (challenge.type) {
      case CHALLENGE_TYPES.ELEMENT_ONLY:
        const invalidCards = playedCards.filter(card => card.element !== challenge.element);
        if (invalidCards.length > 0) {
          violations.push(`Played ${invalidCards.length} non-${challenge.element} cards`);
        }
        break;

      case CHALLENGE_TYPES.STRENGTH_LIMIT:
        const tooStrong = playedCards.filter(card => 
          (card.modifiedStrength || card.strength) > challenge.maxStrength
        );
        if (tooStrong.length > 0) {
          violations.push(`Played ${tooStrong.length} cards above strength ${challenge.maxStrength}`);
        }
        break;

      case CHALLENGE_TYPES.STRENGTH_MINIMUM:
        const tooWeak = playedCards.filter(card => 
          (card.modifiedStrength || card.strength) < challenge.minStrength
        );
        if (tooWeak.length > 0) {
          violations.push(`Played ${tooWeak.length} cards below strength ${challenge.minStrength}`);
        }
        break;

      case CHALLENGE_TYPES.NO_ELEMENT:
        const bannedCards = playedCards.filter(card => card.element === challenge.element);
        if (bannedCards.length > 0) {
          violations.push(`Played ${bannedCards.length} banned ${challenge.element} cards`);
        }
        break;

      case CHALLENGE_TYPES.FAST_GAME:
        if (gameTime > challenge.timeLimit) {
          violations.push(`Game took ${gameTime}s (limit: ${challenge.timeLimit}s)`);
        }
        break;

      case CHALLENGE_TYPES.PERFECT_GAME:
        if (roundsLost > 0) {
          violations.push(`Lost ${roundsLost} rounds (must be 0)`);
        }
        break;

      case CHALLENGE_TYPES.SURVIVAL:
        const cardsRemaining = (gameState.players?.[0]?.deck?.length || 0) + 
                              (gameState.players?.[0]?.hand?.length || 0);
        if (cardsRemaining > challenge.maxCardsRemaining) {
          violations.push(`${cardsRemaining} cards remaining (max: ${challenge.maxCardsRemaining})`);
        }
        break;
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // Complete a challenge
  completeChallenge(challengeId, playerInventory) {
    const challenge = this.challenges.challenges.find(c => c.id === challengeId);
    if (challenge && !challenge.completed) {
      challenge.completed = true;
      challenge.progress = 100;
      this.challenges.totalCompleted++;
      
      // Award rewards
      if (playerInventory && typeof playerInventory.addCurrency === 'function') {
        playerInventory.addCurrency(challenge.reward.coins);
      } else if (playerInventory && typeof playerInventory.currency === 'number') {
        // Fallback: directly modify currency if method doesn't exist
        playerInventory.currency = (playerInventory.currency || 0) + challenge.reward.coins;
      }
      
      this.saveChallenges();
      this.activeChallenge = null;
      
      return {
        success: true,
        reward: challenge.reward
      };
    }
    return { success: false };
  }

  // Get today's challenges
  getTodaysChallenges() {
    return this.challenges.challenges;
  }

  // Get challenge by ID
  getChallenge(challengeId) {
    return this.challenges.challenges.find(c => c.id === challengeId);
  }
}

export const dailyChallengeSystem = new DailyChallengeSystem();

export default dailyChallengeSystem;

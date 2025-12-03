/**
 * Combo System
 * Rewards players for playing cards in specific sequences or patterns
 */

// Combo Definitions
export const COMBOS = {
  // Element-based Combos
  ELEMENTAL_STORM: {
    id: 'elemental_storm',
    name: 'Elemental Storm',
    icon: '🌪️',
    description: 'Play 3 different elements in a row',
    requirements: { differentElements: 3 },
    reward: { strengthBonus: 3, message: 'Elemental Storm! +3 strength to next card!' },
    color: '#9C27B0',
    tier: 'SILVER'
  },
  MONO_MASTERY: {
    id: 'mono_mastery',
    name: 'Mono Mastery',
    icon: '🎯',
    description: 'Play 3 cards of the same element consecutively',
    requirements: { sameElement: 3 },
    reward: { strengthBonus: 4, healPlayer: 2, message: 'Mono Mastery! +4 strength and heal 2 HP!' },
    color: '#4CAF50',
    tier: 'GOLD'
  },
  OPPOSITE_FORCES: {
    id: 'opposite_forces',
    name: 'Opposite Forces',
    icon: '☯️',
    description: 'Play LIGHT then DARK (or vice versa)',
    requirements: { sequence: ['LIGHT', 'DARK'], bidirectional: true },
    reward: { strengthBonus: 5, drawCard: true, message: 'Opposite Forces! +5 strength and draw a card!' },
    color: '#607D8B',
    tier: 'GOLD'
  },
  NATURE_CYCLE: {
    id: 'nature_cycle',
    name: 'Nature Cycle',
    icon: '🔄',
    description: 'Play WATER → NATURE → EARTH',
    requirements: { sequence: ['WATER', 'NATURE', 'EARTH'] },
    reward: { strengthBonus: 4, shieldPlayer: 3, message: 'Nature Cycle! +4 strength and gain 3 shield!' },
    color: '#8BC34A',
    tier: 'GOLD'
  },
  FIRE_AND_ICE: {
    id: 'fire_and_ice',
    name: 'Fire and Ice',
    icon: '🔥❄️',
    description: 'Play FIRE then ICE consecutively',
    requirements: { sequence: ['FIRE', 'ICE'] },
    reward: { strengthBonus: 3, freezeOpponent: 1, message: 'Fire and Ice! +3 strength and freeze opponent for 1 turn!' },
    color: '#FF5722',
    tier: 'SILVER'
  },
  POWER_SURGE: {
    id: 'power_surge',
    name: 'Power Surge',
    icon: '⚡',
    description: 'Play ELECTRICITY → POWER → TECHNOLOGY',
    requirements: { sequence: ['ELECTRICITY', 'POWER', 'TECHNOLOGY'] },
    reward: { strengthBonus: 6, doubleNextDamage: true, message: 'Power Surge! +6 strength and double next card damage!' },
    color: '#FFC107',
    tier: 'PLATINUM'
  },
  
  // Strength-based Combos
  ASCENDING_POWER: {
    id: 'ascending_power',
    name: 'Ascending Power',
    icon: '📈',
    description: 'Play 3 cards with increasing strength',
    requirements: { ascendingStrength: 3 },
    reward: { strengthBonus: 3, message: 'Ascending Power! +3 strength bonus!' },
    color: '#2196F3',
    tier: 'BRONZE'
  },
  POWER_TRIO: {
    id: 'power_trio',
    name: 'Power Trio',
    icon: '💪',
    description: 'Play 3 cards with 7+ strength each',
    requirements: { minStrengthCards: { count: 3, minStrength: 7 } },
    reward: { strengthBonus: 5, message: 'Power Trio! Overwhelming force! +5 strength!' },
    color: '#F44336',
    tier: 'GOLD'
  },
  UNDERDOG: {
    id: 'underdog',
    name: 'Underdog Victory',
    icon: '🏆',
    description: 'Win 3 rounds with lower strength cards',
    requirements: { underdogWins: 3 },
    reward: { healPlayer: 5, strengthBonus: 4, message: 'Underdog Victory! Heal 5 HP and +4 strength!' },
    color: '#9C27B0',
    tier: 'PLATINUM'
  },

  // Win Streak Combos
  WIN_STREAK_3: {
    id: 'win_streak_3',
    name: 'Triple Threat',
    icon: '🔥',
    description: 'Win 3 rounds in a row',
    requirements: { winStreak: 3 },
    reward: { strengthBonus: 2, message: 'Triple Threat! +2 strength!' },
    color: '#FF9800',
    tier: 'BRONZE'
  },
  WIN_STREAK_5: {
    id: 'win_streak_5',
    name: 'Domination',
    icon: '👑',
    description: 'Win 5 rounds in a row',
    requirements: { winStreak: 5 },
    reward: { strengthBonus: 4, healPlayer: 3, message: 'Domination! +4 strength and heal 3 HP!' },
    color: '#E91E63',
    tier: 'GOLD'
  },
  PERFECT_GAME: {
    id: 'perfect_game',
    name: 'Perfect Game',
    icon: '⭐',
    description: 'Win without losing a single round',
    requirements: { perfectGame: true },
    reward: { bonusXP: 100, rareDrop: true, message: 'PERFECT GAME! Massive XP bonus and rare drop!' },
    color: '#FFD700',
    tier: 'LEGENDARY'
  },

  // Special Combos
  LUCKY_SEVEN: {
    id: 'lucky_seven',
    name: 'Lucky Seven',
    icon: '🎰',
    description: 'Play a card with exactly 7 strength three times',
    requirements: { exactStrength: { value: 7, count: 3 } },
    reward: { strengthBonus: 7, drawCard: true, message: 'Lucky Seven! +7 strength and draw a card!' },
    color: '#4CAF50',
    tier: 'SILVER'
  },
  METEOR_SHOWER: {
    id: 'meteor_shower',
    name: 'Meteor Shower',
    icon: '☄️',
    description: 'Play 2 METEOR cards in one game',
    requirements: { elementCount: { element: 'METEOR', count: 2 } },
    reward: { aoeStrike: 3, message: 'Meteor Shower! Deal 3 damage to all opponent cards!' },
    color: '#FF5722',
    tier: 'PLATINUM'
  },
  CHAOS_MASTER: {
    id: 'chaos_master',
    name: 'Chaos Master',
    icon: '🌀',
    description: 'Play 5 different elements in a single game',
    requirements: { uniqueElements: 5 },
    reward: { strengthBonus: 3, randomBuff: true, message: 'Chaos Master! +3 strength and random buff!' },
    color: '#673AB7',
    tier: 'SILVER'
  },
  RAINBOW_WARRIOR: {
    id: 'rainbow_warrior',
    name: 'Rainbow Warrior',
    icon: '🌈',
    description: 'Play 8 different elements in a single game',
    requirements: { uniqueElements: 8 },
    reward: { strengthBonus: 8, healPlayer: 5, shieldPlayer: 5, message: 'RAINBOW WARRIOR! Ultimate elemental mastery!' },
    color: '#FF1493',
    tier: 'LEGENDARY'
  }
};

// Combo Tiers with multipliers
export const COMBO_TIERS = {
  BRONZE: { name: 'Bronze', color: '#CD7F32', xpMultiplier: 1.0, icon: '🥉' },
  SILVER: { name: 'Silver', color: '#C0C0C0', xpMultiplier: 1.5, icon: '🥈' },
  GOLD: { name: 'Gold', color: '#FFD700', xpMultiplier: 2.0, icon: '🥇' },
  PLATINUM: { name: 'Platinum', color: '#E5E4E2', xpMultiplier: 2.5, icon: '💎' },
  LEGENDARY: { name: 'Legendary', color: '#FF4500', xpMultiplier: 3.0, icon: '🏆' }
};

/**
 * Combo Tracker - tracks game state for combo detection
 */
export class ComboTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.playedCards = [];
    this.roundResults = [];
    this.winStreak = 0;
    this.currentStreak = 0;
    this.underdogWins = 0;
    this.uniqueElements = new Set();
    this.elementCounts = {};
    this.strengthHistory = [];
    this.achievedCombos = [];
    this.totalComboBonus = 0;
    this.activeBuffs = [];
  }

  /**
   * Record a card play
   */
  recordCardPlay(card, won = false, opponentStrength = 0) {
    this.playedCards.push({
      element: card.element,
      strength: card.modifiedStrength || card.strength,
      timestamp: Date.now(),
      won
    });

    // Track elements
    this.uniqueElements.add(card.element);
    this.elementCounts[card.element] = (this.elementCounts[card.element] || 0) + 1;

    // Track strength history
    this.strengthHistory.push(card.modifiedStrength || card.strength);

    // Track win streaks
    if (won) {
      this.currentStreak++;
      this.winStreak = Math.max(this.winStreak, this.currentStreak);
      
      // Check for underdog win (won with lower strength)
      if ((card.modifiedStrength || card.strength) < opponentStrength) {
        this.underdogWins++;
      }
    } else {
      this.currentStreak = 0;
    }

    this.roundResults.push({ won, cardStrength: card.strength, opponentStrength });

    // Check for combos after each play
    return this.checkCombos();
  }

  /**
   * Check all combos and return newly achieved ones
   */
  checkCombos() {
    const newCombos = [];

    for (const [comboId, combo] of Object.entries(COMBOS)) {
      // Skip already achieved combos
      if (this.achievedCombos.includes(comboId)) continue;

      if (this.checkComboRequirements(combo)) {
        this.achievedCombos.push(comboId);
        newCombos.push(combo);
        this.totalComboBonus += combo.reward.strengthBonus || 0;
      }
    }

    return newCombos;
  }

  /**
   * Check if combo requirements are met
   */
  checkComboRequirements(combo) {
    const req = combo.requirements;

    // Different elements check
    if (req.differentElements) {
      const recent = this.playedCards.slice(-req.differentElements);
      if (recent.length >= req.differentElements) {
        const elements = new Set(recent.map(c => c.element));
        if (elements.size >= req.differentElements) return true;
      }
    }

    // Same element check
    if (req.sameElement) {
      const recent = this.playedCards.slice(-req.sameElement);
      if (recent.length >= req.sameElement) {
        const elements = recent.map(c => c.element);
        if (elements.every(e => e === elements[0])) return true;
      }
    }

    // Sequence check
    if (req.sequence) {
      const seqLength = req.sequence.length;
      const recent = this.playedCards.slice(-seqLength);
      if (recent.length >= seqLength) {
        const elements = recent.map(c => c.element);
        const matches = req.sequence.every((e, i) => elements[i] === e);
        if (matches) return true;
        
        // Bidirectional check
        if (req.bidirectional) {
          const reversed = [...req.sequence].reverse();
          const reverseMatches = reversed.every((e, i) => elements[i] === e);
          if (reverseMatches) return true;
        }
      }
    }

    // Ascending strength check
    if (req.ascendingStrength) {
      const count = req.ascendingStrength;
      const recent = this.strengthHistory.slice(-count);
      if (recent.length >= count) {
        let ascending = true;
        for (let i = 1; i < recent.length; i++) {
          if (recent[i] <= recent[i - 1]) {
            ascending = false;
            break;
          }
        }
        if (ascending) return true;
      }
    }

    // Min strength cards check
    if (req.minStrengthCards) {
      const { count, minStrength } = req.minStrengthCards;
      const strongCards = this.playedCards.filter(c => c.strength >= minStrength);
      if (strongCards.length >= count) return true;
    }

    // Win streak check
    if (req.winStreak) {
      if (this.currentStreak >= req.winStreak) return true;
    }

    // Perfect game check
    if (req.perfectGame) {
      if (this.roundResults.length >= 5 && this.roundResults.every(r => r.won)) {
        return true;
      }
    }

    // Underdog wins check
    if (req.underdogWins) {
      if (this.underdogWins >= req.underdogWins) return true;
    }

    // Exact strength check
    if (req.exactStrength) {
      const { value, count } = req.exactStrength;
      const matchingCards = this.playedCards.filter(c => c.strength === value);
      if (matchingCards.length >= count) return true;
    }

    // Element count check
    if (req.elementCount) {
      const { element, count } = req.elementCount;
      if ((this.elementCounts[element] || 0) >= count) return true;
    }

    // Unique elements check
    if (req.uniqueElements) {
      if (this.uniqueElements.size >= req.uniqueElements) return true;
    }

    return false;
  }

  /**
   * Apply combo reward effects
   */
  applyComboReward(combo, context) {
    const { player, room } = context;
    const effects = [];

    if (combo.reward.strengthBonus) {
      this.activeBuffs.push({
        type: 'strength',
        value: combo.reward.strengthBonus,
        duration: 1
      });
      effects.push(`+${combo.reward.strengthBonus} strength to next card`);
    }

    if (combo.reward.healPlayer) {
      effects.push(`Heal ${combo.reward.healPlayer} HP`);
    }

    if (combo.reward.shieldPlayer) {
      effects.push(`Gain ${combo.reward.shieldPlayer} shield`);
    }

    if (combo.reward.drawCard) {
      effects.push('Draw a card');
    }

    if (combo.reward.freezeOpponent) {
      effects.push(`Freeze opponent for ${combo.reward.freezeOpponent} turn(s)`);
    }

    if (combo.reward.doubleNextDamage) {
      this.activeBuffs.push({
        type: 'damage_multiplier',
        value: 2,
        duration: 1
      });
      effects.push('Double damage on next card');
    }

    if (combo.reward.bonusXP) {
      effects.push(`+${combo.reward.bonusXP} bonus XP`);
    }

    if (combo.reward.rareDrop) {
      effects.push('Guaranteed rare drop!');
    }

    if (combo.reward.aoeStrike) {
      effects.push(`Deal ${combo.reward.aoeStrike} damage to all opponent cards`);
    }

    return {
      comboId: combo.id,
      comboName: combo.name,
      comboIcon: combo.icon,
      tier: COMBO_TIERS[combo.tier],
      effects,
      message: combo.reward.message
    };
  }

  /**
   * Get active strength bonus from combos
   */
  getActiveStrengthBonus() {
    const strengthBuffs = this.activeBuffs.filter(b => b.type === 'strength' && b.duration > 0);
    return strengthBuffs.reduce((sum, b) => sum + b.value, 0);
  }

  /**
   * Get damage multiplier from combos
   */
  getDamageMultiplier() {
    const multiplierBuffs = this.activeBuffs.filter(b => b.type === 'damage_multiplier' && b.duration > 0);
    return multiplierBuffs.reduce((mult, b) => mult * b.value, 1);
  }

  /**
   * Consume active buffs (reduce duration)
   */
  consumeBuffs() {
    this.activeBuffs = this.activeBuffs
      .map(b => ({ ...b, duration: b.duration - 1 }))
      .filter(b => b.duration > 0);
  }

  /**
   * Get combo progress for UI display
   */
  getComboProgress() {
    const progress = [];

    for (const [comboId, combo] of Object.entries(COMBOS)) {
      if (this.achievedCombos.includes(comboId)) {
        progress.push({
          ...combo,
          achieved: true,
          progress: 100
        });
        continue;
      }

      // Calculate progress percentage for each combo
      let currentProgress = 0;
      const req = combo.requirements;

      if (req.differentElements) {
        const recent = this.playedCards.slice(-req.differentElements);
        const uniqueRecent = new Set(recent.map(c => c.element)).size;
        currentProgress = (uniqueRecent / req.differentElements) * 100;
      } else if (req.sameElement) {
        // Count consecutive same elements
        let consecutive = 1;
        for (let i = this.playedCards.length - 1; i > 0; i--) {
          if (this.playedCards[i].element === this.playedCards[i - 1].element) {
            consecutive++;
          } else break;
        }
        currentProgress = (consecutive / req.sameElement) * 100;
      } else if (req.winStreak) {
        currentProgress = (this.currentStreak / req.winStreak) * 100;
      } else if (req.uniqueElements) {
        currentProgress = (this.uniqueElements.size / req.uniqueElements) * 100;
      }

      progress.push({
        ...combo,
        achieved: false,
        progress: Math.min(100, currentProgress)
      });
    }

    return progress;
  }

  /**
   * Get summary for end of game
   */
  getGameSummary() {
    return {
      totalCardsPlayed: this.playedCards.length,
      uniqueElementsUsed: this.uniqueElements.size,
      maxWinStreak: this.winStreak,
      underdogWins: this.underdogWins,
      combosAchieved: this.achievedCombos.map(id => COMBOS[id]),
      totalComboBonus: this.totalComboBonus,
      xpMultiplier: this.achievedCombos.reduce((mult, id) => {
        const combo = COMBOS[id];
        return mult * COMBO_TIERS[combo.tier].xpMultiplier;
      }, 1.0)
    };
  }
}

// Singleton instance
export const comboTracker = new ComboTracker();

export default {
  COMBOS,
  COMBO_TIERS,
  ComboTracker,
  comboTracker
};

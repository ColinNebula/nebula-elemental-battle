// Combo system for tracking element chains and bonuses

export const COMBO_THRESHOLDS = {
  SMALL: 2,   // 2 cards in a row
  MEDIUM: 3,  // 3 cards in a row
  LARGE: 4,   // 4 cards in a row
  MEGA: 5     // 5+ cards in a row
};

export const COMBO_BONUSES = {
  SMALL: {
    strengthBonus: 1,
    scoreBonus: 1,
    label: 'Combo x2!',
    color: '#4caf50'
  },
  MEDIUM: {
    strengthBonus: 2,
    scoreBonus: 2,
    label: 'Combo x3!',
    color: '#2196f3'
  },
  LARGE: {
    strengthBonus: 3,
    scoreBonus: 3,
    label: 'Mega Combo x4!',
    color: '#9c27b0'
  },
  MEGA: {
    strengthBonus: 5,
    scoreBonus: 5,
    label: 'ULTRA COMBO x5+!',
    color: '#ff9800'
  }
};

export class ComboTracker {
  constructor() {
    this.playerCombo = {
      element: null,
      count: 0,
      totalBonus: 0
    };
    this.aiCombo = {
      element: null,
      count: 0,
      totalBonus: 0
    };
  }

  // Update combo for a player
  updateCombo(playerId, cardElement, isAI = false) {
    const combo = isAI ? this.aiCombo : this.playerCombo;
    
    if (combo.element === cardElement) {
      // Continue combo
      combo.count++;
    } else {
      // New combo or broken combo
      combo.element = cardElement;
      combo.count = 1;
      combo.totalBonus = 0;
    }

    // Calculate bonus
    const bonus = this.getComboBonus(combo.count);
    if (bonus) {
      combo.totalBonus = bonus.strengthBonus;
      return {
        active: true,
        count: combo.count,
        element: cardElement,
        strengthBonus: bonus.strengthBonus,
        scoreBonus: bonus.scoreBonus,
        label: bonus.label,
        color: bonus.color
      };
    }

    return {
      active: false,
      count: combo.count,
      element: cardElement,
      strengthBonus: 0,
      scoreBonus: 0
    };
  }

  // Get combo bonus based on count
  getComboBonus(count) {
    if (count >= COMBO_THRESHOLDS.MEGA) {
      return COMBO_BONUSES.MEGA;
    } else if (count >= COMBO_THRESHOLDS.LARGE) {
      return COMBO_BONUSES.LARGE;
    } else if (count >= COMBO_THRESHOLDS.MEDIUM) {
      return COMBO_BONUSES.MEDIUM;
    } else if (count >= COMBO_THRESHOLDS.SMALL) {
      return COMBO_BONUSES.SMALL;
    }
    return null;
  }

  // Get current combo status
  getComboStatus(isAI = false) {
    const combo = isAI ? this.aiCombo : this.playerCombo;
    return {
      element: combo.element,
      count: combo.count,
      bonus: this.getComboBonus(combo.count)
    };
  }

  // Reset combo
  resetCombo(isAI = false) {
    if (isAI) {
      this.aiCombo = { element: null, count: 0, totalBonus: 0 };
    } else {
      this.playerCombo = { element: null, count: 0, totalBonus: 0 };
    }
  }

  // Reset all combos
  resetAll() {
    this.resetCombo(false);
    this.resetCombo(true);
  }
}

export default ComboTracker;

// Card evolution system - cards gain experience and evolve

export const EVOLUTION_TIERS = {
  BASIC: { level: 1, exp: 0, maxExp: 10, label: 'Basic' },
  EVOLVED: { level: 2, exp: 0, maxExp: 20, label: 'Evolved', strengthBonus: 1 },
  ADVANCED: { level: 3, exp: 0, maxExp: 30, label: 'Advanced', strengthBonus: 2 },
  MASTER: { level: 4, exp: 0, maxExp: 50, label: 'Master', strengthBonus: 3 },
  LEGENDARY: { level: 5, exp: 0, maxExp: Infinity, label: 'Legendary', strengthBonus: 5 }
};

export class CardEvolutionSystem {
  constructor() {
    this.cardRegistry = this.loadCardRegistry();
  }

  // Load card registry from localStorage
  loadCardRegistry() {
    const saved = localStorage.getItem('cardEvolutionRegistry');
    return saved ? JSON.parse(saved) : {};
  }

  // Save card registry to localStorage
  saveCardRegistry() {
    localStorage.setItem('cardEvolutionRegistry', JSON.stringify(this.cardRegistry));
  }

  // Get unique card ID
  getCardId(element, baseStrength) {
    return `${element}_${baseStrength}`;
  }

  // Get card evolution data
  getCardEvolution(element, baseStrength) {
    const cardId = this.getCardId(element, baseStrength);
    if (!this.cardRegistry[cardId]) {
      this.cardRegistry[cardId] = {
        element,
        baseStrength,
        experience: 0,
        level: 1,
        timesPlayed: 0,
        wins: 0,
        totalDamage: 0
      };
    }
    return this.cardRegistry[cardId];
  }

  // Add experience to a card
  addExperience(element, baseStrength, exp, won = false) {
    const cardData = this.getCardEvolution(element, baseStrength);
    const oldLevel = cardData.level;
    
    cardData.experience += exp;
    cardData.timesPlayed++;
    if (won) cardData.wins++;

    // Check for level up
    const tier = this.getTierForLevel(cardData.level);
    if (tier && cardData.experience >= tier.maxExp) {
      cardData.experience = 0;
      cardData.level = Math.min(cardData.level + 1, 5);
      
      const newLevel = cardData.level;
      const leveledUp = newLevel > oldLevel;
      
      this.saveCardRegistry();
      
      return {
        leveledUp,
        oldLevel,
        newLevel,
        cardData
      };
    }

    this.saveCardRegistry();
    return {
      leveledUp: false,
      cardData
    };
  }

  // Get tier data for level
  getTierForLevel(level) {
    switch (level) {
      case 1: return EVOLUTION_TIERS.BASIC;
      case 2: return EVOLUTION_TIERS.EVOLVED;
      case 3: return EVOLUTION_TIERS.ADVANCED;
      case 4: return EVOLUTION_TIERS.MASTER;
      case 5: return EVOLUTION_TIERS.LEGENDARY;
      default: return EVOLUTION_TIERS.BASIC;
    }
  }

  // Apply evolution bonuses to card
  applyEvolutionBonus(card) {
    const cardData = this.getCardEvolution(card.element, card.strength);
    const tier = this.getTierForLevel(cardData.level);
    
    if (tier.strengthBonus) {
      return {
        ...card,
        modifiedStrength: card.strength + tier.strengthBonus,
        evolutionLevel: cardData.level,
        evolutionLabel: tier.label,
        experience: cardData.experience,
        maxExperience: tier.maxExp
      };
    }
    
    return {
      ...card,
      evolutionLevel: cardData.level,
      evolutionLabel: tier.label,
      experience: cardData.experience,
      maxExperience: tier.maxExp
    };
  }

  // Get all evolved cards
  getAllEvolvedCards() {
    return Object.entries(this.cardRegistry)
      .filter(([_, data]) => data.level > 1)
      .map(([id, data]) => ({
        id,
        ...data,
        tier: this.getTierForLevel(data.level)
      }));
  }

  // Reset card evolution
  resetCard(element, baseStrength) {
    const cardId = this.getCardId(element, baseStrength);
    delete this.cardRegistry[cardId];
    this.saveCardRegistry();
  }

  // Reset all cards
  resetAll() {
    this.cardRegistry = {};
    this.saveCardRegistry();
  }
}

export const cardEvolutionSystem = new CardEvolutionSystem();

export default cardEvolutionSystem;

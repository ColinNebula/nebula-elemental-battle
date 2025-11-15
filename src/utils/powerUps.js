/**
 * Power-Up Cards & Items System
 * Includes rare collectible cards, consumable items, wild cards, and equipment
 */

// Power-Up Card Types
export const POWERUP_TYPES = {
  RARE_CARD: 'rare_card',
  CONSUMABLE: 'consumable',
  WILD_CARD: 'wild_card',
  EQUIPMENT: 'equipment'
};

// Rarity Tiers
export const RARITY = {
  COMMON: { name: 'Common', color: '#9E9E9E', dropRate: 0.50 },
  UNCOMMON: { name: 'Uncommon', color: '#4CAF50', dropRate: 0.30 },
  RARE: { name: 'Rare', color: '#2196F3', dropRate: 0.15 },
  EPIC: { name: 'Epic', color: '#9C27B0', dropRate: 0.04 },
  LEGENDARY: { name: 'Legendary', color: '#FF9800', dropRate: 0.01 }
};

// Rare Collectible Cards with Unique Abilities
export const RARE_CARDS = {
  PHOENIX_REBIRTH: {
    id: 'phoenix_rebirth',
    name: 'Phoenix Rebirth',
    element: 'Fire',
    baseStrength: 12,
    rarity: 'LEGENDARY',
    ability: 'resurrection',
    description: 'When defeated, returns to hand with +3 strength next turn',
    icon: '🔥🐦',
    uses: 1,
    cooldown: 3
  },
  TIDAL_WAVE: {
    id: 'tidal_wave',
    name: 'Tidal Wave',
    element: 'Water',
    baseStrength: 10,
    rarity: 'EPIC',
    ability: 'sweep',
    description: 'Damages all opponent cards by 2',
    icon: '🌊',
    uses: 2,
    cooldown: 2
  },
  THUNDERLORD: {
    id: 'thunderlord',
    name: 'Thunderlord',
    element: 'Electricity',
    baseStrength: 11,
    rarity: 'EPIC',
    ability: 'chain_lightning',
    description: 'Stuns opponent for 1 turn on victory',
    icon: '⚡👑',
    uses: 3,
    cooldown: 2
  },
  NATURES_GUARDIAN: {
    id: 'natures_guardian',
    name: "Nature's Guardian",
    element: 'Nature',
    baseStrength: 9,
    rarity: 'RARE',
    ability: 'healing',
    description: 'Heals 2 HP and grants shield when played',
    icon: '🌿🛡️',
    uses: 3,
    cooldown: 1
  },
  EARTHQUAKE: {
    id: 'earthquake',
    name: 'Earthquake',
    element: 'Earth',
    baseStrength: 13,
    rarity: 'LEGENDARY',
    ability: 'devastation',
    description: 'Destroys lowest strength card in opponent hand',
    icon: '🗻💥',
    uses: 1,
    cooldown: 4
  },
  FROST_TITAN: {
    id: 'frost_titan',
    name: 'Frost Titan',
    element: 'Ice',
    baseStrength: 10,
    rarity: 'EPIC',
    ability: 'deep_freeze',
    description: 'Freezes opponent for 2 turns on victory',
    icon: '❄️👹',
    uses: 2,
    cooldown: 3
  },
  ELEMENTAL_MASTER: {
    id: 'elemental_master',
    name: 'Elemental Master',
    element: 'All',
    baseStrength: 8,
    rarity: 'LEGENDARY',
    ability: 'element_shift',
    description: 'Changes element each turn to counter opponent',
    icon: '🌟',
    uses: 5,
    cooldown: 0
  },
  MIRROR_IMAGE: {
    id: 'mirror_image',
    name: 'Mirror Image',
    element: 'All',
    baseStrength: 0,
    rarity: 'RARE',
    ability: 'copy',
    description: 'Copies strength and element of opponent card',
    icon: '🪞',
    uses: 3,
    cooldown: 1
  },
  CARD_THIEF: {
    id: 'card_thief',
    name: 'Card Thief',
    element: 'All',
    baseStrength: 6,
    rarity: 'EPIC',
    ability: 'steal',
    description: 'Steals a random card from opponent hand',
    icon: '🎭',
    uses: 2,
    cooldown: 3
  },
  TIME_WARP: {
    id: 'time_warp',
    name: 'Time Warp',
    element: 'All',
    baseStrength: 7,
    rarity: 'LEGENDARY',
    ability: 'extra_turn',
    description: 'Play 2 cards this turn',
    icon: '⏰',
    uses: 1,
    cooldown: 5
  }
};

// Consumable Items
export const CONSUMABLES = {
  SHIELD_POTION: {
    id: 'shield_potion',
    name: 'Shield Potion',
    type: 'consumable',
    rarity: 'COMMON',
    effect: 'shield',
    value: 3,
    description: 'Grants 3 shield points',
    icon: '🛡️',
    cost: 50
  },
  DAMAGE_BOOSTER: {
    id: 'damage_booster',
    name: 'Damage Booster',
    type: 'consumable',
    rarity: 'COMMON',
    effect: 'strength',
    value: 2,
    description: 'Increases next card strength by 2',
    icon: '💪',
    cost: 50
  },
  CARD_DRAW: {
    id: 'card_draw',
    name: 'Card Draw',
    type: 'consumable',
    rarity: 'UNCOMMON',
    effect: 'draw',
    value: 2,
    description: 'Draw 2 additional cards',
    icon: '🎴',
    cost: 75
  },
  HEALTH_POTION: {
    id: 'health_potion',
    name: 'Health Potion',
    type: 'consumable',
    rarity: 'COMMON',
    effect: 'heal',
    value: 5,
    description: 'Restore 5 HP',
    icon: '❤️',
    cost: 60
  },
  ELEMENT_BOOST: {
    id: 'element_boost',
    name: 'Element Boost',
    type: 'consumable',
    rarity: 'UNCOMMON',
    effect: 'element_power',
    value: 3,
    description: 'Boost chosen element by 3 for 2 turns',
    icon: '✨',
    cost: 80
  },
  CLEANSE_POTION: {
    id: 'cleanse_potion',
    name: 'Cleanse Potion',
    type: 'consumable',
    rarity: 'RARE',
    effect: 'cleanse',
    value: 1,
    description: 'Remove all debuffs',
    icon: '🧪',
    cost: 100
  },
  REFLECT_SHIELD: {
    id: 'reflect_shield',
    name: 'Reflect Shield',
    type: 'consumable',
    rarity: 'RARE',
    effect: 'reflect',
    value: 2,
    description: 'Reflect damage for 2 turns',
    icon: '🔮',
    cost: 120
  },
  DOUBLE_STRIKE: {
    id: 'double_strike',
    name: 'Double Strike',
    type: 'consumable',
    rarity: 'EPIC',
    effect: 'double_damage',
    value: 1,
    description: 'Next card deals double damage',
    icon: '⚔️⚔️',
    cost: 150
  },
  TIME_STOP: {
    id: 'time_stop',
    name: 'Time Stop',
    type: 'consumable',
    rarity: 'LEGENDARY',
    effect: 'skip_turn',
    value: 1,
    description: 'Opponent skips their next turn',
    icon: '⏸️',
    cost: 200
  }
};

// Wild Cards
export const WILD_CARDS = {
  WILD_COMMON: {
    id: 'wild_common',
    name: 'Wild Card',
    element: 'Wild',
    baseStrength: 5,
    rarity: 'COMMON',
    ability: 'element_choice',
    description: 'Choose element when played',
    icon: '🃏',
    canBeAnyElement: true
  },
  WILD_UNCOMMON: {
    id: 'wild_uncommon',
    name: 'Adaptive Card',
    element: 'Wild',
    baseStrength: 7,
    rarity: 'UNCOMMON',
    ability: 'auto_adapt',
    description: 'Automatically becomes strongest element against opponent',
    icon: '🎴',
    canBeAnyElement: true
  },
  WILD_RARE: {
    id: 'wild_rare',
    name: 'Chameleon Card',
    element: 'Wild',
    baseStrength: 8,
    rarity: 'RARE',
    ability: 'element_match',
    description: 'Matches opponent element and gains +2 strength',
    icon: '🦎',
    canBeAnyElement: true
  },
  WILD_EPIC: {
    id: 'wild_epic',
    name: 'Prismatic Card',
    element: 'Wild',
    baseStrength: 9,
    rarity: 'EPIC',
    ability: 'all_elements',
    description: 'Counts as all elements simultaneously',
    icon: '🌈',
    canBeAnyElement: true
  }
};

// Equipment System
export const EQUIPMENT = {
  // Weapons
  FIRE_SWORD: {
    id: 'fire_sword',
    name: 'Fire Sword',
    slot: 'weapon',
    rarity: 'UNCOMMON',
    effect: 'element_boost',
    element: 'Fire',
    value: 2,
    description: '+2 to all Fire cards',
    icon: '🗡️🔥',
    cost: 100
  },
  ICE_STAFF: {
    id: 'ice_staff',
    name: 'Ice Staff',
    slot: 'weapon',
    rarity: 'UNCOMMON',
    effect: 'element_boost',
    element: 'Ice',
    value: 2,
    description: '+2 to all Ice cards',
    icon: '🪄❄️',
    cost: 100
  },
  THUNDER_HAMMER: {
    id: 'thunder_hammer',
    name: 'Thunder Hammer',
    slot: 'weapon',
    rarity: 'RARE',
    effect: 'element_boost',
    element: 'Electricity',
    value: 3,
    description: '+3 to all Electricity cards',
    icon: '🔨⚡',
    cost: 150
  },
  
  // Armor
  DRAGON_SCALE_ARMOR: {
    id: 'dragon_scale_armor',
    name: 'Dragon Scale Armor',
    slot: 'armor',
    rarity: 'EPIC',
    effect: 'damage_reduction',
    value: 2,
    description: 'Reduce all incoming damage by 2',
    icon: '🛡️🐉',
    cost: 200
  },
  CRYSTAL_SHIELD: {
    id: 'crystal_shield',
    name: 'Crystal Shield',
    slot: 'armor',
    rarity: 'RARE',
    effect: 'shield_regen',
    value: 1,
    description: 'Gain 1 shield at start of each turn',
    icon: '💎🛡️',
    cost: 150
  },
  
  // Accessories
  LUCKY_CHARM: {
    id: 'lucky_charm',
    name: 'Lucky Charm',
    slot: 'accessory',
    rarity: 'RARE',
    effect: 'card_draw',
    value: 1,
    description: 'Draw 1 extra card at game start',
    icon: '🍀',
    cost: 120
  },
  RING_OF_POWER: {
    id: 'ring_of_power',
    name: 'Ring of Power',
    slot: 'accessory',
    rarity: 'EPIC',
    effect: 'strength_boost',
    value: 1,
    description: '+1 to all cards',
    icon: '💍',
    cost: 180
  },
  AMULET_OF_ELEMENTS: {
    id: 'amulet_of_elements',
    name: 'Amulet of Elements',
    slot: 'accessory',
    rarity: 'LEGENDARY',
    effect: 'element_mastery',
    value: 1,
    description: 'Element matches grant +1 extra bonus',
    icon: '📿✨',
    cost: 250
  },
  
  // Special Equipment
  DECK_OF_FATE: {
    id: 'deck_of_fate',
    name: 'Deck of Fate',
    slot: 'special',
    rarity: 'LEGENDARY',
    effect: 'deck_size',
    value: 3,
    description: 'Start with 3 extra cards in deck',
    icon: '🎴✨',
    cost: 300
  },
  HOURGLASS_OF_TIME: {
    id: 'hourglass_of_time',
    name: 'Hourglass of Time',
    slot: 'special',
    rarity: 'LEGENDARY',
    effect: 'turn_time',
    value: 10,
    description: '+10 seconds per turn',
    icon: '⏳',
    cost: 200
  }
};

// Player Inventory Class
export class PlayerInventory {
  constructor() {
    this.rareCards = [];
    this.consumables = [];
    this.wildCards = [];
    this.equipment = {
      weapon: null,
      armor: null,
      accessory: null,
      special: null
    };
    this.currency = 0;
  }

  // Add item to inventory
  addItem(item, quantity = 1) {
    if (item.type === 'consumable') {
      const existing = this.consumables.find(c => c.id === item.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        this.consumables.push({ ...item, quantity });
      }
    } else if (item.canBeAnyElement) {
      this.wildCards.push({ ...item, quantity });
    } else if (item.slot) {
      // Equipment - don't add duplicates, just replace
      return { success: true, message: 'Equipment acquired' };
    } else {
      this.rareCards.push({ ...item });
    }
    return { success: true, message: `${item.name} added to inventory` };
  }

  // Use consumable item
  useConsumable(itemId) {
    const index = this.consumables.findIndex(c => c.id === itemId);
    if (index === -1) {
      return { success: false, message: 'Item not found' };
    }

    const item = this.consumables[index];
    if (item.quantity <= 0) {
      return { success: false, message: 'No charges remaining' };
    }

    item.quantity -= 1;
    if (item.quantity === 0) {
      this.consumables.splice(index, 1);
    }

    return { success: true, item: { ...item }, message: `Used ${item.name}` };
  }

  // Equip item
  equipItem(item) {
    if (!item.slot) {
      return { success: false, message: 'Item is not equippable' };
    }

    const previousItem = this.equipment[item.slot];
    this.equipment[item.slot] = { ...item };

    return {
      success: true,
      equipped: item,
      unequipped: previousItem,
      message: `${item.name} equipped`
    };
  }

  // Unequip item
  unequipItem(slot) {
    const item = this.equipment[slot];
    if (!item) {
      return { success: false, message: 'No item in that slot' };
    }

    this.equipment[slot] = null;
    return { success: true, item, message: `${item.name} unequipped` };
  }

  // Get active equipment bonuses
  getEquipmentBonuses() {
    const bonuses = {
      strengthBoost: 0,
      elementBoosts: {},
      damageReduction: 0,
      shieldRegen: 0,
      extraCardDraw: 0,
      turnTimeBonus: 0,
      deckSizeBonus: 0,
      elementMatchBonus: 0
    };

    Object.values(this.equipment).forEach(item => {
      if (!item) return;

      switch (item.effect) {
        case 'strength_boost':
          bonuses.strengthBoost += item.value;
          break;
        case 'element_boost':
          bonuses.elementBoosts[item.element] = (bonuses.elementBoosts[item.element] || 0) + item.value;
          break;
        case 'damage_reduction':
          bonuses.damageReduction += item.value;
          break;
        case 'shield_regen':
          bonuses.shieldRegen += item.value;
          break;
        case 'card_draw':
          bonuses.extraCardDraw += item.value;
          break;
        case 'turn_time':
          bonuses.turnTimeBonus += item.value;
          break;
        case 'deck_size':
          bonuses.deckSizeBonus += item.value;
          break;
        case 'element_mastery':
          bonuses.elementMatchBonus += item.value;
          break;
      }
    });

    return bonuses;
  }

  // Add currency
  addCurrency(amount) {
    this.currency += amount;
    return this.currency;
  }

  // Purchase item
  purchase(item) {
    if (this.currency < item.cost) {
      return { success: false, message: 'Insufficient funds' };
    }

    this.currency -= item.cost;
    this.addItem(item);
    return { success: true, message: `Purchased ${item.name}`, remaining: this.currency };
  }

  // Serialize for storage
  toJSON() {
    return {
      rareCards: this.rareCards,
      consumables: this.consumables,
      wildCards: this.wildCards,
      equipment: this.equipment,
      currency: this.currency
    };
  }

  // Deserialize from storage
  static fromJSON(data) {
    const inventory = new PlayerInventory();
    Object.assign(inventory, data);
    return inventory;
  }
}

// Loot drop system
export const generateLoot = (playerLevel = 1, defeatedOpponent = false) => {
  const lootTable = [];
  
  // Base currency reward
  const baseCurrency = defeatedOpponent ? 50 + (playerLevel * 10) : 25 + (playerLevel * 5);
  lootTable.push({ type: 'currency', amount: baseCurrency });

  // Roll for item drops
  const roll = Math.random();
  
  if (roll < RARITY.LEGENDARY.dropRate) {
    // Legendary drop
    const legendaryItems = [
      ...Object.values(RARE_CARDS).filter(c => c.rarity === 'LEGENDARY'),
      ...Object.values(EQUIPMENT).filter(e => e.rarity === 'LEGENDARY'),
      ...Object.values(CONSUMABLES).filter(c => c.rarity === 'LEGENDARY')
    ];
    lootTable.push(legendaryItems[Math.floor(Math.random() * legendaryItems.length)]);
  } else if (roll < RARITY.EPIC.dropRate) {
    // Epic drop
    const epicItems = [
      ...Object.values(RARE_CARDS).filter(c => c.rarity === 'EPIC'),
      ...Object.values(EQUIPMENT).filter(e => e.rarity === 'EPIC'),
      ...Object.values(CONSUMABLES).filter(c => c.rarity === 'EPIC'),
      ...Object.values(WILD_CARDS).filter(w => w.rarity === 'EPIC')
    ];
    lootTable.push(epicItems[Math.floor(Math.random() * epicItems.length)]);
  } else if (roll < RARITY.RARE.dropRate) {
    // Rare drop
    const rareItems = [
      ...Object.values(RARE_CARDS).filter(c => c.rarity === 'RARE'),
      ...Object.values(EQUIPMENT).filter(e => e.rarity === 'RARE'),
      ...Object.values(CONSUMABLES).filter(c => c.rarity === 'RARE'),
      ...Object.values(WILD_CARDS).filter(w => w.rarity === 'RARE')
    ];
    lootTable.push(rareItems[Math.floor(Math.random() * rareItems.length)]);
  } else if (roll < RARITY.UNCOMMON.dropRate) {
    // Uncommon drop
    const uncommonItems = [
      ...Object.values(EQUIPMENT).filter(e => e.rarity === 'UNCOMMON'),
      ...Object.values(CONSUMABLES).filter(c => c.rarity === 'UNCOMMON'),
      ...Object.values(WILD_CARDS).filter(w => w.rarity === 'UNCOMMON')
    ];
    lootTable.push(uncommonItems[Math.floor(Math.random() * uncommonItems.length)]);
  } else {
    // Common drop (consumables)
    const commonItems = Object.values(CONSUMABLES).filter(c => c.rarity === 'COMMON');
    lootTable.push(commonItems[Math.floor(Math.random() * commonItems.length)]);
  }

  return lootTable;
};

// Apply equipment bonuses to card
export const applyEquipmentToCard = (card, equipment) => {
  const bonuses = equipment.getEquipmentBonuses();
  let modifiedStrength = card.strength + bonuses.strengthBoost;

  // Apply element-specific bonuses
  if (bonuses.elementBoosts[card.element]) {
    modifiedStrength += bonuses.elementBoosts[card.element];
  }

  return {
    ...card,
    modifiedStrength,
    equipmentBonus: modifiedStrength - card.strength
  };
};

// Get element effectiveness (for wild cards)
export const ELEMENT_EFFECTIVENESS = {
  Fire: { strongAgainst: ['Nature', 'Ice'], weakAgainst: ['Water', 'Earth'] },
  Water: { strongAgainst: ['Fire', 'Earth'], weakAgainst: ['Electricity', 'Nature'] },
  Electricity: { strongAgainst: ['Water', 'Ice'], weakAgainst: ['Earth'] },
  Nature: { strongAgainst: ['Water', 'Earth'], weakAgainst: ['Fire', 'Ice'] },
  Earth: { strongAgainst: ['Electricity', 'Fire'], weakAgainst: ['Water', 'Nature'] },
  Ice: { strongAgainst: ['Nature', 'Water'], weakAgainst: ['Fire', 'Electricity'] }
};

// Determine best element for wild card
export const getBestElementForWildCard = (opponentElement) => {
  if (!opponentElement) return 'Fire'; // Default

  for (const [element, effectiveness] of Object.entries(ELEMENT_EFFECTIVENESS)) {
    if (effectiveness.strongAgainst.includes(opponentElement)) {
      return element;
    }
  }

  return 'Fire'; // Fallback
};

// Initialize default inventory
export const createDefaultInventory = () => {
  const inventory = new PlayerInventory();
  
  // Start with some basic items
  inventory.addCurrency(100);
  inventory.addItem(CONSUMABLES.SHIELD_POTION, 2);
  inventory.addItem(CONSUMABLES.DAMAGE_BOOSTER, 2);
  inventory.addItem(WILD_CARDS.WILD_COMMON, 1);

  return inventory;
};

export default {
  POWERUP_TYPES,
  RARITY,
  RARE_CARDS,
  CONSUMABLES,
  WILD_CARDS,
  EQUIPMENT,
  PlayerInventory,
  generateLoot,
  applyEquipmentToCard,
  ELEMENT_EFFECTIVENESS,
  getBestElementForWildCard,
  createDefaultInventory
};

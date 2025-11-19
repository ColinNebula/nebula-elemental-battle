import React, { useState, useEffect } from 'react';
import { 
  PlayerInventory, 
  RARITY, 
  CONSUMABLES, 
  EQUIPMENT, 
  RARE_CARDS, 
  WILD_CARDS 
} from '../utils/powerUps';
import './Inventory.css';

const Inventory = ({ 
  inventory, 
  onUseConsumable, 
  onEquipItem, 
  onUnequipItem,
  onAddToActiveDeck,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('consumables');
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterRarity, setFilterRarity] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get all available items for shop
  const [shopItems] = useState([
    ...Object.values(CONSUMABLES),
    ...Object.values(EQUIPMENT)
  ]);

  // Helper function to calculate equipment bonuses from plain inventory object
  const getEquipmentBonuses = (inv) => {
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

    if (!inv || !inv.equipment) return bonuses;

    Object.values(inv.equipment).forEach(item => {
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
  };

  const handleUseConsumable = (itemId) => {
    if (onUseConsumable) {
      onUseConsumable(itemId);
    }
    setSelectedItem(null);
  };

  const handleEquip = (item) => {
    if (onEquipItem) {
      onEquipItem(item);
    }
    setSelectedItem(null);
  };

  const handleUnequip = (slot) => {
    if (onUnequipItem) {
      onUnequipItem(slot);
    }
  };

  const handlePurchase = (item) => {
    const result = inventory.purchase(item);
    if (result.success) {
      // Re-render will show updated inventory
      setSelectedItem(null);
    }
  };

  const getRarityColor = (rarity) => {
    return RARITY[rarity]?.color || '#9E9E9E';
  };

  const filterByRarity = (items) => {
    if (filterRarity === 'all') return items;
    return items.filter(item => item.rarity === filterRarity);
  };

  const renderConsumables = () => {
    const items = filterByRarity(inventory.consumables);
    
    if (items.length === 0) {
      return <div className="empty-inventory">No consumable items</div>;
    }

    return (
      <div className="inventory-grid">
        {items.map((item, index) => (
          <div 
            key={`${item.id}-${index}`}
            className={`inventory-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
            style={{ borderColor: getRarityColor(item.rarity) }}
            onClick={() => setSelectedItem(item)}
          >
            <div className="item-icon">{item.icon}</div>
            <div className="item-name">{item.name}</div>
            <div className="item-quantity">x{item.quantity}</div>
            <div className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
              {RARITY[item.rarity]?.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderRareCards = () => {
    const items = filterByRarity(inventory.rareCards);
    
    if (items.length === 0) {
      return <div className="empty-inventory">No rare cards collected</div>;
    }

    return (
      <div className="inventory-grid">
        {items.map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className={`inventory-item card-item ${selectedItem?.id === card.id ? 'selected' : ''}`}
            style={{ borderColor: getRarityColor(card.rarity) }}
            onClick={() => setSelectedItem(card)}
          >
            <div className="item-icon">{card.icon}</div>
            <div className="item-name">{card.name}</div>
            <div className="item-strength">⚔️ {card.baseStrength}</div>
            <div className="item-element">{card.element}</div>
            <div className="item-rarity" style={{ color: getRarityColor(card.rarity) }}>
              {RARITY[card.rarity]?.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderWildCards = () => {
    const items = filterByRarity(inventory.wildCards);
    
    if (items.length === 0) {
      return <div className="empty-inventory">No wild cards</div>;
    }

    return (
      <div className="inventory-grid">
        {items.map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className={`inventory-item wild-card-item ${selectedItem?.id === card.id ? 'selected' : ''}`}
            style={{ borderColor: getRarityColor(card.rarity) }}
            onClick={() => setSelectedItem(card)}
          >
            <div className="item-icon">{card.icon}</div>
            <div className="item-name">{card.name}</div>
            <div className="item-strength">⚔️ {card.baseStrength}</div>
            <div className="item-element">🌈 Wild</div>
            <div className="item-rarity" style={{ color: getRarityColor(card.rarity) }}>
              {RARITY[card.rarity]?.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEquipment = () => {
    return (
      <div className="equipment-container">
        <div className="equipment-slots">
          <h3>Equipped Items</h3>
          {['weapon', 'armor', 'accessory', 'special'].map(slot => (
            <div key={slot} className="equipment-slot">
              <div className="slot-label">{slot.charAt(0).toUpperCase() + slot.slice(1)}</div>
              {inventory.equipment[slot] ? (
                <div 
                  className="equipped-item"
                  style={{ borderColor: getRarityColor(inventory.equipment[slot].rarity) }}
                >
                  <div className="item-icon">{inventory.equipment[slot].icon}</div>
                  <div className="item-info">
                    <div className="item-name">{inventory.equipment[slot].name}</div>
                    <div className="item-description">{inventory.equipment[slot].description}</div>
                  </div>
                  <button 
                    className="unequip-btn"
                    onClick={() => handleUnequip(slot)}
                  >
                    ✖
                  </button>
                </div>
              ) : (
                <div className="empty-slot">Empty</div>
              )}
            </div>
          ))}
        </div>

        <div className="equipment-inventory">
          <h3>Available Equipment</h3>
          <div className="inventory-grid">
            {shopItems
              .filter(item => item.slot && filterRarity === 'all' ? true : item.rarity === filterRarity)
              .map((item, index) => (
                <div 
                  key={`${item.id}-${index}`}
                  className={`inventory-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                  style={{ borderColor: getRarityColor(item.rarity) }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-name">{item.name}</div>
                  <div className="item-description">{item.description}</div>
                  <div className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                    {RARITY[item.rarity]?.name}
                  </div>
                  <div className="item-cost">💰 {item.cost}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const renderShop = () => {
    return (
      <div className="shop-container">
        <div className="shop-header">
          <h3>🏪 Shop</h3>
          <div className="player-currency">
            💰 {inventory.currency} Gold
          </div>
        </div>
        
        <div className="inventory-grid">
          {shopItems
            .filter(item => filterRarity === 'all' ? true : item.rarity === filterRarity)
            .map((item, index) => (
              <div 
                key={`shop-${item.id}-${index}`}
                className={`inventory-item shop-item ${selectedItem?.id === item.id ? 'selected' : ''} ${inventory.currency < item.cost ? 'cannot-afford' : ''}`}
                style={{ borderColor: getRarityColor(item.rarity) }}
                onClick={() => setSelectedItem(item)}
              >
                <div className="item-icon">{item.icon}</div>
                <div className="item-name">{item.name}</div>
                <div className="item-description">{item.description}</div>
                <div className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                  {RARITY[item.rarity]?.name}
                </div>
                <div className="item-cost">💰 {item.cost}</div>
                {inventory.currency < item.cost && (
                  <div className="insufficient-funds">Insufficient Funds</div>
                )}
              </div>
            ))}
        </div>
      </div>
    );
  };

  const renderItemDetails = () => {
    if (!selectedItem) {
      return <div className="no-selection">Select an item to view details</div>;
    }

    return (
      <div className="item-details">
        <div className="detail-header">
          <div className="detail-icon">{selectedItem.icon}</div>
          <div>
            <h3>{selectedItem.name}</h3>
            <div className="detail-rarity" style={{ color: getRarityColor(selectedItem.rarity) }}>
              {RARITY[selectedItem.rarity]?.name}
            </div>
          </div>
        </div>

        <div className="detail-description">{selectedItem.description}</div>

        {selectedItem.baseStrength && (
          <div className="detail-stat">
            <span className="stat-label">Strength:</span>
            <span className="stat-value">{selectedItem.baseStrength}</span>
          </div>
        )}

        {selectedItem.element && (
          <div className="detail-stat">
            <span className="stat-label">Element:</span>
            <span className="stat-value">{selectedItem.element}</span>
          </div>
        )}

        {selectedItem.ability && (
          <div className="detail-stat">
            <span className="stat-label">Ability:</span>
            <span className="stat-value">{selectedItem.ability.replace(/_/g, ' ')}</span>
          </div>
        )}

        {selectedItem.uses && (
          <div className="detail-stat">
            <span className="stat-label">Uses:</span>
            <span className="stat-value">{selectedItem.uses}</span>
          </div>
        )}

        {selectedItem.cost && (
          <div className="detail-stat">
            <span className="stat-label">Cost:</span>
            <span className="stat-value">💰 {selectedItem.cost}</span>
          </div>
        )}

        <div className="detail-actions">
          {activeTab === 'consumables' && selectedItem.type === 'consumable' && (
            <button 
              className="action-btn use-btn"
              onClick={() => handleUseConsumable(selectedItem.id)}
              disabled={selectedItem.quantity <= 0}
            >
              Use Item
            </button>
          )}

          {activeTab === 'equipment' && selectedItem.slot && (
            <button 
              className="action-btn equip-btn"
              onClick={() => handleEquip(selectedItem)}
            >
              Equip
            </button>
          )}

          {activeTab === 'shop' && (
            <button 
              className="action-btn buy-btn"
              onClick={() => handlePurchase(selectedItem)}
              disabled={inventory.currency < selectedItem.cost}
            >
              Purchase
            </button>
          )}

          {(activeTab === 'rare_cards' || activeTab === 'wild_cards') && onAddToActiveDeck && (
            <button 
              className="action-btn add-btn"
              onClick={() => {
                onAddToActiveDeck(selectedItem);
                setSelectedItem(null);
              }}
            >
              Add to Active Deck
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="inventory-overlay">
      <div className="inventory-modal">
        <div className="inventory-header">
          <h2>📦 Inventory</h2>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className="mobile-tab-selector">
          <button 
            className="mobile-dropdown-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="dropdown-label">
              {activeTab === 'consumables' && `🧪 Consumables (${inventory.consumables.length})`}
              {activeTab === 'rare_cards' && `⭐ Rare Cards (${inventory.rareCards.length})`}
              {activeTab === 'wild_cards' && `🃏 Wild Cards (${inventory.wildCards.length})`}
              {activeTab === 'equipment' && '⚔️ Equipment'}
              {activeTab === 'shop' && '🏪 Shop'}
            </span>
            <span className={`dropdown-arrow ${isMobileMenuOpen ? 'open' : ''}`}>▼</span>
          </button>
          {isMobileMenuOpen && (
            <div className="mobile-dropdown-menu">
              <button 
                className={`mobile-tab-btn ${activeTab === 'consumables' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('consumables');
                  setIsMobileMenuOpen(false);
                }}
              >
                🧪 Consumables ({inventory.consumables.length})
              </button>
              <button 
                className={`mobile-tab-btn ${activeTab === 'rare_cards' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('rare_cards');
                  setIsMobileMenuOpen(false);
                }}
              >
                ⭐ Rare Cards ({inventory.rareCards.length})
              </button>
              <button 
                className={`mobile-tab-btn ${activeTab === 'wild_cards' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('wild_cards');
                  setIsMobileMenuOpen(false);
                }}
              >
                🃏 Wild Cards ({inventory.wildCards.length})
              </button>
              <button 
                className={`mobile-tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('equipment');
                  setIsMobileMenuOpen(false);
                }}
              >
                ⚔️ Equipment
              </button>
              <button 
                className={`mobile-tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('shop');
                  setIsMobileMenuOpen(false);
                }}
              >
                🏪 Shop
              </button>
            </div>
          )}
        </div>

        {/* Desktop Tabs */}
        <div className="inventory-tabs desktop-tabs">
          <button 
            className={`tab-btn ${activeTab === 'consumables' ? 'active' : ''}`}
            onClick={() => setActiveTab('consumables')}
          >
            🧪 Consumables ({inventory.consumables.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rare_cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('rare_cards')}
          >
            ⭐ Rare Cards ({inventory.rareCards.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'wild_cards' ? 'active' : ''}`}
            onClick={() => setActiveTab('wild_cards')}
          >
            🃏 Wild Cards ({inventory.wildCards.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => setActiveTab('equipment')}
          >
            ⚔️ Equipment
          </button>
          <button 
            className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            🏪 Shop
          </button>
        </div>

        <div className="rarity-filter">
          <label>Filter by Rarity:</label>
          <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)}>
            <option value="all">All</option>
            <option value="COMMON">Common</option>
            <option value="UNCOMMON">Uncommon</option>
            <option value="RARE">Rare</option>
            <option value="EPIC">Epic</option>
            <option value="LEGENDARY">Legendary</option>
          </select>
        </div>

        <div className="inventory-content">
          <div className="inventory-main">
            {activeTab === 'consumables' && renderConsumables()}
            {activeTab === 'rare_cards' && renderRareCards()}
            {activeTab === 'wild_cards' && renderWildCards()}
            {activeTab === 'equipment' && renderEquipment()}
            {activeTab === 'shop' && renderShop()}
          </div>

          <div className="inventory-sidebar">
            {renderItemDetails()}
          </div>
        </div>

        <div className="inventory-footer">
          <div className="currency-display">
            💰 Gold: {inventory.currency || 0}
          </div>
          <div className="equipment-bonuses">
            <strong>Active Bonuses:</strong>
            {(() => {
              const bonuses = getEquipmentBonuses(inventory);
              const bonusTexts = [];
              if (bonuses.strengthBoost > 0) bonusTexts.push(`+${bonuses.strengthBoost} Strength`);
              if (bonuses.damageReduction > 0) bonusTexts.push(`-${bonuses.damageReduction} Damage Taken`);
              if (bonuses.shieldRegen > 0) bonusTexts.push(`+${bonuses.shieldRegen} Shield/Turn`);
              if (bonuses.extraCardDraw > 0) bonusTexts.push(`+${bonuses.extraCardDraw} Card Draw`);
              return bonusTexts.length > 0 ? bonusTexts.join(', ') : 'None';
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

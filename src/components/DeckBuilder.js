import React, { useState, useEffect } from 'react';
import './DeckBuilder.css';

const DeckBuilder = ({ onSaveDeck, onCancel, currentDeck = null }) => {
  const [deckName, setDeckName] = useState(currentDeck?.name || 'My Deck');
  const [selectedCards, setSelectedCards] = useState(currentDeck?.cards || []);
  const [availableCards, setAvailableCards] = useState([]);

  const ELEMENTS = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'POWER', 'LIGHT', 'DARK', 'NEUTRAL', 'TECHNOLOGY', 'METEOR'];
  const MIN_DECK_SIZE = 20;
  const MAX_DECK_SIZE = 40;

  useEffect(() => {
    // Generate available card pool
    const cards = [];
    ELEMENTS.forEach(element => {
      for (let strength = 1; strength <= 10; strength++) {
        // Add multiple copies of each card
        const copies = strength <= 5 ? 4 : strength <= 8 ? 3 : 2;
        for (let i = 0; i < copies; i++) {
          cards.push({
            id: `${element}_${strength}_${i}`,
            element,
            strength,
            modifiedStrength: strength
          });
        }
      }
    });
    setAvailableCards(cards);
  }, []);

  const handleAddCard = (card) => {
    if (selectedCards.length < MAX_DECK_SIZE) {
      setSelectedCards([...selectedCards, { ...card, deckId: Date.now() + Math.random() }]);
    }
  };

  const handleRemoveCard = (deckId) => {
    setSelectedCards(selectedCards.filter(c => c.deckId !== deckId));
  };

  const handleSave = () => {
    if (selectedCards.length >= MIN_DECK_SIZE && selectedCards.length <= MAX_DECK_SIZE) {
      onSaveDeck({
        name: deckName,
        cards: selectedCards,
        createdAt: Date.now()
      });
    }
  };

  const getCardCount = (element) => {
    return selectedCards.filter(c => c.element === element).length;
  };

  const getTotalStrength = () => {
    return selectedCards.reduce((sum, card) => sum + card.strength, 0);
  };

  const getAverageStrength = () => {
    return selectedCards.length > 0 ? (getTotalStrength() / selectedCards.length).toFixed(1) : 0;
  };

  return (
    <div className="deck-builder-overlay">
      <div className="deck-builder-container">
        <div className="deck-builder-header">
          <input 
            type="text"
            className="deck-name-input"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Deck Name"
            maxLength={30}
          />
          <button className="close-builder" onClick={onCancel}>✕</button>
        </div>

        <div className="deck-builder-content">
          {/* Deck Stats */}
          <div className="deck-stats">
            <h3>Deck Stats</h3>
            <div className="stat-row">
              <span>Cards:</span>
              <span className={selectedCards.length < MIN_DECK_SIZE ? 'invalid' : ''}>
                {selectedCards.length} / {MAX_DECK_SIZE}
              </span>
            </div>
            <div className="stat-row">
              <span>Total Strength:</span>
              <span>{getTotalStrength()}</span>
            </div>
            <div className="stat-row">
              <span>Average:</span>
              <span>{getAverageStrength()}</span>
            </div>
            
            <div className="element-distribution">
              <h4>Element Distribution</h4>
              {ELEMENTS.map(element => {
                const count = getCardCount(element);
                return count > 0 ? (
                  <div key={element} className="element-bar">
                    <span className="element-label">{element}</span>
                    <div className="bar-container">
                      <div 
                        className="bar-fill"
                        style={{ 
                          width: `${(count / selectedCards.length) * 100}%`,
                          backgroundColor: getElementColor(element)
                        }}
                      />
                    </div>
                    <span className="element-count">{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Selected Cards */}
          <div className="selected-cards-section">
            <h3>Your Deck ({selectedCards.length})</h3>
            <div className="selected-cards-grid">
              {selectedCards.map((card) => (
                <div key={card.deckId} className="mini-card selected" onClick={() => handleRemoveCard(card.deckId)}>
                  <div className="mini-card-element">{card.element}</div>
                  <div className="mini-card-strength">{card.strength}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Available Cards */}
          <div className="available-cards-section">
            <h3>Available Cards</h3>
            <div className="element-filters">
              {ELEMENTS.map(element => (
                <button 
                  key={element} 
                  className="element-filter-btn"
                  style={{ borderColor: getElementColor(element) }}
                  onClick={() => {
                    const elementCards = availableCards.filter(c => c.element === element);
                    setAvailableCards([...elementCards, ...availableCards.filter(c => c.element !== element)]);
                  }}
                >
                  {element}
                </button>
              ))}
            </div>
            <div className="available-cards-grid">
              {availableCards.slice(0, 50).map((card) => (
                <div 
                  key={card.id} 
                  className="mini-card available" 
                  onClick={() => handleAddCard(card)}
                  style={{ borderColor: getElementColor(card.element) }}
                >
                  <div className="mini-card-element">{card.element}</div>
                  <div className="mini-card-strength">{card.strength}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="deck-builder-footer">
          <div className="validation-message">
            {selectedCards.length < MIN_DECK_SIZE && (
              <span className="error">Need at least {MIN_DECK_SIZE} cards</span>
            )}
            {selectedCards.length >= MIN_DECK_SIZE && (
              <span className="success">✓ Deck is valid</span>
            )}
          </div>
          <div className="builder-actions">
            <button className="cancel-btn" onClick={onCancel}>Cancel</button>
            <button 
              className="save-deck-btn"
              onClick={handleSave}
              disabled={selectedCards.length < MIN_DECK_SIZE || selectedCards.length > MAX_DECK_SIZE}
            >
              Save Deck
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getElementColor = (element) => {
  const colors = {
    FIRE: '#ff4500',
    ICE: '#00bfff',
    WATER: '#1e90ff',
    ELECTRICITY: '#ffd700',
    EARTH: '#8b4513',
    POWER: '#ff1493',
    LIGHT: '#ffeb3b',
    DARK: '#4b0082',
    NEUTRAL: '#808080',
    TECHNOLOGY: '#00ff00',
    METEOR: '#ff6600'
  };
  return colors[element] || '#808080';
};

export default DeckBuilder;

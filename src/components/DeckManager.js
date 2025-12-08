import React, { useState, useEffect } from 'react';
import DeckBuilder from './DeckBuilder';
import './DeckManager.css';

const DeckManager = ({ onClose, onSelectDeck }) => {
  const [savedDecks, setSavedDecks] = useState([]);
  const [showDeckBuilder, setShowDeckBuilder] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'name', 'strength', 'winrate'
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved decks from localStorage
  useEffect(() => {
    loadDecks();
    const active = localStorage.getItem('activeDeckId');
    if (active) setActiveDeckId(active);
  }, []);

  const loadDecks = () => {
    try {
      const decks = JSON.parse(localStorage.getItem('playerDecks') || '[]');
      setSavedDecks(Array.isArray(decks) ? decks : []);
    } catch (error) {
      console.error('Failed to load decks:', error);
      setSavedDecks([]);
    }
  };

  const saveDecks = (decks) => {
    try {
      localStorage.setItem('playerDecks', JSON.stringify(decks));
      return true;
    } catch (error) {
      console.error('Failed to save decks:', error);
      return false;
    }
  };

  const handleCreateDeck = () => {
    setEditingDeck(null);
    setShowDeckBuilder(true);
  };

  const handleEditDeck = (deck) => {
    setEditingDeck(deck);
    setShowDeckBuilder(true);
  };

  const handleSaveDeck = (deckData) => {
    let updatedDecks;
    
    if (editingDeck) {
      // Update existing deck
      updatedDecks = savedDecks.map(d => 
        d.id === editingDeck.id 
          ? { ...deckData, id: editingDeck.id, updatedAt: Date.now(), wins: editingDeck.wins || 0, losses: editingDeck.losses || 0 }
          : d
      );
    } else {
      // Create new deck
      const newDeck = {
        ...deckData,
        id: `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        wins: 0,
        losses: 0
      };
      updatedDecks = [...savedDecks, newDeck];
    }
    
    if (saveDecks(updatedDecks)) {
      setSavedDecks(updatedDecks);
      setShowDeckBuilder(false);
      setEditingDeck(null);
    }
  };

  const handleDeleteDeck = (deckId) => {
    const updatedDecks = savedDecks.filter(d => d.id !== deckId);
    if (saveDecks(updatedDecks)) {
      setSavedDecks(updatedDecks);
      // If deleted deck was active, clear active deck
      if (activeDeckId === deckId) {
        setActiveDeckId(null);
        localStorage.removeItem('activeDeckId');
      }
    }
    setShowDeleteConfirm(null);
  };

  const handleDuplicateDeck = (deck) => {
    const duplicatedDeck = {
      ...deck,
      id: `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${deck.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      wins: 0,
      losses: 0,
      cards: [...deck.cards]
    };
    const updatedDecks = [...savedDecks, duplicatedDeck];
    if (saveDecks(updatedDecks)) {
      setSavedDecks(updatedDecks);
    }
  };

  const handleSetActiveDeck = (deck) => {
    setActiveDeckId(deck.id);
    localStorage.setItem('activeDeckId', deck.id);
    localStorage.setItem('activeDeck', JSON.stringify(deck));
    if (onSelectDeck) {
      onSelectDeck(deck);
    }
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

  const getCardImage = (element) => {
    const basePath = process.env.PUBLIC_URL || '';
    const elementImages = {
      'ELECTRICITY': `${basePath}/electricity-card.png`,
      'FIRE': `${basePath}/fire card.png`,
      'ICE': `${basePath}/ice-card.png`,
      'WATER': `${basePath}/water-card.png`,
      'EARTH': `${basePath}/earth-card.png`,
      'DARK': `${basePath}/dark-card.png`,
      'LIGHT': `${basePath}/star-card.png`,
      'TECHNOLOGY': `${basePath}/tech-card.png`,
      'METEOR': `${basePath}/meteor.png`,
      'NATURE': `${basePath}/nature-card.png`,
      'POWER': `${basePath}/power-card.png`,
      'NEUTRAL': `${basePath}/shifter-card.png`
    };
    return elementImages[element] || null;
  };

  const getDeckElements = (deck) => {
    const elementCounts = {};
    deck.cards?.forEach(card => {
      elementCounts[card.element] = (elementCounts[card.element] || 0) + 1;
    });
    return Object.entries(elementCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const getAverageStrength = (deck) => {
    if (!deck.cards || deck.cards.length === 0) return 0;
    const total = deck.cards.reduce((sum, card) => sum + card.strength, 0);
    return (total / deck.cards.length).toFixed(1);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getElementEmoji = (element) => {
    const emojis = {
      FIRE: '🔥', ICE: '❄️', WATER: '💧', ELECTRICITY: '⚡',
      EARTH: '🌍', POWER: '💪', LIGHT: '☀️', DARK: '🌙',
      NEUTRAL: '🔮', TECHNOLOGY: '🤖', METEOR: '☄️'
    };
    return emojis[element] || '❓';
  };

  const getWinRate = (deck) => {
    if (!deck.wins && !deck.losses) return null;
    return Math.round((deck.wins / (deck.wins + deck.losses)) * 100);
  };

  const getTotalStrength = (deck) => {
    if (!deck.cards || deck.cards.length === 0) return 0;
    return deck.cards.reduce((sum, card) => sum + card.strength, 0);
  };

  // Filter and sort decks
  const getFilteredAndSortedDecks = () => {
    let filtered = savedDecks;
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(deck => 
        deck.name.toLowerCase().includes(query) ||
        deck.cards?.some(card => card.name?.toLowerCase().includes(query) || card.element?.toLowerCase().includes(query))
      );
    }
    
    // Sort
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'strength':
          return getTotalStrength(b) - getTotalStrength(a);
        case 'winrate':
          return (getWinRate(b) || 0) - (getWinRate(a) || 0);
        case 'newest':
        default:
          return (b.createdAt || 0) - (a.createdAt || 0);
      }
    });
  };

  const displayedDecks = getFilteredAndSortedDecks();

  if (showDeckBuilder) {
    return (
      <DeckBuilder
        onSaveDeck={handleSaveDeck}
        onCancel={() => {
          setShowDeckBuilder(false);
          setEditingDeck(null);
        }}
        currentDeck={editingDeck}
      />
    );
  }

  return (
    <div className="deck-manager-overlay">
      <div className="deck-manager-container">
        {/* Enhanced Header */}
        <div className="deck-manager-header">
          <div className="header-left">
            <h2>🎴 Deck Manager</h2>
            <span className="deck-count-badge">{savedDecks.length} / 10</span>
          </div>
          <div className="header-right">
            <button className="close-manager" onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Toolbar */}
        {savedDecks.length > 0 && (
          <div className="deck-manager-toolbar">
            <div className="toolbar-left">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
                )}
              </div>
            </div>
            <div className="toolbar-center">
              <div className="sort-options">
                <span className="sort-label">Sort:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="newest">Newest</option>
                  <option value="name">Name</option>
                  <option value="strength">Strength</option>
                  <option value="winrate">Win Rate</option>
                </select>
              </div>
            </div>
            <div className="toolbar-right">
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  ▦
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  ☰
                </button>
              </div>
              <button className="create-deck-btn-small" onClick={handleCreateDeck}>
                ➕ New Deck
              </button>
            </div>
          </div>
        )}

        <div className="deck-manager-content">
          {/* Deck List */}
          <div className="decks-list">
            {savedDecks.length === 0 ? (
              <div className="no-decks">
                <div className="no-decks-icon">🎴</div>
                <h3>No Decks Created</h3>
                <p>Create your first custom deck to dominate the battlefield!</p>
                <div className="no-decks-features">
                  <div className="feature-item">✨ Build custom strategies</div>
                  <div className="feature-item">⚔️ Counter enemy elements</div>
                  <div className="feature-item">🏆 Track your win rate</div>
                </div>
                <button className="create-deck-btn primary" onClick={handleCreateDeck}>
                  ➕ Create Your First Deck
                </button>
              </div>
            ) : displayedDecks.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No Decks Found</h3>
                <p>No decks match your search "{searchQuery}"</p>
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  Clear Search
                </button>
              </div>
            ) : (
              <>
                <div className={`decks-grid ${viewMode}`}>
                  {displayedDecks.map((deck) => (
                    <div 
                      key={deck.id} 
                      className={`deck-card ${viewMode} ${selectedDeckId === deck.id ? 'selected' : ''} ${activeDeckId === deck.id ? 'active' : ''}`}
                      onClick={() => setSelectedDeckId(deck.id === selectedDeckId ? null : deck.id)}
                    >
                      {activeDeckId === deck.id && (
                        <div className="active-badge">⭐ Active</div>
                      )}
                      
                      <div className="deck-card-header">
                        <div className="deck-title-section">
                          <h3 className="deck-name">{deck.name}</h3>
                          <div className="deck-elements-row">
                            {getDeckElements(deck).slice(0, 3).map(([element]) => (
                              <span key={element} className="element-emoji" title={element}>
                                {getElementEmoji(element)}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="deck-header-stats">
                          <span className="deck-card-count">{deck.cards?.length || 0} 🃏</span>
                          <span className="deck-total-power">⚔️ {getTotalStrength(deck)}</span>
                        </div>
                      </div>

                      {/* Card Preview */}
                      <div className="deck-card-preview">
                        {deck.cards?.slice(0, 6).map((card, idx) => (
                          <div 
                            key={idx}
                            className="preview-mini-card"
                            style={{
                              backgroundImage: getCardImage(card.element) ? `url(${getCardImage(card.element)})` : 'none',
                              borderColor: getElementColor(card.element),
                              zIndex: 10 - idx,
                              marginLeft: idx > 0 ? '-12px' : '0',
                              transform: `rotate(${(idx - 2.5) * 4}deg)`
                            }}
                          >
                            <span className="preview-strength">{card.strength}</span>
                          </div>
                        ))}
                        {deck.cards?.length > 6 && (
                          <div className="preview-more">+{deck.cards.length - 6}</div>
                        )}
                      </div>

                      {/* Element Distribution Bar */}
                      <div className="element-distribution">
                        {getDeckElements(deck).map(([element, count]) => (
                          <div 
                            key={element}
                            className="element-bar"
                            style={{ 
                              backgroundColor: getElementColor(element),
                              flex: count 
                            }}
                            title={`${element}: ${count} cards`}
                          />
                        ))}
                      </div>

                      <div className="deck-stats-row">
                        <div className="deck-stat">
                          <span className="stat-icon">💪</span>
                          <span className="stat-value">{getAverageStrength(deck)}</span>
                          <span className="stat-label">Avg</span>
                        </div>
                        <div className="deck-stat">
                          <span className="stat-icon">🏆</span>
                          <span className="stat-value">{deck.wins || 0}</span>
                          <span className="stat-label">Wins</span>
                        </div>
                        <div className="deck-stat">
                          <span className="stat-icon">💀</span>
                          <span className="stat-value">{deck.losses || 0}</span>
                          <span className="stat-label">Losses</span>
                        </div>
                        <div className="deck-stat winrate">
                          <span className="stat-icon">📊</span>
                          <span className={`stat-value ${getWinRate(deck) >= 50 ? 'positive' : getWinRate(deck) !== null ? 'negative' : ''}`}>
                            {getWinRate(deck) !== null ? `${getWinRate(deck)}%` : '—'}
                          </span>
                          <span className="stat-label">Rate</span>
                        </div>
                      </div>

                      <div className="deck-meta">
                        <span>📅 {formatDate(deck.createdAt || Date.now())}</span>
                      </div>

                      {/* Deck Actions */}
                      <div className="deck-actions">
                        <button 
                          className={`deck-action-btn set-active ${activeDeckId === deck.id ? 'is-active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); handleSetActiveDeck(deck); }}
                          title={activeDeckId === deck.id ? "Currently Active" : "Set as Active Deck"}
                        >
                          {activeDeckId === deck.id ? '✓ Active' : '⭐ Use'}
                        </button>
                        <button 
                          className="deck-action-btn edit"
                          onClick={(e) => { e.stopPropagation(); handleEditDeck(deck); }}
                          title="Edit Deck"
                        >
                          ✏️
                        </button>
                        <button 
                          className="deck-action-btn duplicate"
                          onClick={(e) => { e.stopPropagation(); handleDuplicateDeck(deck); }}
                          title="Duplicate Deck"
                        >
                          📋
                        </button>
                        <button 
                          className="deck-action-btn delete"
                          onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(deck.id); }}
                          title="Delete Deck"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === deck.id && (
                        <div className="delete-confirm-overlay" onClick={(e) => e.stopPropagation()}>
                          <p>Delete "{deck.name}"?</p>
                          <div className="confirm-actions">
                            <button 
                              className="confirm-btn yes"
                              onClick={(e) => { e.stopPropagation(); handleDeleteDeck(deck.id); }}
                            >
                              Yes, Delete
                            </button>
                            <button 
                              className="confirm-btn no"
                              onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(null); }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button className="create-deck-btn floating" onClick={handleCreateDeck}>
                  ➕ Create New Deck
                </button>
              </>
            )}
          </div>
        </div>

        <div className="deck-manager-footer">
          <div className="deck-tips">
            <span>💡 Tip: Set a deck as active to use it in your next battle!</span>
          </div>
          <div className="deck-count">
            {savedDecks.length} / 10 deck slots used
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckManager;

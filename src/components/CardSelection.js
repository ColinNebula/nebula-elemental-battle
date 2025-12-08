import React, { useState, useEffect, useMemo } from 'react';
import Card from './Card';
import './CardSelection.css';

// Element definitions with colors
const ELEMENTS = [
  { id: 'all', name: 'All', emoji: '🎴', color: '#9c27b0' },
  { id: 'FIRE', name: 'Fire', emoji: '🔥', color: '#ff5722' },
  { id: 'ICE', name: 'Ice', emoji: '❄️', color: '#03a9f4' },
  { id: 'WATER', name: 'Water', emoji: '💧', color: '#2196f3' },
  { id: 'ELECTRIC', name: 'Electric', emoji: '⚡', color: '#ffeb3b' },
  { id: 'EARTH', name: 'Earth', emoji: '🌍', color: '#795548' },
  { id: 'LIGHT', name: 'Light', emoji: '☀️', color: '#ffc107' },
  { id: 'DARK', name: 'Dark', emoji: '🌙', color: '#673ab7' },
  { id: 'NEUTRAL', name: 'Neutral', emoji: '⭐', color: '#9e9e9e' },
];

const CardSelection = ({ hand, onConfirmSelection, onBack, isTutorial = false }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [elementFilter, setElementFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [showStats, setShowStats] = useState(true);
  const MAX_SELECTION = 10;

  // Filter and sort cards
  const processedCards = useMemo(() => {
    let cards = hand.map((card, index) => ({ ...card, originalIndex: index }));
    
    // Filter by element
    if (elementFilter !== 'all') {
      cards = cards.filter(card => card.element?.toUpperCase() === elementFilter);
    }
    
    // Sort cards
    if (sortBy === 'power-high') {
      cards.sort((a, b) => (b.power || 0) - (a.power || 0));
    } else if (sortBy === 'power-low') {
      cards.sort((a, b) => (a.power || 0) - (b.power || 0));
    } else if (sortBy === 'element') {
      cards.sort((a, b) => (a.element || '').localeCompare(b.element || ''));
    }
    
    return cards;
  }, [hand, elementFilter, sortBy]);

  // Calculate stats for selected cards
  const selectionStats = useMemo(() => {
    const selectedCards = selectedIndices.map(i => hand[i]);
    const totalPower = selectedCards.reduce((sum, card) => sum + (card?.power || 0), 0);
    const avgPower = selectedCards.length > 0 ? Math.round(totalPower / selectedCards.length) : 0;
    
    const elementCounts = {};
    selectedCards.forEach(card => {
      const el = card?.element || 'Unknown';
      elementCounts[el] = (elementCounts[el] || 0) + 1;
    });
    
    return { totalPower, avgPower, elementCounts, count: selectedCards.length };
  }, [selectedIndices, hand]);

  const toggleCard = (originalIndex) => {
    if (selectedIndices.includes(originalIndex)) {
      setSelectedIndices(selectedIndices.filter(i => i !== originalIndex));
    } else if (selectedIndices.length < MAX_SELECTION) {
      setSelectedIndices([...selectedIndices, originalIndex]);
    }
  };

  const handleConfirm = () => {
    if (selectedIndices.length === MAX_SELECTION) {
      onConfirmSelection(selectedIndices);
    }
  };

  // Quick selection functions
  const selectAll = () => {
    const visibleIndices = processedCards.slice(0, MAX_SELECTION).map(c => c.originalIndex);
    setSelectedIndices(visibleIndices);
  };

  const deselectAll = () => {
    setSelectedIndices([]);
  };

  const autoSelectBest = () => {
    // Select top 10 cards by power
    const sorted = [...hand]
      .map((card, index) => ({ ...card, originalIndex: index }))
      .sort((a, b) => (b.power || 0) - (a.power || 0))
      .slice(0, MAX_SELECTION);
    setSelectedIndices(sorted.map(c => c.originalIndex));
  };

  // Countdown timer effect (disabled in tutorial)
  useEffect(() => {
    if (isTutorial) return;
    
    if (timeLeft <= 0) {
      if (selectedIndices.length < MAX_SELECTION) {
        // Auto-fill remaining slots with highest power cards
        const remaining = MAX_SELECTION - selectedIndices.length;
        const unselected = hand
          .map((card, index) => ({ ...card, originalIndex: index }))
          .filter(c => !selectedIndices.includes(c.originalIndex))
          .sort((a, b) => (b.power || 0) - (a.power || 0))
          .slice(0, remaining);
        const finalSelection = [...selectedIndices, ...unselected.map(c => c.originalIndex)];
        onConfirmSelection(finalSelection);
      } else {
        onConfirmSelection(selectedIndices);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedIndices, onConfirmSelection, isTutorial, hand]);

  return (
    <div className="card-selection-overlay">
      <div className="card-selection-container">
        {/* Header */}
        <div className="card-selection-header">
          <div className="header-left">
            <h2>⚔️ Build Your Deck</h2>
            <p className="selection-subtitle">Choose your 10 strongest cards for battle</p>
          </div>
          {onBack && !isTutorial && (
            <button className="back-button" onClick={onBack} title="Back to Main Menu">
              ← Back
            </button>
          )}
        </div>

        {/* Timer and Progress Bar */}
        <div className="selection-progress-section">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${(selectedIndices.length / MAX_SELECTION) * 100}%` }}
            />
            <span className="progress-text">
              {selectedIndices.length} / {MAX_SELECTION} Cards Selected
            </span>
          </div>
          {!isTutorial && (
            <div className={`selection-timer ${timeLeft <= 5 ? 'low-time' : timeLeft <= 10 ? 'warning-time' : ''}`}>
              <span className="timer-icon">⏱️</span>
              <span className="timer-value">{timeLeft}</span>
              <span className="timer-label">sec</span>
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="selection-controls">
          {/* Element Filters */}
          <div className="element-filters">
            {ELEMENTS.map(el => (
              <button
                key={el.id}
                className={`element-filter-btn ${elementFilter === el.id ? 'active' : ''}`}
                onClick={() => setElementFilter(el.id)}
                style={{ '--el-color': el.color }}
                title={el.name}
              >
                <span className="filter-emoji">{el.emoji}</span>
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="sort-options">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Default Order</option>
              <option value="power-high">Power: High → Low</option>
              <option value="power-low">Power: Low → High</option>
              <option value="element">Sort by Element</option>
            </select>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="quick-btn auto-btn" onClick={autoSelectBest} title="Auto-select strongest cards">
              ⚡ Auto Best
            </button>
            <button className="quick-btn select-all-btn" onClick={selectAll} title="Select all visible">
              ✓ All
            </button>
            <button className="quick-btn deselect-btn" onClick={deselectAll} title="Deselect all">
              ✕ Clear
            </button>
          </div>
        </div>

        {/* Selection Stats */}
        {showStats && selectedIndices.length > 0 && (
          <div className="selection-stats-panel">
            <div className="stat-item">
              <span className="stat-label">Total Power</span>
              <span className="stat-value power-value">⚔️ {selectionStats.totalPower}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Power</span>
              <span className="stat-value">{selectionStats.avgPower}</span>
            </div>
            <div className="stat-item elements-breakdown">
              <span className="stat-label">Elements</span>
              <div className="element-tags">
                {Object.entries(selectionStats.elementCounts).map(([el, count]) => (
                  <span key={el} className="element-tag">{el}: {count}</span>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Card Grid */}
        <div className="card-selection-grid">
          {processedCards.length === 0 ? (
            <div className="no-cards-message">
              <span className="no-cards-icon">🔍</span>
              <p>No cards match this filter</p>
              <button className="reset-filter-btn" onClick={() => setElementFilter('all')}>
                Show All Cards
              </button>
            </div>
          ) : (
            processedCards.map((card) => (
              <div
                key={card.originalIndex}
                className={`selectable-card ${selectedIndices.includes(card.originalIndex) ? 'selected' : ''} ${selectedIndices.length >= MAX_SELECTION && !selectedIndices.includes(card.originalIndex) ? 'disabled' : ''}`}
                onClick={() => toggleCard(card.originalIndex)}
              >
                <Card card={card} isPlayable={true} />
                {selectedIndices.includes(card.originalIndex) && (
                  <div className="selection-badge">
                    <span className="badge-number">{selectedIndices.indexOf(card.originalIndex) + 1}</span>
                    <span className="badge-check">✓</span>
                  </div>
                )}
                <div className="card-power-indicator">⚔️ {card.power || 0}</div>
              </div>
            ))
          )}
        </div>
        
        {/* Confirm Button */}
        <button
          className={`confirm-selection-button ${selectedIndices.length === MAX_SELECTION ? 'ready' : ''}`}
          onClick={handleConfirm}
          disabled={selectedIndices.length !== MAX_SELECTION}
        >
          {selectedIndices.length === MAX_SELECTION 
            ? '⚔️ Confirm & Start Battle!' 
            : `Select ${MAX_SELECTION - selectedIndices.length} More Card${MAX_SELECTION - selectedIndices.length !== 1 ? 's' : ''}`}
        </button>

        {!isTutorial && timeLeft <= 5 && selectedIndices.length < MAX_SELECTION && (
          <p className="time-warning">
            ⚠️ Auto-selecting best cards in {timeLeft}s!
          </p>
        )}
      </div>
    </div>
  );
};

export default CardSelection;

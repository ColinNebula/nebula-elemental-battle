import React, { useState, useEffect } from 'react';
import Card from './Card';
import './CardSelection.css';

const CardSelection = ({ hand, onConfirmSelection, onBack }) => {
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [timeLeft, setTimeLeft] = useState(20);

  const toggleCard = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter(i => i !== index));
    } else if (selectedIndices.length < 5) {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleConfirm = () => {
    if (selectedIndices.length === 5) {
      onConfirmSelection(selectedIndices);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      // Time's up - start with whatever cards are selected
      onConfirmSelection(selectedIndices);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, selectedIndices, onConfirmSelection]);

  return (
    <div className="card-selection-overlay">
      <div className="card-selection-container">
        <div className="card-selection-header">
          <h2>Select Your Starting 5 Cards</h2>
          {onBack && (
            <button className="back-button" onClick={onBack} title="Back to Main Menu">
              ← Back
            </button>
          )}
        </div>
        <p className="selection-info">
          Choose 5 cards from your hand. The remaining 5 will be kept in reserve.
        </p>
        <div className="selection-stats">
          <p className="selection-count">
            Selected: {selectedIndices.length} / 5
          </p>
          <div className={`selection-timer ${timeLeft <= 5 ? 'low-time' : timeLeft <= 10 ? 'warning-time' : ''}`}>
            ⏱️ Time Left: <span className="timer-value">{timeLeft}s</span>
          </div>
        </div>
        
        <div className="card-selection-grid">
          {hand.map((card, index) => (
            <div
              key={index}
              className={`selectable-card ${selectedIndices.includes(index) ? 'selected' : ''}`}
              onClick={() => toggleCard(index)}
            >
              <Card card={card} isPlayable={true} />
              {selectedIndices.includes(index) && (
                <div className="selection-badge">{selectedIndices.indexOf(index) + 1}</div>
              )}
            </div>
          ))}
        </div>
        
        <button
          className="confirm-selection-button"
          onClick={handleConfirm}
          disabled={selectedIndices.length !== 5}
        >
          {selectedIndices.length === 5 ? 'Confirm Selection' : `Select ${5 - selectedIndices.length} More Card${5 - selectedIndices.length !== 1 ? 's' : ''}`}
        </button>
        {timeLeft <= 5 && selectedIndices.length > 0 && selectedIndices.length < 5 && (
          <p className="time-warning">
            ⚠️ Starting soon with {selectedIndices.length} card{selectedIndices.length !== 1 ? 's' : ''}!
          </p>
        )}
      </div>
    </div>
  );
};

export default CardSelection;

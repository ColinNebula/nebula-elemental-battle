import React, { useState } from 'react';
import './StoryChoice.css';

function StoryChoice({ choiceData, onChoice }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showConsequence, setShowConsequence] = useState(false);

  const handleSelectChoice = (choice) => {
    setSelectedChoice(choice);
    setShowConsequence(true);
  };

  const handleConfirm = () => {
    if (selectedChoice) {
      onChoice?.(selectedChoice.id);
    }
  };

  if (!choiceData) return null;

  return (
    <div className="story-choice-overlay">
      <div className="story-choice-container">
        <div className="choice-header">
          <h2>⚔️ A Choice Awaits ⚔️</h2>
          <p className="choice-question">{choiceData.question}</p>
        </div>

        <div className="choices-grid">
          {choiceData.choices.map((choice, idx) => (
            <div
              key={choice.id}
              className={`choice-card ${selectedChoice?.id === choice.id ? 'selected' : ''}`}
              onClick={() => handleSelectChoice(choice)}
              style={{ '--delay': `${idx * 0.1}s` }}
            >
              <div className="choice-icon">{choice.effect === 'darkness' ? '🌑' : choice.effect === 'light' ? '☀️' : choice.effect === 'ally' ? '🤝' : choice.effect === 'solo' ? '⚔️' : choice.effect === 'power' ? '💎' : choice.effect === 'heroic' ? '✨' : choice.effect === 'mercy' ? '💝' : choice.effect === 'justice' ? '⚖️' : choice.effect === 'sacrifice' ? '🕊️' : '❓'}</div>
              <h3 className="choice-text">{choice.text}</h3>
              
              {selectedChoice?.id === choice.id && showConsequence && (
                <div className="choice-consequence">
                  <p className="consequence-label">Consequence:</p>
                  <p className="consequence-text">{choice.consequence}</p>
                  
                  {choice.bonus && (
                    <div className="choice-bonus">
                      <span className="bonus-icon">🎁</span>
                      <span>Bonus: {choice.bonus.type === 'strength' ? `+${choice.bonus.value} Strength` : 
                                     choice.bonus.type === 'experience' ? `${choice.bonus.value}x XP` :
                                     choice.bonus.type === 'equipment' ? `${choice.bonus.item}` :
                                     `+${choice.bonus.value} ${choice.bonus.type}`}</span>
                    </div>
                  )}
                  
                  {choice.unlocksStage && (
                    <div className="choice-unlock">
                      <span className="unlock-icon">🔓</span>
                      <span>Unlocks special stage</span>
                    </div>
                  )}
                  
                  {choice.unlocksSecret && (
                    <div className="choice-unlock secret">
                      <span className="unlock-icon">👁️</span>
                      <span>Unlocks secret boss</span>
                    </div>
                  )}
                  
                  {choice.unlocksEnding && (
                    <div className="choice-unlock ending">
                      <span className="unlock-icon">🏆</span>
                      <span>Unlocks special ending</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedChoice && (
          <div className="choice-actions">
            <button className="choice-btn confirm-btn" onClick={handleConfirm}>
              Confirm Choice
            </button>
            <button className="choice-btn cancel-btn" onClick={() => { setSelectedChoice(null); setShowConsequence(false); }}>
              Choose Again
            </button>
          </div>
        )}

        {!selectedChoice && (
          <p className="choice-hint">Click on a choice to see its consequences</p>
        )}
      </div>
    </div>
  );
}

export default StoryChoice;

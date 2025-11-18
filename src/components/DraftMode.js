import React, { useState, useEffect } from 'react';
import './DraftMode.css';

const DraftMode = ({ onDraftComplete, onCancel }) => {
  const [draftPool, setDraftPool] = useState([]);
  const [playerPicks, setPlayerPicks] = useState([]);
  const [aiPicks, setAIPicks] = useState([]);
  const [currentPicker, setCurrentPicker] = useState('player'); // 'player' or 'ai'
  const [round, setRound] = useState(1);
  const [cardsToShow, setCardsToShow] = useState([]);
  
  const TOTAL_PICKS = 20;
  const CARDS_PER_ROUND = 3;
  const ELEMENTS = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'POWER', 'LIGHT', 'DARK', 'NEUTRAL', 'TECHNOLOGY', 'METEOR'];

  useEffect(() => {
    generateDraftPool();
  }, []);

  useEffect(() => {
    if (playerPicks.length + aiPicks.length < TOTAL_PICKS * 2) {
      showNextCards();
    } else {
      completeDraft();
    }
  }, [playerPicks.length, aiPicks.length]);

  const generateDraftPool = () => {
    const pool = [];
    ELEMENTS.forEach(element => {
      for (let strength = 1; strength <= 10; strength++) {
        const copies = strength <= 5 ? 6 : strength <= 8 ? 4 : 3;
        for (let i = 0; i < copies; i++) {
          pool.push({
            id: `${element}_${strength}_${i}`,
            element,
            strength,
            modifiedStrength: strength
          });
        }
      }
    });
    
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    setDraftPool(pool);
  };

  const showNextCards = () => {
    if (draftPool.length >= CARDS_PER_ROUND) {
      const cards = draftPool.slice(0, CARDS_PER_ROUND);
      setCardsToShow(cards);
      setDraftPool(draftPool.slice(CARDS_PER_ROUND));
    }
  };

  const handleCardPick = (card) => {
    if (currentPicker === 'player') {
      setPlayerPicks([...playerPicks, card]);
      setCardsToShow(cardsToShow.filter(c => c.id !== card.id));
      setCurrentPicker('ai');
      
      // AI picks after a delay
      setTimeout(() => {
        aiPickCard();
      }, 1000);
    }
  };

  const aiPickCard = () => {
    if (cardsToShow.length > 0) {
      // AI picks strongest card
      const bestCard = cardsToShow.reduce((best, card) => 
        card.strength > best.strength ? card : best
      , cardsToShow[0]);
      
      setAIPicks([...aiPicks, bestCard]);
      setCardsToShow(cardsToShow.filter(c => c.id !== bestCard.id));
      setCurrentPicker('player');
      setRound(round + 1);
    }
  };

  const completeDraft = () => {
    onDraftComplete({
      playerDeck: playerPicks,
      aiDeck: aiPicks
    });
  };

  const getPickProgress = () => {
    return {
      player: playerPicks.length,
      ai: aiPicks.length,
      total: TOTAL_PICKS
    };
  };

  const progress = getPickProgress();

  return (
    <div className="draft-mode-overlay">
      <div className="draft-mode-container">
        <div className="draft-header">
          <h2>🎴 Draft Mode</h2>
          <div className="draft-progress">
            <div className="progress-bar">
              <div className="player-progress">
                <span>Your Picks: {progress.player}/{progress.total}</span>
                <div className="bar">
                  <div 
                    className="bar-fill player"
                    style={{ width: `${(progress.player / progress.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="ai-progress">
                <span>AI Picks: {progress.ai}/{progress.total}</span>
                <div className="bar">
                  <div 
                    className="bar-fill ai"
                    style={{ width: `${(progress.ai / progress.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button className="close-draft" onClick={onCancel}>✕</button>
        </div>

        <div className="draft-content">
          <div className="turn-indicator">
            {currentPicker === 'player' ? (
              <h3 className="your-turn">🎯 Your Turn - Pick a Card</h3>
            ) : (
              <h3 className="ai-turn">🤖 AI is picking...</h3>
            )}
            <p>Round {round}</p>
          </div>

          <div className="draft-cards">
            {cardsToShow.map((card) => (
              <div
                key={card.id}
                className={`draft-card ${currentPicker === 'player' ? 'pickable' : 'waiting'}`}
                onClick={() => currentPicker === 'player' && handleCardPick(card)}
                style={{ borderColor: getElementColor(card.element) }}
              >
                <div className="draft-card-element" style={{ color: getElementColor(card.element) }}>
                  {card.element}
                </div>
                <div className="draft-card-strength">{card.strength}</div>
                {currentPicker === 'player' && (
                  <div className="pick-overlay">PICK</div>
                )}
              </div>
            ))}
          </div>

          <div className="draft-decks">
            <div className="player-deck">
              <h4>Your Deck ({playerPicks.length})</h4>
              <div className="mini-cards">
                {playerPicks.slice(-5).map((card, index) => (
                  <div key={index} className="mini-draft-card" style={{ borderColor: getElementColor(card.element) }}>
                    {card.strength}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="ai-deck">
              <h4>AI Deck ({aiPicks.length})</h4>
              <div className="mini-cards">
                {aiPicks.slice(-5).map((card, index) => (
                  <div key={index} className="mini-draft-card" style={{ borderColor: getElementColor(card.element) }}>
                    {card.strength}
                  </div>
                ))}
              </div>
            </div>
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

export default DraftMode;

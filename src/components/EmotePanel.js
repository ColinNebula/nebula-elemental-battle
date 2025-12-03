import React, { useState, useEffect, useCallback } from 'react';
import { EMOTES, AI_EMOTE_RESPONSES } from '../utils/gameEnhancements';
import './EmotePanel.css';

const EmotePanel = ({ isVisible, onClose, onEmote, isPlayerTurn, aiName = 'AI' }) => {
  const [selectedCategory, setSelectedCategory] = useState('GREETINGS');
  const [lastEmote, setLastEmote] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [cooldown, setCooldown] = useState(false);

  const categories = Object.keys(EMOTES);

  const handleEmoteClick = useCallback((emote) => {
    if (cooldown) return;
    
    setLastEmote(emote);
    setCooldown(true);
    
    // Notify parent
    if (onEmote) {
      onEmote(emote);
    }
    
    // AI might respond (30% chance)
    if (Math.random() < 0.3) {
      const responseCategory = AI_EMOTE_RESPONSES[selectedCategory];
      if (responseCategory) {
        const responseId = responseCategory[Math.floor(Math.random() * responseCategory.length)];
        const allEmotes = Object.values(EMOTES).flat();
        const response = allEmotes.find(e => e.id === responseId);
        
        if (response) {
          setTimeout(() => {
            setAiResponse({ ...response, from: aiName });
          }, 1000 + Math.random() * 2000);
        }
      }
    }
    
    // Clear cooldown after 3 seconds
    setTimeout(() => setCooldown(false), 3000);
  }, [cooldown, onEmote, selectedCategory, aiName]);

  // Clear AI response after display
  useEffect(() => {
    if (aiResponse) {
      const timer = setTimeout(() => setAiResponse(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [aiResponse]);

  // Clear last emote after display
  useEffect(() => {
    if (lastEmote) {
      const timer = setTimeout(() => setLastEmote(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [lastEmote]);

  if (!isVisible) return null;

  return (
    <>
      {/* Emote Display Bubbles */}
      {lastEmote && (
        <div className="emote-bubble player-emote">
          <span className="emote-icon">{lastEmote.icon}</span>
          <span className="emote-text">{lastEmote.text}</span>
        </div>
      )}
      
      {aiResponse && (
        <div className="emote-bubble ai-emote">
          <span className="emote-sender">{aiResponse.from}:</span>
          <span className="emote-icon">{aiResponse.icon}</span>
          <span className="emote-text">{aiResponse.text}</span>
        </div>
      )}

      {/* Emote Panel */}
      <div className="emote-panel">
        <div className="emote-panel-header">
          <h3>Quick Chat</h3>
          <button className="emote-close-btn" onClick={onClose}>×</button>
        </div>
        
        {/* Category Tabs */}
        <div className="emote-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`emote-category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        
        {/* Emote Grid */}
        <div className="emote-grid">
          {EMOTES[selectedCategory].map(emote => (
            <button
              key={emote.id}
              className={`emote-btn ${cooldown ? 'cooldown' : ''}`}
              onClick={() => handleEmoteClick(emote)}
              disabled={cooldown}
              title={emote.text}
            >
              <span className="emote-btn-icon">{emote.icon}</span>
              <span className="emote-btn-text">{emote.text}</span>
            </button>
          ))}
        </div>
        
        {cooldown && (
          <div className="emote-cooldown-notice">
            Please wait before sending another message...
          </div>
        )}
      </div>
    </>
  );
};

export default EmotePanel;

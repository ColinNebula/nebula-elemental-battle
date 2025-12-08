import React, { useState, useEffect, useCallback } from 'react';
import { EMOTES, AI_EMOTE_RESPONSES } from '../utils/gameEnhancements';
import './EmotePanel.css';

// Category icons for visual tabs
const CATEGORY_ICONS = {
  GREETINGS: '👋',
  COMPLIMENTS: '👏',
  REACTIONS: '😮',
  TAUNTS: '💪',
  ENDING: '🤝',
  EMOTIONS: '😄'
};

const EmotePanel = ({ isVisible, onClose, onEmote, isPlayerTurn, aiName = 'AI' }) => {
  const [selectedCategory, setSelectedCategory] = useState('GREETINGS');
  const [lastEmote, setLastEmote] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [recentEmotes, setRecentEmotes] = useState([]);

  const categories = Object.keys(EMOTES);

  // Load recent emotes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentEmotes');
    if (saved) {
      try {
        setRecentEmotes(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load recent emotes');
      }
    }
  }, []);

  const handleEmoteClick = useCallback((emote) => {
    if (cooldown) return;
    
    setLastEmote(emote);
    setCooldown(true);
    setCooldownTime(3);
    
    // Add to recent emotes
    setRecentEmotes(prev => {
      const filtered = prev.filter(e => e.id !== emote.id);
      const updated = [emote, ...filtered].slice(0, 6);
      localStorage.setItem('recentEmotes', JSON.stringify(updated));
      return updated;
    });
    
    // Notify parent
    if (onEmote) {
      onEmote(emote);
    }
    
    // AI might respond (40% chance)
    if (Math.random() < 0.4) {
      const responseCategory = AI_EMOTE_RESPONSES[selectedCategory];
      if (responseCategory) {
        const responseId = responseCategory[Math.floor(Math.random() * responseCategory.length)];
        const allEmotes = Object.values(EMOTES).flat();
        const response = allEmotes.find(e => e.id === responseId);
        
        if (response) {
          setTimeout(() => {
            setAiResponse({ ...response, from: aiName });
          }, 800 + Math.random() * 1500);
        }
      }
    }
    
    // Countdown timer
    const interval = setInterval(() => {
      setCooldownTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCooldown(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
  }, [cooldown, onEmote, selectedCategory, aiName]);

  // Clear AI response after display
  useEffect(() => {
    if (aiResponse) {
      const timer = setTimeout(() => setAiResponse(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [aiResponse]);

  // Clear last emote after display
  useEffect(() => {
    if (lastEmote) {
      const timer = setTimeout(() => setLastEmote(null), 3000);
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
          <span className="emote-sender">{aiResponse.from}</span>
          <span className="emote-icon">{aiResponse.icon}</span>
          <span className="emote-text">{aiResponse.text}</span>
        </div>
      )}

      {/* Emote Panel */}
      <div className="emote-panel">
        <div className="emote-panel-header">
          <div className="emote-panel-title">
            <span className="emote-panel-icon">💬</span>
            <h3>Quick Chat</h3>
          </div>
          <button className="emote-close-btn" onClick={onClose}>×</button>
        </div>
        
        {/* Recent Emotes (Quick Access) */}
        {recentEmotes.length > 0 && (
          <div className="emote-recent">
            <span className="recent-label">Recent:</span>
            <div className="recent-emotes">
              {recentEmotes.map(emote => (
                <button
                  key={emote.id}
                  className={`recent-emote-btn ${cooldown ? 'cooldown' : ''}`}
                  onClick={() => handleEmoteClick(emote)}
                  disabled={cooldown}
                  title={emote.text}
                >
                  {emote.icon}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Category Tabs */}
        <div className="emote-categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`emote-category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              title={cat.charAt(0) + cat.slice(1).toLowerCase()}
            >
              <span className="category-icon">{CATEGORY_ICONS[cat]}</span>
              <span className="category-name">{cat.charAt(0) + cat.slice(1).toLowerCase()}</span>
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
            <div className="cooldown-bar" style={{ width: `${(cooldownTime / 3) * 100}%` }}></div>
            <span>Wait {cooldownTime}s...</span>
          </div>
        )}
        
        <div className="emote-panel-footer">
          <span className="emote-tip">💡 Tip: {isPlayerTurn ? "It's your turn to play!" : "Waiting for opponent..."}</span>
        </div>
      </div>
    </>
  );
};

export default EmotePanel;

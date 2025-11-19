import React, { useState, useEffect, useRef } from 'react';
import './Lobby.css';

const AI_OPPONENTS = [
  { key: 'CHAOS', name: 'Chaos', avatar: '🔮', difficulty: 'Random', color: '#9c27b0' },
  { key: 'EMBER', name: 'Ember', avatar: '🔥', difficulty: 'Easy', color: '#f44336' },
  { key: 'FROST', name: 'Frost', avatar: '❄️', difficulty: 'Medium', color: '#2196f3' },
  { key: 'VOLT', name: 'Volt', avatar: '⚡', difficulty: 'Hard', color: '#ffeb3b' },
  { key: 'NEXUS', name: 'Nexus', avatar: '⭐', difficulty: 'Master', color: '#ffd700' }
];

const Lobby = ({ onSinglePlayer, onMultiplayer, onBack }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedAI, setSelectedAI] = useState('CHAOS');
  const [showAISelection, setShowAISelection] = useState(false);

  const handleSinglePlayer = () => {
    const name = playerName.trim() || 'Player';
    onSinglePlayer(name, selectedAI);
  };

  const handleMultiplayer = () => {
    const name = playerName.trim() || 'Player';
    onMultiplayer(name);
  };

  const selectedOpponent = AI_OPPONENTS.find(ai => ai.key === selectedAI) || AI_OPPONENTS[0];

  return (
    <div className="lobby">
      <div className="lobby-container">
        <div className="lobby-header">
          <h1 className="lobby-title">
            <span className="title-icon">🎴</span>
            <span>Choose Your Mode</span>
          </h1>
          {onBack && (
            <button className="back-to-menu-button" onClick={onBack} title="Back to Main Menu">
              ← Back
            </button>
          )}
        </div>
        
        <div className="lobby-form">
          <div className="form-group">
            <label>Your Name:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name (optional)"
              className="input-field"
              onKeyPress={(e) => e.key === 'Enter' && handleSinglePlayer()}
            />
          </div>

          <div className="mode-selection">
            <div className="mode-card">
              <div className="mode-icon">🎮</div>
              <h2 className="mode-title">Single Player</h2>
              <p className="mode-description">Play against AI opponent</p>
              
              {!showAISelection ? (
                <>
                  <div className="selected-opponent" onClick={() => setShowAISelection(true)}>
                    <span className="opponent-label">Opponent:</span>
                    <div className="opponent-display">
                      <span className="opponent-avatar">{selectedOpponent.avatar}</span>
                      <span className="opponent-name">{selectedOpponent.name}</span>
                      <span className={`opponent-difficulty ${selectedOpponent.difficulty.toLowerCase()}`}>
                        {selectedOpponent.difficulty}
                      </span>
                    </div>
                    <span className="change-opponent-hint">Click to change</span>
                  </div>
                  <button className="mode-button" onClick={handleSinglePlayer}>
                    Play Now
                  </button>
                </>
              ) : (
                <div className="ai-selection-grid">
                  {AI_OPPONENTS.map(ai => (
                    <div 
                      key={ai.key}
                      className={`ai-option ${selectedAI === ai.key ? 'selected' : ''}`}
                      onClick={() => { setSelectedAI(ai.key); setShowAISelection(false); }}
                      style={{ borderColor: ai.color }}
                    >
                      <div className="ai-avatar">{ai.avatar}</div>
                      <div className="ai-name">{ai.name}</div>
                      <div className={`ai-difficulty ${ai.difficulty.toLowerCase()}`}>{ai.difficulty}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mode-card multiplayer" onClick={handleMultiplayer}>
              <div className="mode-icon">👥</div>
              <h2 className="mode-title">Multiplayer</h2>
              <p className="mode-description">Challenge other players</p>
              <div className="mode-features">
                <div className="feature">🌐 Online Match</div>
                <div className="feature">🎯 Competitive</div>
                <div className="feature">💬 Real Players</div>
              </div>
              <button className="mode-button">Coming Soon</button>
            </div>
          </div>
        </div>

        <div className="lobby-info">
          <h3>Game Features:</h3>
          <ul>
            <li>🔥 9 Unique Elements with special abilities</li>
            <li>⚔️ Counter system - elements beat each other</li>
            <li>🔗 Card evolution - chain same elements for bonuses</li>
            <li>⚰️ Graveyard mechanics - revive fallen cards</li>
            <li>💀 Fatigue damage - strategic deck management</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Lobby;

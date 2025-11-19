import React, { useState } from 'react';
import './CharacterSelection.css';

const AVATARS = [
  {
    id: 'rage',
    name: 'Rage Warrior',
    image: 'rage-avatar.png',
    description: 'A fierce warrior fueled by unstoppable rage',
    element: 'FIRE',
    icon: '🔥'
  },
  {
    id: 'water',
    name: 'Water Mage',
    image: 'water-avatar.png',
    description: 'Master of the flowing tides and ocean depths',
    element: 'WATER',
    icon: '💧'
  },
  {
    id: 'blood',
    name: 'Blood Knight',
    image: 'blood-avatar.png',
    description: 'Dark warrior who draws power from sacrifice',
    element: 'DARK',
    icon: '🩸'
  },
  {
    id: 'ninja',
    name: 'Shadow Ninja',
    image: 'ninja-avatar.png',
    description: 'Silent assassin who strikes from the shadows',
    element: 'DARK',
    icon: '🥷'
  },
  {
    id: 'fire',
    name: 'Flame Sorcerer',
    image: 'fire1-avatar.png',
    description: 'Pyromancer wielding devastating flame magic',
    element: 'FIRE',
    icon: '🔥'
  }
];

const CharacterSelection = ({ onSelectCharacter, onCancel }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [hoveredAvatar, setHoveredAvatar] = useState(null);

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelectCharacter(selectedAvatar);
    }
  };

  return (
    <div className="character-selection-overlay">
      <div className="character-selection-modal">
        <div className="character-header">
          <h1>Choose Your Champion</h1>
          <p className="character-subtitle">Select your avatar to begin your journey</p>
        </div>

        <div className="avatars-grid">
          {AVATARS.map((avatar) => (
            <div
              key={avatar.id}
              className={`avatar-card ${selectedAvatar?.id === avatar.id ? 'selected' : ''} ${hoveredAvatar?.id === avatar.id ? 'hovered' : ''}`}
              onClick={() => setSelectedAvatar(avatar)}
              onMouseEnter={() => setHoveredAvatar(avatar)}
              onMouseLeave={() => setHoveredAvatar(null)}
            >
              <div className="avatar-image-container">
                <img 
                  src={`${process.env.PUBLIC_URL}/${avatar.image}`}
                  alt={avatar.name}
                  className="avatar-image"
                  onError={(e) => {
                    // Fallback to icon if image not found
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="avatar-fallback" style={{ display: 'none' }}>
                  <span className="fallback-icon">{avatar.icon}</span>
                </div>
              </div>
              <div className="avatar-info">
                <h3 className="avatar-name">{avatar.name}</h3>
                <div className="avatar-element">
                  {avatar.icon} {avatar.element}
                </div>
              </div>
              {selectedAvatar?.id === avatar.id && (
                <div className="selected-indicator">✓</div>
              )}
            </div>
          ))}
        </div>

        {selectedAvatar && (
          <div className="character-details">
            <div className="detail-content">
              <h3>{selectedAvatar.name}</h3>
              <p className="character-description">{selectedAvatar.description}</p>
              <div className="character-element-badge">
                <span className="element-icon">{selectedAvatar.icon}</span>
                <span className="element-name">{selectedAvatar.element} Affinity</span>
              </div>
            </div>
          </div>
        )}

        <div className="character-actions">
          <button 
            className="character-btn cancel-btn"
            onClick={onCancel}
          >
            ← Back
          </button>
          <button 
            className="character-btn confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedAvatar}
          >
            Confirm Selection →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterSelection;

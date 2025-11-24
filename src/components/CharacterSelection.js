import React, { useState, useEffect } from 'react';
import './CharacterSelection.css';
import { ARENA_THEMES } from '../utils/themes';
import { AI_PERSONALITIES } from '../utils/aiPersonalities';
import secureStorage from '../utils/secureStorage';

const BASE_AVATARS = [
  {
    id: 'random',
    name: 'Random Champion',
    image: null,
    description: 'Let fate decide your champion! A random avatar will be selected for you.',
    element: 'ALL',
    icon: '❓',
    isRandom: true
  },
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
    image: 'ember-the-firestarter-avatar.png',
    description: 'Pyromancer wielding devastating flame magic',
    element: 'FIRE',
    icon: '🔥'
  }
];

const CharacterSelection = ({ onSelectCharacter, onCancel, isStoryMode = false }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const [selectedArenaTheme, setSelectedArenaTheme] = useState('cosmic');
  const [ownedThemes, setOwnedThemes] = useState(['cosmic']);
  const [availableAvatars, setAvailableAvatars] = useState(BASE_AVATARS);

  // Load owned themes and unlocked characters from localStorage
  useEffect(() => {
    const themesData = localStorage.getItem('playerThemes');
    if (themesData) {
      try {
        const parsed = JSON.parse(themesData);
        if (parsed.ownedThemes) {
          setOwnedThemes(parsed.ownedThemes);
        }
      } catch (e) {
        console.error('Error loading themes:', e);
      }
    }

    // Load unlocked characters from story progress
    const storyProgress = secureStorage.getItem('storyModeProgress');
    if (storyProgress && storyProgress.completedStages) {
      const unlockedCharacters = [];
      
      // Map defeated opponents to unlockable avatars
      Object.keys(storyProgress.completedStages).forEach(stageKey => {
        const personality = AI_PERSONALITIES[stageKey];
        if (personality && personality.avatarImage) {
          unlockedCharacters.push({
            id: stageKey.toLowerCase(),
            name: personality.name,
            image: personality.avatarImage,
            description: personality.description,
            element: personality.element || 'NEUTRAL',
            icon: personality.avatar,
            unlocked: true,
            unlockedFrom: 'Story Mode'
          });
        }
      });

      // Combine base avatars with unlocked characters (remove duplicates)
      const allAvatars = [...BASE_AVATARS];
      unlockedCharacters.forEach(unlockedChar => {
        if (!allAvatars.find(a => a.id === unlockedChar.id)) {
          allAvatars.push(unlockedChar);
        }
      });
      
      setAvailableAvatars(allAvatars);
      console.log('🎮 Unlocked characters loaded:', unlockedCharacters.map(c => c.name));
    }
  }, []);

  const handleConfirm = () => {
    if (selectedAvatar) {
      // Handle random avatar selection
      let finalAvatar = selectedAvatar;
      if (selectedAvatar.isRandom) {
        const nonRandomAvatars = availableAvatars.filter(a => !a.isRandom);
        const randomIndex = Math.floor(Math.random() * nonRandomAvatars.length);
        finalAvatar = nonRandomAvatars[randomIndex];
        console.log('🎲 Random avatar selected:', finalAvatar.name);
      }

      // Handle random arena theme selection (only for non-story mode)
      if (!isStoryMode) {
        let finalTheme = selectedArenaTheme;
        if (selectedArenaTheme === 'random') {
          const ownedNonRandomThemes = ownedThemes.filter(t => t !== 'random');
          const randomIndex = Math.floor(Math.random() * ownedNonRandomThemes.length);
          finalTheme = ownedNonRandomThemes[randomIndex];
          console.log('🎲 Random arena theme selected:', finalTheme);
        }

        // Save the selected arena theme to localStorage
        localStorage.setItem('arenaTheme', finalTheme);
      }
      
      onSelectCharacter(finalAvatar);
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
          {availableAvatars.map((avatar) => (
            <div
              key={avatar.id}
              className={`avatar-card ${selectedAvatar?.id === avatar.id ? 'selected' : ''} ${hoveredAvatar?.id === avatar.id ? 'hovered' : ''}`}
              onClick={() => setSelectedAvatar(avatar)}
              onMouseEnter={() => setHoveredAvatar(avatar)}
              onMouseLeave={() => setHoveredAvatar(null)}
            >
              <div className="avatar-image-container">
                {avatar.isRandom ? (
                  <div className="avatar-fallback avatar-random-special" style={{ display: 'flex' }}>
                    <span className="fallback-icon random-icon">{avatar.icon}</span>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
              <div className="avatar-info">
                <h3 className="avatar-name">{avatar.name}</h3>
                <div className="avatar-element">
                  {avatar.icon} {avatar.element}
                </div>
                {avatar.unlocked && (
                  <div className="avatar-unlocked-badge">
                    🔓 Unlocked from {avatar.unlockedFrom}
                  </div>
                )}
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

        {!isStoryMode && (
          <div className="arena-theme-selection">
          <h2 className="arena-theme-title">Choose Arena Background</h2>
          <div className="arena-themes-grid">
            {/* Random Theme Option */}
            <div
              key="random"
              className={`arena-theme-card arena-theme-random ${selectedArenaTheme === 'random' ? 'selected' : ''}`}
              onClick={() => setSelectedArenaTheme('random')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%)',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 3s ease infinite',
                cursor: 'pointer'
              }}
            >
              <div className="arena-theme-name">
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '5px' }}>❓</span>
                Random Arena
              </div>
              {selectedArenaTheme === 'random' && (
                <div className="arena-theme-check">✓</div>
              )}
            </div>

            {/* Regular Theme Options */}
            {Object.entries(ARENA_THEMES).map(([themeId, theme]) => {
              const isOwned = ownedThemes.includes(themeId);
              const isLocked = !isOwned;
              
              return (
                <div
                  key={themeId}
                  className={`arena-theme-card ${selectedArenaTheme === themeId ? 'selected' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => {
                    if (isOwned) {
                      setSelectedArenaTheme(themeId);
                    }
                  }}
                  style={{
                    background: theme.background,
                    opacity: isLocked ? 0.5 : 1,
                    cursor: isLocked ? 'not-allowed' : 'pointer'
                  }}
                >
                  <div className="arena-theme-name">{theme.name}</div>
                  {isLocked && (
                    <div className="arena-theme-locked">
                      <span className="lock-icon">🔒</span>
                      <span className="lock-cost">{theme.cost} coins</span>
                    </div>
                  )}
                  {selectedArenaTheme === themeId && !isLocked && (
                    <div className="arena-theme-check">✓</div>
                  )}
                </div>
              );
            })}
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

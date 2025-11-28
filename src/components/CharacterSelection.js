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

// Story mode characters that appear locked until defeated
const LOCKED_STORY_CHARACTERS = [
  {
    id: 'frost',
    storyKey: 'FROST',
    name: 'Frost the Frozen',
    image: 'frost-the-frozen-avatar.png',
    description: 'A calculated strategist who freezes opponents in their tracks',
    element: 'ICE',
    icon: '❄️',
    unlockRequirement: 'Defeat in Story Mode Stage 2',
    isLocked: true
  },
  {
    id: 'aqua',
    storyKey: 'AQUA',
    name: 'Aqua the Tidekeeper',
    image: 'water-avatar.png',
    description: 'A flowing fighter who adapts to any situation',
    element: 'WATER',
    icon: '💧',
    unlockRequirement: 'Defeat in Story Mode Stage 3',
    isLocked: true
  },
  {
    id: 'volt',
    storyKey: 'VOLT',
    name: 'Volt the Electrifier',
    image: 'vol- the-electrifier-avatar.png',
    description: 'A shocking speedster with lightning-fast combos',
    element: 'ELECTRICITY',
    icon: '⚡',
    unlockRequirement: 'Defeat in Story Mode Stage 4',
    isLocked: true
  },
  {
    id: 'terra',
    storyKey: 'TERRA',
    name: 'Terra the Earthshaker',
    image: 'terra-the-earthshaker-avatar.png',
    description: 'A defensive powerhouse who wears opponents down',
    element: 'EARTH',
    icon: '🌍',
    unlockRequirement: 'Defeat in Story Mode Stage 5',
    isLocked: true
  },
  {
    id: 'lumina',
    storyKey: 'LUMINA',
    name: 'Lumina the Radiant',
    image: 'lumina-the-radiant-avatar.png',
    description: 'A brilliant tactician with divine powers',
    element: 'LIGHT',
    icon: '☀️',
    unlockRequirement: 'Defeat in Story Mode Stage 6',
    isLocked: true
  },
  {
    id: 'shadow',
    storyKey: 'SHADOW',
    name: 'Shadow the Voidwalker',
    image: 'void-walker-avatar.png',
    description: 'A mysterious fighter who exploits weaknesses',
    element: 'DARK',
    icon: '🌙',
    unlockRequirement: 'Defeat in Story Mode Stage 7',
    isLocked: true
  },
  {
    id: 'shadow_ninja',
    storyKey: 'SHADOW_NINJA',
    name: 'Shadow Ninja',
    image: 'ninja-avatar.png',
    description: 'A silent assassin who strikes from the shadows with lethal precision',
    element: 'DARK',
    icon: '🥷',
    unlockRequirement: 'Defeat in Story Mode Stage 8',
    isLocked: true
  },
  {
    id: 'blood_knight',
    storyKey: 'BLOOD_KNIGHT',
    name: 'Blood Knight',
    image: 'blood-avatar.png',
    description: 'A ruthless warrior who grows stronger with every drop of blood spilled',
    element: 'FIRE',
    icon: '⚔️',
    unlockRequirement: 'Defeat BOSS in Story Mode Stage 9',
    isLocked: true
  },
  {
    id: 'nexus',
    storyKey: 'NEXUS',
    name: 'Nexus the Omnipotent',
    image: 'power-nexus--avatar.png',
    description: 'The ultimate champion who masters all elements',
    element: 'POWER',
    icon: '⭐',
    unlockRequirement: 'Defeat BOSS in Story Mode Stage 10',
    isLocked: true
  },
  {
    id: 'chaos',
    storyKey: 'CHAOS',
    name: 'Chaos the Unpredictable',
    image: 'chaos-the-unpredictable-avatar.png',
    description: 'An erratic wildcard who defies all logic',
    element: 'NEUTRAL',
    icon: '🔮',
    unlockRequirement: 'Defeat FINAL BOSS in Story Mode Stage 11',
    isLocked: true
  },
  {
    id: 'samurai',
    storyKey: 'SAMURAI_SECRET',
    name: 'Legendary Samurai',
    image: 'samurai-avatar.png',
    description: 'A legendary warrior of unmatched skill. Master of all combat styles and elements.',
    element: 'ALL',
    icon: '⚔️🎌',
    unlockRequirement: 'Defeat Shadow Ninja & Complete Story Mode',
    isLocked: true,
    isSecret: true
  }
];

const CharacterSelection = ({ onSelectCharacter, onCancel, isStoryMode = false }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [hoveredAvatar, setHoveredAvatar] = useState(null);
  const [selectedArenaTheme, setSelectedArenaTheme] = useState('cosmic');
  const [ownedThemes, setOwnedThemes] = useState(['cosmic']);
  const [availableAvatars, setAvailableAvatars] = useState(BASE_AVATARS);

  const playSelectSound = () => {
    const selectSound = new Audio(`${process.env.PUBLIC_URL}/mixkit-arcade-player-select-2036.wav`);
    selectSound.volume = 0.5;    selectSound.setAttribute('playsinline', 'true');
    selectSound.setAttribute('webkit-playsinline', 'true');    selectSound.play().catch(err => console.log('Sound play prevented:', err));
  };

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

    // Load story progress and determine which characters to show
    const storyProgress = secureStorage.getItem('storyModeProgress');
    const completedStages = storyProgress?.completedStages || [];
    
    // Start with base avatars
    const allAvatars = [...BASE_AVATARS];
    
    // Check if story mode is completed (all 11 stages done)
    const isStoryModeComplete = completedStages.length >= 11;
    const hasShadowNinja = completedStages.includes('SHADOW_NINJA');
    
    // Process each locked story character
    LOCKED_STORY_CHARACTERS.forEach(lockedChar => {
      // Special handling for secret Samurai character
      if (lockedChar.isSecret) {
        // Only show Samurai if Shadow Ninja defeated AND story mode complete
        if (hasShadowNinja && isStoryModeComplete) {
          allAvatars.push({
            ...lockedChar,
            isLocked: true // Always locked for now (future unlock mechanic)
          });
        }
        return;
      }
      
      // Check if this character's stage has been completed
      const isUnlocked = completedStages.some(stage => {
        // Match the opponent from STORY_MODE_CAMPAIGN with this character
        const campaignStage = AI_PERSONALITIES[lockedChar.storyKey];
        return campaignStage && completedStages.includes(lockedChar.storyKey);
      });
      
      if (isUnlocked) {
        // Add as unlocked character
        allAvatars.push({
          id: lockedChar.id,
          name: lockedChar.name,
          image: lockedChar.image,
          description: lockedChar.description,
          element: lockedChar.element,
          icon: lockedChar.icon,
          unlocked: true,
          unlockedFrom: 'Story Mode'
        });
      } else {
        // Add as locked character (visible but not selectable)
        allAvatars.push({
          ...lockedChar,
          isLocked: true
        });
      }
    });
    
    setAvailableAvatars(allAvatars);
    console.log('🎮 Characters loaded:', {
      total: allAvatars.length,
      unlocked: allAvatars.filter(a => !a.isLocked).length,
      locked: allAvatars.filter(a => a.isLocked).length
    });
  }, []);

  const handleConfirm = () => {
    if (selectedAvatar) {
      playSelectSound();
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

        // Save the selected arena theme using secure storage
        secureStorage.setItem('arenaTheme', finalTheme);
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
              className={`avatar-card ${selectedAvatar?.id === avatar.id ? 'selected' : ''} ${hoveredAvatar?.id === avatar.id ? 'hovered' : ''} ${avatar.isLocked ? 'locked' : ''}`}
              onClick={() => { 
                if (!avatar.isLocked) {
                  playSelectSound(); 
                  setSelectedAvatar(avatar);
                }
              }}
              onMouseEnter={() => !avatar.isLocked && setHoveredAvatar(avatar)}
              onMouseLeave={() => setHoveredAvatar(null)}
              style={{ cursor: avatar.isLocked ? 'not-allowed' : 'pointer' }}
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
                <h3 className="avatar-name">{avatar.isLocked ? '???' : avatar.name}</h3>
                <div className="avatar-element">
                  {avatar.isLocked ? '🔒' : avatar.icon} {avatar.isLocked ? 'LOCKED' : avatar.element}
                </div>
                {avatar.unlocked && !avatar.isLocked && (
                  <div className="avatar-unlocked-badge">
                    🔓 Unlocked from {avatar.unlockedFrom}
                  </div>
                )}
                {avatar.isLocked && (
                  <div className="avatar-locked-badge">
                    {avatar.unlockRequirement}
                  </div>
                )}
              </div>
              {selectedAvatar?.id === avatar.id && !avatar.isLocked && (
                <div className="selected-indicator">✓</div>
              )}
              {avatar.isLocked && (
                <div className="locked-overlay">
                  <div className="lock-icon-large">🔒</div>
                </div>
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

        {/* Arena selection - only show for versus mode, not story mode */}
        {!isStoryMode && selectedAvatar && (
          <div className="arena-theme-selection">
          <h2 className="arena-theme-title">Choose Arena Background</h2>
          <div className="arena-themes-grid">
            {/* Random Theme Option */}
            <div
              key="random"
              className={`arena-theme-card arena-theme-random ${selectedArenaTheme === 'random' ? 'selected' : ''}`}
              onClick={() => { playSelectSound(); setSelectedArenaTheme('random'); }}
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
                      playSelectSound();
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

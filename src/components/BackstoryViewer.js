import React, { useState } from 'react';
import './BackstoryViewer.css';
import { CHARACTER_BACKSTORIES } from '../utils/storySystem';

function BackstoryViewer({ unlockedBackstories = [], onClose }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleCharacterSelect = (characterId) => {
    const backstory = CHARACTER_BACKSTORIES[characterId];
    if (backstory && unlockedBackstories.includes(characterId)) {
      setSelectedCharacter(characterId);
    }
  };

  return (
    <div className="backstory-viewer-overlay" onClick={onClose}>
      <div className="backstory-viewer-container" onClick={(e) => e.stopPropagation()}>
        <div className="backstory-header">
          <h2>📖 Character Backstories</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {!selectedCharacter ? (
          <div className="character-grid">
            {Object.keys(CHARACTER_BACKSTORIES).map((characterId) => {
              const backstory = CHARACTER_BACKSTORIES[characterId];
              const isUnlocked = unlockedBackstories.includes(characterId);

              return (
                <div
                  key={characterId}
                  className={`character-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => isUnlocked && handleCharacterSelect(characterId)}
                >
                  <div className="character-artwork">
                    {isUnlocked ? (
                      backstory.avatarImage ? (
                        <img src={`${process.env.PUBLIC_URL}/${backstory.avatarImage}`} alt={backstory.title} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        backstory.artwork
                      )
                    ) : (
                      '🔒'
                    )}
                  </div>
                  <h3 className="character-title">
                    {isUnlocked ? backstory.title : '???'}
                  </h3>
                  {!isUnlocked && (
                    <p className="unlock-requirement">{backstory.unlock}</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="backstory-details">
            <button className="back-to-list-btn" onClick={() => setSelectedCharacter(null)}>
              ← Back to List
            </button>
            
            <div className="backstory-content">
              <div className="backstory-artwork-large">
                {CHARACTER_BACKSTORIES[selectedCharacter].avatarImage ? (
                  <img 
                    src={`${process.env.PUBLIC_URL}/${CHARACTER_BACKSTORIES[selectedCharacter].avatarImage}`} 
                    alt={CHARACTER_BACKSTORIES[selectedCharacter].title} 
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }} 
                  />
                ) : (
                  CHARACTER_BACKSTORIES[selectedCharacter].artwork
                )}
              </div>
              
              <h3 className="backstory-title">
                {CHARACTER_BACKSTORIES[selectedCharacter].title}
              </h3>
              
              <div className="backstory-story">
                {CHARACTER_BACKSTORIES[selectedCharacter].story.map((paragraph, idx) => (
                  <p key={idx} className="story-paragraph" style={{ '--delay': `${idx * 0.2}s` }}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BackstoryViewer;

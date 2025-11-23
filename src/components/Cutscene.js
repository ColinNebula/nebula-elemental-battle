import React, { useState, useEffect } from 'react';
import './Cutscene.css';

function Cutscene({ cutsceneData, onComplete, canSkip = true }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [fadeIn, setFadeIn] = useState(true);

  const currentScene = cutsceneData?.scenes?.[currentSceneIndex];

  useEffect(() => {
    if (!currentScene) return;

    setFadeIn(true);
    
    const timer = setTimeout(() => {
      // Fade out
      setFadeIn(false);
      
      // Move to next scene or complete
      setTimeout(() => {
        if (currentSceneIndex < cutsceneData.scenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
        } else {
          setIsVisible(false);
          setTimeout(() => {
            onComplete?.();
          }, 500);
        }
      }, 500);
    }, currentScene.duration || 3000);

    return () => clearTimeout(timer);
  }, [currentSceneIndex, currentScene, cutsceneData, onComplete]);

  const handleSkip = () => {
    if (canSkip) {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 300);
    }
  };

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      if (currentSceneIndex < cutsceneData.scenes.length - 1) {
        setCurrentSceneIndex(prev => prev + 1);
      } else {
        handleSkip();
      }
    }, 300);
  };

  if (!isVisible || !cutsceneData) return null;

  return (
    <div className={`cutscene-overlay ${isVisible ? 'visible' : ''}`}>
      <div className={`cutscene-content ${fadeIn ? 'fade-in' : 'fade-out'}`}>
        {/* Background */}
        <div className="cutscene-background">
          <div className="background-icon">{currentScene?.background}</div>
        </div>

        {/* Title (only on first scene) */}
        {currentSceneIndex === 0 && (
          <div className="cutscene-title">
            <h1>{cutsceneData.title}</h1>
          </div>
        )}

        {/* Character */}
        {currentScene?.character && (
          <div className="cutscene-character">
            <div className="character-avatar">{currentScene.character}</div>
            {currentScene.speaker && (
              <div className="character-name">{currentScene.speaker}</div>
            )}
          </div>
        )}

        {/* Dialogue Box */}
        <div className="cutscene-dialogue">
          <p className="dialogue-text">{currentScene?.text}</p>
          
          {/* Progress indicator */}
          <div className="scene-progress">
            {cutsceneData.scenes.map((_, idx) => (
              <div 
                key={idx} 
                className={`progress-dot ${idx === currentSceneIndex ? 'active' : ''} ${idx < currentSceneIndex ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="cutscene-controls">
          <button className="cutscene-btn next-btn" onClick={handleNext}>
            {currentSceneIndex < cutsceneData.scenes.length - 1 ? 'Next ▶' : 'Continue ▶'}
          </button>
          {canSkip && (
            <button className="cutscene-btn skip-btn" onClick={handleSkip}>
              Skip ⏭
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cutscene;

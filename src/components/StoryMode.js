import React, { useState, useEffect } from 'react';
import './StoryMode.css';
import { STORY_MODE_CAMPAIGN, AI_PERSONALITIES } from '../utils/aiPersonalities';

function StoryMode({ onStartBattle, onBack, completedStages = [] }) {
  const [selectedStage, setSelectedStage] = useState(null);
  const [showStageDetails, setShowStageDetails] = useState(false);

  const currentStage = completedStages.length;

  const handleStageClick = (stage) => {
    // Only allow playing current stage or replaying completed stages
    if (stage.stage <= currentStage + 1) {
      setSelectedStage(stage);
      setShowStageDetails(true);
    }
  };

  const handleStartBattle = () => {
    if (selectedStage) {
      onStartBattle(selectedStage.opponent, selectedStage.stage);
    }
  };

  const getStageStatus = (stage) => {
    if (completedStages.includes(stage.stage)) return 'completed';
    if (stage.stage === currentStage + 1) return 'available';
    return 'locked';
  };

  return (
    <div className="story-mode">
      <div className="story-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="story-title">⚔️ Story Mode Campaign ⚔️</h1>
        <div className="progress-info">
          Stage {currentStage}/{STORY_MODE_CAMPAIGN.length}
        </div>
      </div>

      <div className="campaign-map">
        {STORY_MODE_CAMPAIGN.map((stage, index) => {
          const status = getStageStatus(stage);
          const opponent = AI_PERSONALITIES[stage.opponent];
          const isLocked = status === 'locked';

          return (
            <div
              key={stage.stage}
              className={`stage-node ${status} ${stage.isBoss ? 'boss' : ''}`}
              onClick={() => !isLocked && handleStageClick(stage)}
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <div className="stage-number">{stage.stage}</div>
              <div className="stage-avatar">{opponent?.avatar || '❓'}</div>
              <div className="stage-name">{stage.name}</div>
              {status === 'completed' && <div className="stage-check">✓</div>}
              {isLocked && <div className="stage-lock">🔒</div>}
              {stage.isBoss && <div className="boss-indicator">BOSS</div>}
            </div>
          );
        })}
      </div>

      {showStageDetails && selectedStage && (
        <div className="stage-details-overlay" onClick={() => setShowStageDetails(false)}>
          <div className="stage-details" onClick={(e) => e.stopPropagation()}>
            <div className="details-header">
              <h2>{selectedStage.name}</h2>
              <button className="close-btn" onClick={() => setShowStageDetails(false)}>×</button>
            </div>
            
            <div className="opponent-info">
              <div className="opponent-avatar-large">
                {AI_PERSONALITIES[selectedStage.opponent]?.avatar}
              </div>
              <div className="opponent-details">
                <h3>{AI_PERSONALITIES[selectedStage.opponent]?.name}</h3>
                <div className="opponent-element">
                  Element: {AI_PERSONALITIES[selectedStage.opponent]?.element}
                </div>
                <div className="opponent-difficulty">
                  Difficulty: <span className={`difficulty ${AI_PERSONALITIES[selectedStage.opponent]?.difficulty.toLowerCase()}`}>
                    {AI_PERSONALITIES[selectedStage.opponent]?.difficulty}
                  </span>
                </div>
                <p className="opponent-description">
                  {AI_PERSONALITIES[selectedStage.opponent]?.description}
                </p>
              </div>
            </div>

            <div className="stage-description">
              <p>{selectedStage.description}</p>
            </div>

            <div className="stage-reward">
              <strong>🏆 Reward:</strong> {selectedStage.reward}
            </div>

            <div className="stage-quote">
              <em>"{AI_PERSONALITIES[selectedStage.opponent]?.quotes.start}"</em>
            </div>

            <button className="start-battle-btn" onClick={handleStartBattle}>
              {getStageStatus(selectedStage) === 'completed' ? 'Replay Battle' : 'Start Battle'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryMode;

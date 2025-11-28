import React, { useState, useEffect, useRef } from 'react';
import './StoryMode.css';
import { STORY_MODE_CAMPAIGN, AI_PERSONALITIES } from '../utils/aiPersonalities';
import Cutscene from './Cutscene';
import StoryChoice from './StoryChoice';
import BackstoryViewer from './BackstoryViewer';
import storySystem from '../utils/storySystem';

function StoryMode({ onStartBattle, onBack, storyProgress }) {
  const [selectedStage, setSelectedStage] = useState(null);
  const [showStageDetails, setShowStageDetails] = useState(false);
  const [currentCutscene, setCurrentCutscene] = useState(null);
  const [currentChoice, setCurrentChoice] = useState(null);
  const [showBackstories, setShowBackstories] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(storyProgress?.difficulty || 'warrior');
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showSecretBosses, setShowSecretBosses] = useState(false);
  const storyMusicRef = useRef(null);

  const currentStage = storyProgress?.currentStage || 0;
  const completedStages = storyProgress?.completedStages || [];
  const unlockedChapters = storyProgress?.unlockedChapters || [1];
  const choices = storyProgress?.choices || {};
  const unlockedBackstories = storyProgress?.unlockedBackstories || ['DONOVAN_RAGE'];
  const unlockedSecretBosses = storyProgress?.unlockedSecretBosses || [];

  useEffect(() => {
    // Play Under Cover of the Myst music when story mode opens
    storyMusicRef.current = new Audio(`${process.env.PUBLIC_URL}/Under_Cover_of_the_Myst.mp3`);
    storyMusicRef.current.volume = 0.3;
    storyMusicRef.current.loop = true;
    storyMusicRef.current.setAttribute('playsinline', 'true');
    storyMusicRef.current.setAttribute('webkit-playsinline', 'true');
    storyMusicRef.current.preload = 'auto';
    storyMusicRef.current.play().catch(err => console.log('Story music autoplay prevented:', err));

    return () => {
      // Stop music when leaving story mode
      if (storyMusicRef.current) {
        storyMusicRef.current.pause();
        storyMusicRef.current = null;
      }
    };
  }, []);

  const handleStageClick = (stage) => {
    // Only allow playing current stage or replaying completed stages
    if (stage.stage <= currentStage + 1) {
      setSelectedStage(stage);
      setShowStageDetails(true);
    }
  };

  const handleStartBattle = () => {
    if (selectedStage) {
      // Show cutscene if it's a boss stage
      if (selectedStage.isBoss && selectedStage.stage === 5) {
        setCurrentCutscene(storySystem.STORY_CUTSCENES.CHAPTER1_INTRO);
        return;
      }
      
      // Check for story choice before certain stages
      if (selectedStage.stage === 6 && !choices.chapter1_path) {
        setCurrentChoice(storySystem.STORY_CHOICES.CHAPTER1_PATH);
        return;
      }
      
      if (selectedStage.stage === 11 && !choices.chapter2_alliance) {
        setCurrentChoice(storySystem.STORY_CHOICES.CHAPTER2_ALLIANCE);
        return;
      }
      
      if (selectedStage.stage === 15 && !choices.chapter3_artifact) {
        setCurrentChoice(storySystem.STORY_CHOICES.CHAPTER3_ARTIFACT);
        return;
      }
      
      if (selectedStage.stage === 20 && !choices.final_choice) {
        setCurrentChoice(storySystem.STORY_CHOICES.FINAL_CHOICE);
        return;
      }
      
      onStartBattle(selectedStage.opponent, selectedStage.stage, selectedDifficulty);
    }
  };
  
  const handleCutsceneComplete = () => {
    setCurrentCutscene(null);
    if (selectedStage) {
      onStartBattle(selectedStage.opponent, selectedStage.stage, selectedDifficulty);
    }
  };
  
  const handleChoiceMade = (choiceId) => {
    // Save choice to storyProgress (would need to pass this up to App.js)
    console.log('Choice made:', choiceId);
    setCurrentChoice(null);
    
    // Continue to battle
    if (selectedStage) {
      onStartBattle(selectedStage.opponent, selectedStage.stage, selectedDifficulty);
    }
  };

  const getStageStatus = (stage) => {
    if (completedStages.includes(stage.stage)) return 'completed';
    if (stage.stage === currentStage + 1) return 'available';
    return 'locked';
  };

  return (
    <div className="story-mode">
      {/* Cutscene Overlay */}
      {currentCutscene && (
        <Cutscene
          cutsceneData={currentCutscene}
          onComplete={handleCutsceneComplete}
          canSkip={true}
        />
      )}
      
      {/* Story Choice Overlay */}
      {currentChoice && (
        <StoryChoice
          choiceData={currentChoice}
          onChoice={handleChoiceMade}
        />
      )}
      
      {/* Backstory Viewer */}
      {showBackstories && (
        <BackstoryViewer
          unlockedBackstories={unlockedBackstories}
          onClose={() => setShowBackstories(false)}
        />
      )}
      
      <div className="story-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1 className="story-title">⚔️ Story Mode Campaign ⚔️</h1>
        <div className="story-controls">
          <button className="story-control-btn" onClick={() => setShowBackstories(true)} title="Character Backstories">
            📖
          </button>
          <button className="story-control-btn" onClick={() => setShowDifficultySelect(!showDifficultySelect)} title="Difficulty">
            {storySystem.DIFFICULTY_LEVELS[selectedDifficulty.toUpperCase()]?.icon}
          </button>
          <button className="story-control-btn" onClick={() => setShowSecretBosses(!showSecretBosses)} title="Secret Bosses">
            👁️
          </button>
        </div>
        <div className="progress-info">
          Stage {currentStage}/{STORY_MODE_CAMPAIGN.length}
        </div>
      </div>
      
      {/* Difficulty Selector */}
      {showDifficultySelect && (
        <div className="difficulty-selector">
          <h3>Select Difficulty</h3>
          <div className="difficulty-options">
            {Object.values(storySystem.DIFFICULTY_LEVELS).map(diff => (
              <button
                key={diff.id}
                className={`difficulty-btn ${selectedDifficulty === diff.id ? 'selected' : ''} ${!diff.unlocked ? 'locked' : ''}`}
                onClick={() => diff.unlocked && setSelectedDifficulty(diff.id)}
                disabled={!diff.unlocked}
              >
                <div className="diff-icon">{diff.icon}</div>
                <div className="diff-name">{diff.name}</div>
                <div className="diff-desc">{diff.description}</div>
                {!diff.unlocked && <div className="diff-lock">🔒 {diff.requirement}</div>}
                <div className="diff-reward">Rewards: {diff.rewards}x</div>
              </button>
            ))}
          </div>
        </div>
      )}

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
              style={{ 
                '--delay': `${index * 0.1}s`,
                backgroundImage: stage.levelImage ? `url(${process.env.PUBLIC_URL}/${stage.levelImage})` : 'none'
              }}
            >
              <div className="stage-number">{stage.stage}</div>
              <div className="stage-avatar">
                {opponent?.avatarImage ? (
                  <img src={`${process.env.PUBLIC_URL}/${opponent.avatarImage}`} alt={opponent.name} />
                ) : (
                  opponent?.avatar || '❓'
                )}
              </div>
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
                {AI_PERSONALITIES[selectedStage.opponent]?.avatarImage ? (
                  <img src={`${process.env.PUBLIC_URL}/${AI_PERSONALITIES[selectedStage.opponent].avatarImage}`} alt={AI_PERSONALITIES[selectedStage.opponent]?.name} />
                ) : (
                  AI_PERSONALITIES[selectedStage.opponent]?.avatar
                )}
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
      
      {/* Secret Bosses Section */}
      {showSecretBosses && (
        <div className="secret-bosses-panel">
          <h3>👁️ Secret Bosses</h3>
          <div className="secret-bosses-grid">
            {Object.values(storySystem.SECRET_BOSSES).map(boss => {
              const isUnlocked = storySystem.checkSecretBossUnlock(storyProgress || {}, boss.id);
              
              return (
                <div
                  key={boss.id}
                  className={`secret-boss-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => {
                    if (isUnlocked) {
                      setSelectedStage({
                        ...boss,
                        opponent: boss.id
                      });
                      setShowStageDetails(true);
                    }
                  }}
                >
                  <div className="secret-boss-avatar">
                    {isUnlocked ? boss.avatar : '❓'}
                  </div>
                  <div className="secret-boss-name">
                    {isUnlocked ? boss.name : '???'}
                  </div>
                  {isUnlocked ? (
                    <>
                      <div className="secret-boss-element">{boss.element}</div>
                      <div className="secret-boss-desc">{boss.description}</div>
                    </>
                  ) : (
                    <div className="secret-boss-unlock">{boss.unlockCondition}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default StoryMode;

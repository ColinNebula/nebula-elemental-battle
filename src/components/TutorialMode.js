import React, { useState, useEffect, useRef } from 'react';
import './TutorialMode.css';
import CharacterSelection from './CharacterSelection';
import CardSelection from './CardSelection';
import GameBoard from './GameBoard';
import GameClient from '../services/GameClient';

const TutorialMode = ({ onComplete, onExit, playerProfile }) => {
  const [tutorialStep, setTutorialStep] = useState('welcome');
  const [gameClient] = useState(() => new GameClient());
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [playerId] = useState(() => 'tutorial_player_' + Math.random().toString(36).substr(2, 9));
  const [gameState, setGameState] = useState(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [cardsPlayed, setCardsPlayed] = useState(0);
  const [autoPlayAI, setAutoPlayAI] = useState(false);
  const [characterSelectionStarted, setCharacterSelectionStarted] = useState(false);
  const [cardSelectionCompleted, setCardSelectionCompleted] = useState(false);
  const pollIntervalRef = useRef(null);
  const progressionHandledRef = useRef(new Set()); // Track which progressions have been handled

  // Tutorial steps configuration
  const tutorialSteps = {
    welcome: {
      title: "🎓 Welcome to Tutorial Mode!",
      message: "I'll guide you through your first battle step-by-step. Let's start by choosing your character!",
      actions: ['character-selection']
    },
    characterSelected: {
      title: "✅ Great Choice!",
      message: "Now let's select your battle deck. You'll receive 10 cards and need to choose your best 5 for battle.",
      actions: ['card-selection']
    },
    cardSelectionIntro: {
      title: "📋 Card Selection Phase",
      message: "These are your 10 cards. Look at their elements and strength values. Select 5 cards you want to use in battle. The other 5 will go to your reserve deck.\n\n💡 Tips:\n• Choose cards with higher strength values (10-15 are strong!)\n• Try to pick cards of the same element for combo bonuses\n• Balance is key - don't pick all weak or all strong cards",
      actions: ['continue']
    },
    firstCardPlay: {
      title: "⚔️ Your First Turn!",
      message: "It's your turn! Click on any card in your hand to play it. The card with higher strength wins the round!\n\n💡 Strategic Tips:\n• Look at your hand - which card has the highest strength?\n• Consider saving your strongest card for later\n• Starting with a medium-strength card (8-12) is usually safe\n• Remember the element - you'll want to match it next turn for DOUBLE strength!",
      actions: ['continue']
    },
    cardStrength: {
      title: "💪 Understanding Strength",
      message: `Good! You played a card with strength ${gameState?.humanPlayer?.lastPlayedCard?.strength || '?'}. The player with the higher strength card wins the round and gets points equal to the difference.`,
      actions: ['continue']
    },
    elementMatching: {
      title: "🎯 Element Matching Bonus",
      message: "If you play 2 cards of the same element in a row, you get DOUBLE STRENGTH! Try to match elements when possible.\n\n💡 Pro Strategy:\n• Check if you have another card matching your last element\n• A weak card (5-7) becomes strong (10-14) when doubled!\n• Plan your combo: save matching cards to chain together\n• Breaking a combo to play a very strong card can also be smart",
      actions: ['continue']
    },
    specialAbilities: {
      title: "✨ Special Abilities",
      message: "Some elements have special powers:\n🌍 Earth: Draw from reserve (get more options!)\n⭐ Power: Auto-plays another Power card (free play!)\n🔥 Fire: Burns opponent's card (damage them!)\n\n💡 When to Use:\n• Earth cards when you need more choices\n• Power cards to trigger chain reactions\n• Fire cards to weaken strong opponents\n• Combine abilities with element matching for maximum effect!",
      actions: ['continue']
    },
    manaSystem: {
      title: "💠 Mana System",
      message: "You have mana that regenerates each turn. Cards cost mana to play. Manage your mana wisely!\n\n💡 Mana Tips:\n• Check the mana cost before playing (shown on cards)\n• Higher strength cards usually cost more mana\n• Mana regenerates each turn, so don't hoard it all\n• Save some mana for power-ups and special abilities\n• Running out of mana = limited options next turn!",
      actions: ['continue']
    },
    powerUps: {
      title: "⚡ Power-Ups",
      message: "You have access to Boosters (💪), Ultimate Abilities (⚡), and Equipment (⚔️) in the right sidebar. These give you special advantages!",
      actions: ['continue']
    },
    advancedMechanics: {
      title: "🎲 Advanced Features",
      message: "Notice the Fusion and Trap buttons? These allow you to combine cards or set traps for your opponent. Try them when you're ready!",
      actions: ['continue']
    },
    finalRounds: {
      title: "🏁 Finish the Battle!",
      message: "Now complete the rest of the battle on your own. Use what you've learned to defeat your opponent!",
      actions: ['finish-battle']
    },
    victory: {
      title: "🏆 Congratulations!",
      message: "You've completed the tutorial and won your first battle! You're now ready to play on your own. Good luck, warrior!",
      actions: ['complete']
    },
    defeat: {
      title: "💪 Keep Learning!",
      message: "Don't worry! Every battle teaches you something. You now understand the basics. Ready to try again in a real match?",
      actions: ['complete']
    }
  };

  useEffect(() => {
    // Listen for game state updates
    const handleGameState = (state) => {
      setGameState(state);
      
      // Track cards played for tutorial progression
      if (state?.humanPlayer?.graveyard?.length > cardsPlayed) {
        setCardsPlayed(state.humanPlayer.graveyard.length);
      }
    };
    
    gameClient.on('gameState', handleGameState);

    return () => {
      gameClient.off('gameState', handleGameState);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      gameClient.disconnect();
    };
  }, [gameClient, cardsPlayed]);

  // Tutorial step progression logic
  useEffect(() => {
    if (!gameState) return;

    const { humanPlayer, aiPlayer, gameStarted, gameOver, currentPlayer, cardSelectionPhase } = gameState;

    // Show card selection intro when card selection phase starts (only once)
    if (tutorialStep === 'characterSelected' && cardSelectionPhase && !progressionHandledRef.current.has('cardSelectionIntro')) {
      progressionHandledRef.current.add('cardSelectionIntro');
      setTimeout(() => {
        setTutorialStep('cardSelectionIntro');
        setShowOverlay(true);
      }, 500);
      return;
    }

    // Progress tutorial based on game events (prevent duplicate triggers)
    if (tutorialStep === 'firstCardPlay' && cardsPlayed >= 1 && !progressionHandledRef.current.has('cardStrength')) {
      progressionHandledRef.current.add('cardStrength');
      setTimeout(() => {
        setTutorialStep('cardStrength');
        setShowOverlay(true);
      }, 2000);
      return;
    }
    
    if (tutorialStep === 'cardStrength' && cardsPlayed >= 1 && !progressionHandledRef.current.has('elementMatching')) {
      progressionHandledRef.current.add('elementMatching');
      setTimeout(() => {
        setTutorialStep('elementMatching');
        setShowOverlay(true);
      }, 1000);
      return;
    }
    
    if (tutorialStep === 'elementMatching' && cardsPlayed === 2 && !progressionHandledRef.current.has('specialAbilities')) {
      progressionHandledRef.current.add('specialAbilities');
      setTimeout(() => {
        setTutorialStep('specialAbilities');
        setShowOverlay(true);
      }, 2000);
      return;
    }
    
    if (tutorialStep === 'manaSystem' && cardsPlayed === 3 && !progressionHandledRef.current.has('powerUps')) {
      progressionHandledRef.current.add('powerUps');
      setTimeout(() => {
        setTutorialStep('powerUps');
        setShowOverlay(true);
      }, 2000);
      return;
    }

    // Check for game over (only once)
    if (gameOver && !progressionHandledRef.current.has('gameOver')) {
      progressionHandledRef.current.add('gameOver');
      const humanWon = humanPlayer?.score > aiPlayer?.score;
      setTutorialStep(humanWon ? 'victory' : 'defeat');
      setShowOverlay(true);
    }
  }, [gameState, tutorialStep, cardsPlayed]);

  // Poll game state
  const pollGameState = (roomId) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    pollIntervalRef.current = setInterval(async () => {
      try {
        const state = await gameClient.getGameState(roomId);
        if (state) {
          setGameState(state);
        }
      } catch (error) {
        console.error('Error polling game state:', error);
      }
    }, 500);
  };

  const handleCharacterSelect = async (character) => {
    // Update all states together to prevent double render
    setSelectedCharacter(character);
    setTutorialStep('characterSelected');
    setShowOverlay(true); // Show "Great Choice!" overlay
    setCharacterSelectionStarted(false); // Prevent re-render of character selection
    
    // Create tutorial room with easy AI
    try {
      const result = await gameClient.createRoom('EMBER', true); // Use EMBER (Easy difficulty) for tutorial, with fast AI timing
      if (result && result.roomId) {
        setRoomId(result.roomId);
        await gameClient.joinRoom(result.roomId, playerId, playerProfile?.name || 'Tutorial Player');
        
        // Start the game (this triggers card selection phase)
        await gameClient.startGame(result.roomId);
        
        // Start polling to get card selection phase
        pollGameState(result.roomId);
        
        setTimeout(() => {
          setShowOverlay(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating tutorial room:', error);
    }
  };

  const handleCardSelectionComplete = async (selectedIndices) => {
    console.log('Tutorial: Cards selected', selectedIndices);
    setCardSelectionCompleted(true); // Mark as completed to prevent re-render
    
    // Send card selection to server
    try {
      await gameClient.selectCards(roomId, playerId, selectedIndices);
      
      // Tutorial auto-completes coin toss (player goes first)
      await gameClient.completeCoinToss(roomId, playerId);
      
      // Wait a moment for game state to update, then show first card play instruction
      setTimeout(() => {
        setTutorialStep('firstCardPlay');
        setShowOverlay(true);
      }, 1000);
    } catch (error) {
      console.error('Error completing card selection:', error);
    }
  };

  const handleOverlayContinue = () => {
    if (tutorialStep === 'victory' || tutorialStep === 'defeat') {
      // Mark tutorial as completed
      localStorage.setItem('tutorialCompleted', 'true');
      // Clear progression tracking
      progressionHandledRef.current.clear();
      onComplete();
      return;
    }
    
    // Handle manual progression for certain steps
    if (tutorialStep === 'specialAbilities') {
      if (!progressionHandledRef.current.has('specialAbilities-continue')) {
        progressionHandledRef.current.add('specialAbilities-continue');
        setTutorialStep('manaSystem');
        setShowOverlay(true);
      }
      return;
    }
    
    if (tutorialStep === 'powerUps') {
      if (!progressionHandledRef.current.has('powerUps-continue')) {
        progressionHandledRef.current.add('powerUps-continue');
        setTutorialStep('advancedMechanics');
        setShowOverlay(true);
      }
      return;
    }
    
    if (tutorialStep === 'advancedMechanics') {
      if (!progressionHandledRef.current.has('advancedMechanics-continue')) {
        progressionHandledRef.current.add('advancedMechanics-continue');
        setTutorialStep('finalRounds');
        setShowOverlay(true);
        setAutoPlayAI(true); // Let AI play automatically from now on
      }
      return;
    }
    
    // For all other steps, just hide the overlay
    setShowOverlay(false);
  };

  const handleExit = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    // Clear progression tracking
    progressionHandledRef.current.clear();
    onExit();
  };

  const renderTutorialOverlay = () => {
    if (!showOverlay || !tutorialSteps[tutorialStep]) return null;

    const step = tutorialSteps[tutorialStep];

    return (
      <div className="tutorial-overlay">
        <div className="tutorial-modal">
          <div className="tutorial-header">
            <h2>{step.title}</h2>
            {tutorialStep !== 'welcome' && (
              <button className="tutorial-skip" onClick={handleExit}>
                Skip Tutorial ✕
              </button>
            )}
          </div>
          
          <div className="tutorial-content">
            <p>{step.message}</p>
            
            {tutorialStep === 'welcome' && (
              <div className="tutorial-preview">
                <div className="preview-icons">
                  <span className="preview-icon">🔥</span>
                  <span className="preview-icon">❄️</span>
                  <span className="preview-icon">⚡</span>
                  <span className="preview-icon">💧</span>
                  <span className="preview-icon">🌍</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="tutorial-actions">
            {step.actions.includes('continue') && (
              <button className="tutorial-btn primary" onClick={handleOverlayContinue}>
                Continue →
              </button>
            )}
            {step.actions.includes('complete') && (
              <button className="tutorial-btn complete" onClick={handleOverlayContinue}>
                Finish Tutorial 🎉
              </button>
            )}
            {tutorialStep === 'welcome' && (
              <button 
                className="tutorial-btn primary" 
                onClick={() => {
                  setCharacterSelectionStarted(true);
                  setShowOverlay(false);
                }}
              >
                Let's Begin! →
              </button>
            )}
          </div>
          
          <div className="tutorial-progress">
            <div className="progress-dots">
              {Object.keys(tutorialSteps).map((key, index) => (
                <div 
                  key={key} 
                  className={`progress-dot ${key === tutorialStep ? 'active' : ''} ${Object.keys(tutorialSteps).indexOf(key) < Object.keys(tutorialSteps).indexOf(tutorialStep) ? 'completed' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render different phases of tutorial
  if (tutorialStep === 'welcome') {
    return (
      <div className="tutorial-mode">
        {renderTutorialOverlay()}
        {characterSelectionStarted && !selectedCharacter && !showOverlay && (
          <CharacterSelection 
            onSelectCharacter={handleCharacterSelect}
            onCancel={handleExit}
          />
        )}
      </div>
    );
  }

  if (tutorialStep === 'characterSelected' && !gameState?.cardSelectionPhase) {
    return (
      <div className="tutorial-mode">
        {renderTutorialOverlay()}
        {!showOverlay && (
          <div className="tutorial-loading">
            <div className="loading-spinner"></div>
            <p>Preparing your deck...</p>
          </div>
        )}
      </div>
    );
  }

  if (tutorialStep === 'cardSelectionIntro' && !gameState?.gameStarted) {
    const playerHand = gameState?.players?.find(p => p.id === playerId)?.hand || [];
    
    return (
      <div className="tutorial-mode">
        {renderTutorialOverlay()}
        {!showOverlay && playerHand.length > 0 && !cardSelectionCompleted ? (
          <CardSelection
            hand={playerHand}
            onConfirmSelection={handleCardSelectionComplete}
            onBack={handleExit}
            isTutorial={true}
          />
        ) : !showOverlay ? (
          <div className="tutorial-loading">
            <div className="loading-spinner"></div>
            <p>Loading your cards...</p>
          </div>
        ) : null}
      </div>
    );
  }

  // Game handlers
  const handlePlayCard = async (cardIndex) => {
    try {
      await gameClient.playCard(roomId, playerId, cardIndex);
    } catch (error) {
      console.error('Error playing card:', error);
    }
  };

  const handleDrawFromReserve = async () => {
    try {
      await gameClient.drawFromReserve(roomId, playerId);
    } catch (error) {
      console.error('Error drawing from reserve:', error);
    }
  };

  const handleSkipAbility = async () => {
    try {
      await gameClient.skipAbility(roomId, playerId);
    } catch (error) {
      console.error('Error skipping ability:', error);
    }
  };

  const handleForfeit = async () => {
    try {
      await gameClient.forfeitTurn(roomId, playerId);
    } catch (error) {
      console.error('Error forfeiting turn:', error);
    }
  };

  const handleFuseCards = async (cardIndices) => {
    try {
      await gameClient.fuseCards(roomId, playerId, cardIndices);
    } catch (error) {
      console.error('Error fusing cards:', error);
    }
  };

  if (gameState?.gameStarted) {
    return (
      <div className="tutorial-mode">
        {renderTutorialOverlay()}
        <div className={`tutorial-game-wrapper ${showOverlay ? 'dimmed' : ''}`}>
          <GameBoard
            gameState={gameState}
            currentPlayerId={playerId}
            onPlayCard={handlePlayCard}
            onDrawFromReserve={handleDrawFromReserve}
            onSkipAbility={handleSkipAbility}
            onForfeit={handleForfeit}
            onQuit={handleExit}
            onFuseCards={handleFuseCards}
            settings={{ volume: 0.5, musicEnabled: true, soundEnabled: true }}
            isTutorial={true}
            tutorialStep={tutorialStep}
            selectedCharacter={selectedCharacter}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="tutorial-mode">
      {renderTutorialOverlay()}
      <div className="tutorial-loading">
        <div className="loading-spinner"></div>
        <p>Preparing tutorial...</p>
      </div>
    </div>
  );
};

export default TutorialMode;

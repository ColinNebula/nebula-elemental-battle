import React from 'react';
import { useState, useEffect, useRef } from 'react';
import Card from './Card';
import PauseMenu from './PauseMenu';
import RoundAnnouncement from './RoundAnnouncement';
import { createParticles, createDamageNumber, triggerScreenShake, createVictoryCelebration } from '../utils/animations';
import soundManager from '../utils/sounds';
import './GameBoard.css';

const GameBoard = ({ 
  gameState, 
  currentPlayerId, 
  onPlayCard,
  onStartGame,
  onPlayAgain,
  onDrawFromReserve,
  onSkipAbility,
  onForfeit,
  onQuit,
  settings,
  isStoryMode
}) => {
  const currentPlayer = gameState?.players?.find(p => p.id === currentPlayerId);
  const humanPlayer = gameState?.players?.find(p => !p.isAI);
  const aiPlayer = gameState?.players?.find(p => p.isAI);
  const isMyTurn = currentPlayer?.active;
  const [showTurnAnnouncement, setShowTurnAnnouncement] = useState(true);
  const [showMatchBonus, setShowMatchBonus] = useState(false);
  const [cardPreview, setCardPreview] = useState(null);
  const [lastTurnInfo, setLastTurnInfo] = useState({ playerId: null, round: -1 });
  const [turnTimer, setTurnTimer] = useState(30);
  const gameBoardRef = useRef(null);
  const [lastPlayedCards, setLastPlayedCards] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showForfeitAnnouncement, setShowForfeitAnnouncement] = useState(false);
  const [defeatCountdown, setDefeatCountdown] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [showRoundAnnouncement, setShowRoundAnnouncement] = useState(false);
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const lastAnnouncedRoundRef = useRef(0);

  // Calculate total strength from played cards
  const calculateTotalStrength = (player) => {
    if (!player?.playedCards || player.playedCards.length === 0) return 0;
    return player.playedCards.reduce((total, card) => {
      return total + (card.modifiedStrength || card.strength || 0);
    }, 0);
  };

  const humanTotalStrength = calculateTotalStrength(humanPlayer);
  const aiTotalStrength = calculateTotalStrength(aiPlayer);

  // ESC key to toggle pause menu
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && gameState?.gameStarted && !gameState?.gameOver) {
        setIsPaused(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [gameState?.gameStarted, gameState?.gameOver]);

  // Trigger effects when cards are played
  useEffect(() => {
    if (!gameState?.playedCards || !gameBoardRef.current) return;
    
    const currentPlayedCount = gameState.playedCards.length;
    const prevPlayedCount = lastPlayedCards.length;
    
    if (currentPlayedCount > prevPlayedCount) {
      // New cards were played
      const newCards = gameState.playedCards.slice(prevPlayedCount);
      
      newCards.forEach((cardPlay, idx) => {
        setTimeout(() => {
          if (!gameBoardRef.current) return;
          
          const rect = gameBoardRef.current.getBoundingClientRect();
          const x = rect.width / 2 + (Math.random() - 0.5) * 100;
          const y = rect.height / 2 + (Math.random() - 0.5) * 100;
          
          // Sound effects
          soundManager.playElementSound(cardPlay.card.element);
          soundManager.playSound('cardFlip');
          
          // Particle effects
          createParticles(cardPlay.card.element, x, y, gameBoardRef.current);
          
          // Damage numbers and power play sound
          if ((cardPlay.card.modifiedStrength || cardPlay.card.strength) >= 10) {
            soundManager.playSound('powerPlay');
            createDamageNumber(
              cardPlay.card.modifiedStrength || cardPlay.card.strength, 
              x, 
              y - 50, 
              gameBoardRef.current,
              false,
              false
            );
            
            // Screen shake for powerful plays
            triggerScreenShake(gameBoardRef.current);
          }
        }, idx * 200);
      });
      
      setLastPlayedCards(gameState.playedCards);
    }
  }, [gameState?.playedCards?.length, gameBoardRef]);

  // Story mode defeat countdown
  useEffect(() => {
    if (gameState?.gameOver && isStoryMode && gameState.winner !== humanPlayer?.name && gameState.winner !== 'Tie') {
      // Player lost in story mode
      setDefeatCountdown(10);
    }
  }, [gameState?.gameOver, gameState?.winner, humanPlayer?.name, isStoryMode]);

  // Countdown timer for defeat modal
  useEffect(() => {
    if (defeatCountdown === null) return;

    if (defeatCountdown <= 0) {
      // Fade out and return to main menu
      setFadeOut(true);
      setTimeout(() => {
        onQuit();
      }, 1000);
      return;
    }

    const timer = setTimeout(() => {
      setDefeatCountdown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [defeatCountdown, onQuit]);

  const handleContinueAfterDefeat = () => {
    setDefeatCountdown(null);
    setFadeOut(false);
    onPlayAgain();
  };

  // Victory celebration
  useEffect(() => {
    if (gameState?.gameOver && gameBoardRef.current) {
      setTimeout(() => {
        const winner = gameState.winner === 'Tie' ? 'tie' : gameState.winner;
        
        // Play victory or defeat sound
        if (winner === 'tie') {
          soundManager.playSound('victory');
        } else if (winner === humanPlayer?.name) {
          soundManager.playSound('victory');
        } else {
          soundManager.playSound('defeat');
        }
        
        // Stop background music
        soundManager.stopMusic();
        
        createVictoryCelebration(winner, gameBoardRef.current);
      }, 500);
    }
  }, [gameState?.gameOver, gameState?.winner, humanPlayer?.name]);

  // Show turn announcement AFTER round announcement completes
  useEffect(() => {
    const activePlayerId = gameState?.players?.find(p => p.active)?.id;
    const currentRound = gameState?.currentRound || 0;
    
    // Only show announcement if player changed OR it's a new round
    if (gameState?.gameStarted && !gameState?.gameOver && activePlayerId) {
      const playerChanged = activePlayerId !== lastTurnInfo.playerId;
      const roundChanged = currentRound !== lastTurnInfo.round;
      
      console.log('🔔 Turn announcement check:', {
        activePlayerId,
        lastPlayerId: lastTurnInfo.playerId,
        playerChanged,
        roundChanged,
        showRoundAnnouncement
      });
      
      // Show announcement when player changes, but limit to once per turn change
      // Reset timer on every turn change (both player and AI)
      if (playerChanged || roundChanged) {
        setLastTurnInfo({ playerId: activePlayerId, round: currentRound });
        setTurnTimer(30); // Always reset timer on turn change
        
        // Don't show turn announcement if round announcement is showing
        // The round announcement completion handler will trigger turn announcement
        if (showRoundAnnouncement) {
          console.log('⏸️ Delaying turn announcement - round announcement active');
          return;
        }
        
        // Show turn announcement immediately if no round announcement
        console.log('📢 Showing turn announcement for:', activePlayerId === currentPlayerId ? 'Player' : 'AI');
        setShowTurnAnnouncement(true);
        
        // Play turn sound
        if (activePlayerId === currentPlayerId) {
          soundManager.playSound('yourTurn');
        } else {
          soundManager.playSound('opponentTurn');
        }
        
        // Keep announcement visible - shorter for AI turn
        const announcementDuration = activePlayerId === currentPlayerId ? 1500 : 1200;
        const timer = setTimeout(() => {
          setShowTurnAnnouncement(false);
        }, announcementDuration);
        
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.players, gameState?.currentRound, gameState?.gameStarted, gameState?.gameOver, showRoundAnnouncement]);

  // Round Announcement Logic
  useEffect(() => {
    const currentRound = gameState?.currentRound || 0;
    const roundToDisplay = currentRound + 1;
    
    // Only show if: game started, not over, and this round hasn't been announced yet
    if (gameState?.gameStarted && !gameState?.gameOver) {
      if (roundToDisplay !== lastAnnouncedRoundRef.current) {
        lastAnnouncedRoundRef.current = roundToDisplay;
        setCurrentRoundNumber(roundToDisplay);
        setShowRoundAnnouncement(true);
        soundManager.playSound('yourTurn');
      }
    }
    
    // Reset when game ends
    if (gameState?.gameOver) {
      lastAnnouncedRoundRef.current = 0;
    }
  }, [gameState?.currentRound, gameState?.gameStarted, gameState?.gameOver]);

  // Background music management
  useEffect(() => {
    if (gameState?.gameStarted && !gameState?.gameOver) {
      // Determine music intensity based on game state
      const currentRound = gameState?.currentRound || 0;
      const maxRounds = gameState?.maxRounds || 5;
      
      if (currentRound >= maxRounds - 1) {
        soundManager.playMusic('intense');
      } else if (currentRound >= Math.floor(maxRounds / 2)) {
        soundManager.playMusic('battle');
      } else {
        soundManager.playMusic('calm');
      }
    }
    
    return () => {
      if (gameState?.gameOver) {
        soundManager.stopMusic();
      }
    };
  }, [gameState?.gameStarted, gameState?.gameOver, gameState?.currentRound]);

  // Handle round announcement completion
  const handleRoundAnnouncementComplete = () => {
    console.log('Round announcement complete, hiding and showing turn announcement...');
    setShowRoundAnnouncement(false);
    
    // Show turn announcement after round announcement completes
    const activePlayerId = gameState?.players?.find(p => p.active)?.id;
    if (activePlayerId) {
      setShowTurnAnnouncement(true);
      
      // Play turn sound
      if (activePlayerId === currentPlayerId) {
        soundManager.playSound('yourTurn');
      } else {
        soundManager.playSound('opponentTurn');
      }
      
      // Keep announcement visible - shorter for AI turn
      const announcementDuration = activePlayerId === currentPlayerId ? 1500 : 1200;
      setTimeout(() => {
        setShowTurnAnnouncement(false);
      }, announcementDuration);
    }
  };

  // Turn timer countdown - starts 3 seconds after turn announcement
  useEffect(() => {
    if (!settings?.timerEnabled || gameState?.gameOver || gameState?.pendingAbility || isPaused || showRoundAnnouncement || showTurnAnnouncement) {
      return;
    }

    // Only countdown during player's turn
    if (!isMyTurn) {
      return;
    }
    
    // Wait 3 seconds before starting countdown
    let timerStarted = false;
    const startDelay = setTimeout(() => {
      timerStarted = true;
    }, 3000);

    const interval = setInterval(() => {
      if (!timerStarted) return; // Don't count down until delay completes
      
      setTurnTimer((prev) => {
        if (prev <= 1) {
          // Forfeit turn when timer reaches 0
          console.log('Turn timer expired - forfeiting turn');
          
          // Show forfeit announcement
          setShowForfeitAnnouncement(true);
          setTimeout(() => {
            setShowForfeitAnnouncement(false);
          }, 2000);
          
          // Play timeout sound
          soundManager.playSound('defeat');
          
          if (onForfeit) {
            onForfeit();
          }
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMyTurn, settings?.timerEnabled, gameState?.gameOver, gameState?.pendingAbility, isPaused, showRoundAnnouncement, showTurnAnnouncement]);

  // Keyboard shortcuts for card selection
  useEffect(() => {
    if (!settings?.keyboardEnabled || !isMyTurn || gameState?.gameOver || gameState?.pendingAbility) {
      return;
    }

    const handleKeyPress = (e) => {
      const key = e.key;
      if (key >= '1' && key <= '5') {
        const cardIndex = parseInt(key) - 1;
        if (currentPlayer?.hand?.length > cardIndex) {
          handleCardClick(cardIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMyTurn, settings?.keyboardEnabled, gameState?.gameOver, gameState?.pendingAbility, currentPlayer?.hand]);

  // Show element match bonus animation
  useEffect(() => {
    if (gameState?.lastMatchBonus) {
      setShowMatchBonus(true);
      const timer = setTimeout(() => {
        setShowMatchBonus(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [gameState?.lastMatchBonus]);

  // Show AI card preview when they play
  useEffect(() => {
    if (aiPlayer?.chosenCard && !isMyTurn && gameState?.gameStarted && !gameState?.gameOver) {
      const lastPlayedCount = aiPlayer.playedCards?.length || 0;
      const prevPlayedCount = Math.max(0, lastPlayedCount - 1);
      
      // Only show preview if AI just played (new card appeared)
      if (lastPlayedCount > prevPlayedCount) {
        setCardPreview({ card: aiPlayer.chosenCard, isPlayer: false });
        setTimeout(() => {
          setCardPreview(null);
        }, 1000);
      }
    }
  }, [aiPlayer?.playedCards?.length]);

  // AI Watchdog: Check if AI is stuck and needs to play
  useEffect(() => {
    if (!gameState?.gameStarted || gameState?.gameOver || !aiPlayer) {
      return;
    }

    // If AI is active, has cards, hasn't chosen a card, and battle phase is false
    // This means AI should be playing but might be stuck
    if (aiPlayer.active && 
        aiPlayer.hand?.length > 0 && 
        !aiPlayer.chosenCard && 
        !gameState.battlePhase &&
        !showRoundAnnouncement &&
        !showTurnAnnouncement) {
      
      console.log('⚠️ AI WATCHDOG: AI should be playing but appears stuck', {
        aiActive: aiPlayer.active,
        aiHandSize: aiPlayer.hand.length,
        aiChosen: aiPlayer.chosenCard,
        battlePhase: gameState.battlePhase
      });
      
      // Wait 5 seconds for round/turn announcements, then force AI to play if still stuck
      const watchdogTimer = setTimeout(() => {
        if (aiPlayer.active && aiPlayer.hand?.length > 0 && !aiPlayer.chosenCard) {
          console.log('🚨 AI WATCHDOG: Forcing AI to play');
          const randomIndex = Math.floor(Math.random() * aiPlayer.hand.length);
          onPlayCard(randomIndex, aiPlayer.id);
        }
      }, 5000); // Increased from 3000ms to allow for round announcement
      
      return () => clearTimeout(watchdogTimer);
    }
  }, [aiPlayer?.active, aiPlayer?.hand?.length, aiPlayer?.chosenCard, gameState?.battlePhase, 
      gameState?.gameStarted, gameState?.gameOver, showRoundAnnouncement, showTurnAnnouncement, 
      onPlayCard, aiPlayer?.id]);

  // General game stuck detector - detects if game is in an invalid state
  useEffect(() => {
    if (!gameState?.gameStarted || gameState?.gameOver) {
      return;
    }

    // Detect stuck states
    const isStuck = 
      // Both players inactive
      (humanPlayer && aiPlayer && !humanPlayer.active && !aiPlayer.active && !gameState.battlePhase) ||
      // Battle phase but cards missing
      (gameState.battlePhase && (!humanPlayer?.chosenCard || !aiPlayer?.chosenCard)) ||
      // No active player and not in battle
      (!gameState.battlePhase && !humanPlayer?.active && !aiPlayer?.active);

    if (isStuck && !gameState.pendingAbility) {
      console.warn('⚠️ STUCK DETECTOR: Game appears stuck!', {
        battlePhase: gameState.battlePhase,
        playerActive: humanPlayer?.active,
        aiActive: aiPlayer?.active,
        playerChosen: !!humanPlayer?.chosenCard,
        aiChosen: !!aiPlayer?.chosenCard,
        pendingAbility: !!gameState.pendingAbility
      });

      // Wait 3 seconds before attempting recovery
      const recoveryTimer = setTimeout(() => {
        console.log('🔧 Attempting to recover stuck game...');
        // Force player to be active if both are inactive
        if (!humanPlayer?.active && !aiPlayer?.active && !gameState.battlePhase) {
          console.log('🔧 Forcing player to be active');
          // This will trigger a re-render with player active
          if (onPlayCard) {
            // Just trigger a state update by calling game state refresh
            // This is a fallback - ideally the game logic should prevent this
          }
        }
      }, 3000);

      return () => clearTimeout(recoveryTimer);
    }
  }, [gameState?.gameStarted, gameState?.gameOver, gameState?.battlePhase, gameState?.pendingAbility,
      humanPlayer?.active, aiPlayer?.active, humanPlayer?.chosenCard, aiPlayer?.chosenCard]);

  const handleCardClick = (cardIndex) => {
    if (isMyTurn && onPlayCard && !gameState?.gameOver && !isPaused && !gameState?.pendingAbility) {
      const card = currentPlayer.hand[cardIndex];
      
      // Trigger particle effects
      if (gameBoardRef.current) {
        const rect = gameBoardRef.current.getBoundingClientRect();
        const x = rect.width / 2;
        const y = rect.height / 2;
        createParticles(card.element, x, y, gameBoardRef.current);
      }
      
      // Show card preview first
      setCardPreview({ card, isPlayer: true });
      
      // After 1 second, hide preview and play card
      setTimeout(() => {
        setCardPreview(null);
        onPlayCard(cardIndex);
      }, 1000);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(false);
  };

  const handlePauseForfeit = () => {
    setIsPaused(false);
    // Forfeit the match and return to main menu
    if (onQuit) {
      onQuit();
    }
  };

  const handlePauseQuit = () => {
    setIsPaused(false);
    // Quit to main menu
    if (onQuit) {
      onQuit();
    }
  };

  if (!gameState) {
    return <div className="game-board">Loading...</div>;
  }

  return (
    <div className="game-board" ref={gameBoardRef}>
      {/* Round Announcement */}
      {showRoundAnnouncement && (
        <RoundAnnouncement
          roundNumber={currentRoundNumber}
          show={showRoundAnnouncement}
          onComplete={handleRoundAnnouncementComplete}
        />
      )}

      {/* Pause Menu */}
      {isPaused && (
        <PauseMenu
          onResume={handlePauseResume}
          onForfeit={handlePauseForfeit}
          onQuit={handlePauseQuit}
        />
      )}

      {/* Pause Button */}
      {gameState.gameStarted && !gameState.gameOver && (
        <button className="pause-button" onClick={() => setIsPaused(true)} title="Pause (ESC)">
          ⏸
        </button>
      )}

      {/* Defeat Countdown Modal for Story Mode */}
      {defeatCountdown !== null && (
        <div className={`defeat-countdown-overlay ${fadeOut ? 'fade-out' : ''}`}>
          <div className="defeat-countdown-container">
            <h1 className="defeat-title">DEFEATED!</h1>
            <p className="defeat-message">You were defeated by {aiPlayer?.name}</p>
            <div className="countdown-circle">
              <div className="countdown-number">{defeatCountdown}</div>
            </div>
            <p className="countdown-text">Returning to main menu...</p>
            <button className="retry-button" onClick={handleContinueAfterDefeat}>
              TRY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState.gameOver && defeatCountdown === null && (
        <div className="game-over-overlay">
          <div className="game-over-container">
            <h1 className="game-over-title">GAME OVER!</h1>
            <h2 className="winner-announcement">
              {gameState.winner === 'Tie' ? (
                "IT'S A TIE!"
              ) : (
                <>{gameState.winner} WINS!</>
              )}
            </h2>
            <div className="final-scores">
              <div className="final-score-item">
                <span className="player-name">{humanPlayer?.name}</span>
                <span className="player-score">{humanPlayer?.score}</span>
              </div>
              <div className="score-separator">vs</div>
              <div className="final-score-item">
                <span className="player-name">{aiPlayer?.name}</span>
                <span className="player-score">{aiPlayer?.score}</span>
              </div>
            </div>
            <div className="game-over-buttons">
              <button className="play-again-button" onClick={onPlayAgain}>
                {isStoryMode ? 'CONTINUE' : 'PLAY AGAIN'}
              </button>
              <button className="quit-button" onClick={onQuit}>
                QUIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Turn Announcement Overlay */}
      {gameState.gameStarted && !gameState.gameOver && showTurnAnnouncement && (
        <div className="turn-announcement">
          {isMyTurn ? (
            <>
              <h1 className="turn-text your-turn-text">YOUR TURN!</h1>
            </>
          ) : (
            <>
              <h1 className="turn-text opponent-turn-text">PLAYER 2 TURN</h1>
              <div className="ai-thinking">AI is thinking...</div>
            </>
          )}
        </div>
      )}
      
      {/* Turn Timer */}
      {gameState.gameStarted && !gameState.gameOver && !gameState.battlePhase && (
        <div className="floating-timer">
          <div className={`timer-display-small ${turnTimer <= 10 ? 'low-time' : ''}`}>
            {turnTimer}s
          </div>
        </div>
      )}

      {/* Forfeit Announcement Overlay */}
      {showForfeitAnnouncement && (
        <div className="forfeit-announcement">
          <h1 className="forfeit-text">TIME'S UP!</h1>
          <p className="forfeit-subtext">Turn Forfeited</p>
        </div>
      )}

      {/* Element Match Bonus Overlay */}
      {showMatchBonus && gameState?.lastMatchBonus && (
        <div className={`match-bonus-overlay ${
          gameState.lastMatchBonus.player === currentPlayer?.name ? 'player-side' : 'opponent-side'
        }`}>
          <div className={`element-particles ${gameState.lastMatchBonus.element.toLowerCase()}-particles`}>
            {Array(20).fill(null).map((_, i) => (
              <div key={i} className="particle"></div>
            ))}
          </div>
          <h1 className="match-bonus-text">
            {gameState.lastMatchBonus.element} MATCH!<br/>
            <span className="bonus-subtitle">DOUBLE STRENGTH!</span>
          </h1>
        </div>
      )}

      {/* Combo Bonus Overlay */}
      {gameState?.lastComboBonus && Date.now() - gameState.lastComboBonus.timestamp < 3000 && (
        <div className="combo-bonus-overlay">
          {gameState.lastComboBonus.type === 'ELEMENT_CHAIN' && (
            <>
              <div className="combo-icon">⚡⚡⚡</div>
              <h1 className="combo-message">ELEMENT CHAIN!</h1>
              <div className="combo-details">
                <span className="combo-player">{gameState.lastComboBonus.player === 'player' ? 'Player 1' : 'Player 2'}</span>
                <span className="combo-multiplier">3x Strength Multiplier</span>
              </div>
            </>
          )}
          {gameState.lastComboBonus.type === 'SEQUENTIAL' && (
            <>
              <div className="combo-icon">🔄</div>
              <h1 className="combo-message">SEQUENTIAL COMBO!</h1>
              <div className="combo-details">
                <span className="combo-player">{gameState.lastComboBonus.player === 'player' ? 'Player 1' : 'Player 2'}</span>
                <span className="combo-multiplier">1.5x Strength Multiplier</span>
              </div>
            </>
          )}
          {gameState.lastComboBonus.type === 'OPPOSITION' && (
            <>
              <div className="combo-icon">⚔️</div>
              <h1 className="combo-message">OPPOSITION BONUS!</h1>
              <div className="combo-details">
                <span className="combo-player">{gameState.lastComboBonus.player === 'player' ? 'Player 1' : 'Player 2'}</span>
                <span className="combo-multiplier">+2 Strength Bonus</span>
              </div>
            </>
          )}
          {gameState.lastComboBonus.type === 'RAINBOW' && (
            <>
              <div className="combo-icon">🌈</div>
              <h1 className="combo-message">RAINBOW MASTERY!</h1>
              <div className="combo-details">
                <span className="combo-player">{gameState.lastComboBonus.player === 'player' ? 'Player 1' : 'Player 2'}</span>
                <span className="combo-multiplier">INSTANT WIN!</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Card Preview Overlay */}
      {cardPreview && (
        <div className="card-preview-overlay">
          {cardPreview.type === 'graveyard' ? (
            <div className="graveyard-preview-container">
              <div className="graveyard-header">
                <h2>⚰️ Graveyard - {cardPreview.isPlayer ? 'Your' : "Opponent's"} Cards</h2>
                <button className="close-preview" onClick={() => setCardPreview(null)}>✕</button>
              </div>
              <div className="graveyard-cards-grid">
                {cardPreview.cards && cardPreview.cards.length > 0 ? (
                  cardPreview.cards.map((card, index) => (
                    <div key={index} className="graveyard-card-wrapper">
                      <Card card={card} isPlayable={false} />
                    </div>
                  ))
                ) : (
                  <p className="no-cards-message">No cards in graveyard</p>
                )}
              </div>
            </div>
          ) : (
            <div className={`card-preview-container ${cardPreview.isPlayer ? 'player-preview' : 'ai-preview'}`}>
              <Card card={cardPreview.card} isPlayable={false} />
            </div>
          )}
        </div>
      )}

      {/* Special Ability Overlay */}
      {gameState?.pendingAbility && gameState.pendingAbility.playerId === currentPlayerId && (
        <div className="ability-overlay">
          <div className="ability-container ability-card-selection">
            <h2 className="ability-title">🌍 EARTH ABILITY!</h2>
            <p className="ability-description">
              Choose a card from your reserve deck:
            </p>
            <div className="reserve-cards-display">
              {currentPlayer?.deck && currentPlayer.deck.length > 0 ? (
                currentPlayer.deck.map((card, index) => (
                  <div key={index} className="reserve-card-wrapper">
                    <Card 
                      card={card} 
                      onClick={() => onDrawFromReserve(index)}
                      isPlayable={true}
                    />
                  </div>
                ))
              ) : (
                <p className="no-cards-message">No cards in reserve deck</p>
              )}
            </div>
            <div className="ability-buttons">
              <button className="ability-button skip-button" onClick={onSkipAbility}>
                ✖ SKIP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Game Button - Show when game hasn't started */}
      {!gameState.gameStarted && !gameState.cardSelectionPhase && (
        <div className="game-info">
          <button onClick={onStartGame} className="start-button">
            Start Game
          </button>
        </div>
      )}

      {/* Left Sidebar - Both Players */}
      <div className="left-sidebar">
        <div className="sidebar-content">
          <h3>Player 2 (AI)</h3>
          {aiPlayer && (
            <div className="sidebar-player-info">
              <div className="player-avatar">🤖</div>
              <p><strong>{aiPlayer.name}</strong></p>
              <p className={aiPlayer.active ? 'active-indicator' : ''}>
                {aiPlayer.active && '⭐ '}Score: {aiPlayer.score}
              </p>
              {/* AI Status Effects Display */}
              {gameState.statusEffects?.ai?.length > 0 && (
                <div className="status-effects-display">
                  <h4>🎭 Active Effects</h4>
                  {gameState.statusEffects.ai.map((effect, idx) => (
                    <div key={idx} className={`status-effect ${['STRENGTH_BOOST', 'SHIELD', 'REGENERATION', 'PIERCING', 'CRITICAL_HIT', 'ELEMENT_MASTERY', 'DRAW_POWER', 'TURN_EXTENSION', 'DOUBLE_STRIKE'].includes(effect.type) ? 'buff' : 'debuff'}`}>
                      <span className="status-icon">
                        {effect.type === 'STRENGTH_BOOST' && '💪'}
                        {effect.type === 'SHIELD' && '🛡️'}
                        {effect.type === 'REGENERATION' && '💚'}
                        {effect.type === 'PIERCING' && '🗡️'}
                        {effect.type === 'CRITICAL_HIT' && '💥'}
                        {effect.type === 'WEAKNESS' && '😵'}
                        {effect.type === 'BURN' && '🔥'}
                        {effect.type === 'FREEZE' && '🧊'}
                        {effect.type === 'POISON' && '☠️'}
                        {effect.type === 'CURSE' && '👹'}
                        {effect.type === 'CONFUSION' && '😵‍💫'}
                        {effect.type === 'SILENCE' && '🔇'}
                        {effect.type === 'FATIGUE' && '😴'}
                        {effect.type === 'VULNERABILITY' && '🎯'}
                      </span>
                      <span className="status-name">{effect.type.replace(/_/g, ' ')}</span>
                      <span className="status-value">
                        {effect.value > 1 && `${effect.value}`}
                        {effect.turnsRemaining > 0 && ` (${effect.turnsRemaining})`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {aiPlayer.fatigueDamage > 0 && (
                <div className="fatigue-indicator">
                  💀 Fatigue: -{aiPlayer.fatigueDamage}
                </div>
              )}
              {aiPlayer.lastPlayedElement && (
                <div className="evolution-indicator">
                  🔗 Chain: {aiPlayer.lastPlayedElement}
                </div>
              )}
              <div className="total-strength-display">
                <div className="strength-label">Total Strength</div>
                <div className="strength-value">{aiTotalStrength}</div>
              </div>
              <p>Cards: {aiPlayer.cardCount}</p>
              {gameState.graveyard?.ai?.length > 0 && (
                <div className="graveyard-indicator">
                  ⚰️ Graveyard: {gameState.graveyard.ai.length}
                </div>
              )}
            </div>
          )}

          <div className="sidebar-divider"></div>

          <h3>Player 1 (You)</h3>
          {humanPlayer && (
            <div className="sidebar-player-info">
              <div className="player-avatar">👤</div>
              <p><strong>{humanPlayer.name}</strong></p>
              <p>Score: {humanPlayer.score}</p>
              {/* Status Effects Display */}
              {gameState.statusEffects?.player?.length > 0 && (
                <div className="status-effects-display">
                  <h4>🎭 Active Effects</h4>
                  {gameState.statusEffects.player.map((effect, idx) => (
                    <div key={idx} className={`status-effect ${effect.type.toLowerCase().includes('buff') || ['STRENGTH_BOOST', 'SHIELD', 'REGENERATION', 'PIERCING', 'CRITICAL_HIT'].includes(effect.type) ? 'buff' : 'debuff'}`}>
                      <span className="status-icon">
                        {effect.type === 'STRENGTH_BOOST' && '💪'}
                        {effect.type === 'SHIELD' && '🛡️'}
                        {effect.type === 'REGENERATION' && '💚'}
                        {effect.type === 'PIERCING' && '🗡️'}
                        {effect.type === 'CRITICAL_HIT' && '💥'}
                        {effect.type === 'WEAKNESS' && '😵'}
                        {effect.type === 'BURN' && '🔥'}
                        {effect.type === 'FREEZE' && '🧊'}
                        {effect.type === 'POISON' && '☠️'}
                        {effect.type === 'CURSE' && '👹'}
                        {effect.type === 'CONFUSION' && '😵‍💫'}
                        {effect.type === 'SILENCE' && '🔇'}
                        {effect.type === 'FATIGUE' && '😴'}
                        {effect.type === 'VULNERABILITY' && '🎯'}
                      </span>
                      <span className="status-name">{effect.type.replace(/_/g, ' ')}</span>
                      <span className="status-value">
                        {effect.value > 1 && `${effect.value}`}
                        {effect.turnsRemaining > 0 && ` (${effect.turnsRemaining})`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {humanPlayer.fatigueDamage > 0 && (
                <div className="fatigue-indicator warning">
                  💀 Fatigue: -{humanPlayer.fatigueDamage}
                </div>
              )}
              {humanPlayer.lastPlayedElement && (
                <div className="evolution-indicator">
                  🔗 Chain: {humanPlayer.lastPlayedElement}
                </div>
              )}
              <div className="total-strength-display">
                <div className="strength-label">Total Strength</div>
                <div className="strength-value">{humanTotalStrength}</div>
              </div>
              <p>Cards: {humanPlayer.cardCount}</p>
              {gameState.graveyard?.player?.length > 0 && (
                <div className="graveyard-section">
                  <div className="graveyard-indicator">
                    ⚰️ Graveyard: {gameState.graveyard.player.length}
                  </div>
                  <button 
                    className="graveyard-preview-btn"
                    onClick={() => setCardPreview({
                      type: 'graveyard',
                      cards: gameState.graveyard.player,
                      isPlayer: true
                    })}
                  >
                    View Graveyard
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Card Decks */}
      <div className="right-sidebar">
        <div className="sidebar-content">
          <h3>Player 2 Cards</h3>
          {aiPlayer && gameState.gameStarted && (
            <>
              <div className="ai-cards-display">
                <h4>Remaining Cards</h4>
                <div className="vertical-card-stack">
                  {Array(aiPlayer.cardCount).fill(null).map((_, i) => (
                    <div key={i} className="card-back-small"></div>
                  ))}
                </div>
              </div>

              {aiPlayer.deck && aiPlayer.deck.length > 0 && (
                <div className="deck-section">
                  <h4>Reserve Deck ({aiPlayer.deck.length})</h4>
                  <div className="reserve-deck-stack">
                    {aiPlayer.deck.map((_, i) => (
                      <div key={i} className="card-back-small" style={{ top: `${i * 2}px` }}></div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="sidebar-divider"></div>

          {/* Game Modifiers Display */}
          {gameState.modifiers && gameState.modifiers.length > 0 && (
            <div className="modifiers-panel-sidebar">
              <h4>🎲 Active Modifiers</h4>
              {gameState.modifiers.map((mod, idx) => (
                <div key={idx} className="modifier-item">
                  <span className="modifier-name">{mod.name.replace(/_/g, ' ')}</span>
                  <span className="modifier-desc">{mod.description}</span>
                </div>
              ))}
              {gameState.boostedElement && (
                <div className="boosted-element">
                  ⚡ Boosted: <strong>{gameState.boostedElement}</strong> (+3)
                </div>
              )}
            </div>
          )}

          <div className="sidebar-divider"></div>

          <h3>Player 1 Cards</h3>
          {humanPlayer && gameState.gameStarted && (
            <>
              <div className="ai-cards-display">
                <h4>Remaining Cards</h4>
                <div className="vertical-card-stack">
                  {Array(humanPlayer.cardCount).fill(null).map((_, i) => (
                    <div key={i} className="card-back-small player-card-back"></div>
                  ))}
                </div>
              </div>

              {humanPlayer.deck && humanPlayer.deck.length > 0 && (
                <div className="deck-section">
                  <h4>Reserve Deck ({humanPlayer.deck.length})</h4>
                  <div className="reserve-deck-stack">
                    {humanPlayer.deck.map((_, i) => (
                      <div key={i} className="card-back-small player-card-back" style={{ top: `${i * 2}px` }}></div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>



      {/* Center Battle Area - Cards Played */}
      {gameState.gameStarted && (
        <div className="center-battle-area">
          {/* Floating Turn Timer - Hidden (removed from display) */}
          
          <h3>Battle Arena - All Played Cards</h3>
          
          {/* AI's Played Cards - Top */}
          <div className="battle-card-row ai-row">
            <div className="played-cards-container">
              {aiPlayer?.playedCards && aiPlayer.playedCards.length > 0 ? (
                aiPlayer.playedCards.map((card, index) => (
                  <div key={index} className="played-card-wrapper ai-card">
                    <Card card={card} isPlayable={false} />
                    <div className="card-round-label">R{index + 1}</div>
                  </div>
                ))
              ) : (
                <div className="empty-card-slot">
                  {aiPlayer?.active ? 'AI is thinking...' : 'No cards played yet'}
                </div>
              )}
            </div>
          </div>

          {/* Player's Played Cards - Bottom */}
          <div className="battle-card-row player-row">
            <div className="played-cards-container">
              {humanPlayer?.playedCards && humanPlayer.playedCards.length > 0 ? (
                humanPlayer.playedCards.map((card, index) => (
                  <div key={index} className="played-card-wrapper">
                    <Card card={card} isPlayable={false} />
                    <div className="card-round-label">R{index + 1}</div>
                  </div>
                ))
              ) : (
                <div className="empty-card-slot">
                  {humanPlayer?.active ? 'Choose your card...' : 'No cards played yet'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Player's Hand (Bottom) */}
      {humanPlayer && gameState.gameStarted && !gameState.gameOver && (
        <div className="hand-container">
          <div className="hand">
            {humanPlayer.hand?.map((card, index) => (
              <Card
                key={index}
                card={card}
                onClick={() => handleCardClick(index)}
                isPlayable={isMyTurn && !gameState?.pendingAbility}
                keyboardKey={settings?.keyboardEnabled ? String(index + 1) : null}
              />
            ))}
          </div>
          <h3 className="hand-label">Your Hand</h3>
        </div>
      )}

      {/* Score Tracker - Always visible during game */}
    </div>
  );
};

export default GameBoard;
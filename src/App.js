import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './accessibility.css';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';
import StoryMode from './components/StoryMode';
import GameBoard from './components/GameBoard';
import CardSelection from './components/CardSelection';
import Settings from './components/Settings';
import Tutorial from './components/Tutorial';
import Statistics from './components/Statistics';
import PlayerProfile from './components/PlayerProfile';
import InstallPrompt from './components/InstallPrompt';
import Credits from './components/Credits';
import SplashScreen from './components/SplashScreen';
import CoinToss from './components/CoinToss';
import ThemeShop from './components/ThemeShop';
import DonationBanner from './components/DonationBanner';
import Inventory from './components/Inventory';
import GameClient from './services/GameClient';
import securityManager from './utils/security';
import { recordGameEnd, recordCardPlayed, recordMatchBonus, recordAbilityUsed, getProfile, updateProfile, recoverStoryProgress, recoverProfile } from './utils/statistics';
import { awardCoins, initializeThemes } from './utils/themes';
import { initializeAccessibility, applyColorblindMode, applyHighContrast, applyTextSize } from './utils/accessibility';
import { createDefaultInventory, generateLoot, PlayerInventory } from './utils/powerUps';

function App() {
  // Donation banner state
  const [showDonationBanner, setShowDonationBanner] = useState(true);

  // Initialize security
  useEffect(() => {
    try {
      // Initialize security manager
      securityManager.logSecurityEvent('app_initialized', {
        version: process.env.REACT_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      console.error('Security initialization failed:', error);
    }
  }, []);

  const [gameClient] = useState(() => new GameClient());
  const hasConnected = useRef(false);
  const [connected, setConnected] = useState(true); // Start as true - mock server is always available
  const [showSplash, setShowSplash] = useState(true);
  const [isReturningToSplash, setIsReturningToSplash] = useState(false);
  const [showMainMenu, setShowMainMenu] = useState(false);
  const [showStoryMode, setShowStoryMode] = useState(false);
  const [storyModeStage, setStoryModeStage] = useState(null);
  const [completedStoryStages, setCompletedStoryStages] = useState(() => {
    return recoverStoryProgress();
  });
  const [showCredits, setShowCredits] = useState(false);
  const [showCoinToss, setShowCoinToss] = useState(false);
  const [firstPlayer, setFirstPlayer] = useState(null);
  const [currentOpponent, setCurrentOpponent] = useState(null);
  const [inGame, setInGame] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [playerId] = useState(() => 'player_' + Math.random().toString(36).substr(2, 9));
  const [gameState, setGameState] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showThemeShop, setShowThemeShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [playerProfile, setPlayerProfile] = useState(() => recoverProfile());
  const [gameStartTime, setGameStartTime] = useState(null);
  const [lastRoundWinner, setLastRoundWinner] = useState(null);
  const [playerInventory, setPlayerInventory] = useState(() => {
    const saved = localStorage.getItem('playerInventory');
    return saved ? PlayerInventory.fromJSON(JSON.parse(saved)) : createDefaultInventory();
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('gameSettings');
    const accessibilitySettings = initializeAccessibility();
    return saved ? {
      ...JSON.parse(saved),
      ...accessibilitySettings
    } : {
      soundEnabled: true,
      musicEnabled: true,
      animationsEnabled: true,
      timerEnabled: true,
      keyboardEnabled: true,
      colorblindMode: accessibilitySettings.colorblindMode,
      highContrast: accessibilitySettings.highContrast,
      textSize: accessibilitySettings.textSize,
      showElementIcons: accessibilitySettings.showElementIcons
    };
  });

  // Initialize themes on app startup
  useEffect(() => {
    initializeThemes();
    initializeAccessibility();
  }, []);

  // Apply accessibility settings when they change
  useEffect(() => {
    if (settings.colorblindMode) {
      applyColorblindMode(settings.colorblindMode);
    }
    if (settings.highContrast !== undefined) {
      applyHighContrast(settings.highContrast);
    }
    if (settings.textSize) {
      applyTextSize(settings.textSize);
    }
    if (settings.showElementIcons !== undefined) {
      localStorage.setItem('showElementIcons', settings.showElementIcons);
    }
    
    // Dispatch event for other components to react
    window.dispatchEvent(new Event('settingsUpdated'));
  }, [settings.colorblindMode, settings.highContrast, settings.textSize, settings.showElementIcons]);

  // Handler for settings changes that also persists to localStorage
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
  };

  // Persist inventory changes to localStorage
  useEffect(() => {
    localStorage.setItem('playerInventory', JSON.stringify(playerInventory));
  }, [playerInventory]);

  // Inventory handlers
  const handleUseConsumable = (item) => {
    console.log('Using consumable:', item);
    // Apply consumable effect to game state if in game
    if (gameClient && roomId) {
      // Will be handled by GameClient integration
    }
  };

  const handleEquipItem = (equipped, unequipped) => {
    console.log('Equipped:', equipped, 'Unequipped:', unequipped);
    // Equipment bonuses will be applied automatically through inventory.getEquipmentBonuses()
  };

  const handleUnequipItem = (item) => {
    console.log('Unequipped:', item);
  };

  const handleAddToActiveDeck = (card) => {
    console.log('Added to deck:', card);
    // This will integrate with deck building system
  };

  useEffect(() => {
    // Clear old cached data on version change (but preserve user data)
    const APP_VERSION = '2.0.0';
    const cachedVersion = localStorage.getItem('appVersion');
    if (cachedVersion !== APP_VERSION) {
      console.log('Version changed, updating app version...');
      
      // Preserve user data
      const playerThemes = localStorage.getItem('playerThemes');
      const playerProfile = localStorage.getItem('playerProfile');
      const storyProgress = localStorage.getItem('storyModeProgress');
      const storyBackup = localStorage.getItem('storyModeBackup');
      const tutorialCompleted = localStorage.getItem('tutorialCompleted');
      const gameSettings = localStorage.getItem('gameSettings');
      
      // Clear only cache data
      const keysToPreserve = ['playerThemes', 'playerProfile', 'storyModeProgress', 'storyModeBackup', 'tutorialCompleted', 'gameSettings'];
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!keysToPreserve.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      // Restore preserved data
      if (playerThemes) localStorage.setItem('playerThemes', playerThemes);
      if (playerProfile) localStorage.setItem('playerProfile', playerProfile);
      if (storyProgress) localStorage.setItem('storyModeProgress', storyProgress);
      if (storyBackup) localStorage.setItem('storyModeBackup', storyBackup);
      if (tutorialCompleted) localStorage.setItem('tutorialCompleted', tutorialCompleted);
      if (gameSettings) localStorage.setItem('gameSettings', gameSettings);
      
      localStorage.setItem('appVersion', APP_VERSION);
      console.log('✅ User data preserved during version update');
      return;
    }

    // Prevent duplicate connections
    if (hasConnected.current) {
      console.log('Skipping duplicate connection attempt');
      return;
    }
    hasConnected.current = true;
    console.log('Initializing game client connection...');

    // Connect to game server
    gameClient.connect('localhost', 3011) // Connect to basic server
      .then(() => {
        console.log('Connected to game server');
      })
      .catch((error) => {
        console.error('Failed to connect:', error);
      });

    // Listen for game state updates
    const handleGameState = (state) => {
      setGameState(state);
    };
    
    gameClient.on('gameState', handleGameState);

    // Show tutorial on first visit
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }

    return () => {
      console.log('Cleaning up game client...');
      gameClient.off('gameState', handleGameState);
      gameClient.disconnect();
    };
  }, []); // Empty deps - gameClient is stable from useState


  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('gameSettings', JSON.stringify(settings));
  }, [settings]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // ESC to close overlays
      if (e.key === 'Escape') {
        setShowSettings(false);
        setShowStats(false);
        setShowTutorial(false);
        setShowProfile(false);
        setShowThemeShop(false);
      }
      // S to open settings (only when not in active game)
      if (e.key === 's' || e.key === 'S') {
        if (!inGame || gameState?.gameOver) {
          e.preventDefault();
          setShowSettings(true);
        }
      }
      // T to open tutorial (only when not in active game)
      if (e.key === 't' || e.key === 'T') {
        if (!inGame || gameState?.gameOver) {
          e.preventDefault();
          setShowTutorial(true);
        }
      }
      // P to open stats (only when not in active game)
      if (e.key === 'p' || e.key === 'P') {
        if (!inGame || gameState?.gameOver) {
          e.preventDefault();
          setShowStats(true);
        }
      }
      // U to open profile (only when not in active game)
      if (e.key === 'u' || e.key === 'U') {
        if (!inGame || gameState?.gameOver) {
          e.preventDefault();
          setShowProfile(true);
        }
      }
      // H to open theme shop (only when not in active game)
      if (e.key === 'h' || e.key === 'H') {
        if (!inGame || gameState?.gameOver) {
          e.preventDefault();
          setShowThemeShop(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inGame, gameState?.gameOver]);

  // Track game statistics
  useEffect(() => {
    if (!gameState) return;

    // Record when game starts
    if (gameState.gameStarted && !gameState.cardSelectionPhase && !gameStartTime) {
      setGameStartTime(Date.now());
    }

    // Track match bonuses
    if (gameState.lastMatchBonus) {
      recordMatchBonus();
    }

    // Track special abilities
    if (gameState.pendingAbility && gameState.pendingAbility.playerId === playerId) {
      recordAbilityUsed();
    }

    // Record game end
    if (gameState.gameOver && gameStartTime) {
      const humanPlayer = gameState.players?.find(p => !p.isAI);
      const aiPlayer = gameState.players?.find(p => p.isAI);
      
      if (humanPlayer && aiPlayer) {
        let playerWon;
        if (gameState.winner === humanPlayer.name) playerWon = true;
        else if (gameState.winner === aiPlayer.name) playerWon = false;
        else playerWon = null; // Tie

        recordGameEnd(
          playerWon,
          humanPlayer.score,
          aiPlayer.score,
          gameState.currentRound || 0,
          gameStartTime
        );
        
        // Update player profile
        const updatedProfile = updateProfile({
          won: playerWon === true,
          lost: playerWon === false,
          tied: playerWon === null,
          playerScore: humanPlayer.score,
          aiScore: aiPlayer.score
        });
        
        // Award coins for winning
        const coinReward = awardCoins({
          won: playerWon === true,
          lost: playerWon === false,
          tied: playerWon === null,
          playerScore: humanPlayer.score,
          aiScore: aiPlayer.score
        }, !!storyModeStage);
        
        if (coinReward.coinsEarned > 0) {
          console.log(`🪙 Earned ${coinReward.coinsEarned} coins! Total: ${coinReward.totalCoins}`);
        }
        
        // Award loot for winning or completing matches
        if (playerWon === true || playerWon === null) {
          const playerLevel = Math.floor((playerProfile.gamesPlayed || 0) / 10) + 1;
          const loot = generateLoot(playerLevel, playerWon === true);
          
          loot.forEach(item => {
            if (item.type === 'currency') {
              playerInventory.addCurrency(item.amount);
              console.log(`💰 Earned ${item.amount} gold!`);
            } else {
              playerInventory.addItem(item);
              console.log(`✨ Obtained: ${item.name} (${item.rarity})`);
            }
          });
          
          // Update inventory state
          setPlayerInventory({ ...playerInventory });
        }
        
        setPlayerProfile(updatedProfile);
        
        // Story mode progress tracking with enhanced autosave
        if (storyModeStage && playerWon === true && !completedStoryStages.includes(storyModeStage)) {
          setCompletedStoryStages(prev => {
            const newProgress = [...prev, storyModeStage].sort((a, b) => a - b);
            
            // Primary autosave
            localStorage.setItem('storyModeProgress', JSON.stringify(newProgress));
            
            // Backup save with timestamp
            const backupData = {
              progress: newProgress,
              timestamp: Date.now(),
              completedStage: storyModeStage
            };
            localStorage.setItem('storyModeBackup', JSON.stringify(backupData));
            
            // Save player profile state
            localStorage.setItem('playerProfile', JSON.stringify(playerProfile));
            
            // Log successful autosave
            console.log(`✅ Story Progress Autosaved: Stage ${storyModeStage} completed`);
            
            // Show credits after completing final stage (stage 9)
            if (storyModeStage === 9) {
              setTimeout(() => {
                setShowCredits(true);
              }, 2000);
            }
            
            return newProgress;
          });
        }
        
        setGameStartTime(null);
      }
    }
  }, [gameState, gameStartTime, playerId, storyModeStage]);

  const handlePlayGame = () => {
    console.log('🎮 Play Game clicked - navigating to lobby');
    setShowMainMenu(false);
    setShowStoryMode(false);
    setShowSplash(false);
    setShowLobby(true);
  };

  const handleStoryMode = () => {
    setShowMainMenu(false);
    setShowStoryMode(true);
  };

  const handleStoryModeBack = () => {
    setShowStoryMode(false);
    setShowMainMenu(true);
  };

  const handleStartStoryBattle = async (opponentKey, stageNumber) => {
    setStoryModeStage(stageNumber);
    setCurrentOpponent(opponentKey);
    setShowStoryMode(false);
    
    // Use player profile name for story mode
    const playerName = playerProfile.name || 'Player';
    
    // Create room with specific AI personality
    try {
      const result = await gameClient.createRoom(opponentKey);
      if (result && result.roomId) {
        setRoomId(result.roomId);
        await gameClient.joinRoom(result.roomId, playerId, playerName);
        // Auto-start game immediately for story mode
        await gameClient.startGame(result.roomId);
        setInGame(true);
        setGameStartTime(Date.now());
        
        // Start polling for game state updates
        pollGameState(result.roomId);
      }
    } catch (error) {
      console.error('Error starting story battle:', error);
    }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setIsReturningToSplash(false);
    setShowMainMenu(true);
    // Ensure all other screens are hidden
    setShowStoryMode(false);
    setInGame(false);
    setStoryModeStage(null);
  };

  const handleQuit = () => {
    // Return to main menu
    setInGame(false);
    setShowStoryMode(false);
    setShowLobby(false);
    setStoryModeStage(null);
    setGameState(null);
    setRoomId(null);
    setShowSplash(false);
    setIsReturningToSplash(false);
    setShowMainMenu(true);
  };

  const handleSinglePlayer = async (playerName, aiPersonality = 'CHAOS') => {
    console.log('🎯 Starting single player game:', { playerName, aiPersonality });
    try {
      const result = await gameClient.createRoom(aiPersonality);
      console.log('🏠 Room created:', result);
      if (result && result.roomId) {
        setRoomId(result.roomId);
        await gameClient.joinRoom(result.roomId, playerId, playerName);
        await gameClient.startGame(result.roomId);
        
        // Clear all other UI states first
        setShowMainMenu(false);
        setShowLobby(false);
        setShowStoryMode(false);
        setShowSplash(false);
        
        // Set game state
        setInGame(true);
        setGameStartTime(Date.now());
        
        console.log('🔄 Starting game state polling for room:', result.roomId);
        pollGameState(result.roomId);
        
        // Update player profile name
        if (playerName !== playerProfile.name) {
          const updatedProfile = { ...playerProfile, name: playerName };
          setPlayerProfile(updatedProfile);
          localStorage.setItem('playerProfile', JSON.stringify(updatedProfile));
        }
      } else {
        console.error('🚨 No room ID returned from createRoom');
      }
    } catch (error) {
      console.error('🚨 Error creating single player game:', error);
    }
  };

  const handleMultiplayer = async (playerName) => {
    // Placeholder for future multiplayer functionality
    alert('Multiplayer mode coming soon! Play Single Player for now.');
  };

  const handleCreateRoom = async () => {
    try {
      const playerName = playerProfile.name || 'Player';
      const result = await gameClient.createRoom();
      if (result && result.roomId) {
        setRoomId(result.roomId);
        await gameClient.joinRoom(result.roomId, playerId, playerName);
        setInGame(true);
        setGameStartTime(Date.now());
      }
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = async (roomId, playerName) => {
    try {
      const joined = await gameClient.joinRoom(roomId, playerId, playerName);
      
      if (joined) {
        setRoomId(roomId);
        setInGame(true);
        // Start polling for game state
        pollGameState(roomId);
      } else {
        alert('Failed to join room. Room may be full or game already started.');
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room');
    }
  };

  const pollGameState = (roomId) => {
    console.log('🔄 Starting polling for room:', roomId);
    
    // Initial immediate poll
    gameClient.getGameState(roomId);
    
    // Then poll every 2 seconds to reduce unnecessary updates
    const interval = setInterval(() => {
      gameClient.getGameState(roomId);
    }, 2000);

    // Store interval ID to clear it later if needed
    window.gameStateInterval = interval;
  };

  const handleStartGame = async () => {
    if (roomId) {
      const started = await gameClient.startGame(roomId);
      if (!started) {
        alert('Failed to start game. Need at least 2 players.');
      }
    }
  };

  const handlePlayCard = async (cardIndex) => {
    if (roomId) {
      const currentPlayer = gameState?.players?.find(p => p.id === playerId);
      const card = currentPlayer?.hand?.[cardIndex];
      
      console.log('🎴 Playing card:', { cardIndex, card, isMyTurn: currentPlayer?.active });
      
      // Check if it's actually the player's turn before attempting to play
      if (!currentPlayer?.active) {
        console.log('❌ Not your turn - waiting...');
        return;
      }
      
      const played = await gameClient.playCard(roomId, playerId, cardIndex);
      console.log('✅ Play card result:', played);
      
      // Immediately fetch updated game state to show card in battle arena
      gameClient.getGameState(roomId);
      
      if (card) {
        // Track card played (will determine if won after round resolves)
        setTimeout(() => {
          const updatedState = gameState;
          const humanPlayer = updatedState?.players?.find(p => !p.isAI);
          const aiPlayer = updatedState?.players?.find(p => p.isAI);
          
          if (humanPlayer?.chosenCard && aiPlayer?.chosenCard) {
            const wonRound = humanPlayer.chosenCard.strength > aiPlayer.chosenCard.strength;
            recordCardPlayed(card.element, wonRound);
          }
        }, 6000); // After round resolves
      }
    }
  };

  const handleSelectCards = async (selectedIndices) => {
    console.log('🎴 Selecting cards:', selectedIndices);
    if (roomId) {
      try {
        const selected = await gameClient.selectCards(roomId, playerId, selectedIndices);
        console.log('🎴 Card selection result:', selected);
        if (!selected) {
          alert('Failed to select cards.');
        } else {
          // Show coin toss instead of immediately starting game
          console.log('✅ Cards selected successfully, showing coin toss');
          setShowCoinToss(true);
        }
      } catch (error) {
        console.error('❌ Error selecting cards:', error);
        alert('Failed to select cards.');
      }
    }
  };

  const handleCoinTossComplete = async (playerWon) => {
    console.log('Coin toss result:', playerWon ? 'Player goes first' : 'Opponent goes first');
    setShowCoinToss(false);
    
    if (roomId) {
      // Complete the coin toss in the backend and start game
      const result = await gameClient.completeCoinToss(roomId, playerId);
      if (result && result.success) {
        // Store who goes first for potential future use
        setFirstPlayer(playerWon ? playerId : gameState?.players?.find(p => p.id !== playerId)?.id);
        
        // The backend should have already set who is active based on coin toss
        // No need to call handleStartGame() - game is already started
        console.log('✅ Coin toss completed, game should be active now');
      } else {
        console.error('❌ Failed to complete coin toss');
        setShowCoinToss(false);
      }
    }
  };

  const handlePlayAgain = () => {
    // Clear game state interval
    if (window.gameStateInterval) {
      clearInterval(window.gameStateInterval);
    }
    
    // If we were in story mode, mark stage as completed and return to story mode screen
    if (storyModeStage) {
      setInGame(false);
      setRoomId(null);
      setGameState(null);
      setGameStartTime(null);
      setLastRoundWinner(null);
      setStoryModeStage(null);
      setShowStoryMode(true);
    } else {
      // For regular quick play, restart the game with the same opponent
      if (currentOpponent) {
        setGameState(null);
        setGameStartTime(null);
        setLastRoundWinner(null);
        // Start a new game immediately
        handleStartGame(currentOpponent);
      } else {
        // No opponent set, go back to main menu
        setInGame(false);
        setRoomId(null);
        setGameState(null);
        setGameStartTime(null);
        setLastRoundWinner(null);
        setShowMainMenu(true);
      }
    }
  };

  const handleDrawFromReserve = async (cardIndex = 0) => {
    if (roomId) {
      const drawn = await gameClient.drawFromReserve(roomId, playerId, cardIndex);
      if (drawn) {
        // Immediately fetch updated game state to show the new card in hand
        gameClient.getGameState(roomId);
      } else {
        alert('Failed to draw from reserve.');
      }
    }
  };

  const handleSkipAbility = async () => {
    if (roomId) {
      await gameClient.skipAbility(roomId, playerId);
      // Immediately fetch updated game state
      gameClient.getGameState(roomId);
    }
  };

  const handleBackFromCardSelection = () => {
    // Clear game state interval
    if (window.gameStateInterval) {
      clearInterval(window.gameStateInterval);
    }
    // Reset to main menu
    setInGame(false);
    setRoomId(null);
    setGameState(null);
    setGameStartTime(null);
    setShowMainMenu(true);
  };

  const handleForfeitTurn = async () => {
    if (roomId) {
      await gameClient.forfeitTurn(roomId, playerId);
    }
  };

  const handleCloseCredits = () => {
    setShowCredits(false);
    setShowStoryMode(true);
  };

  if (!connected) {
    return (
      <div className="App">
        <div className="connecting">
          <h2>Connecting to game server...</h2>
          <p>Make sure the C++ server is running on port 8080</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App" data-testid="app-container">
      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} isReturning={isReturningToSplash} />}
      
      {/* PWA Install Prompt - Only show on main menu */}
      {!showSplash && showMainMenu && !inGame && !showSettings && !showTutorial && !showStats && !showProfile && !showThemeShop && <InstallPrompt />}
      
      {/* Credits */}
      {showCredits && (
        <Credits onClose={handleCloseCredits} />
      )}
      
      {/* Overlay Components - Always Available */}
      <Settings 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      <Tutorial 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)}
      />
      <Statistics 
        isOpen={showStats} 
        onClose={() => setShowStats(false)}
      />
      
      {/* Theme Shop Modal */}
      {showThemeShop && (
        <ThemeShop onClose={() => setShowThemeShop(false)} />
      )}
      
      {/* Inventory Modal */}
      {showInventory && (
        <Inventory 
          inventory={playerInventory}
          onUseConsumable={handleUseConsumable}
          onEquipItem={handleEquipItem}
          onUnequipItem={handleUnequipItem}
          onAddToActiveDeck={handleAddToActiveDeck}
          onClose={() => setShowInventory(false)}
        />
      )}
      
      {/* Player Profile Modal */}
      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfile(false)}>✕</button>
            <PlayerProfile 
              player={gameState?.players?.find(p => !p.isAI) || { name: playerProfile.name || 'Player' }}
              isAI={false}
              stats={playerProfile}
            />
          </div>
        </div>
      )}

      {/* Main Menu */}
      {!showSplash && showMainMenu && !inGame ? (
        <MainMenu
          onPlayGame={handlePlayGame}
          onStoryMode={handleStoryMode}
          onShowTutorial={() => setShowTutorial(true)}
          onShowStats={() => setShowStats(true)}
          onShowProfile={() => setShowProfile(true)}
          onShowThemeShop={() => setShowThemeShop(true)}
          onShowInventory={() => setShowInventory(true)}
          onShowSettings={() => setShowSettings(true)}
          onQuit={handleQuit}
        />
      ) : !showSplash && showStoryMode && !inGame ? (
        <StoryMode
          onStartBattle={handleStartStoryBattle}
          onBack={handleStoryModeBack}
          completedStages={completedStoryStages}
        />
      ) : !showSplash && showLobby && !inGame ? (
        <Lobby 
          onSinglePlayer={handleSinglePlayer}
          onMultiplayer={handleMultiplayer}
          onBack={() => {
            setShowLobby(false);
            setShowMainMenu(true);
          }}
        />
      ) : !showSplash ? (
        <>
          {/* Top-right menu buttons - hide during active gameplay */}
          {(!inGame || gameState?.gameOver || gameState?.cardSelectionPhase) && (
            <div className="top-menu">
              <button className="menu-button" onClick={() => {
                setShowMainMenu(true);
                setShowLobby(false);
              }} title="Main Menu">
                🏠
              </button>
              <button className="menu-button" onClick={() => setShowTutorial(true)} title="Tutorial (T)">
                ❓
              </button>
              <button className="menu-button" onClick={() => setShowStats(true)} title="Statistics (P)">
                📊
              </button>
              <button className="menu-button" onClick={() => setShowProfile(true)} title="Profile (U)">
                👤
              </button>
              <button className="menu-button" onClick={() => setShowThemeShop(true)} title="Theme Shop (H)">
                🎨
              </button>
              <button className="menu-button" onClick={() => setShowSettings(true)} title="Settings (S)">
                ⚙️
              </button>
            </div>
          )}

          {gameState?.cardSelectionPhase && !gameState?.gameStarted ? (
            <CardSelection
              hand={gameState.players?.find(p => p.id === playerId)?.hand || []}
              onConfirmSelection={handleSelectCards}
              onBack={handleBackFromCardSelection}
            />
          ) : showCoinToss ? (
            <CoinToss
              playerName={gameState?.players?.find(p => p.id === playerId)?.name || 'Player'}
              opponentName={gameState?.players?.find(p => p.id !== playerId)?.name || 'Opponent'}
              onComplete={handleCoinTossComplete}
            />
          ) : (
            <GameBoard
              gameState={gameState}
              currentPlayerId={playerId}
              onPlayCard={handlePlayCard}
              onStartGame={handleStartGame}
              onPlayAgain={handlePlayAgain}
              onDrawFromReserve={handleDrawFromReserve}
              onSkipAbility={handleSkipAbility}
              onForfeit={handleForfeitTurn}
              onQuit={handleQuit}
              settings={settings}
              isStoryMode={!!storyModeStage}
            />
          )}
        </>
      ) : null}
      {/* Donation Banner - Only show on main menu */}
      {showDonationBanner && !showSplash && showMainMenu && !inGame && !showSettings && !showTutorial && !showStats && !showProfile && !showThemeShop && !showStoryMode && !showCredits && !showLobby && (
        <DonationBanner 
          onClose={() => setShowDonationBanner(false)}
        />
      )}
    </div>
  );
}

export default App;

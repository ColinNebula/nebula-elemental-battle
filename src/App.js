import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import './App.css';
import './accessibility.css';
import MainMenu from './components/MainMenu';
import Lobby from './components/Lobby';
import GameBoard from './components/GameBoard';
import BrandScreen from './components/BrandScreen';
import SplashScreen from './components/SplashScreen';
import SecurityIndicator from './components/SecurityIndicator';
import GameClient from './services/GameClient';
import securityManager from './utils/security';
import secureStorage from './utils/secureStorage';
import { recordGameEnd, recordCardPlayed, recordMatchBonus, recordAbilityUsed, getProfile, updateProfile, recoverStoryProgress, recoverProfile } from './utils/statistics';
import { awardCoins, initializeThemes, getStoryModeArenaTheme } from './utils/themes';
import { initializeAccessibility, applyColorblindMode, applyHighContrast, applyTextSize } from './utils/accessibility';
import { createDefaultInventory, generateLoot, PlayerInventory } from './utils/powerUps';
import mobileScreenManager from './utils/mobileScreenManager';
import soundManager from './utils/sounds';

// Lazy load heavy components for code splitting
const StoryMode = lazy(() => import('./components/StoryMode'));
const CardSelection = lazy(() => import('./components/CardSelection'));
const CharacterSelection = lazy(() => import('./components/CharacterSelection'));
const VictoryRewards = lazy(() => import('./components/VictoryRewards'));
const Settings = lazy(() => import('./components/Settings'));
const Tutorial = lazy(() => import('./components/Tutorial'));
const TutorialMode = lazy(() => import('./components/TutorialMode'));
const Statistics = lazy(() => import('./components/Statistics'));
const PlayerProfile = lazy(() => import('./components/PlayerProfile'));
const NewsModal = lazy(() => import('./components/NewsModal'));
const InstallPrompt = lazy(() => import('./components/InstallPrompt'));
const Credits = lazy(() => import('./components/Credits'));
const CoinToss = lazy(() => import('./components/CoinToss'));
const ThemeShop = lazy(() => import('./components/ThemeShop'));
const DonationBanner = lazy(() => import('./components/DonationBanner'));
const Inventory = lazy(() => import('./components/Inventory'));

function App() {
  // Donation banner state
  const [showDonationBanner, setShowDonationBanner] = useState(true);
  
  // Lobby music ref - persists across lobby, character selection, and card selection
  const lobbyMusicRef = useRef(null);

  // Initialize mobile screen manager and sound system
  useEffect(() => {
    mobileScreenManager.init();
    soundManager.init();
    
    return () => {
      mobileScreenManager.destroy();
    };
  }, []);

  // Initialize security and migrate storage
  useEffect(() => {
    try {
      // Initialize security manager
      securityManager.logSecurityEvent('app_initialized', {
        version: process.env.REACT_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      });

      // Migrate existing data to secure storage (one-time migration)
      const migrationKey = 'secureStorageMigrated';
      if (!localStorage.getItem(migrationKey)) {
        console.log('[APP] Running secure storage migration...');
        secureStorage.migrateToSecureStorage();
        localStorage.setItem(migrationKey, 'true');
        console.log('[APP] Migration complete');
      }

      // Validate data integrity on startup
      const integrity = secureStorage.validateIntegrity();
      if (integrity.invalid.length > 0) {
        console.warn('[APP] Corrupted data detected:', integrity.invalid);
        securityManager.logSecurityEvent('corrupted_data_detected', {
          keys: integrity.invalid
        });
      }
    } catch (error) {
      console.error('Security initialization failed:', error);
    }
  }, []);

  const [gameClient] = useState(() => new GameClient());
  const hasConnected = useRef(false);
  const [connected, setConnected] = useState(true); // Start as true - mock server is always available
  const [showBrandScreen, setShowBrandScreen] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
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
  const [showTutorialMode, setShowTutorialMode] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showThemeShop, setShowThemeShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showVictoryRewards, setShowVictoryRewards] = useState(false);
  const [victoryRewardsData, setVictoryRewardsData] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(() => recoverProfile());
  const [gameStartTime, setGameStartTime] = useState(null);
  const [lastRoundWinner, setLastRoundWinner] = useState(null);
  const [rewardsAwarded, setRewardsAwarded] = useState(false);
  const [playerInventory, setPlayerInventory] = useState(() => {
    const saved = secureStorage.getItem('playerInventory');
    return saved ? PlayerInventory.fromJSON(saved) : createDefaultInventory();
  });
  const [settings, setSettings] = useState(() => {
    const saved = secureStorage.getItem('gameSettings');
    const accessibilitySettings = initializeAccessibility();
    const baseSettings = saved ? {
      ...saved,
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
    
    // Remove strategicMode from initial settings - it should only be set when explicitly choosing Strategic Mode
    delete baseSettings.strategicMode;
    
    return baseSettings;
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

  // Manage music across different game screens
  useEffect(() => {
    const isInCardSelection = gameState?.cardSelectionPhase && !gameState?.gameStarted;
    const shouldPlayLobbyMusic = (showLobby || showCharacterSelection || isInCardSelection) && !gameState?.gameStarted;
    const shouldPlayMainMenuMusic = showMainMenu && !showLobby && !showCharacterSelection && !inGame;
    
    if (shouldPlayLobbyMusic && !lobbyMusicRef.current) {
      // Start lobby music
      lobbyMusicRef.current = new Audio(`${process.env.PUBLIC_URL}/Under_Cover_of_the_Myst.mp3`);
      lobbyMusicRef.current.volume = settings.musicEnabled ? 0.3 : 0;
      lobbyMusicRef.current.loop = true;
      lobbyMusicRef.current.play().catch(err => console.log('Lobby music autoplay prevented:', err));
    } else if (!shouldPlayLobbyMusic && lobbyMusicRef.current) {
      // Stop lobby music when leaving lobby screens
      lobbyMusicRef.current.pause();
      lobbyMusicRef.current = null;
    }
    
    // Play main menu music (Cooler Heads Prevail only)
    if (shouldPlayMainMenuMusic && settings.musicEnabled) {
      // Play specific main menu track
      const mainMenuAudio = new Audio(`${process.env.PUBLIC_URL}/Cooler_Heads_Prevail.mp3`);
      mainMenuAudio.volume = 0.3;
      mainMenuAudio.loop = true;
      mainMenuAudio.play().catch(err => console.log('Main menu music autoplay prevented:', err));
    } else if (!shouldPlayMainMenuMusic) {
      soundManager.stopMusic();
    }
  }, [showLobby, showCharacterSelection, gameState?.cardSelectionPhase, gameState?.gameStarted, showMainMenu, inGame, settings.musicEnabled]);

  // Handler for settings changes that also persists to localStorage
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    secureStorage.setItem('gameSettings', newSettings);
  };

  // Persist inventory changes to localStorage
  useEffect(() => {
    secureStorage.setItem('playerInventory', playerInventory);
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
      const playerProfile = secureStorage.getItem('playerProfile');
      const storyProgress = secureStorage.getItem('storyModeProgress');
      const storyBackup = localStorage.getItem('storyModeBackup');
      const tutorialCompleted = localStorage.getItem('tutorialCompleted');
      const gameSettings = secureStorage.getItem('gameSettings');
      
      // Clear only cache data
      const keysToPreserve = ['playerThemes', 'playerProfile', 'storyModeProgress', 'storyModeBackup', 'tutorialCompleted', 'gameSettings', '_encKey', 'checksums'];
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!keysToPreserve.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      
      // Restore preserved data
      if (playerThemes) localStorage.setItem('playerThemes', playerThemes);
      if (playerProfile) secureStorage.setItem('playerProfile', playerProfile);
      if (storyProgress) secureStorage.setItem('storyModeProgress', storyProgress);
      if (storyBackup) localStorage.setItem('storyModeBackup', storyBackup);
      if (tutorialCompleted) localStorage.setItem('tutorialCompleted', tutorialCompleted);
      if (gameSettings) secureStorage.setItem('gameSettings', gameSettings);
      
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
    secureStorage.setItem('gameSettings', settings);
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
    if (gameState.gameOver && gameStartTime && !rewardsAwarded) {
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
        
        // Award coins for winning (only once per game)
        const coinReward = awardCoins({
          won: playerWon === true,
          lost: playerWon === false,
          tied: playerWon === null,
          playerScore: humanPlayer.score,
          aiScore: aiPlayer.score
        }, !!storyModeStage);
        
        // Mark rewards as awarded for this game
        setRewardsAwarded(true);
        
        if (coinReward.coinsEarned > 0) {
          console.log(`🪙 Earned ${coinReward.coinsEarned} coins! Total: ${coinReward.totalCoins}`);
        }
        
        // Award loot for winning or completing matches
        let loot = [];
        if (playerWon === true || playerWon === null) {
          const playerLevel = Math.floor((playerProfile.gamesPlayed || 0) / 10) + 1;
          loot = generateLoot(playerLevel, playerWon === true);
          
          loot.forEach(item => {
            if (item.type === 'currency') {
              playerInventory.addCurrency(item.amount);
              console.log(`💰 Earned ${item.amount} gold!`);
            } else {
              playerInventory.addItem(item);
              console.log(`✨ Obtained: ${item.name} (${item.rarity})`);
            }
          });
          
          // Update inventory state - preserve class instance
          setPlayerInventory(playerInventory);
        }
        
        setPlayerProfile(updatedProfile);
        
        // Show victory rewards screen
        setVictoryRewardsData({
          coinsEarned: coinReward.coinsEarned,
          totalCoins: coinReward.totalCoins,
          playerWon: playerWon,
          loot: loot
        });
        setShowVictoryRewards(true);
        
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
            secureStorage.setItem('playerProfile', playerProfile);
            
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
    setShowCharacterSelection(true);
  };

  const handleStoryModeBack = () => {
    setShowStoryMode(false);
    setShowCharacterSelection(true);
  };

  const handleTutorialMode = () => {
    console.log('🎓 Tutorial Mode clicked');
    setShowMainMenu(false);
    setShowSplash(false);
    setShowTutorialMode(true);
  };

  const handleTutorialComplete = () => {
    console.log('✅ Tutorial completed');
    setShowTutorialMode(false);
    setShowMainMenu(true);
    localStorage.setItem('tutorialCompleted', 'true');
  };

  const handleTutorialExit = () => {
    console.log('❌ Tutorial exited');
    setShowTutorialMode(false);
    setShowMainMenu(true);
  };

  const handleStartStoryBattle = async (opponentKey, stageNumber) => {
    setStoryModeStage(stageNumber);
    setCurrentOpponent(opponentKey);
    setShowStoryMode(false);
    
    // Reset rewards flag for new game
    setRewardsAwarded(false);
    
    // Set arena theme based on story mode opponent
    const storyArenaTheme = getStoryModeArenaTheme(opponentKey);
    const currentThemes = JSON.parse(localStorage.getItem('playerThemes')) || {};
    currentThemes.arenaTheme = storyArenaTheme;
    localStorage.setItem('playerThemes', JSON.stringify(currentThemes));
    
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

  const handleSinglePlayer = async (playerName, aiPersonality = 'CHAOS', strategicMode = null) => {
    console.log('🎯 Single player mode selected:', { playerName, aiPersonality, strategicMode });
    // Store selection info and show character selection
    setCurrentOpponent(aiPersonality);
    setPlayerProfile({ ...playerProfile, name: playerName });
    
    // Update settings - either set strategic mode or explicitly remove it
    if (strategicMode && typeof strategicMode === 'object') {
      console.log('✅ Setting strategic mode:', strategicMode);
      setSettings(prev => ({ ...prev, strategicMode }));
    } else {
      console.log('❌ Clearing strategic mode');
      setSettings(prev => {
        const newSettings = { ...prev };
        delete newSettings.strategicMode;
        return newSettings;
      });
    }
    
    setShowLobby(false);
    setShowCharacterSelection(true);
  };

  const startSinglePlayerGame = async (playerName, aiPersonality) => {
    console.log('🎯 Starting single player game:', { playerName, aiPersonality });
    try {
      // Reset rewards flag for new game
      setRewardsAwarded(false);
      
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
          secureStorage.setItem('playerProfile', updatedProfile);
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
      // Reset rewards flag for new game
      setRewardsAwarded(false);
      
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

  const handleFuseCards = (cardIndex1, cardIndex2, fusedCard) => {
    console.log('🔮 Fusing cards:', { cardIndex1, cardIndex2, fusedCard });
    
    // FIRST: Update the mock game state in gameClient synchronously
    if (roomId && gameClient.mockState.rooms[roomId]) {
      const mockRoom = gameClient.mockState.rooms[roomId];
      const mockPlayer = mockRoom.players.find(p => p.id === playerId);
      if (mockPlayer) {
        // Remove the two fused cards (remove higher index first to avoid index shift)
        const indices = [cardIndex1, cardIndex2].sort((a, b) => b - a);
        indices.forEach(index => {
          mockPlayer.hand.splice(index, 1);
        });
        
        // Add the fused card to hand
        mockPlayer.hand.push(fusedCard);
        
        // Update card count
        mockPlayer.cardCount = mockPlayer.hand.length + (mockPlayer.deck?.length || 0);
        
        console.log('✅ Mock state updated with fusion (synchronous)');
      }
    }
    
    // THEN: Update React state to reflect changes in UI
    setGameState(prevState => {
      const newState = { ...prevState };
      const currentPlayer = newState.players.find(p => p.id === playerId);
      
      if (currentPlayer) {
        // Remove the two fused cards (remove higher index first to avoid index shift)
        const indices = [cardIndex1, cardIndex2].sort((a, b) => b - a);
        indices.forEach(index => {
          currentPlayer.hand.splice(index, 1);
        });
        
        // Add the fused card to hand
        currentPlayer.hand.push(fusedCard);
        
        // Update card count
        currentPlayer.cardCount = currentPlayer.hand.length + (currentPlayer.deck?.length || 0);
        
        console.log('✨ Updated hand after fusion:', currentPlayer.hand);
      }
      
      return newState;
    });
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
      // Store who goes first for potential future use
      setFirstPlayer(playerWon ? playerId : gameState?.players?.find(p => p.id !== playerId)?.id);
      
      // Complete the coin toss in the backend
      const result = await gameClient.completeCoinToss(roomId, playerId);
      if (result && result.success) {
        console.log('✅ Coin toss completed, proceeding to card selection');
      } else {
        console.error('❌ Failed to complete coin toss');
      }
    }
  };

  const handlePlayAgain = () => {
    // Reset rewards flag for new game
    setRewardsAwarded(false);
    
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
    setShowCharacterSelection(false);
    setSelectedCharacter(null);
  };

  const handleCharacterSelect = async (character) => {
    setSelectedCharacter(character);
    setShowCharacterSelection(false);
    
    // Check if coming from lobby or story mode
    if (currentOpponent) {
      // From lobby - start the actual game
      const playerName = playerProfile?.name || 'Player 1';
      const aiPersonality = currentOpponent;
      await startSinglePlayerGame(playerName, aiPersonality);
    } else {
      // From story mode - show story mode campaign screen
      setShowStoryMode(true);
    }
  };

  const handleBackFromCharacterSelection = () => {
    setShowCharacterSelection(false);
    setSelectedCharacter(null);
    
    // Return to either lobby or main menu based on where we came from
    if (currentOpponent) {
      // Came from lobby
      setShowLobby(true);
      setCurrentOpponent(null);
    } else {
      // Came from story mode
      setShowMainMenu(true);
    }
  };

  const handleVictoryRewardsContinue = () => {
    setShowVictoryRewards(false);
    setVictoryRewardsData(null);
    // Game over screen will now be visible
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

  // Loading fallback for lazy-loaded components
  const LoadingFallback = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontSize: '1.5rem',
      color: 'var(--primary-color, #4a9eff)'
    }}>
      Loading...
    </div>
  );

  return (
    <div className="App" data-testid="app-container">
      {/* Brand Screen */}
      {showBrandScreen && <BrandScreen onComplete={() => {
        setShowBrandScreen(false);
        setShowSplash(true);
      }} />}
      
      {/* Only show other content when brand screen is done */}
      {!showBrandScreen && (
        <>
          {/* Splash Screen */}
          {showSplash && <SplashScreen onComplete={handleSplashComplete} isReturning={isReturningToSplash} />}
          
          {/* PWA Install Prompt - Only show on main menu */}
          {!showSplash && showMainMenu && !inGame && !showSettings && !showTutorial && !showStats && !showProfile && !showThemeShop && (
            <Suspense fallback={null}>
              <InstallPrompt />
            </Suspense>
          )}
      
      {/* Tutorial Mode */}
      {showTutorialMode && (
        <Suspense fallback={<LoadingFallback />}>
          <TutorialMode 
            onComplete={handleTutorialComplete}
            onExit={handleTutorialExit}
            playerProfile={playerProfile}
          />
        </Suspense>
      )}

      {/* Credits */}
      {showCredits && (
        <Suspense fallback={<LoadingFallback />}>
          <Credits onClose={handleCloseCredits} />
        </Suspense>
      )}
      
      {/* Overlay Components - Always Available */}
      <Suspense fallback={null}>
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
      </Suspense>
      
      {/* Theme Shop Modal */}
      {showThemeShop && (
        <Suspense fallback={<LoadingFallback />}>
          <ThemeShop onClose={() => setShowThemeShop(false)} />
        </Suspense>
      )}
      
      {/* Inventory Modal */}
      {showInventory && (
        <Suspense fallback={<LoadingFallback />}>
          <Inventory 
            inventory={playerInventory}
            onUseConsumable={handleUseConsumable}
            onEquipItem={handleEquipItem}
            onUnequipItem={handleUnequipItem}
            onAddToActiveDeck={handleAddToActiveDeck}
            onClose={() => setShowInventory(false)}
          />
        </Suspense>
      )}
      
      {/* Player Profile Modal */}
      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowProfile(false)}>✕</button>
            <Suspense fallback={<LoadingFallback />}>
              <PlayerProfile 
                player={gameState?.players?.find(p => !p.isAI) || { name: playerProfile.name || 'Player' }}
                isAI={false}
                stats={playerProfile}
                onUpdateProfile={(updates) => {
                  const updatedProfile = { ...playerProfile, ...updates };
                  setPlayerProfile(updatedProfile);
                  updateProfile(updatedProfile);
                }}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* News Modal */}
      {showNews && (
        <Suspense fallback={<LoadingFallback />}>
          <NewsModal onClose={() => setShowNews(false)} />
        </Suspense>
      )}

      {/* Main Menu */}
      {!showSplash && showMainMenu && !inGame ? (
        <MainMenu
          onPlayGame={handlePlayGame}
          onStoryMode={handleStoryMode}
          onTutorialMode={handleTutorialMode}
          onShowTutorial={() => setShowTutorial(true)}
          onShowStats={() => setShowStats(true)}
          onShowProfile={() => setShowProfile(true)}
          onShowNews={() => setShowNews(true)}
          onShowThemeShop={() => setShowThemeShop(true)}
          onShowInventory={() => setShowInventory(true)}
          onShowSettings={() => setShowSettings(true)}
          onQuit={handleQuit}
        />
      ) : !showSplash && showStoryMode && !inGame ? (
        <Suspense fallback={<LoadingFallback />}>
          <StoryMode
            onStartBattle={handleStartStoryBattle}
            onBack={handleStoryModeBack}
            storyProgress={{
              currentStage: completedStoryStages.length > 0 ? Math.max(...completedStoryStages) : 0,
              completedStages: completedStoryStages,
              unlockedChapters: [1],
              choices: {},
              unlockedBackstories: ['DONOVAN_RAGE'],
              unlockedSecretBosses: [],
              difficulty: 'warrior'
            }}
          />
        </Suspense>
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
          {/* Top-right menu buttons - hide during active gameplay, character selection, card selection, and tutorial mode */}
          {(!inGame || gameState?.gameOver) && !showCharacterSelection && !gameState?.cardSelectionPhase && !showTutorialMode && (
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

          {/* Victory Rewards Screen */}
          {showVictoryRewards && victoryRewardsData ? (
            <Suspense fallback={<LoadingFallback />}>
              <VictoryRewards
                coinsEarned={victoryRewardsData.coinsEarned}
                totalCoins={victoryRewardsData.totalCoins}
                playerWon={victoryRewardsData.playerWon}
                onContinue={handleVictoryRewardsContinue}
              />
            </Suspense>
          ) : showCharacterSelection && !showTutorialMode ? (
            <Suspense fallback={<LoadingFallback />}>
              <CharacterSelection
                onSelectCharacter={handleCharacterSelect}
                onCancel={handleBackFromCharacterSelection}
                isStoryMode={!currentOpponent}
              />
            </Suspense>
          ) : gameState?.cardSelectionPhase && !gameState?.gameStarted && !showTutorialMode ? (
            <Suspense fallback={<LoadingFallback />}>
              <CardSelection
                hand={gameState.players?.find(p => p.id === playerId)?.hand || []}
                onConfirmSelection={handleSelectCards}
                onBack={handleBackFromCardSelection}
                selectedCharacter={selectedCharacter}
              />
            </Suspense>
          ) : showCoinToss ? (
            <Suspense fallback={<LoadingFallback />}>
              <CoinToss
                playerName={gameState?.players?.find(p => p.id === playerId)?.name || 'Player'}
                opponentName={gameState?.players?.find(p => p.id !== playerId)?.name || 'Opponent'}
                onComplete={handleCoinTossComplete}
              />
            </Suspense>
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
              onFuseCards={handleFuseCards}
              settings={settings}
              isStoryMode={!!storyModeStage}
              selectedCharacter={selectedCharacter}
            />
          )}
        </>
      ) : null}
          
          {/* Donation Banner - Only show on main menu */}
          {showDonationBanner && !showSplash && showMainMenu && !inGame && !showSettings && !showTutorial && !showStats && !showProfile && !showThemeShop && !showStoryMode && !showCredits && !showLobby && (
            <Suspense fallback={null}>
              <DonationBanner 
                onClose={() => setShowDonationBanner(false)}
              />
            </Suspense>
          )}
        </>
      )}
    </div>
  );
}

export default App;

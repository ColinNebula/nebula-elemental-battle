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
import userPreferences from './utils/userPreferences';
import gameProgress from './utils/gameProgress';

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
  const mainMenuMusicRef = useRef(null);
  const audioUnlockedRef = useRef(false);
  const [showAudioPrompt, setShowAudioPrompt] = useState(false);

  // Initialize mobile screen manager and sound system
  useEffect(() => {
    mobileScreenManager.init();
    soundManager.init();
    
    return () => {
      mobileScreenManager.destroy();
    };
  }, []);

  // Unlock audio on first user interaction (required for mobile/iOS)
  useEffect(() => {
    const unlockAudio = async () => {
      if (!audioUnlockedRef.current) {
        try {
          // iOS requires audio elements to be created during user interaction
          const silentAudio = new Audio();
          // Use a valid minimal MP3 base64 - empty audio
          silentAudio.src = 'data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAESAAzMzMzMzMzMzMzMzMzMzMzMzMzZmZmZmZmZmZmZmZmZmZmZmZmZmb/////////////////////////////////////////////8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAARDRbfmwAAAAAAAAAAAAAAAAAAAA//sUxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUxDsAAANIAAAAAAAAADSAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
          silentAudio.volume = 0.01; // iOS won't play with 0 volume
          silentAudio.setAttribute('playsinline', 'true');
          
          // Load the audio first (important for iOS)
          await new Promise((resolve) => {
            silentAudio.addEventListener('loadeddata', resolve, { once: true });
            silentAudio.load();
          });
          
          // Play silent audio to unlock
          await silentAudio.play();
          console.log('🔊 Audio context unlocked for mobile/iOS');
          audioUnlockedRef.current = true;
          
          // Resume soundManager's persistent AudioContext (for Web Audio API sounds)
          await soundManager.resumeAudioContext();
          
          // Now try to play any pending music
          if (lobbyMusicRef.current && lobbyMusicRef.current.paused) {
            lobbyMusicRef.current.play().catch(err => console.log('Music play after unlock:', err.message));
          }
          
          // Try to start background music if it exists
          if (soundManager.backgroundMusic && soundManager.backgroundMusic.paused) {
            soundManager.backgroundMusic.play().catch(err => console.log('Background music play after unlock:', err.message));
          }
          
          // Mark sound manager as unlocked
          soundManager.audioUnlocked = true;
          
          // Try to start any queued music
          if (soundManager.tryStartMusic) {
            soundManager.tryStartMusic();
          }
          
          // Hide audio prompt if it was showing
          setShowAudioPrompt(false);
        } catch (err) {
          console.log('Audio unlock will retry on next interaction:', err.message || err);
          // Show audio prompt for mobile users
          if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            setShowAudioPrompt(true);
          }
        }
      }
    };

    // Listen for first user interaction - use more events for better mobile coverage
    const events = ['touchstart', 'touchend', 'mousedown', 'keydown', 'click'];
    events.forEach(event => {
      document.addEventListener(event, unlockAudio, { once: true, passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, unlockAudio);
      });
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
        console.log('[APP] Attempting to recover corrupted data...');
        
        // Attempt to recover corrupted data by removing and reinitializing
        integrity.invalid.forEach(key => {
          try {
            localStorage.removeItem(key);
            console.log(`[APP] Removed corrupted key: ${key}`);
            
            // Reinitialize playerProfile if it was corrupted
            if (key === 'playerProfile') {
              const defaultProfile = {
                name: 'Player',
                gamesPlayed: 0,
                gamesWon: 0,
                tutorialCompleted: false,
                selectedAvatar: null,
                settings: {
                  soundEnabled: true,
                  musicEnabled: true
                }
              };
              secureStorage.setItem('playerProfile', JSON.stringify(defaultProfile));
              console.log('[APP] Reinitialized playerProfile with defaults');
            }
          } catch (err) {
            console.error(`[APP] Failed to recover ${key}:`, err);
          }
        });
        
        securityManager.logSecurityEvent('corrupted_data_recovered', {
          keys: integrity.invalid
        });
        
        console.log('[APP] Data recovery complete');
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
    // Try gameProgress first (unified storage), fall back to legacy recovery
    const progress = gameProgress.getGameProgress();
    if (progress.completedStoryStages && progress.completedStoryStages.length > 0) {
      return progress.completedStoryStages;
    }
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
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    // Try multiple sources to find saved avatar
    console.log('🎮 [INIT] Loading saved avatar...');
    
    // 0. Try direct localStorage first (most reliable, no encryption)
    try {
      const directSaved = localStorage.getItem('savedAvatar');
      if (directSaved) {
        const parsed = JSON.parse(directSaved);
        console.log('🎮 [INIT] Found savedAvatar in localStorage:', parsed);
        if (parsed && (parsed.id || parsed.icon)) {
          return parsed;
        }
      }
    } catch (e) {
      console.log('🎮 [INIT] Could not parse savedAvatar:', e);
    }
    
    // 1. Try userPreferences first (primary storage)
    const savedAvatar = userPreferences.getAvatar();
    console.log('🎮 [INIT] userPreferences.getAvatar():', savedAvatar);
    if (savedAvatar && (savedAvatar.id || savedAvatar.icon)) {
      console.log('🎮 [INIT] Loaded saved avatar from preferences:', savedAvatar.name || savedAvatar.icon);
      return savedAvatar;
    }
    
    // 2. Fallback to playerProfile
    const profile = recoverProfile();
    console.log('🎮 [INIT] recoverProfile() selectedAvatar:', profile?.selectedAvatar);
    if (profile?.selectedAvatar && (profile.selectedAvatar.id || profile.selectedAvatar.icon)) {
      console.log('🎮 [INIT] Loaded saved avatar from profile:', profile.selectedAvatar.name || profile.selectedAvatar.icon);
      // Also save to userPreferences for future consistency
      userPreferences.updateAvatar(profile.selectedAvatar);
      return profile.selectedAvatar;
    }
    
    // 3. Try direct secureStorage as last resort
    const directProfile = secureStorage.getItem('playerProfile');
    console.log('🎮 [INIT] secureStorage playerProfile:', directProfile);
    console.log('🎮 [INIT] directProfile.selectedAvatar:', directProfile?.selectedAvatar);
    console.log('🎮 [INIT] directProfile.avatar:', directProfile?.avatar);
    
    if (directProfile?.selectedAvatar && (directProfile.selectedAvatar.id || directProfile.selectedAvatar.icon)) {
      console.log('🎮 [INIT] Loaded saved avatar from direct storage:', directProfile.selectedAvatar.name || directProfile.selectedAvatar.icon);
      userPreferences.updateAvatar(directProfile.selectedAvatar);
      return directProfile.selectedAvatar;
    }
    
    // 4. Check for legacy avatar format (just an emoji string)
    if (directProfile?.avatar && typeof directProfile.avatar === 'string') {
      const legacyAvatar = { id: 'legacy', name: 'Avatar', icon: directProfile.avatar, element: 'NEUTRAL' };
      console.log('🎮 [INIT] Loaded legacy avatar from profile:', legacyAvatar);
      userPreferences.updateAvatar(legacyAvatar);
      return legacyAvatar;
    }
    
    console.log('🎮 [INIT] No saved avatar found, will show selection on first play');
    return null;
  });
  const [showVictoryRewards, setShowVictoryRewards] = useState(false);
  const [victoryRewardsData, setVictoryRewardsData] = useState(null);
  const [playerProfile, setPlayerProfile] = useState(() => {
    const profile = recoverProfile();
    // Also check localStorage for saved player name
    const savedName = localStorage.getItem('playerName');
    if (savedName && profile) {
      profile.name = savedName;
    }
    return profile;
  });
  const [gameStartTime, setGameStartTime] = useState(null);
  const [lastRoundWinner, setLastRoundWinner] = useState(null);
  const [rewardsAwarded, setRewardsAwarded] = useState(false);
  const [playerInventory, setPlayerInventory] = useState(() => {
    const saved = secureStorage.getItem('playerInventory');
    return saved ? PlayerInventory.fromJSON(saved) : createDefaultInventory();
  });
  const [settings, setSettings] = useState(() => {
    // Load from userPreferences system first
    const prefs = userPreferences.getUserPreferences();
    const accessibilitySettings = initializeAccessibility();
    
    // Merge preferences with accessibility settings
    const baseSettings = {
      soundEnabled: prefs.soundEnabled,
      musicEnabled: prefs.musicEnabled,
      animationsEnabled: prefs.animationsEnabled,
      timerEnabled: prefs.timerEnabled,
      keyboardEnabled: prefs.keyboardEnabled,
      colorblindMode: prefs.colorblindMode || accessibilitySettings.colorblindMode,
      highContrast: prefs.highContrast !== undefined ? prefs.highContrast : accessibilitySettings.highContrast,
      textSize: prefs.textSize || accessibilitySettings.textSize,
      showElementIcons: prefs.showElementIcons !== undefined ? prefs.showElementIcons : accessibilitySettings.showElementIcons,
      difficulty: prefs.difficulty,
      gameSpeed: prefs.gameSpeed,
      autoSortHand: prefs.autoSortHand,
      particleEffects: prefs.particleEffects,
      screenShake: prefs.screenShake,
      showStats: prefs.showStats,
      showTooltips: prefs.showTooltips,
      confirmActions: prefs.confirmActions,
      autoEndTurn: prefs.autoEndTurn
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
    
    if (shouldPlayLobbyMusic && !lobbyMusicRef.current && settings.musicEnabled) {
      // Start lobby music
      lobbyMusicRef.current = new Audio(`${process.env.PUBLIC_URL}/Spooky_Loop.mp3`);
      lobbyMusicRef.current.volume = 0.3;
      lobbyMusicRef.current.loop = true;
      // iOS compatibility
      lobbyMusicRef.current.setAttribute('playsinline', 'true');
      lobbyMusicRef.current.setAttribute('webkit-playsinline', 'true');
      lobbyMusicRef.current.preload = 'auto';
      
      // Try to play, but handle mobile autoplay restrictions gracefully
      const playPromise = lobbyMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Lobby music autoplay prevented (will play on user interaction):', err);
          // Music will automatically play after first user interaction via unlockAudio
        });
      }
    } else if (!shouldPlayLobbyMusic && lobbyMusicRef.current) {
      // Stop lobby music when leaving lobby screens
      lobbyMusicRef.current.pause();
      lobbyMusicRef.current = null;
    }
    
    // Update volume if music is already playing
    if (lobbyMusicRef.current && !lobbyMusicRef.current.paused) {
      lobbyMusicRef.current.volume = settings.musicEnabled ? 0.3 : 0;
    }
    
    // Play main menu music (Cooler Heads Prevail only)
    if (shouldPlayMainMenuMusic && settings.musicEnabled && !mainMenuMusicRef.current) {
      // Play specific main menu track
      mainMenuMusicRef.current = new Audio(`${process.env.PUBLIC_URL}/Cooler_Heads_Prevail.mp3`);
      mainMenuMusicRef.current.volume = 0.3;
      mainMenuMusicRef.current.loop = true;
      // iOS compatibility
      mainMenuMusicRef.current.setAttribute('playsinline', 'true');
      mainMenuMusicRef.current.setAttribute('webkit-playsinline', 'true');
      mainMenuMusicRef.current.preload = 'auto';
      
      const playPromise = mainMenuMusicRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.log('Main menu music autoplay prevented (will play on user interaction):', err);
        });
      }
    } else if (!shouldPlayMainMenuMusic && mainMenuMusicRef.current) {
      // Stop main menu music when leaving main menu
      mainMenuMusicRef.current.pause();
      mainMenuMusicRef.current = null;
    }
    
    // Stop soundManager music when not in game
    if (!inGame && !gameState?.gameStarted) {
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

  // Sync selectedCharacter with userPreferences on mount
  useEffect(() => {
    const savedAvatar = userPreferences.getAvatar();
    if (savedAvatar && savedAvatar.id) {
      console.log('🔄 Syncing avatar from preferences:', savedAvatar.name);
      setSelectedCharacter(savedAvatar);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const savedAvatar = localStorage.getItem('savedAvatar');
      const playerName = localStorage.getItem('playerName');
      
      // Clear only cache data - preserve all user data keys
      const keysToPreserve = [
        'playerThemes', 'playerProfile', 'storyModeProgress', 'storyModeBackup', 
        'tutorialCompleted', 'gameSettings', '_encKey', 'checksums',
        'savedAvatar', 'playerName', 'userPreferences', 'gameProgress',
        'elementalBattleStats', 'profileBackup', 'gameProgressBackup', 'settingsBackup',
        'secureStorageMigrated', 'appVersion'
      ];
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
      if (savedAvatar) localStorage.setItem('savedAvatar', savedAvatar);
      if (playerName) localStorage.setItem('playerName', playerName);
      
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


  // Save settings to userPreferences whenever they change
  useEffect(() => {
    userPreferences.updatePreferences(settings);
    // Also update legacy gameSettings for backwards compatibility
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
      // Alt+S to open settings (only when not in active game)
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
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
      // Alt+U to open profile (only when not in active game)
      if (e.altKey && (e.key === 'u' || e.key === 'U')) {
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
        
        // Record game result in unified gameProgress system
        gameProgress.recordGameResult({
          won: playerWon === true,
          lost: playerWon === false,
          tied: playerWon === null
        });
        
        // Add coins to unified progress
        if (coinReward.coinsEarned > 0) {
          gameProgress.addCoins(coinReward.coinsEarned, storyModeStage ? 'story_mode_win' : 'game_win');
        }
        
        // Mark rewards as awarded for this game
        setRewardsAwarded(true);
        
        if (coinReward.coinsEarned > 0) {
          console.log(`🪙 Earned ${coinReward.coinsEarned} coins! Total: ${coinReward.totalCoins}`);
        }
        
        // Award loot for winning or completing matches
        let loot = [];
        if (playerWon === true || playerWon === null) {
          const playerLevel = Math.floor((playerProfile.gamesPlayed || 0) / 10) + 1;
          // Pass currentOpponent for special story boss rewards
          loot = generateLoot(playerLevel, playerWon === true, currentOpponent);
          
          loot.forEach(item => {
            if (item.type === 'currency') {
              playerInventory.addCurrency(item.amount);
              console.log(`💰 Earned ${item.amount} gold!`);
            } else {
              playerInventory.addItem(item);
              console.log(`✨ Obtained: ${item.name} (${item.rarity})`);
              
              // Special notification for Blackhole card and track unlock
              if (item.id === 'blackhole') {
                console.log('🌌🕳️ LEGENDARY BLACKHOLE CARD UNLOCKED! Defeat Chaos to obtain this exclusive weapon of mass destruction!');
                gameProgress.unlockCard('blackhole');
              }
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
            
            // Save to unified gameProgress system (primary)
            gameProgress.completeStoryStage(storyModeStage);
            
            // Also save to legacy locations for backwards compatibility
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
    // Save to unified gameProgress system
    gameProgress.completeTutorial();
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
    
    // Restore saved avatar and player name from storage
    try {
      const savedAvatar = localStorage.getItem('savedAvatar');
      if (savedAvatar) {
        const parsed = JSON.parse(savedAvatar);
        if (parsed && (parsed.id || parsed.icon)) {
          setSelectedCharacter(parsed);
          console.log('🎮 Restored saved avatar on quit:', parsed.name);
        }
      }
      const savedName = localStorage.getItem('playerName');
      if (savedName && playerProfile) {
        setPlayerProfile(prev => ({ ...prev, name: savedName }));
        console.log('🎮 Restored saved player name on quit:', savedName);
      }
    } catch (e) {
      console.log('Could not restore avatar/name:', e);
    }
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
        // Remove the two fused cards by creating new array without mutating
        const indices = [cardIndex1, cardIndex2].sort((a, b) => b - a);
        const newHand = mockPlayer.hand.filter((_, idx) => !indices.includes(idx));
        
        // Add the fused card to hand
        newHand.push(fusedCard);
        mockPlayer.hand = newHand;
        
        // Update card count
        mockPlayer.cardCount = mockPlayer.hand.length + (mockPlayer.deck?.length || 0);
        
        console.log('✅ Mock state updated with fusion (synchronous)', { handSize: mockPlayer.hand.length });
      }
    }
    
    // THEN: Update React state to reflect changes in UI
    setGameState(prevState => {
      if (!prevState) return prevState;
      
      // Create deep copy to avoid mutation
      const newState = {
        ...prevState,
        players: prevState.players.map(player => {
          if (player.id === playerId) {
            // Remove the two fused cards by creating new array
            const indices = [cardIndex1, cardIndex2].sort((a, b) => b - a);
            const newHand = player.hand.filter((_, idx) => !indices.includes(idx));
            
            // Add the fused card to the new hand
            newHand.push(fusedCard);
            
            console.log('✨ Updated hand after fusion:', {
              oldHandSize: player.hand.length,
              newHandSize: newHand.length,
              fusedCard: fusedCard.name
            });
            
            return {
              ...player,
              hand: newHand,
              cardCount: newHand.length + (player.deck?.length || 0)
            };
          }
          return player;
        })
      };
      
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

  const handleReviveFromGraveyard = async (cardIndex) => {
    if (roomId) {
      const result = await gameClient.reviveFromGraveyard(roomId, playerId, cardIndex);
      if (result?.success) {
        // Immediately fetch updated game state to show the revived card
        gameClient.getGameState(roomId);
        return result;
      } else {
        return { success: false, error: result?.error || 'Failed to revive card' };
      }
    }
    return { success: false, error: 'No room ID' };
  };

  const handleBackFromCardSelection = () => {
    // Clear game state interval
    if (window.gameStateInterval) {
      clearInterval(window.gameStateInterval);
    }
    // Reset to main menu but preserve avatar
    setInGame(false);
    setRoomId(null);
    setGameState(null);
    setGameStartTime(null);
    setShowMainMenu(true);
    setShowCharacterSelection(false);
    // Don't reset selectedCharacter - preserve the saved avatar
  };

  const handleCharacterSelect = async (character) => {
    setSelectedCharacter(character);
    setShowCharacterSelection(false);
    
    // Save character to both userPreferences and playerProfile
    const avatarData = {
      id: character.id,
      name: character.name,
      image: character.image,
      icon: character.icon,
      element: character.element
    };
    
    // Update userPreferences system (primary storage)
    userPreferences.updateAvatar(avatarData);
    
    // Save directly to localStorage (most reliable)
    localStorage.setItem('savedAvatar', JSON.stringify(avatarData));
    
    // Update playerProfile for backwards compatibility
    const updatedProfile = {
      ...playerProfile,
      selectedAvatar: avatarData,
      avatar: character.icon || character.name
    };
    setPlayerProfile(updatedProfile);
    secureStorage.setItem('playerProfile', updatedProfile);
    console.log('💾 Saved avatar to profile, preferences, and localStorage:', character.name);
    
    // Update selectedCharacter state
    setSelectedCharacter(avatarData);
    
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
    
    // Restore saved avatar from storage instead of clearing it
    try {
      const savedAvatar = localStorage.getItem('savedAvatar');
      if (savedAvatar) {
        const parsed = JSON.parse(savedAvatar);
        if (parsed && (parsed.id || parsed.icon)) {
          setSelectedCharacter(parsed);
          console.log('🎮 Restored saved avatar on back:', parsed.name);
        }
      } else {
        setSelectedCharacter(null);
      }
    } catch (e) {
      setSelectedCharacter(null);
    }
    
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
                  // Update avatar in userPreferences if avatar changed
                  if (updates.avatar) {
                    const avatarData = {
                      id: 'custom',
                      name: 'Custom Avatar',
                      icon: updates.avatar,
                      element: 'NEUTRAL'
                    };
                    console.log('🎭 [APP] Saving avatar to userPreferences:', avatarData);
                    userPreferences.updateAvatar(avatarData);
                    
                    // Also update selectedCharacter to reflect on main menu
                    setSelectedCharacter(avatarData);
                    
                    // Also save to playerProfile directly for MainMenu fallback
                    const currentProfile = secureStorage.getItem('playerProfile') || {};
                    currentProfile.selectedAvatar = avatarData;
                    currentProfile.avatar = updates.avatar;
                    secureStorage.setItem('playerProfile', currentProfile);
                    console.log('🎭 [APP] Also saved to playerProfile:', currentProfile);
                    
                    // DIRECT localStorage backup (bypasses encryption for debugging)
                    localStorage.setItem('savedAvatar', JSON.stringify(avatarData));
                    console.log('🎭 [APP] Also saved directly to localStorage savedAvatar');
                    
                    // Force dispatch event to update MainMenu
                    window.dispatchEvent(new CustomEvent('userPreferencesUpdated', { 
                      detail: { selectedAvatar: avatarData }
                    }));
                    console.log('🎭 [APP] Dispatched userPreferencesUpdated event');
                  }
                  
                  const updatedProfile = { ...playerProfile, ...updates };
                  setPlayerProfile(updatedProfile);
                  
                  console.log('✅ Profile updated, avatar synced to main menu');
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
          playerAvatar={selectedCharacter}
          playerName={playerProfile?.name || 'Player'}
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
                playerAvatar={selectedCharacter?.image || selectedCharacter?.icon || '👤'}
                opponentName={gameState?.players?.find(p => p.id !== playerId)?.name || 'Opponent'}
                opponentAvatar={gameState?.players?.find(p => p.id !== playerId)?.avatarImage || gameState?.players?.find(p => p.id !== playerId)?.avatar || '🤖'}
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
              onReviveFromGraveyard={handleReviveFromGraveyard}
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
          
          {/* Audio Enable Prompt for Mobile */}
          {showAudioPrompt && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 99999,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '30px 40px',
              borderRadius: '20px',
              border: '3px solid #ffd700',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8)',
              textAlign: 'center',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔊</div>
              <h2 style={{ margin: '0 0 15px 0', color: 'white', fontSize: '24px' }}>Enable Sound</h2>
              <p style={{ margin: '0 0 20px 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                Tap to enable music and sound effects
              </p>
              <button
                onClick={async () => {
                  try {
                    const silentAudio = new Audio();
                    silentAudio.src = 'data:audio/mpeg;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAESAAzMzMzMzMzMzMzMzMzMzMzMzMzZmZmZmZmZmZmZmZmZmZmZmZmZmb/////////////////////////////////////////////8AAABhTEFNRTMuMTAwA8MAAAAAAAAAABQgJAUHQQAB9AAAARDRbfmwAAAAAAAAAAAAAAAAAAAA//sUxAADwAABpAAAACAAADSAAAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//sUxDsAAANIAAAAAAAAADSAAAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
                    silentAudio.volume = 0.01;
                    silentAudio.setAttribute('playsinline', 'true');
                    await silentAudio.play();
                    
                    // Resume the soundManager's persistent AudioContext
                    await soundManager.resumeAudioContext();
                    
                    audioUnlockedRef.current = true;
                    soundManager.audioUnlocked = true;
                    
                    if (lobbyMusicRef.current && lobbyMusicRef.current.paused) {
                      lobbyMusicRef.current.play();
                    }
                    if (soundManager.backgroundMusic && soundManager.backgroundMusic.paused) {
                      soundManager.backgroundMusic.play();
                    }
                    if (soundManager.tryStartMusic) {
                      soundManager.tryStartMusic();
                    }
                    
                    setShowAudioPrompt(false);
                    console.log('✅ Audio manually enabled');
                  } catch (error) {
                    console.error('Failed to enable audio:', error);
                  }
                }}
                style={{
                  padding: '15px 40px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #4ecdc4 0%, #44a6b5 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              >
                🎵 Enable Sound
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

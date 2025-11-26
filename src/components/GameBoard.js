import React from 'react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Card from './Card';
import PauseMenu from './PauseMenu';
import RoundAnnouncement from './RoundAnnouncement';
import StatusEffects from './StatusEffects';
import { 
  createParticles, 
  createDamageNumber, 
  triggerScreenShake, 
  createVictoryCelebration,
  createCardDrawAnimation,
  createVictoryPose,
  createEnvironmentalEffect,
  removeEnvironmentalEffect,
  createPhaseTransition,
  createShuffleAnimation,
  createCardFlipAnimation,
  createComboMultiplierAnimation,
  createElementPlayAnimation,
  createEnhancedVictoryPose
} from '../utils/animations';
import {
  handleCriticalHit,
  handleMeteorStrike,
  createElementalWeather,
  applyCardRarityGlow,
  createWinnerVictoryPose,
  createDefeatAnimation,
  applyElementalBackground,
  createSlowMotionReplay,
  isDecisivePlay,
  createEpicMoment
} from '../utils/visualEffects';
import {
  initializeMana,
  regenerateMana,
  spendMana,
  calculateCardManaCost,
  canAffordCard,
  awardComboMana,
  allowOverdraft,
  canOverdraftCard,
  initializeWeather,
  updateWeather,
  applyWeatherModifier,
  initializeTerrain,
  applyTerrainBonus,
  WEATHER_TYPES,
  TERRAIN_TYPES
} from '../utils/strategicSystems';
import ManaDisplay from './ManaDisplay';
import WeatherDisplay from './WeatherDisplay';
import TerrainDisplay from './TerrainDisplay';
import soundManager from '../utils/sounds';
import { getCurrentThemes, HAND_THEMES, ARENA_THEMES } from '../utils/themes';
import advancedMechanics from '../utils/advancedCardMechanics';
import powerUpSystem from '../utils/powerUpSystem';
import './GameBoard.css';
import '../utils/visualEffects.css';
import '../utils/advancedCardMechanics.css';
import '../utils/powerUpSystem.css';

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
  onFuseCards,
  onReviveFromGraveyard,
  settings,
  isStoryMode,
  isTutorial,
  tutorialStep,
  selectedCharacter
}) => {
  // Memoize expensive player lookups
  const currentPlayer = useMemo(() => 
    gameState?.players?.find(p => p.id === currentPlayerId),
    [gameState?.players, currentPlayerId]
  );
  
  const humanPlayer = useMemo(() => 
    gameState?.players?.find(p => !p.isAI),
    [gameState?.players]
  );
  
  const aiPlayer = useMemo(() => 
    gameState?.players?.find(p => p.isAI),
    [gameState?.players]
  );
  
  const isMyTurn = currentPlayer?.active;
  
  // UI State - Consolidated announcements and overlays
  const [uiState, setUIState] = useState({
    showTurnAnnouncement: true,
    showMatchBonus: false,
    showRoundAnnouncement: false,
    showForfeitAnnouncement: false,
    showMeteorStrike: false,
    showInitialArena: false,
    isPaused: false,
    fadeOut: false
  });
  
  // Card and game state
  const [cardPreview, setCardPreview] = useState(null);
  const [pendingCardIndex, setPendingCardIndex] = useState(null);
  const [lastTurnInfo, setLastTurnInfo] = useState({ playerId: null, round: -1 });
  const [turnTimer, setTurnTimer] = useState(20);
  const [hasQuit, setHasQuit] = useState(false);
  const [lastPlayedCards, setLastPlayedCards] = useState([]);
  const [hasAutoSkipped, setHasAutoSkipped] = useState(false);
  const timerIntervalRef = useRef(null);
  
  // Sidebar visibility
  const [sidebarState, setSidebarState] = useState({
    left: false,
    right: false
  });
  
  // Round and meteor state
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
  const [meteorDamageDisplay, setMeteorDamageDisplay] = useState([]);
  const [meteorStrikeInfo, setMeteorStrikeInfo] = useState(null);
  const [defeatCountdown, setDefeatCountdown] = useState(null);
  
  // Theme state
  const [themeState, setThemeState] = useState({
    hand: 'standard',
    arena: 'cosmic'
  });
  
  const [sortBy, setSortBy] = useState('none');
  
  // Strategic Systems State
  const [manaState, setManaState] = useState(() => initializeMana());
  const [weatherState, setWeatherState] = useState(() => initializeWeather());
  const [terrainState, setTerrainState] = useState(null);
  const [strategicSettings, setStrategicSettings] = useState({
    manaEnabled: false,
    weatherEnabled: false,
    terrainEnabled: false,
    selectedTerrain: 'NEUTRAL'
  });
  
  // Advanced Mechanics State
  const [evolutionTracker, setEvolutionTracker] = useState(advancedMechanics.initializeEvolutionTracker());
  const [persistentAbilities, setPersistentAbilities] = useState(advancedMechanics.initializePersistentAbilities());
  const [trapSystem, setTrapSystem] = useState(advancedMechanics.initializeTrapSystem());
  const [comboHistory, setComboHistory] = useState([]);
  const [fusionQueue, setFusionQueue] = useState([]);
  const [showFusionUI, setShowFusionUI] = useState(false);
  const [selectedFusionCards, setSelectedFusionCards] = useState([]);
  const [avatarPersonality, setAvatarPersonality] = useState('warrior'); // warrior, mage, rogue, sage
  const [showTrapUI, setShowTrapUI] = useState(false);
  const [selectedTrapCard, setSelectedTrapCard] = useState(null);
  
  // Power-Up System State
  const [boosterSystem, setBoosterSystem] = useState(() => powerUpSystem?.initializeBoosterSystem?.() || { activeBoosters: [], usedBoosters: [] });
  const [ultimateSystem, setUltimateSystem] = useState(() => powerUpSystem?.initializeUltimateSystem?.('meteor_strike') || { id: 'meteor_strike', selectedUltimate: 'meteor_strike', currentCooldown: 5 });
  const [sideboard, setSideboard] = useState(() => powerUpSystem?.initializeSideboard?.() || { cards: [], maxCards: 5, swapsUsed: 0, maxSwaps: 3 });
  const [equipment, setEquipment] = useState(() => powerUpSystem?.initializeEquipment?.() || { slots: {}, inventory: [], unlockedItems: [], gold: 100 });
  const [showBoosterPanel, setShowBoosterPanel] = useState(false);
  const [showEquipmentPanel, setShowEquipmentPanel] = useState(false);
  const [showEquipmentShop, setShowEquipmentShop] = useState(false);
  const [swapMode, setSwapMode] = useState(false);
  const [selectedSideboardCard, setSelectedSideboardCard] = useState(null);
  const [showEquipmentStats, setShowEquipmentStats] = useState(false);
  
  // Refs
  const gameBoardRef = useRef(null);
  const lastAnnouncedRoundRef = useRef(0);
  const hasShownInitialArenaRef = useRef(false);
  const handCardRefs = useRef({});
  const shownMatchBonuses = useRef(new Set());
  
  // Check if player has any playable cards
  const hasPlayableCards = () => {
    if (!currentPlayer?.hand || currentPlayer.hand.length === 0) return false;
    
    // If mana system is disabled, all cards are playable
    if (!strategicSettings?.manaEnabled) return true;
    
    // Check if at least one card is affordable or overdraftable
    return currentPlayer.hand.some(card => {
      const affordable = canAffordCard(manaState, card);
      const overdraftable = !affordable && canOverdraftCard(manaState, card);
      return affordable || overdraftable;
    });
  };
  
  // Derived values for backward compatibility
  const showTurnAnnouncement = uiState.showTurnAnnouncement;
  const setShowTurnAnnouncement = (val) => setUIState(prev => ({ ...prev, showTurnAnnouncement: val }));
  const showMatchBonus = uiState.showMatchBonus;
  const setShowMatchBonus = (val) => setUIState(prev => ({ ...prev, showMatchBonus: val }));
  const showRoundAnnouncement = uiState.showRoundAnnouncement;
  const setShowRoundAnnouncement = (val) => setUIState(prev => ({ ...prev, showRoundAnnouncement: val }));
  const showForfeitAnnouncement = uiState.showForfeitAnnouncement;
  const setShowForfeitAnnouncement = (val) => setUIState(prev => ({ ...prev, showForfeitAnnouncement: val }));
  const showMeteorStrike = uiState.showMeteorStrike;
  const setShowMeteorStrike = (val) => setUIState(prev => ({ ...prev, showMeteorStrike: val }));
  const showInitialArena = uiState.showInitialArena;
  const setShowInitialArena = (val) => setUIState(prev => ({ ...prev, showInitialArena: val }));
  const isPaused = uiState.isPaused;
  const setIsPaused = (val) => setUIState(prev => ({ ...prev, isPaused: val }));
  const fadeOut = uiState.fadeOut;
  const setFadeOut = (val) => setUIState(prev => ({ ...prev, fadeOut: val }));
  const leftSidebarVisible = sidebarState.left;
  const setLeftSidebarVisible = (val) => setSidebarState(prev => ({ ...prev, left: val }));
  const rightSidebarVisible = sidebarState.right;
  const setRightSidebarVisible = (val) => setSidebarState(prev => ({ ...prev, right: val }));
  const handTheme = themeState.hand;
  const setHandTheme = (val) => setThemeState(prev => ({ ...prev, hand: val }));
  const arenaTheme = themeState.arena;
  const setArenaTheme = (val) => setThemeState(prev => ({ ...prev, arena: val }));

  // Initialize strategic systems from settings
  useEffect(() => {
    console.log('🎮 GameBoard settings:', settings);
    console.log('⚙️ Strategic mode:', settings?.strategicMode);
    
    if (settings?.strategicMode && typeof settings.strategicMode === 'object') {
      console.log('✅ Enabling strategic systems:', settings.strategicMode);
      setStrategicSettings(settings.strategicMode);
      if (settings.strategicMode.manaEnabled === true) {
        setManaState(initializeMana());
      }
      if (settings.strategicMode.weatherEnabled === true) {
        setWeatherState(initializeWeather());
      }
      if (settings.strategicMode.terrainEnabled === true) {
        setTerrainState(initializeTerrain(settings.strategicMode.selectedTerrain));
      }
    } else {
      console.log('❌ No strategic mode detected, using defaults (all disabled)');
      setStrategicSettings({
        manaEnabled: false,
        weatherEnabled: false,
        terrainEnabled: false,
        selectedTerrain: 'NEUTRAL'
      });
    }
  }, [settings]);

  // Load hand theme from localStorage and listen for changes
  useEffect(() => {
    const loadHandTheme = () => {
      const themes = getCurrentThemes();
      setHandTheme(themes.handTheme || 'standard');
      setArenaTheme(themes.arenaTheme || 'cosmic');
    };
    
    loadHandTheme();
    
    // Listen for storage changes (theme updates)
    const handleStorageChange = (e) => {
      if (e.key === 'playerThemes') {
        loadHandTheme();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom theme update event
    const handleThemeUpdate = () => loadHandTheme();
    window.addEventListener('themeUpdated', handleThemeUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeUpdated', handleThemeUpdate);
    };
  }, []);

  // Regenerate mana when turn changes (strategic mode)
  useEffect(() => {
    if (strategicSettings.manaEnabled && isMyTurn && gameState?.gameStarted && !gameState?.gameOver) {
      const equipStats = powerUpSystem?.calculateEquipmentStats?.(equipment) || {};
      const bonusRegen = equipStats.manaRegen || 0;
      
      setManaState(prev => {
        const regenerated = regenerateMana(prev);
        return {
          ...regenerated,
          current: Math.min(regenerated.max, regenerated.current + bonusRegen)
        };
      });
    }
  }, [isMyTurn, strategicSettings.manaEnabled, gameState?.gameStarted, gameState?.gameOver, equipment]);

  // Process persistent abilities each turn
  useEffect(() => {
    if (isMyTurn && gameState?.gameStarted && !gameState?.gameOver) {
      const result = advancedMechanics.processPersistentAbilities(persistentAbilities, currentPlayerId);
      setPersistentAbilities(result.abilities);
      
      // Apply persistent ability effects
      result.effects.forEach(effect => {
        if (effect.type === 'STRENGTH_BOOST' && currentPlayer?.hand) {
          // Boost all cards in hand
          currentPlayer.hand.forEach(card => {
            if (card) card.modifiedStrength = (card.modifiedStrength || card.strength) + effect.value;
          });
        }
      });
    }
  }, [isMyTurn, gameState?.gameStarted, gameState?.gameOver, currentPlayerId]);

  // Tick power-up systems each turn
  useEffect(() => {
    if (isMyTurn && gameState?.gameStarted && !gameState?.gameOver) {
      // Tick booster durations
      setBoosterSystem(prev => powerUpSystem?.tickBoosterSystem?.(prev, currentPlayerId) || prev);
      
      // Tick ultimate cooldown
      setUltimateSystem(prev => powerUpSystem?.tickUltimateCooldown?.(prev) || prev);
    }
  }, [isMyTurn, gameState?.gameStarted, gameState?.gameOver, currentPlayerId]);

  // Update weather every few rounds (strategic mode)
  useEffect(() => {
    if (strategicSettings.weatherEnabled && gameState?.currentRound > lastAnnouncedRoundRef.current) {
      setWeatherState(prev => updateWeather(prev));
    }
  }, [gameState?.currentRound, strategicSettings.weatherEnabled]);

  // Calculate total strength from played cards with strategic modifiers
  const calculateTotalStrength = useCallback((player) => {
    if (!player?.playedCards || player.playedCards.length === 0) return 0;
    return player.playedCards.reduce((total, card) => {
      let strength = card.modifiedStrength || card.strength || 0;
      
      // Apply strategic modifiers if enabled
      if (strategicSettings.weatherEnabled && weatherState?.current) {
        strength += applyWeatherModifier(card, weatherState.current);
      }
      if (strategicSettings.terrainEnabled && terrainState?.current) {
        strength += applyTerrainBonus(card, terrainState.current);
      }
      
      return total + strength;
    }, 0);
  }, [strategicSettings.weatherEnabled, strategicSettings.terrainEnabled, weatherState?.current, terrainState?.current]);

  const humanTotalStrength = useMemo(() => calculateTotalStrength(humanPlayer), [humanPlayer?.playedCards, calculateTotalStrength]);
  const aiTotalStrength = useMemo(() => calculateTotalStrength(aiPlayer), [aiPlayer?.playedCards, calculateTotalStrength]);

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
          if (!cardPlay.card) return; // Safety check
          const cardStrength = cardPlay.card.modifiedStrength || cardPlay.card.strength;
          if (soundManager && cardPlay.card.element) {
            soundManager.playElementSound(cardPlay.card.element);
            soundManager.playSound('cardFlip');
            
            // Play voice line for card play (only for player cards)
            if (cardPlay.playerId === humanPlayer?.id) {
              soundManager.playVoiceLine(avatarPersonality, 'cardPlay');
            }
          }
          
          // Card flip animation
          const cardElements = gameBoardRef.current.querySelectorAll('.played-card');
          if (cardElements[currentPlayedCount - 1 + idx]) {
            const cardEl = cardElements[currentPlayedCount - 1 + idx];
            createCardFlipAnimation(cardEl);
            
            // Apply rarity glow based on card power
            const power = cardPlay.card.modifiedStrength || cardPlay.card.strength;
            applyCardRarityGlow(cardEl, power);
          }
          
          // Particle effects (only if animations enabled)
          if (cardPlay.card.element && settings?.particleEffects !== false) {
            createParticles(cardPlay.card.element, x, y, gameBoardRef.current);
          }
          
          // Power play and combo sounds
          if (cardStrength >= 10) {
            if (soundManager) soundManager.playSound('powerPlay');
            if (settings?.animationsEnabled !== false) {
              createDamageNumber(
                cardPlay.card.modifiedStrength || cardPlay.card.strength, 
                x, 
                y - 50, 
                gameBoardRef.current,
                false,
                false
              );
            }
            
            // Screen shake for powerful plays
            if (settings?.screenShake !== false) {
              triggerScreenShake(gameBoardRef.current);
            }
          }
        }, idx * 200);
      });
      
      setLastPlayedCards(gameState.playedCards);
    }
  }, [gameState?.playedCards?.length, gameBoardRef]);

  // Dynamic music intensity based on game state
  useEffect(() => {
    if (!gameState?.gameStarted || gameState?.gameOver) return;
    
    const playerScore = humanPlayer?.score || 0;
    const opponentScore = aiPlayer?.score || 0;
    const currentRound = gameState?.round || 1;
    const maxRounds = gameState?.maxRounds || 7;
    
    soundManager.updateMusicIntensity(playerScore, opponentScore, currentRound, maxRounds);
  }, [humanPlayer?.score, aiPlayer?.score, gameState?.round, gameState?.maxRounds, gameState?.gameStarted, gameState?.gameOver]);

  // Auto-skip turn if player has no cards
  useEffect(() => {
    if (!gameState?.gameStarted || gameState?.gameOver || !humanPlayer?.active) {
      // Reset auto-skip flag when it's not player's turn
      if (!humanPlayer?.active) {
        setHasAutoSkipped(false);
      }
      return;
    }

    // If it's player's turn and they have no cards, automatically skip (only once)
    if (humanPlayer.hand?.length === 0 && !gameState?.battlePhase && !hasAutoSkipped) {
      console.log('🔄 Player has no cards - auto-skipping turn');
      setHasAutoSkipped(true);
      
      // Small delay so the UI can show the state
      const skipTimer = setTimeout(() => {
        if (onForfeit) {
          onForfeit(); // This will skip the turn without showing forfeit announcement
        }
      }, 1500);
      
      return () => clearTimeout(skipTimer);
    }
  }, [humanPlayer?.active, humanPlayer?.hand?.length, gameState?.gameStarted, gameState?.gameOver, gameState?.battlePhase, onForfeit, hasAutoSkipped]);

  // Story mode defeat countdown
  useEffect(() => {
    if (gameState?.gameOver && isStoryMode && gameState.winner !== humanPlayer?.name && gameState.winner !== 'Tie') {
      // Player lost in story mode - show defeat countdown
      setDefeatCountdown(10);
    } else if (gameState?.gameOver) {
      // Game over in any other scenario - ensure defeatCountdown is null for game over screen
      setDefeatCountdown(null);
    }
  }, [gameState?.gameOver, gameState?.winner, humanPlayer?.name, isStoryMode]);

  // Reset hasQuit when game starts
  useEffect(() => {
    if (gameState?.gameStarted && !gameState?.gameOver) {
      setHasQuit(false);
    }
  }, [gameState?.gameStarted, gameState?.gameOver]);

  // Countdown timer for defeat modal
  useEffect(() => {
    if (defeatCountdown === null) return;

    if (defeatCountdown <= 0) {
      // Fade out and return to main menu
      setFadeOut(true);
      setTimeout(() => {
        setHasQuit(true);
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
        // Check if ref is still valid after timeout
        if (!gameBoardRef.current) return;
        
        const winner = gameState.winner === 'Tie' ? 'Tie' : gameState.winner;
        
        // Award equipment rewards for victory
        if (winner === humanPlayer?.name) {
          const goldReward = 50 + (gameState.currentRound * 10);
          const randomReward = Math.random();
          let itemReward = null;
          
          if (randomReward > 0.7) {
            const availableItems = Object.keys(powerUpSystem.EQUIPMENT_ITEMS).filter(
              id => !equipment.unlockedItems.includes(id)
            );
            if (availableItems.length > 0) {
              itemReward = availableItems[Math.floor(Math.random() * availableItems.length)];
            }
          }
          
          const reward = powerUpSystem.awardEquipmentReward(equipment, itemReward, goldReward);
          if (reward.success) {
            setEquipment(reward.equipment);
            
            // Show reward notification
            if (gameBoardRef.current) {
              const rewardDiv = document.createElement('div');
              rewardDiv.className = 'equipment-reward-notification';
              rewardDiv.innerHTML = `
                <div style="font-size: 24px; color: #ffd700; margin-bottom: 10px;">🏆 VICTORY REWARDS! 🏆</div>
                <div style="font-size: 18px;">+${goldReward} Gold</div>
                ${itemReward ? `<div style="font-size: 20px; color: #ff9800; margin-top: 10px;">🎁 ${powerUpSystem.EQUIPMENT_ITEMS[itemReward].name} UNLOCKED!</div>` : ''}
              `;
              rewardDiv.style.cssText = `
                position: fixed; top: 20%; left: 50%; transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9); color: white; padding: 30px 50px;
                border-radius: 15px; z-index: 10001; text-align: center;
                border: 3px solid #ffd700; box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
                animation: slideInDown 0.5s ease-out;
              `;
              gameBoardRef.current.appendChild(rewardDiv);
              setTimeout(() => rewardDiv.remove(), 4000);
            }
          }
        }
        
        // Play single victory/defeat music and stop all other sounds
        if (soundManager) {
          // Stop all ongoing sounds and music first
          soundManager.stopMusic();
          soundManager.stopAllSounds();
          
          // Wait a moment then play appropriate game over music
          setTimeout(() => {
            if (winner === 'Tie') {
              soundManager.playSound('victory');
            } else if (winner === humanPlayer?.name) {
              // Play victory music only
              soundManager.playSound('victory');
            } else {
              // Play defeat sound only
              soundManager.playSound('defeat');
            }
          }, 300);
        }
        
        // Create enhanced victory pose animation
        createEnhancedVictoryPose(winner, gameBoardRef.current);
        
        // Also create traditional victory celebration
        createVictoryCelebration(winner === 'Tie' ? 'tie' : winner, gameBoardRef.current);
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
        setTurnTimer(20); // Always reset timer on turn change
        
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
        if (soundManager) {
          if (activePlayerId === currentPlayerId) {
            soundManager.playSound('yourTurn');
          } else {
            soundManager.playSound('opponentTurn');
          }
        }
        
        // Keep announcement visible - shorter for AI turn
        const announcementDuration = activePlayerId === currentPlayerId ? 2000 : 1500;
        const timer = setTimeout(() => {
          setShowTurnAnnouncement(false);
        }, announcementDuration);
        
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.players, gameState?.currentRound, gameState?.gameStarted, gameState?.gameOver, showRoundAnnouncement]);

  // Initial Arena Display - Show arena for 6 seconds, then "Battle Begin!", then round announcements
  useEffect(() => {
    if (gameState?.gameStarted && !gameState?.gameOver && !hasShownInitialArenaRef.current) {
      hasShownInitialArenaRef.current = true;
      setShowInitialArena(true);
      
      // Shuffle animation at game start
      if (gameBoardRef.current) {
        const deckElements = gameBoardRef.current.querySelectorAll('.reserve-deck-stack, .vertical-card-stack');
        deckElements.forEach(deck => {
          createShuffleAnimation(deck);
        });
      }
      
      // After 6 seconds, show "Battle Begin!" phase transition
      const battleBeginTimer = setTimeout(() => {
        if (gameBoardRef.current) {
          const battleTransition = createPhaseTransition('⚔️ BATTLE BEGIN! ⚔️', gameBoardRef.current);
          if (battleTransition) {
            battleTransition.classList.add('battle-start-epic');
          }
        }
      }, 6000);
      
      // After 11 seconds total (6s arena + 2s battle begin + 3s delay), hide initial arena and allow round announcements
      const arenaTimer = setTimeout(() => {
        setShowInitialArena(false);
      }, 11000);
      
      return () => {
        clearTimeout(battleBeginTimer);
        clearTimeout(arenaTimer);
      };
    }
    
    // Reset when game ends
    if (gameState?.gameOver) {
      hasShownInitialArenaRef.current = false;
      setShowInitialArena(false);
    }
  }, [gameState?.gameStarted, gameState?.gameOver]);

  // Round Announcement Logic
  useEffect(() => {
    const currentRound = gameState?.currentRound || 0;
    const roundToDisplay = currentRound + 1;
    
    // Only show if: game started, not over, initial arena shown, and this round hasn't been announced yet
    if (gameState?.gameStarted && !gameState?.gameOver && !showInitialArena) {
      if (roundToDisplay !== lastAnnouncedRoundRef.current) {
        // Add a small delay to ensure "Battle Begin!" has fully completed
        const roundAnnouncementTimer = setTimeout(() => {
          lastAnnouncedRoundRef.current = roundToDisplay;
          setCurrentRoundNumber(roundToDisplay);
          setShowRoundAnnouncement(true);
          if (soundManager) soundManager.playSound('yourTurn');
          
          // Add phase transition animation
          if (gameBoardRef.current) {
            createPhaseTransition(`Round ${roundToDisplay}`, gameBoardRef.current);
          }
          
          // Add environmental effects based on arena theme
          if (gameBoardRef.current) {
            // Clear previous environmental effect
            removeEnvironmentalEffect(gameBoardRef.current);
          
          // Add new environmental effect based on arena theme or dominant element
          const effects = ['rain', 'snow', 'leaves', 'embers'];
          const randomEffect = effects[Math.floor(Math.random() * effects.length)];
          
          // Match environmental effect to arena theme if possible
          let effect = randomEffect;
          if (arenaTheme.includes('ice') || arenaTheme.includes('frost')) {
            effect = 'snow';
          } else if (arenaTheme.includes('fire') || arenaTheme.includes('flame')) {
            effect = 'embers';
          } else if (arenaTheme.includes('forest') || arenaTheme.includes('nature')) {
            effect = 'leaves';
          } else if (arenaTheme.includes('water') || arenaTheme.includes('ocean')) {
            effect = 'rain';
          }
          
          createEnvironmentalEffect(effect, gameBoardRef.current);
        }
        }, 500); // Small delay to ensure "Battle Begin!" has completed
        
        return () => clearTimeout(roundAnnouncementTimer);
      }
    }
    
    // Reset when game ends
    if (gameState?.gameOver) {
      lastAnnouncedRoundRef.current = 0;
      if (gameBoardRef.current) {
        removeEnvironmentalEffect(gameBoardRef.current);
      }
    }
  }, [gameState?.currentRound, gameState?.gameStarted, gameState?.gameOver, showInitialArena, arenaTheme]);

  // Background music management - start once when game begins
  useEffect(() => {
    if (!soundManager) return; // Safety check
    
    // Only start music once when game starts
    if (gameState?.gameStarted && !gameState?.gameOver) {
      // Check if music is not already playing
      if (!soundManager.backgroundMusic) {
        soundManager.playMusic('calm');
      }
    }
    
    return () => {
      if (soundManager && gameState?.gameOver) {
        soundManager.stopMusic();
      }
    };
  }, [gameState?.gameStarted, gameState?.gameOver]);

  // Pause/resume background music when game is paused
  useEffect(() => {
    if (!soundManager) return;
    
    if (isPaused) {
      soundManager.pauseMusic();
    } else {
      soundManager.resumeMusic();
    }
  }, [isPaused]);

  // Handle round announcement completion
  const handleRoundAnnouncementComplete = () => {
    console.log('Round announcement complete, hiding and showing turn announcement...');
    setShowRoundAnnouncement(false);
    
    // Show turn announcement after round announcement completes
    const activePlayerId = gameState?.players?.find(p => p.active)?.id;
    if (activePlayerId) {
      setShowTurnAnnouncement(true);
      
      // Play turn sound
      if (soundManager) {
        if (activePlayerId === currentPlayerId) {
          soundManager.playSound('yourTurn');
        } else {
          soundManager.playSound('opponentTurn');
        }
      }
      
      // Keep announcement visible - shorter for AI turn
      const announcementDuration = activePlayerId === currentPlayerId ? 2000 : 1500;
      setTimeout(() => {
        setShowTurnAnnouncement(false);
      }, announcementDuration);
    }
  };

  // Turn timer countdown - starts after turn announcement finishes
  useEffect(() => {
    // Clean up any existing timer
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    // Don't run timer if disabled or game conditions prevent it
    if (!settings?.timerEnabled || gameState?.gameOver || gameState?.pendingAbility || isPaused || showRoundAnnouncement) {
      return;
    }

    // Don't start timer until turn announcement is finished
    if (showTurnAnnouncement) {
      return;
    }

    // Only countdown during player's turn
    if (!isMyTurn) {
      return;
    }
    
    // Wait 1 second after turn announcement finishes before starting countdown
    const startDelay = setTimeout(() => {
      timerIntervalRef.current = setInterval(() => {
        setTurnTimer((prev) => {
          if (prev <= 1) {
            // Clear the interval when timer expires
            if (timerIntervalRef.current) {
              clearInterval(timerIntervalRef.current);
              timerIntervalRef.current = null;
            }
            
            // Check if player has no cards left
            const hasCards = currentPlayer?.hand?.length > 0;
            
            if (!hasCards) {
              // Player has no cards - automatically skip turn without forfeit
              console.log('Turn timer expired - player has no cards, skipping turn');
              
              // Just let the turn pass naturally without forfeit announcement
              if (onForfeit) {
                onForfeit();
              }
            } else {
              // Player has cards but didn't play - this is a forfeit
              console.log('Turn timer expired - forfeiting turn');
              
              // Show forfeit announcement
              setShowForfeitAnnouncement(true);
              setTimeout(() => {
                setShowForfeitAnnouncement(false);
              }, 2000);
              
              // Play timeout sound
              if (soundManager) soundManager.playSound('defeat');
              
              if (onForfeit) {
                onForfeit();
              }
            }
            return 20;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);

    return () => {
      clearTimeout(startDelay);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
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

  // Show element match bonus animation - only once per unique bonus
  useEffect(() => {
    if (gameState?.lastMatchBonus) {
      const bonusKey = `${gameState.lastMatchBonus.element}-${gameState.lastMatchBonus.player}-${gameState.currentRound}`;
      
      // Initialize ref if needed (for hot reload)
      if (!shownMatchBonuses.current) {
        shownMatchBonuses.current = new Set();
      }
      
      if (!shownMatchBonuses.current.has(bonusKey)) {
        shownMatchBonuses.current.add(bonusKey);
        setShowMatchBonus(true);
        const timer = setTimeout(() => {
          setShowMatchBonus(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState?.lastMatchBonus, gameState?.currentRound]);

  // Reset shown bonuses when game restarts
  useEffect(() => {
    if (gameState?.gameStarted && shownMatchBonuses.current) {
      shownMatchBonuses.current.clear();
    }
  }, [gameState?.gameStarted]);

  // Victory pose for winning cards
  useEffect(() => {
    if (!gameState?.playedCards || gameState.playedCards.length < 2) return;
    if (!gameBoardRef.current) return;
    
    // Check if both players have played cards this round
    const humanCard = humanPlayer?.playedCards?.[humanPlayer.playedCards.length - 1];
    const aiCard = aiPlayer?.playedCards?.[aiPlayer.playedCards.length - 1];
    
    if (humanCard && aiCard) {
      // Determine winner
      const humanPower = humanCard.modifiedStrength || humanCard.strength;
      const aiPower = aiCard.modifiedStrength || aiCard.strength;
      
      if (humanPower !== aiPower) {
        // Find the winning card element
        const isHumanWinner = humanPower > aiPower;
        const winningCard = isHumanWinner ? humanCard : aiCard;
        const losingCard = isHumanWinner ? aiCard : humanCard;
        const winningElement = winningCard.element || 'FIRE';
        
        const winningCardElements = gameBoardRef.current.querySelectorAll(
          isHumanWinner ? '.player-row .played-card-wrapper' : '.ai-row .played-card-wrapper'
        );
        const losingCardElements = gameBoardRef.current.querySelectorAll(
          isHumanWinner ? '.ai-row .played-card-wrapper' : '.player-row .played-card-wrapper'
        );
        
        if (winningCardElements.length > 0) {
          const winnerElement = winningCardElements[winningCardElements.length - 1];
          const loserElement = losingCardElements.length > 0 ? losingCardElements[losingCardElements.length - 1] : null;
          
          setTimeout(() => {
            if (winnerElement) {
              // Check for decisive play
              const decisive = isDecisivePlay(humanPower, aiPower, gameState?.gameOver);
              
              if (decisive) {
                // Epic moment with all effects
                createEpicMoment(winningCard, losingCard, winningElement, gameBoardRef.current);
              } else {
                // Standard victory effects
                createVictoryPose(winnerElement);
                
                // Critical hit check - show on the card being hit (loser)
                const winPower = winningCard.modifiedStrength || winningCard.strength;
                if (winPower >= 8 && loserElement) {
                  setTimeout(() => {
                    handleCriticalHit(winningCard, loserElement, gameBoardRef.current);
                  }, 300);
                }
                
                // Elemental weather
                setTimeout(() => {
                  createElementalWeather(winningElement, gameBoardRef.current);
                }, 600);
                
                // Enhanced victory pose for winner
                setTimeout(() => {
                  createWinnerVictoryPose(winnerElement);
                }, 800);
                
                // Defeat animation for loser
                if (loserElement) {
                  setTimeout(() => {
                    createDefeatAnimation(loserElement);
                  }, 1000);
                }
              }
              
              // Add combo multiplier if match bonus
              if (gameState?.lastMatchBonus && gameBoardRef.current) {
                try {
                  const rect = winnerElement.getBoundingClientRect();
                  const parentRect = gameBoardRef.current.getBoundingClientRect();
                  const x = rect.left - parentRect.left + rect.width / 2;
                  const y = rect.top - parentRect.top;
                  createComboMultiplierAnimation('MATCH!', x, y, gameBoardRef.current);
                } catch (error) {
                  console.warn('Error creating combo animation:', error);
                }
              }
            }
          }, 500);
        }
      }
    }
  }, [gameState?.playedCards?.length, humanPlayer?.playedCards, aiPlayer?.playedCards, gameState?.lastMatchBonus, gameState?.gameOver]);

  // Display meteor damage events
  useEffect(() => {
    if (!gameState?.meteorDamageEvents || gameState.meteorDamageEvents.length === 0) return;
    
    const latestEvent = gameState.meteorDamageEvents[gameState.meteorDamageEvents.length - 1];
    
    // Check if this is a new event
    if (latestEvent && latestEvent.timestamp) {
      const isNewEvent = !meteorDamageDisplay.find(e => e.timestamp === latestEvent.timestamp);
      
      if (isNewEvent && latestEvent.damagedCards && latestEvent.damagedCards.length > 0) {
        // Show meteor strike announcement
        setMeteorStrikeInfo({
          cardsHit: latestEvent.totalCards,
          cardsDestroyed: latestEvent.cardsDestroyed,
          targetName: latestEvent.playerName
        });
        setShowMeteorStrike(true);
        
        setTimeout(() => {
          setShowMeteorStrike(false);
        }, 1500);
        
        // Add visual damage indicators
        latestEvent.damagedCards.forEach((damageInfo, idx) => {
          setTimeout(() => {
            // Find the card element that was hit
            const handElements = document.querySelectorAll('.hand .card');
            if (handElements[damageInfo.cardIndex]) {
              handleMeteorStrike(handElements[damageInfo.cardIndex], gameBoardRef.current);
            }
            
            // Create floating -1 damage number for each card
            if (gameBoardRef.current) {
              const rect = gameBoardRef.current.getBoundingClientRect();
              const x = rect.width / 2 + (idx - latestEvent.damagedCards.length / 2) * 120;
              const y = latestEvent.targetPlayer === currentPlayerId ? rect.height - 200 : 200;
              
              createDamageNumber(-1, x, y, gameBoardRef.current, false, false, true);
              
              // Play meteor sound
              if (idx === 0 && soundManager) {
                soundManager.playSound('defeat');
              }
            }
          }, idx * 150);
        });
        
        // Update display state
        setMeteorDamageDisplay(prev => [...prev, latestEvent]);
        
        // Clear old events after 5 seconds
        setTimeout(() => {
          setMeteorDamageDisplay(prev => prev.filter(e => e.timestamp !== latestEvent.timestamp));
        }, 5000);
      }
    }
  }, [gameState?.meteorDamageEvents, currentPlayerId]);

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
        battlePhase: gameState.battlePhase,
        hasDeckCards: aiPlayer.deck?.length || 0
      });
      
      // Use shorter delay (1.5s) if turn announcement is not showing (forfeit scenario)
      // Use longer delay (5s) if announcements might be showing
      const delay = showTurnAnnouncement || showRoundAnnouncement || showInitialArena ? 5000 : 1500;
      
      const watchdogTimer = setTimeout(() => {
        // Don't force AI to play during initial arena display
        if (showInitialArena) {
          console.log('⏸️ AI watchdog blocked - arena display in progress');
          return;
        }
        
        // Don't force AI to play during round announcement
        if (showRoundAnnouncement) {
          console.log('⏸️ AI watchdog blocked - round announcement in progress');
          return;
        }
        
        // Only force AI to play if it actually has cards
        if (aiPlayer.active && aiPlayer.hand?.length > 0 && !aiPlayer.chosenCard) {
          console.log('🚨 AI WATCHDOG: Forcing AI to play');
          const randomIndex = Math.floor(Math.random() * aiPlayer.hand.length);
          onPlayCard(randomIndex, aiPlayer.id);
        } else if (aiPlayer.active && aiPlayer.hand?.length === 0) {
          console.log('⏭️ AI WATCHDOG: AI has no cards, waiting for server to skip turn');
        }
      }, delay);
      
      return () => clearTimeout(watchdogTimer);
    }
  }, [aiPlayer, gameState?.battlePhase, gameState?.gameStarted, gameState?.gameOver, 
      showRoundAnnouncement, showTurnAnnouncement, onPlayCard, showInitialArena]);

  // General game stuck detector - detects if game is in an invalid state
  useEffect(() => {
    if (!gameState?.gameStarted || gameState?.gameOver) {
      return;
    }

    // Detect stuck states
    const isStuck = 
      // Both players inactive
      (humanPlayer && aiPlayer && !humanPlayer.active && !aiPlayer.active && !gameState.battlePhase && !gameState.pendingAbility) ||
      // Battle phase but cards missing
      (gameState.battlePhase && (!humanPlayer?.chosenCard || !aiPlayer?.chosenCard));

    if (isStuck) {
      console.warn('⚠️ STUCK DETECTOR: Game appears stuck!', {
        battlePhase: gameState.battlePhase,
        playerActive: humanPlayer?.active,
        aiActive: aiPlayer?.active,
        playerChosen: !!humanPlayer?.chosenCard,
        aiChosen: !!aiPlayer?.chosenCard,
        pendingAbility: !!gameState.pendingAbility,
        currentRound: gameState.currentRound
      });

      // Wait 2 seconds before attempting recovery
      const recoveryTimer = setTimeout(() => {
        console.log('🔧 Attempting to recover stuck game...');
        
        // If battle phase but missing cards, reset to player turn
        if (gameState.battlePhase && (!humanPlayer?.chosenCard || !aiPlayer?.chosenCard)) {
          console.log('🔧 Battle phase stuck - resetting to player turn');
          // Force a card play to reset state
          if (humanPlayer?.hand?.length > 0) {
            const randomIndex = Math.floor(Math.random() * humanPlayer.hand.length);
            onPlayCard(randomIndex, humanPlayer.id);
          }
        }
        // If both players inactive, activate player
        else if (!humanPlayer?.active && !aiPlayer?.active && !gameState.battlePhase && !gameState.pendingAbility) {
          console.log('🔧 Both players inactive - forcing player active');
          // Trigger a draw action to reset state
          if (humanPlayer?.deck?.length > 0 && onDrawFromReserve) {
            onDrawFromReserve();
          } else if (humanPlayer?.hand?.length > 0) {
            // Force player to play a card
            const randomIndex = Math.floor(Math.random() * humanPlayer.hand.length);
            onPlayCard(randomIndex, humanPlayer.id);
          }
        }
      }, 2000);
      
      return () => clearTimeout(recoveryTimer);
    }
  }, [humanPlayer, aiPlayer, gameState, onPlayCard, onDrawFromReserve]);

  // Check if both players have 0 cards - end the game
  useEffect(() => {
    if (!gameState?.gameStarted || gameState?.gameOver) return;
    
    const humanHandEmpty = !humanPlayer?.hand || humanPlayer.hand.length === 0;
    const aiHandEmpty = !aiPlayer?.hand || aiPlayer.hand.length === 0;
    
    // End game if both players have no cards in hand
    if (humanHandEmpty && aiHandEmpty) {
      console.log('🏁 Both players have no cards in hand - ending game');
      
      // Manually set game over state
      gameState.gameOver = true;
      gameState.battlePhase = false;
      
      // Determine winner by comparing played cards total strength
      const humanTotal = humanPlayer?.playedCards?.reduce((sum, card) => 
        sum + (card.modifiedStrength || card.strength || 0), 0) || 0;
      const aiTotal = aiPlayer?.playedCards?.reduce((sum, card) => 
        sum + (card.modifiedStrength || card.strength || 0), 0) || 0;
      
      console.log('Final totals - Human:', humanTotal, 'AI:', aiTotal);
      
      // Set winner
      if (humanTotal > aiTotal) {
        gameState.winner = humanPlayer.name;
      } else if (aiTotal > humanTotal) {
        gameState.winner = aiPlayer.name;
      } else {
        gameState.winner = 'Tie';
      }
      
      console.log('🏆 Winner:', gameState.winner);
      
      // Force a state update to trigger game over UI
      if (onPlayCard) {
        // Trigger a dummy update to refresh the game state
        setTimeout(() => {
          const dummyEvent = new CustomEvent('gameStateUpdate');
          window.dispatchEvent(dummyEvent);
        }, 100);
      }
    }
  }, [humanPlayer?.hand?.length, aiPlayer?.hand?.length, humanPlayer?.deck?.length, aiPlayer?.deck?.length, gameState?.gameStarted, gameState?.gameOver, humanPlayer?.playedCards, aiPlayer?.playedCards, gameState, humanPlayer, aiPlayer, onPlayCard]);

  const handleCardClick = useCallback((cardIndex) => {
    console.log('🎴 Card clicked:', { cardIndex, isMyTurn, gameOver: gameState?.gameOver, isPaused, pendingAbility: gameState?.pendingAbility });
    
    // Try to start music on first user interaction
    if (soundManager) {
      soundManager.tryStartMusic();
    }
    
    // Block actions during initial arena display
    if (showInitialArena) {
      console.log('⏸️ Card click blocked - arena display in progress');
      return;
    }
    
    // Block actions during round announcement
    if (showRoundAnnouncement) {
      console.log('⏸️ Card click blocked - round announcement in progress');
      return;
    }
    
    // Check if we're in trap selection mode (no trap UI shown yet)
    if (isMyTurn && !showTrapUI) {
      // Toggle trap card selection
      if (selectedTrapCard === cardIndex) {
        setSelectedTrapCard(null);
        console.log('🕸️ Trap card deselected');
      } else {
        // Select or switch to different card
        setSelectedTrapCard(cardIndex);
        console.log('🕸️ Trap card selected:', cardIndex);
      }
    }
    
    if (isMyTurn && onPlayCard && !gameState?.gameOver && !isPaused && !gameState?.pendingAbility) {
      const card = currentPlayer?.hand[cardIndex];
      
      if (!card) {
        console.error('❌ No card found at index:', cardIndex);
        return;
      }
      
      // Check mana cost only if strategic mode enabled AND mana system is active
      if (strategicSettings?.manaEnabled === true && card) {
        const cost = calculateCardManaCost(card);
        const affordable = canAffordCard(manaState, card);
        console.log('💎 Mana check:', { 
          manaEnabled: strategicSettings.manaEnabled,
          cost, 
          current: manaState.current, 
          affordable 
        });
        
        if (!affordable) {
          console.log(`❌ Not enough mana! Need ${cost}, have ${manaState.current}`);
          // Don't show preview for unaffordable cards
          return;
        }
      } else {
        console.log('✅ Mana system disabled or not checking, card playable');
      }
      
      console.log('✅ Card click allowed, showing preview');
      
      // Trigger particle effects
      if (gameBoardRef.current && card && card.element) {
        const rect = gameBoardRef.current.getBoundingClientRect();
        const x = rect.width / 2;
        const y = rect.height / 2;
        createParticles(card.element, x, y, gameBoardRef.current);
      }
      
      // Show card preview and store pending card index for confirmation
      setCardPreview({ card, isPlayer: true });
      setPendingCardIndex(cardIndex);
    } else {
      console.log('⏸️ Card click blocked - conditions not met');
    }
  }, [isMyTurn, gameState?.gameOver, gameState?.pendingAbility, isPaused, showInitialArena, showRoundAnnouncement, showTrapUI, selectedTrapCard, onPlayCard, currentPlayer, strategicSettings?.manaEnabled, manaState]);

  const handleConfirmCardPlay = () => {
    if (pendingCardIndex !== null && currentPlayer) {
      const originalCard = currentPlayer.hand[pendingCardIndex];
      
      // Safety check - card might have been removed
      if (!originalCard) {
        console.error('❌ Card not found at pending index:', pendingCardIndex);
        setCardPreview(null);
        setPendingCardIndex(null);
        return;
      }
      
      let card = { ...originalCard };
      
      // Apply rarity bonus if not already set
      if (!card.rarity) {
        card.rarity = advancedMechanics.determineRarity(card);
        card = advancedMechanics.applyRarityBonus(card);
      }
      
      // Apply booster effects
      card = powerUpSystem?.applyBoosterEffects?.(card, boosterSystem, currentPlayerId) || card;
      
      // Apply equipment bonuses
      card = powerUpSystem?.applyEquipmentEffects?.(card, equipment, {
        isFirstTurn: gameState.turn === 1,
        comboCount: comboHistory.filter(c => Date.now() - (c.timestamp || 0) < 5000).length
      });
      
      // Check for evolution
      const evolutionResult = advancedMechanics.checkEvolution(card, evolutionTracker, {
        playCount: (evolutionTracker[`${card.element}_${card.strength}`]?.playCount || 0) + 1,
        wins: humanPlayer?.score || 0,
        damage: card.strength
      });
      
      if (evolutionResult?.evolved) {
        card.evolved = true;
        card.strength = evolutionResult.newStrength;
        setEvolutionTracker(evolutionResult.tracker);
        
        // Show evolution animation
        if (gameBoardRef.current) {
          const cardElements = gameBoardRef.current.querySelectorAll('.hand .card');
          const cardElement = cardElements[pendingCardIndex];
          if (cardElement) {
            cardElement.classList.add('evolution-glow');
            setTimeout(() => cardElement.classList.remove('evolution-glow'), 1500);
          }
        }
      }
      
      // Check for combos with previously played cards
      const recentCards = [...(humanPlayer?.playedCards || []).slice(-2), card];
      const comboResult = advancedMechanics.detectCombo(recentCards);
      
      if (comboResult?.combo) {
        card = comboResult.card;
        setComboHistory(prev => [...prev, comboResult.combo]);
        
        // Play combo chain sound based on recent combo count
        const recentComboCount = comboHistory.filter(c => Date.now() - (c.timestamp || 0) < 5000).length + 1;
        soundManager.playComboChain(recentComboCount);
        
        // Award combo mana bonus if strategic mode enabled
        if (strategicSettings.manaEnabled && recentComboCount >= 3) {
          setManaState(prev => awardComboMana(prev, recentComboCount));
        }
        
        // Play combo voice line
        soundManager.playVoiceLine(avatarPersonality, 'combo');
        
        // Show combo indicator
        if (gameBoardRef.current) {
          const comboDiv = document.createElement('div');
          comboDiv.className = 'combo-indicator';
          comboDiv.textContent = `${comboResult.combo.name} +${comboResult.combo.bonus}!`;
          gameBoardRef.current.appendChild(comboDiv);
          setTimeout(() => comboDiv.remove(), 2000);
        }
      }
      
      // Check for counter activation (if opponent has played cards)
      if (card?.counter && aiPlayer?.playedCards?.length > 0) {
        const lastOpponentCard = aiPlayer.playedCards[aiPlayer.playedCards.length - 1];
        const counterResult = advancedMechanics.checkCounterActivation(card, lastOpponentCard, 'PLAY');
        
        if (counterResult?.activated) {
          card = counterResult.card;
          
          // Play counter voice line and crowd gasp
          soundManager.playVoiceLine(avatarPersonality, 'counter');
          soundManager.playCrowdReaction('gasp');
          
          // Show counter activation
          if (gameBoardRef.current) {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'counter-burst';
            gameBoardRef.current.appendChild(counterDiv);
            setTimeout(() => counterDiv.remove(), 600);
          }
        }
      }
      
      // Check for trap activation
      const trapResult = advancedMechanics.checkTrapActivation(trapSystem, 'onPlay', { 
        card, 
        value: card.strength,
        position: humanPlayer?.playedCards?.length || 0 
      });
      
      if (trapResult?.activated) {
        setTrapSystem(trapResult.system);
        
        // Process each activated trap
        trapResult.traps.forEach((activatedTrap, index) => {
          // Show trap activation message
          if (gameBoardRef.current) {
            const trapDiv = document.createElement('div');
            trapDiv.className = 'trap-activation';
            trapDiv.textContent = `🕸️ Trap Activated: ${activatedTrap.trapData.name}!`;
            gameBoardRef.current.appendChild(trapDiv);
            setTimeout(() => trapDiv.remove(), 2000 + (index * 500));
          }
          
          // Apply trap effects to card
          if (activatedTrap.type === 'WEAKNESS') {
            card.strength = Math.max(1, (card.strength || 0) + (activatedTrap.trapData.power || -5));
            console.log(`🕸️ Weakness trap activated! Card strength reduced to ${card.strength}`);
          } else if (activatedTrap.type === 'EXPLOSIVE') {
            // Visual explosion effect
            triggerScreenShake(gameBoardRef.current);
            console.log(`💥 Explosive trap! ${activatedTrap.trapData.damage} damage!`);
          }
        });
      }
      
      // Activate persistent ability if card has one
      if (card?.persistentAbility) {
        const newAbilitySystem = advancedMechanics.activatePersistentAbility(
          persistentAbilities, 
          card.persistentAbility, 
          currentPlayerId
        );
        setPersistentAbilities(newAbilitySystem);
      }
      
      // Spend mana if strategic mode enabled
      if (strategicSettings.manaEnabled && card) {
        const cost = calculateCardManaCost(card);
        const affordable = canAffordCard(manaState, card);
        
        if (affordable) {
          // Normal mana spending
          setManaState(prev => spendMana(prev, cost));
        } else {
          // Try overdraft
          const overdraftResult = allowOverdraft(manaState, cost);
          if (overdraftResult) {
            setManaState(overdraftResult);
            // Show overdraft warning
            setShowMatchBonus({ 
              message: '⚠️ OVERDRAFTED! No regen next turn',
              type: 'warning'
            });
            setTimeout(() => setShowMatchBonus(false), 2500);
          }
        }
      }
      
      // Trigger enhanced element play animation
      if (gameBoardRef.current && card) {
        // Find the card element being played
        const cardElements = gameBoardRef.current.querySelectorAll('.hand .card');
        const cardElement = cardElements[pendingCardIndex];
        
        // Only trigger animation if card element exists
        if (card && card.element && cardElement && typeof cardElement.getBoundingClientRect === 'function') {
          try {
            createElementPlayAnimation(card.element, cardElement, gameBoardRef.current);
          } catch (error) {
            console.warn('Error creating element animation:', error);
          }
        }
      }
      
      setCardPreview(null);
      setPendingCardIndex(null);
      onPlayCard(pendingCardIndex);
    }
  };

  const handleBackToDeck = () => {
    setCardPreview(null);
    setPendingCardIndex(null);
  };

  // Revive card from graveyard
  const handleReviveCard = useCallback(async (cardIndex) => {
    if (!isMyTurn || !humanPlayer) {
      console.log('❌ Cannot revive: Not your turn or no player');
      return;
    }

    // Check if player has enough score (costs 1 point)
    if (humanPlayer.score < 1) {
      alert('❌ Need at least 1 score point to revive a card!');
      return;
    }

    try {
      console.log('👻 Attempting to revive card at index:', cardIndex);
      const result = await onReviveFromGraveyard(cardIndex);
      
      if (result?.success) {
        console.log('✅ Card revived successfully:', result.card);
        // Close the graveyard preview
        setCardPreview(null);
        // Show success notification
        if (gameBoardRef.current) {
          const notification = document.createElement('div');
          notification.className = 'revive-notification';
          notification.innerHTML = `
            <div class="revive-text">👻 CARD REVIVED!</div>
            <div class="revive-subtext">${result.card?.name || 'Card'} returned to your hand</div>
          `;
          gameBoardRef.current.appendChild(notification);
          setTimeout(() => notification.remove(), 3000);
        }
      } else {
        console.log('❌ Revive failed:', result?.reason);
        alert(`❌ Revive failed: ${result?.reason || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error reviving card:', error);
      alert('❌ Error reviving card. Please try again.');
    }
  }, [isMyTurn, humanPlayer, onReviveFromGraveyard]);

  // Screen shake effect for dramatic moments
  const triggerScreenShake = (element) => {
    element.classList.add('screen-shake');
    setTimeout(() => element.classList.remove('screen-shake'), 500);
  };

  const handleFusionAttempt = () => {
    if (selectedFusionCards.length === 2 && currentPlayer) {
      const card1 = currentPlayer.hand[selectedFusionCards[0]];
      const card2 = currentPlayer.hand[selectedFusionCards[1]];
      
      console.log('🔮 Attempting fusion:', {
        card1: { element: card1?.element, strength: card1?.strength },
        card2: { element: card2?.element, strength: card2?.strength }
      });
      
      const fusionResult = advancedMechanics.fuseCards(card1, card2);
      console.log('🔮 Fusion result:', fusionResult);
      
      if (fusionResult.success) {
        // Show enhanced fusion animation
        if (gameBoardRef.current) {
          // Create particle burst effect
          for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'fusion-particle';
            const angle = (Math.PI * 2 * i) / 30;
            const distance = 150 + Math.random() * 100;
            particle.style.setProperty('--angle', `${angle}rad`);
            particle.style.setProperty('--distance', `${distance}px`);
            particle.style.left = '50%';
            particle.style.top = '50%';
            gameBoardRef.current.appendChild(particle);
            setTimeout(() => particle.remove(), 1500);
          }
          
          // Create fusion circle effect
          const fusionCircle = document.createElement('div');
          fusionCircle.className = 'fusion-circle-effect';
          gameBoardRef.current.appendChild(fusionCircle);
          setTimeout(() => fusionCircle.remove(), 2000);
          
          // Create main fusion banner
          const fusionDiv = document.createElement('div');
          fusionDiv.className = 'fusion-complete-banner';
          fusionDiv.innerHTML = `
            <div class="fusion-glow-ring"></div>
            <div class="fusion-sparkle-container">
              <span class="fusion-sparkle" style="--delay: 0s;">✨</span>
              <span class="fusion-sparkle" style="--delay: 0.2s;">✨</span>
              <span class="fusion-sparkle" style="--delay: 0.4s;">✨</span>
            </div>
            <div class="fusion-title">🔥 FUSION SUCCESS! 🔥</div>
            <div class="fusion-card-name">${fusionResult.fusedCard.name}</div>
            <div class="fusion-elements">${fusionResult.fusionName}</div>
            <div class="fusion-stats">
              <span class="fusion-stat">⚡ Strength: ${fusionResult.fusedCard.strength}</span>
              ${fusionResult.fusedCard.element ? `<span class="fusion-stat">🌟 ${fusionResult.fusedCard.element}</span>` : ''}
            </div>
          `;
          gameBoardRef.current.appendChild(fusionDiv);
          setTimeout(() => fusionDiv.remove(), 3500);
          
          // Trigger screen shake
          triggerScreenShake(gameBoardRef.current);
        }
        
        console.log('✨ Fusion successful:', fusionResult.fusionName, fusionResult.fusedCard);
        
        // Notify parent to update game state with fused card
        if (onFuseCards) {
          onFuseCards(selectedFusionCards[0], selectedFusionCards[1], fusionResult.fusedCard);
        }
        
        // Close fusion UI but DON'T end turn - player can continue playing
        setShowFusionUI(false);
        setSelectedFusionCards([]);
        
        // Show a message that fusion is complete and player can continue
        if (gameBoardRef.current) {
          const continueDiv = document.createElement('div');
          continueDiv.className = 'fusion-continue-message';
          continueDiv.innerHTML = `
            <div style="font-size: 20px; color: #4caf50;">✅ Fusion Complete!</div>
            <div style="font-size: 16px; margin-top: 5px;">Select a card to play</div>
          `;
          continueDiv.style.cssText = `
            position: fixed;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(76, 175, 80, 0.9);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            z-index: 9999;
            text-align: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            animation: slideInUp 0.3s ease-out;
          `;
          gameBoardRef.current.appendChild(continueDiv);
          setTimeout(() => continueDiv.remove(), 2000);
        }
        
        return; // Exit early to prevent duplicate UI closing
      } else {
        // Show detailed error message
        console.log('❌ Fusion failed:', fusionResult.message);
        if (gameBoardRef.current) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'fusion-error-banner';
          errorDiv.innerHTML = `
            <div style="font-size: 24px; color: #f44336;">❌ Fusion Failed</div>
            <div style="font-size: 18px; margin-top: 10px;">${fusionResult.message || 'Cards cannot be fused'}</div>
            <div style="font-size: 14px; margin-top: 5px; opacity: 0.8;">Try different element combinations</div>
          `;
          errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(244, 67, 54, 0.95);
            color: white;
            padding: 30px 50px;
            border-radius: 15px;
            z-index: 10000;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
          `;
          gameBoardRef.current.appendChild(errorDiv);
          setTimeout(() => errorDiv.remove(), 3000);
        }
      }
      
      // Only close UI if we didn't already return after success
      setShowFusionUI(false);
      setSelectedFusionCards([]);
    }
  };

  const handleTrapPlacement = (position) => {
    if (selectedTrapCard !== null && currentPlayer) {
      const trapCard = currentPlayer.hand[selectedTrapCard];
      
      const newTrapSystem = advancedMechanics.setTrap(trapSystem, trapCard, position, currentPlayerId);
      setTrapSystem(newTrapSystem);
      
      // Show trap placed notification
      if (gameBoardRef.current) {
        const trapDiv = document.createElement('div');
        trapDiv.className = 'trap-activation';
        trapDiv.textContent = 'Trap Card Set!';
        gameBoardRef.current.appendChild(trapDiv);
        setTimeout(() => trapDiv.remove(), 1500);
      }
      
      setShowTrapUI(false);
      setSelectedTrapCard(null);
      
      // End turn after setting trap
      if (onPlayCard) {
        onPlayCard(null); // Pass null to indicate special action (trap), not card play
      }
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
    setHasQuit(true);
    // Quit to main menu
    if (onQuit) {
      onQuit();
    }
  };

  // Sort hand cards
  const getSortedHand = useCallback((hand) => {
    if (!hand || hand.length === 0) return [];
    
    // Filter out any undefined/null cards before mapping
    const sortedWithIndices = hand
      .map((card, originalIndex) => ({
        card,
        originalIndex
      }))
      .filter(item => item.card && item.card.element);
    
    switch (sortBy) {
      case 'element':
        const elementOrder = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'POWER', 'LIGHT', 'DARK', 'NEUTRAL', 'TECHNOLOGY', 'METEOR'];
        sortedWithIndices.sort((a, b) => {
          const indexA = a.card?.element ? elementOrder.indexOf(a.card.element) : 999;
          const indexB = b.card?.element ? elementOrder.indexOf(b.card.element) : 999;
          return indexA - indexB;
        });
        break;
      case 'strength':
        sortedWithIndices.sort((a, b) => 
          (b.card.modifiedStrength || b.card.strength) - (a.card.modifiedStrength || a.card.strength)
        );
        break;
      case 'rarity':
        const rarityOrder = { 'LEGENDARY': 0, 'RARE': 1, 'UNCOMMON': 2, 'COMMON': 3 };
        sortedWithIndices.sort((a, b) => {
          const tierA = rarityOrder[a.card.tier || 'COMMON'];
          const tierB = rarityOrder[b.card.tier || 'COMMON'];
          return tierA - tierB;
        });
        break;
      default:
        return sortedWithIndices;
    }
    
    return sortedWithIndices;
  }, [sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(prevSort => prevSort === newSort ? 'none' : newSort);
  };

  const handleSkipTurn = () => {
    console.log('⏭️ Player manually skipped turn');
    
    // Show skip notification
    if (gameBoardRef.current) {
      const skipDiv = document.createElement('div');
      skipDiv.className = 'skip-turn-notification';
      skipDiv.textContent = 'Turn Skipped';
      gameBoardRef.current.appendChild(skipDiv);
      setTimeout(() => skipDiv.remove(), 1500);
    }
    
    // Play sound effect
    if (soundManager) {
      soundManager.playSound('cardFlip');
    }
    
    // End the turn
    if (onForfeit) {
      onForfeit();
    }
  };

  // Memoize sorted hand to prevent unnecessary recalculations
  const sortedHumanHand = useMemo(() => 
    humanPlayer?.hand ? getSortedHand(humanPlayer.hand) : [],
    [humanPlayer?.hand, getSortedHand]
  );

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

      {/* Pause Button - Hidden during game over */}
      {gameState.gameStarted && !gameState.gameOver && !defeatCountdown && (
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
      {gameState.gameOver && defeatCountdown === null && !hasQuit && (
        <div className="game-over-overlay">
          {/* Victory Particles */}
          <div className="victory-particles">
            {Array(30).fill(null).map((_, i) => (
              <div key={i} className="victory-particle" style={{
                '--delay': `${Math.random() * 2}s`,
                '--x': `${Math.random() * 100}vw`,
                '--rotation': `${Math.random() * 360}deg`
              }}></div>
            ))}
          </div>
          
          <div className="game-over-container">
            {/* Trophy Icon for Winner */}
            {gameState.winner !== 'Tie' && (
              <div className="trophy-icon">
                {gameState.winner === humanPlayer?.name ? '🏆' : '💀'}
              </div>
            )}
            
            <h1 className="game-over-title">GAME OVER!</h1>
            <h2 className={`winner-announcement ${gameState.winner === humanPlayer?.name ? 'victory' : gameState.winner === 'Tie' ? 'tie' : 'defeat'}`}>
              {gameState.winner === 'Tie' ? (
                "IT'S A TIE!"
              ) : (
                <>{gameState.winner} WINS!</>
              )}
            </h2>
            
            {/* Battle Statistics */}
            <div className="battle-stats">
              <div className="stat-box">
                <div className="stat-icon">⚔️</div>
                <div className="stat-label">Total Strength</div>
                <div className="stat-value">{humanTotalStrength} vs {aiTotalStrength}</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">🎴</div>
                <div className="stat-label">Rounds Played</div>
                <div className="stat-value">{gameState.currentRound}</div>
              </div>
            </div>
            
            <div className="final-scores">
              <div className={`final-score-item ${gameState.winner === humanPlayer?.name ? 'winner' : gameState.winner === 'Tie' ? 'tie' : ''}`}>
                <div className={`final-player-avatar ${gameState.winner === humanPlayer?.name ? 'winner-avatar' : ''}`}>
                  {selectedCharacter?.image ? (
                    <img 
                      src={`${process.env.PUBLIC_URL}/${selectedCharacter?.image}`} 
                      alt={selectedCharacter?.name || 'Player'}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                    />
                  ) : null}
                  <span style={{ display: selectedCharacter?.image ? 'none' : 'block' }}>
                    {selectedCharacter?.icon || '👤'}
                  </span>
                </div>
                {gameState.winner === humanPlayer?.name && <div className="winner-crown">👑</div>}
                <span className="player-name">{humanPlayer?.name}</span>
                <span className="player-score">{humanPlayer?.score}</span>
                <div className="score-badge">POINTS</div>
              </div>
              <div className="score-separator">vs</div>
              <div className={`final-score-item ${gameState.winner === aiPlayer?.name ? 'winner' : gameState.winner === 'Tie' ? 'tie' : ''}`}>
                <div className={`final-player-avatar ${gameState.winner === aiPlayer?.name ? 'winner-avatar' : ''}`}>
                  {aiPlayer?.avatarImage ? (
                    <img src={`${process.env.PUBLIC_URL}/${aiPlayer.avatarImage}`} alt={aiPlayer.name} />
                  ) : (
                    <span>{aiPlayer?.avatar || '🤖'}</span>
                  )}
                </div>
                {gameState.winner === aiPlayer?.name && <div className="winner-crown">👑</div>}
                <span className="player-name">{aiPlayer?.name}</span>
                <span className="player-score">{aiPlayer?.score}</span>
                <div className="score-badge">POINTS</div>
              </div>
            </div>
            
            <div className="game-over-buttons">
              <button className="play-again-button" onClick={onPlayAgain}>
                <span className="button-icon">🔄</span>
                {isStoryMode ? 'CONTINUE' : 'PLAY AGAIN'}
              </button>
              <button className="quit-button" onClick={() => { setHasQuit(true); onQuit(); }}>
                <span className="button-icon">🚪</span>
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
              <div className="ai-thinking">
                {aiPlayer?.hand?.length === 0 && (!aiPlayer?.deck || aiPlayer.deck.length === 0) 
                  ? '🚫 AI has no cards - Skipping turn...'
                  : 'AI is thinking...'}
              </div>
            </>
          )}
        </div>
      )}

      {/* Meteor Strike Announcement */}
      {showMeteorStrike && meteorStrikeInfo && (
        <div className="meteor-strike-overlay">
          <div className="meteor-strike-text">
            ☄️ METEOR STRIKE! ☄️
            <div style={{ fontSize: '18px', marginTop: '8px', fontWeight: '700' }}>
              {meteorStrikeInfo.cardsHit} EARTH {meteorStrikeInfo.cardsHit === 1 ? 'CARD' : 'CARDS'} HIT!
              {meteorStrikeInfo.cardsDestroyed > 0 && (
                <span style={{ color: '#ff3300' }}> ({meteorStrikeInfo.cardsDestroyed} DESTROYED)</span>
              )}
            </div>
          </div>
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
      
      {/* Equipment Stats Display */}
      {gameState.gameStarted && !gameState.gameOver && (() => {
        const stats = powerUpSystem?.calculateEquipmentStats?.(equipment) || {};
        const hasStats = Object.values(stats).some(v => v !== 0);
        
        return hasStats ? (
          <div className="active-equipment-stats">
            <div className="stats-header" onClick={() => setShowEquipmentStats(!showEquipmentStats)}>
              ⚔️ Equipment Bonuses {showEquipmentStats ? '▼' : '▲'}
            </div>
            {showEquipmentStats && (
              <div className="stats-list">
                {Object.entries(stats).map(([stat, value]) => (
                  value !== 0 && (
                    <div key={stat} className="stat-item">
                      <span className="stat-name">{stat.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="stat-boost">+{value}</span>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        ) : null;
      })()}

      {/* Forfeit Announcement Overlay */}
      {showForfeitAnnouncement && (
        <div className="forfeit-announcement">
          <h1 className="forfeit-text">TIME'S UP!</h1>
          <p className="forfeit-subtext">Turn Forfeited</p>
        </div>
      )}

      {/* Fusion UI */}
      {showFusionUI && (
        <div className="fusion-ui-overlay">
          <div className="fusion-ui-container">
            <h2>Card Fusion</h2>
            <p>Select 2 cards to fuse</p>
            <div className="fusion-card-selection">
              {currentPlayer?.hand?.map((card, index) => (
                <div
                  key={index}
                  className={`fusion-card ${selectedFusionCards.includes(index) ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    console.log('🔮 Fusion card clicked:', index, 'Current selection:', selectedFusionCards);
                    if (selectedFusionCards.includes(index)) {
                      setSelectedFusionCards(prev => prev.filter(i => i !== index));
                      console.log('🔮 Card deselected');
                    } else if (selectedFusionCards.length < 2) {
                      setSelectedFusionCards(prev => [...prev, index]);
                      console.log('🔮 Card selected');
                    } else {
                      console.log('🔮 Already have 2 cards selected');
                    }
                  }}
                >
                  <Card card={card} isPlayable={false} onClick={(e) => e.stopPropagation()} />
                </div>
              ))}
            </div>
            
            {/* Fusion Preview */}
            {selectedFusionCards.length === 2 && (() => {
              const card1 = currentPlayer?.hand[selectedFusionCards[0]];
              const card2 = currentPlayer?.hand[selectedFusionCards[1]];
              const compatibility = advancedMechanics.checkFusionCompatibility(card1, card2);
              
              return (
                <div className="fusion-preview">
                  {compatibility.canFuse ? (
                    <div className="fusion-preview-success">
                      <div className="preview-title">✨ Fusion Preview ✨</div>
                      <div className="preview-name">{compatibility.recipe.result.name}</div>
                      <div className="preview-element">Element: {compatibility.recipe.result.element}</div>
                      <div className="preview-strength">
                        Strength: {(card1?.strength || 0) + (card2?.strength || 0) + compatibility.recipe.result.strengthBonus}
                        <span className="bonus"> (+{compatibility.recipe.result.strengthBonus} bonus)</span>
                      </div>
                      <div className="preview-abilities">
                        Abilities: {compatibility.recipe.result.abilities.join(', ')}
                      </div>
                    </div>
                  ) : (
                    <div className="fusion-preview-fail">
                      <div className="preview-title">❌ Incompatible</div>
                      <div className="preview-message">{compatibility.message}</div>
                    </div>
                  )}
                </div>
              );
            })()}
            
            <div className="fusion-actions">
              <button 
                className="fusion-confirm-btn"
                onClick={handleFusionAttempt}
                disabled={selectedFusionCards.length !== 2}
                title="Fuse Cards"
              >
                🔮
              </button>
              <button 
                className="fusion-cancel-btn"
                onClick={() => {
                  setShowFusionUI(false);
                  setSelectedFusionCards([]);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trap Placement UI */}
      {showTrapUI && (
        <div className="trap-ui-overlay">
          <div className="trap-ui-container">
            <h2>Place Trap Card</h2>
            <p>Select position to place trap</p>
            <div className="trap-positions">
              {[0, 1, 2, 3, 4].map(position => (
                <button
                  key={position}
                  className="trap-position-btn"
                  onClick={() => handleTrapPlacement(position)}
                >
                  Position {position + 1}
                </button>
              ))}
            </div>
            <button 
              className="trap-cancel-btn"
              onClick={() => {
                setShowTrapUI(false);
                setSelectedTrapCard(null);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Element Match Bonus Overlay */}
      {showMatchBonus && gameState?.lastMatchBonus && (
        <div className={`match-bonus-overlay ${
          gameState.lastMatchBonus.player === currentPlayer?.name ? 'player-side' : 'opponent-side'
        }`}>
          <div className={`element-particles ${gameState.lastMatchBonus.element.toLowerCase()}-particles`}>
            {Array(40).fill(null).map((_, i) => (
              <div key={i} className="particle"></div>
            ))}
          </div>
          <div className="match-starburst">
            {Array(12).fill(null).map((_, i) => (
              <div key={i} className="star-ray" style={{ '--rotation': `${i * 30}deg` }}></div>
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
                {cardPreview.isPlayer && humanPlayer && (
                  <div className="graveyard-info">
                    <span className="revive-cost">💀 Revive Cost: 1 Score Point</span>
                    <span className="current-score">Your Score: {humanPlayer.score}</span>
                  </div>
                )}
                <button className="close-preview" onClick={() => setCardPreview(null)}>✕</button>
              </div>
              <div className="graveyard-cards-grid">
                {cardPreview.cards && cardPreview.cards.length > 0 ? (
                  cardPreview.cards.map((card, index) => (
                    <div key={index} className="graveyard-card-wrapper">
                      <Card card={card} isPlayable={false} />
                      {cardPreview.isPlayer && isMyTurn && (
                        <button
                          className="revive-card-btn"
                          onClick={() => handleReviveCard(index)}
                          disabled={!humanPlayer || humanPlayer.score < 1}
                          title={humanPlayer?.score < 1 ? 'Need 1 score point to revive' : 'Revive this card (costs 1 point)'}
                        >
                          👻 Revive
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-cards-message">No cards in graveyard</p>
                )}
              </div>
              {cardPreview.isPlayer && !isMyTurn && (
                <p className="graveyard-note">⏳ Wait for your turn to revive cards</p>
              )}
            </div>
          ) : (
            <div className={`card-preview-container ${cardPreview.isPlayer ? 'player-preview' : 'ai-preview'}`}>
              <Card card={cardPreview.card} isPlayable={false} />
              {cardPreview.isPlayer && pendingCardIndex !== null && (
                <div className="card-preview-actions">
                  <button className="confirm-card-btn" onClick={handleConfirmCardPlay}>
                    ✓ OK
                  </button>
                  <button className="back-to-deck-btn" onClick={handleBackToDeck}>
                    ← Back
                  </button>
                </div>
              )}
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

      {/* Left Sidebar Toggle - Outside sidebar for mobile visibility */}
      <button 
        className="sidebar-toggle left-toggle"
        onClick={() => setLeftSidebarVisible(!leftSidebarVisible)}
        aria-label="Toggle player stats"
      >
        {leftSidebarVisible ? '◀' : '▶'}
      </button>

      {/* Left Sidebar - Both Players */}
      <div className={`left-sidebar ${leftSidebarVisible ? 'visible' : ''}`}>
        <div className="sidebar-content">
          <h3>Player 2 (AI)</h3>
          {aiPlayer && (
            <div className="sidebar-player-info">
              <div className="player-avatar">
                {aiPlayer.avatarImage ? (
                  <img src={`${process.env.PUBLIC_URL}/${aiPlayer.avatarImage}`} alt={aiPlayer.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  aiPlayer.avatar || '🤖'
                )}
              </div>
              <p><strong>{aiPlayer.name}</strong></p>
              <p className={aiPlayer.active ? 'active-indicator' : ''}>
                {aiPlayer.active && '⭐ '}Score: {aiPlayer.score}
              </p>
              {/* AI Status Effects Display */}
              {gameState.statusEffects?.ai?.length > 0 && (
                <StatusEffects 
                  effects={gameState.statusEffects.ai}
                  playerName={aiPlayer.name}
                  availableEffects={gameState.availableStatusEffects || {}}
                />
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
              <div className="player-avatar">
                {selectedCharacter?.image ? (
                  <img 
                    src={`${process.env.PUBLIC_URL}/${selectedCharacter?.image}`} 
                    alt={selectedCharacter?.name || 'Player'}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                ) : null}
                <span style={{ display: selectedCharacter?.image ? 'none' : 'block' }}>
                  {selectedCharacter?.icon || '👤'}
                </span>
              </div>
              <p><strong>{humanPlayer.name}</strong></p>
              <p>Score: {humanPlayer.score}</p>
              {/* Status Effects Display */}
              {gameState.statusEffects?.player?.length > 0 && (
                <StatusEffects 
                  effects={gameState.statusEffects.player}
                  playerName={humanPlayer.name}
                  availableEffects={gameState.availableStatusEffects || {}}
                />
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

      {/* Right Sidebar Toggle - Outside sidebar for mobile visibility */}
      <button 
        className="sidebar-toggle right-toggle"
        onClick={() => setRightSidebarVisible(!rightSidebarVisible)}
        aria-label="Toggle card decks"
      >
        {rightSidebarVisible ? '▶' : '◀'}
      </button>

      {/* Right Sidebar - Card Decks */}
      <div className={`right-sidebar ${rightSidebarVisible ? 'visible' : ''}`}>
        <div className="sidebar-content">
          <h3>Player 2 Cards</h3>
          {aiPlayer && gameState.gameStarted && (
            <>
              <div className="ai-cards-display">
                <h4>Remaining Cards</h4>
                <div className="vertical-card-stack">
                  {Array(aiPlayer.cardCount).fill(null).map((_, i) => (
                    <div key={i} className="card-back-small" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/${aiPlayer.cardBackImage || 'cards-back.png'})` }}></div>
                  ))}
                </div>
              </div>

              {aiPlayer.deck && aiPlayer.deck.length > 0 && (
                <div className="deck-section">
                  <h4>Reserve Deck ({aiPlayer.deck.length})</h4>
                  <div className="reserve-deck-stack">
                    {aiPlayer.deck.map((_, i) => (
                      <div key={i} className="card-back-small" style={{ top: `${i * 2}px`, backgroundImage: `url(${process.env.PUBLIC_URL}/${aiPlayer.cardBackImage || 'cards-back.png'})` }}></div>
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
                    <div key={i} className="card-back-small player-card-back" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/cards-back.png)` }}></div>
                  ))}
                </div>
              </div>

              {humanPlayer.deck && humanPlayer.deck.length > 0 && (
                <div className="deck-section">
                  <h4>Reserve Deck ({humanPlayer.deck.length})</h4>
                  <div className="reserve-deck-stack">
                    {humanPlayer.deck.map((_, i) => (
                      <div key={i} className="card-back-small player-card-back" style={{ top: `${i * 2}px`, backgroundImage: `url(${process.env.PUBLIC_URL}/cards-back.png)` }}></div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Ultimate Ability Section in Sidebar */}
          {gameState.gameStarted && !gameState.gameOver && !hasQuit && defeatCountdown === null && (
            <>
              <div className="sidebar-divider"></div>
              
              <div className="ultimate-sidebar-section">
                <h3>⚡ Ultimate Ability</h3>
                <div 
                  className={`ultimate-sidebar-display ${ultimateSystem.currentCooldown === 0 ? 'ready' : 'cooldown'}`}
                  onClick={() => {
                    if (ultimateSystem.currentCooldown === 0) {
                      const result = powerUpSystem?.useUltimate?.(ultimateSystem, humanPlayer, aiPlayer, gameState);
                      if (result?.success) {
                        setUltimateSystem(result.updatedSystem);
                        
                        // Apply ultimate effects
                        if (result.effects) {
                          result.effects.forEach(effect => {
                            if (effect.type === 'DAMAGE') {
                              console.log(`Ultimate dealt ${effect.amount} damage`);
                            }
                          });
                        }
                        
                        // Visual feedback
                        if (gameBoardRef.current) {
                          triggerScreenShake(gameBoardRef.current);
                          createElementalWeather('METEOR', gameBoardRef.current);
                        }
                        
                        setShowMatchBonus({ 
                          message: `⚡ ${result.ultimateData.name.toUpperCase()}!`,
                          type: 'ultimate'
                        });
                        setTimeout(() => setShowMatchBonus(false), 2500);
                        
                        if (soundManager) {
                          soundManager.playSound('powerPlay');
                          soundManager.playVoiceLine(avatarPersonality, 'combo');
                        }
                      }
                    }
                  }}
                >
                  <div className="ultimate-icon">
                    {ultimateSystem.currentCooldown === 0 ? '⚡' : ultimateSystem.currentCooldown}
                  </div>
                  <div className="ultimate-info">
                    <div className="ultimate-name">
                      {powerUpSystem.ULTIMATE_ABILITIES[ultimateSystem.selectedUltimate || ultimateSystem.id || 'METEOR_STRIKE']?.name || 'Meteor Strike'}
                    </div>
                    <div className="ultimate-status">
                      {ultimateSystem.currentCooldown === 0 ? '✅ READY!' : `Cooldown: ${ultimateSystem.currentCooldown}`}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>



      {/* Center Battle Area - Cards Played */}
      {gameState.gameStarted && (
        <div className="center-battle-area" style={{
          background: ARENA_THEMES[arenaTheme]?.background || ARENA_THEMES.cosmic.background,
          backgroundImage: ARENA_THEMES[arenaTheme]?.backgroundImage || 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'overlay',
          boxShadow: ARENA_THEMES[arenaTheme]?.borderGlow || ARENA_THEMES.cosmic.borderGlow
        }}>
          {/* Arena overlay effect */}
          <div className="arena-overlay" style={{
            background: ARENA_THEMES[arenaTheme]?.overlay || ARENA_THEMES.cosmic.overlay
          }}></div>
          
          {/* Floating particles */}
          <div className="arena-particles">
            {[...Array(15)].map((_, i) => (
              <div 
                key={i} 
                className="arena-particle"
                style={{
                  background: ARENA_THEMES[arenaTheme]?.particles || ARENA_THEMES.cosmic.particles,
                  animationDelay: `${i * 0.5}s`,
                  left: `${Math.random() * 100}%`
                }}
              />
            ))}
          </div>
          
          {/* Floating Turn Timer - Hidden (removed from display) */}
          
          <h3 className="arena-title">⚔️ Battle Arena ⚔️</h3>
          
          {/* Strategic Systems Displays */}
          {(strategicSettings.manaEnabled || strategicSettings.weatherEnabled || strategicSettings.terrainEnabled) && (
            <div className="strategic-systems-display">
              {strategicSettings.manaEnabled && (
                <ManaDisplay 
                  current={manaState.current}
                  max={manaState.max}
                  regenRate={manaState.regenRate}
                  surgeActive={manaState.surgeActive}
                  emergencyRegen={manaState.emergencyRegen}
                  overdrafted={manaState.overdrafted}
                  lastComboBonus={manaState.lastComboBonus}
                />
              )}
              {strategicSettings.weatherEnabled && weatherState?.current && (
                <WeatherDisplay 
                  weather={weatherState.current}
                  roundsUntilChange={weatherState.roundsUntilChange}
                />
              )}
              {strategicSettings.terrainEnabled && terrainState?.current && (
                <TerrainDisplay 
                  terrain={terrainState.current}
                />
              )}
            </div>
          )}
          
          {/* AI's Played Cards - Top */}
          <div className="battle-card-row ai-row">
            <div className="played-cards-container">
              {aiPlayer?.playedCards && aiPlayer.playedCards.length > 0 ? (
                aiPlayer.playedCards.map((card, index) => {
                  // Debug: Log AI card properties
                  console.log(`🎴 AI Card ${index + 1} in arena:`, {
                    name: card.name,
                    element: card.element,
                    strength: card.strength,
                    image: card.image,
                    hasImage: !!card.image,
                    isFusion: card.isFusion,
                    allProps: Object.keys(card)
                  });
                  return (
                    <div key={index} className="played-card-wrapper ai-card">
                      <Card card={card} isPlayable={false} />
                    </div>
                  );
                })
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
                humanPlayer.playedCards.map((card, index) => {
                  // Debug: Log Player card properties
                  console.log(`👤 Player Card ${index + 1} in arena:`, {
                    name: card.name,
                    element: card.element,
                    strength: card.strength,
                    image: card.image,
                    hasImage: !!card.image,
                    isFusion: card.isFusion
                  });
                  return (
                    <div key={index} className="played-card-wrapper">
                      <Card card={card} isPlayable={false} />
                    </div>
                  );
                })
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
          {isMyTurn && humanPlayer.hand?.length >= 2 && (
            <div className="advanced-mechanics-controls">
              <button 
                className="fusion-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowFusionUI(true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowFusionUI(true);
                }}
                title="Fuse two cards together"
              >
                🔮 Fusion
              </button>
              <button 
                className={`trap-btn ${selectedTrapCard !== null ? 'selected' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (selectedTrapCard !== null) {
                    setShowTrapUI(true);
                  } else {
                    // Show hint to select a card first
                    if (gameBoardRef.current) {
                      const hint = document.createElement('div');
                      hint.className = 'trap-hint';
                      hint.textContent = '👆 Select a card from your hand first!';
                      gameBoardRef.current.appendChild(hint);
                      setTimeout(() => hint.remove(), 2000);
                    }
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (selectedTrapCard !== null) {
                    setShowTrapUI(true);
                  } else {
                    // Show hint to select a card first
                    if (gameBoardRef.current) {
                      const hint = document.createElement('div');
                      hint.className = 'trap-hint';
                      hint.textContent = '👆 Select a card from your hand first!';
                      gameBoardRef.current.appendChild(hint);
                      setTimeout(() => hint.remove(), 2000);
                    }
                  }
                }}
                title={selectedTrapCard !== null ? "Choose trap position" : "Select a card first, then click to set as trap"}
              >
                🕸️{selectedTrapCard !== null ? '✓' : ''}
              </button>
            </div>
          )}
          {/* Skip Turn Button - Always show when it's player's turn */}
          {isMyTurn && (
            <div className="skip-turn-container">
              <button 
                className="skip-turn-btn"
                onClick={handleSkipTurn}
                title={humanPlayer.hand?.length === 0 ? "Skip Turn - No cards in hand" : !hasPlayableCards() ? "Skip Turn - No playable cards available" : "Skip Turn - Pass this round"}
              >
                <span className="skip-turn-icon">⏭️</span>
                <span className="skip-turn-text">Skip Turn</span>
              </button>
              {humanPlayer.hand?.length === 0 ? (
                <p className="skip-turn-message">No cards in hand</p>
              ) : !hasPlayableCards() ? (
                <p className="skip-turn-message">No playable cards - Not enough mana</p>
              ) : (
                <p className="skip-turn-message">Pass this round</p>
              )}
            </div>
          )}
          <div className={`hand ${isMyTurn ? 'your-turn' : ''}`} style={{
            background: HAND_THEMES[handTheme]?.handBackground || HAND_THEMES.standard.handBackground,
            boxShadow: `${HAND_THEMES[handTheme]?.glowEffect || HAND_THEMES.standard.glowEffect}, inset 0 2px 8px rgba(0, 0, 0, 0.2)`,
            borderImage: `url(${process.env.PUBLIC_URL}/hand-frame1.png) 50 stretch`
          }}>
            {sortedHumanHand.map((item, displayIndex) => {
              const manaSystemActive = strategicSettings?.manaEnabled === true;
              const cost = manaSystemActive ? calculateCardManaCost(item.card) : undefined;
              const affordable = manaSystemActive ? canAffordCard(manaState, item.card) : true;
              const overdraftable = manaSystemActive && !affordable ? canOverdraftCard(manaState, item.card) : false;
              const playable = isMyTurn && !gameState?.pendingAbility && (affordable || overdraftable);
              
              if (displayIndex === 0) {
                console.log('🎴 First card render:', { 
                  element: item.card.element, 
                  strength: item.card.strength,
                  manaSystemActive,
                  cost, 
                  currentMana: manaSystemActive ? manaState.current : 'N/A',
                  affordable,
                  overdraftable, 
                  isMyTurn,
                  playable,
                  strategicSettings: strategicSettings
                });
              }
              
              return (
                <Card
                  key={`${item.card.element}-${item.card.strength}-${item.originalIndex}`}
                  card={{
                    ...item.card,
                    isTrapSelected: selectedTrapCard === item.originalIndex
                  }}
                  onClick={() => handleCardClick(item.originalIndex)}
                  isPlayable={playable}
                  keyboardKey={settings?.keyboardEnabled ? String(displayIndex + 1) : null}
                  manaCost={cost}
                  canAfford={affordable}
                  canOverdraft={overdraftable}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Score Tracker - Always visible during game */}

      {/* Power-Up System UI - Hidden during game over */}
      {gameState.gameStarted && !gameState.gameOver && !hasQuit && defeatCountdown === null && !isPaused && (
        <>
          {/* Active Boosts Display */}
          {boosterSystem?.activeBoosts?.length > 0 && (
            <div className="active-boosts">
              {boosterSystem?.activeBoosts?.filter(boost => boost?.boosterId && powerUpSystem?.BOOSTERS?.[boost.boosterId]).map((boost, idx) => {
                const boosterData = powerUpSystem.BOOSTERS[boost.boosterId];
                return (
                  <div key={idx} className="active-boost">
                    <div className="active-boost-icon">{boosterData?.icon || '💪'}</div>
                    <div className="active-boost-text">
                      <div className="active-boost-name">{boosterData?.name || 'Boost'}</div>
                      <div className="active-boost-turns">{boost.turnsRemaining || 0} turns left</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Booster Panel Toggle Button */}
          <button 
            className="power-up-toggle booster-toggle"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBoosterPanel(!showBoosterPanel);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowBoosterPanel(!showBoosterPanel);
            }}
            style={{
              position: 'fixed',
              top: '80px',
              right: showBoosterPanel ? '280px' : '20px',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(139, 195, 74, 0.95) 100%)',
              border: '2px solid #4caf50',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 1600,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(76, 175, 80, 0.5)',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            title="Boosters"
          >
            💪
          </button>

          {/* Booster Panel */}
          {showBoosterPanel && powerUpSystem?.BOOSTERS && (
            <div className="booster-bar">
              <h3>⚡ BOOSTERS</h3>
              <div className="booster-list">
                {Object.keys(powerUpSystem.BOOSTERS || {}).map(boosterId => {
                  const booster = powerUpSystem.BOOSTERS[boosterId];
                  const isActive = boosterSystem?.activeBoosters?.some(b => b.boosterId === boosterId);
                  const isUsed = boosterSystem?.usedBoosters?.includes(boosterId);
                  
                  return (
                    <div 
                      key={boosterId}
                      className={`booster-item ${isActive ? 'active' : ''} ${isUsed ? 'used' : ''}`}
                      onClick={() => {
                        if (!isUsed && !isActive) {
                          const result = powerUpSystem?.activateBooster?.(boosterSystem, boosterId, currentPlayerId);
                          if (result?.success) {
                            setBoosterSystem(result.system);
                            setShowMatchBonus({ 
                              message: `💪 ${booster.name} ACTIVATED!`,
                              type: 'booster'
                            });
                            setTimeout(() => setShowMatchBonus(false), 2000);
                            soundManager.playElementSound('fire');
                          }
                        }
                      }}
                    >
                      <div className="booster-icon">{booster?.icon || '💪'}</div>
                      <div className="booster-info">
                        <div className="booster-name">{booster?.name || 'Booster'}</div>
                        <div className="booster-description">{booster?.description || ''}</div>
                      </div>
                      {isActive ? (
                        <div className="booster-duration">
                          {boosterSystem?.activeBoosters?.find(b => b?.boosterId === boosterId)?.turnsRemaining || 0}T
                        </div>
                      ) : (
                        <div className="booster-cost">{booster?.duration || 0}T</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Equipment Panel Toggle Button */}
          <button 
            className="power-up-toggle equipment-toggle"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowEquipmentPanel(!showEquipmentPanel);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowEquipmentPanel(!showEquipmentPanel);
            }}
            style={{
              position: 'fixed',
              top: '140px',
              right: showEquipmentPanel ? '310px' : '20px',
              background: 'linear-gradient(135deg, rgba(255, 152, 0, 0.95) 0%, rgba(255, 193, 7, 0.95) 100%)',
              border: '2px solid #ff9800',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              fontSize: '24px',
              cursor: 'pointer',
              zIndex: 1600,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(255, 152, 0, 0.5)',
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              WebkitUserSelect: 'none'
            }}
            title="Equipment"
          >
            ⚔️
          </button>

          {/* Equipment Panel */}
          {showEquipmentPanel && powerUpSystem?.EQUIPMENT_SLOTS && (
            <div className="equipment-panel">
              <div className="equipment-header">
                <div className="equipment-title">⚔️ EQUIPMENT</div>
                <div className="equipment-gold">💰 {equipment.gold} Gold</div>
                <button 
                  className="equipment-shop-btn"
                  onClick={() => setShowEquipmentShop(!showEquipmentShop)}
                >
                  🛒 Shop
                </button>
              </div>
              
              {showEquipmentShop ? (
                <div className="equipment-shop">
                  <h4>🛒 Equipment Shop</h4>
                  <div className="shop-items">
                    {Object.entries(powerUpSystem.EQUIPMENT_ITEMS).map(([itemId, item]) => {
                      const isUnlocked = equipment.unlockedItems.includes(itemId);
                      const cost = item.rarity === 'LEGENDARY' ? 200 : item.rarity === 'EPIC' ? 150 : 100;
                      const canAfford = equipment.gold >= cost;
                      
                      return (
                        <div 
                          key={itemId}
                          className={`shop-item ${isUnlocked ? 'unlocked' : ''} ${!canAfford ? 'expensive' : ''}`}
                          onClick={() => {
                            if (!isUnlocked && canAfford) {
                              const result = powerUpSystem.unlockEquipment(equipment, itemId, cost);
                              if (result.success) {
                                setEquipment(result.equipment);
                                if (soundManager) soundManager.playSound('cardDraw');
                              }
                            }
                          }}
                        >
                          <div className="shop-item-icon">{item?.icon || '⚔️'}</div>
                          <div className="shop-item-name">{item?.name || 'Item'}</div>
                          <div className="shop-item-rarity">{item?.rarity || 'Common'}</div>
                          <div className="shop-item-cost">{isUnlocked ? '✅ OWNED' : `💰 ${cost}G`}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <>
                  <div className="equipment-slots">
                    {powerUpSystem.EQUIPMENT_SLOTS.map(slot => {
                      const equipped = equipment?.slots?.[slot];
                      const item = equipped ? powerUpSystem?.EQUIPMENT_ITEMS?.[equipped] : null;
                      
                      return (
                        <div 
                          key={slot}
                          className={`equipment-slot ${equipped ? 'equipped' : ''}`}
                          onClick={() => {
                            if (equipped && powerUpSystem?.unequipItem) {
                              const result = powerUpSystem.unequipItem(equipment, slot);
                              if (result.success) {
                                setEquipment(result.equipment);
                              }
                            }
                          }}
                        >
                          <div className="slot-label">{slot}</div>
                          {item ? (
                            <>
                              <div className="slot-icon">{item?.icon || '⚔️'}</div>
                              <div className="slot-name">{item?.name || 'Item'}</div>
                            </>
                          ) : (
                            <div className="slot-empty">Empty</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="equipment-inventory">
                    <h4>📦 Unlocked Items</h4>
                    <div className="inventory-items">
                      {equipment.unlockedItems.filter(itemId => powerUpSystem?.EQUIPMENT_ITEMS?.[itemId]).map(itemId => {
                        const item = powerUpSystem.EQUIPMENT_ITEMS[itemId];
                        const isEquipped = Object.values(equipment.slots).includes(itemId);
                        
                        return (
                          <div 
                            key={itemId}
                            className={`inventory-item ${isEquipped ? 'equipped' : ''}`}
                            onClick={() => {
                              if (!isEquipped) {
                                const result = powerUpSystem.equipItem(equipment, itemId);
                                if (result.success) {
                                  setEquipment(result.equipment);
                                  if (soundManager) soundManager.playSound('cardFlip');
                                }
                              }
                            }}
                          >
                            <div className="inventory-icon">{item?.icon || '⚔️'}</div>
                            <div className="inventory-name">{item?.name || 'Item'}</div>
                            {isEquipped && <div className="equipped-badge">✓</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="equipment-stats">
                    <div className="equipment-stats-title">⭐ ACTIVE BONUSES</div>
                    {(() => {
                      const stats = powerUpSystem?.calculateEquipmentStats?.(equipment) || {};
                      const hasStats = Object.values(stats).some(v => v !== 0);
                      
                      if (!hasStats) {
                        return <div className="no-stats">No equipment equipped</div>;
                      }
                      
                      return Object.entries(stats).map(([stat, value]) => (
                        value !== 0 && (
                          <div key={stat} className="stat-row">
                            <span className="stat-label">{stat.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="stat-value">+{value}</span>
                          </div>
                        )
                      ));
                    })()}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GameBoard;
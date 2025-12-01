/**
 * Game Recovery System
 * Centralized watchdog to detect and recover from stuck game states
 * 
 * This addresses the issue of gameplay getting stuck due to:
 * - setTimeout chains failing (browser tab throttling)
 * - Race conditions between multiple timeout handlers
 * - Missing state transitions
 */

// Stuck state detection thresholds (in milliseconds)
const THRESHOLDS = {
  PLAYER_TURN_STUCK: 8000,      // Player turn with no action
  AI_TURN_STUCK: 5000,          // AI turn with no action
  BATTLE_PHASE_STUCK: 10000,    // Battle phase not resolving
  BOTH_INACTIVE_STUCK: 3000,    // Neither player active
  PENDING_ABILITY_STUCK: 12000, // Ability prompt not resolved
  RECOVERY_COOLDOWN: 2000       // Minimum time between recovery attempts
};

class GameRecovery {
  constructor() {
    this.lastStateChange = Date.now();
    this.lastRecoveryAttempt = 0;
    this.stateHistory = [];
    this.maxHistorySize = 10;
    this.isRecovering = false;
    this.watchdogInterval = null;
    this.callbacks = {
      onPlayCard: null,
      onDrawFromReserve: null,
      onSkipAbility: null,
      onForceStateUpdate: null
    };
  }

  /**
   * Initialize the recovery system with game callbacks
   */
  init(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
    console.log('🛡️ Game Recovery System initialized');
  }

  /**
   * Record a state change - call this whenever game state updates
   */
  recordStateChange(gameState) {
    const now = Date.now();
    const stateSnapshot = {
      timestamp: now,
      round: gameState?.currentRound,
      playerActive: gameState?.players?.[0]?.active,
      aiActive: gameState?.players?.[1]?.active,
      battlePhase: gameState?.battlePhase,
      pendingAbility: !!gameState?.pendingAbility,
      gameOver: gameState?.gameOver,
      playerHandSize: gameState?.players?.[0]?.hand?.length || 0,
      aiHandSize: gameState?.players?.[1]?.hand?.length || 0,
      playerChosen: !!gameState?.players?.[0]?.chosenCard,
      aiChosen: !!gameState?.players?.[1]?.chosenCard
    };

    // Only record if state actually changed
    const lastState = this.stateHistory[this.stateHistory.length - 1];
    if (!lastState || this.statesDiffer(lastState, stateSnapshot)) {
      this.lastStateChange = now;
      this.stateHistory.push(stateSnapshot);
      
      // Trim history
      if (this.stateHistory.length > this.maxHistorySize) {
        this.stateHistory.shift();
      }
    }
  }

  /**
   * Check if two state snapshots are different
   */
  statesDiffer(state1, state2) {
    return (
      state1.round !== state2.round ||
      state1.playerActive !== state2.playerActive ||
      state1.aiActive !== state2.aiActive ||
      state1.battlePhase !== state2.battlePhase ||
      state1.pendingAbility !== state2.pendingAbility ||
      state1.playerChosen !== state2.playerChosen ||
      state1.aiChosen !== state2.aiChosen ||
      state1.playerHandSize !== state2.playerHandSize ||
      state1.aiHandSize !== state2.aiHandSize
    );
  }

  /**
   * Start the watchdog timer
   */
  startWatchdog(getGameState, getUIState) {
    // Clear any existing watchdog
    this.stopWatchdog();

    this.watchdogInterval = setInterval(() => {
      this.checkForStuckState(getGameState(), getUIState());
    }, 1000); // Check every second

    console.log('⏰ Watchdog timer started');
  }

  /**
   * Stop the watchdog timer
   */
  stopWatchdog() {
    if (this.watchdogInterval) {
      clearInterval(this.watchdogInterval);
      this.watchdogInterval = null;
      console.log('⏹️ Watchdog timer stopped');
    }
  }

  /**
   * Check if game is in a stuck state and attempt recovery
   */
  checkForStuckState(gameState, uiState = {}) {
    if (!gameState?.gameStarted || gameState?.gameOver) {
      return;
    }

    // Don't check during UI transitions
    if (uiState.showRoundAnnouncement || uiState.showTurnAnnouncement || uiState.showInitialArena) {
      return;
    }

    const now = Date.now();
    const timeSinceLastChange = now - this.lastStateChange;
    const timeSinceLastRecovery = now - this.lastRecoveryAttempt;

    // Prevent rapid recovery attempts
    if (timeSinceLastRecovery < THRESHOLDS.RECOVERY_COOLDOWN || this.isRecovering) {
      return;
    }

    const humanPlayer = gameState.players?.[0];
    const aiPlayer = gameState.players?.[1];

    // Detect various stuck states
    const stuckState = this.detectStuckState(gameState, humanPlayer, aiPlayer, timeSinceLastChange);

    if (stuckState) {
      console.warn(`🚨 STUCK STATE DETECTED: ${stuckState.type} (${timeSinceLastChange}ms since last change)`);
      console.log('📊 Current state:', {
        round: gameState.currentRound,
        playerActive: humanPlayer?.active,
        aiActive: aiPlayer?.active,
        battlePhase: gameState.battlePhase,
        pendingAbility: !!gameState.pendingAbility,
        playerHand: humanPlayer?.hand?.length,
        aiHand: aiPlayer?.hand?.length,
        playerChosen: !!humanPlayer?.chosenCard,
        aiChosen: !!aiPlayer?.chosenCard
      });

      this.attemptRecovery(stuckState, gameState, humanPlayer, aiPlayer);
    }
  }

  /**
   * Detect what kind of stuck state we're in
   */
  detectStuckState(gameState, humanPlayer, aiPlayer, timeSinceLastChange) {
    // Both players inactive (deadlock)
    if (!humanPlayer?.active && !aiPlayer?.active && 
        !gameState.battlePhase && !gameState.pendingAbility &&
        timeSinceLastChange > THRESHOLDS.BOTH_INACTIVE_STUCK) {
      return { type: 'BOTH_INACTIVE', severity: 'high' };
    }

    // Battle phase stuck (cards played but not resolving)
    if (gameState.battlePhase && 
        humanPlayer?.chosenCard && aiPlayer?.chosenCard &&
        timeSinceLastChange > THRESHOLDS.BATTLE_PHASE_STUCK) {
      return { type: 'BATTLE_STUCK', severity: 'high' };
    }

    // Battle phase but missing cards
    if (gameState.battlePhase && 
        (!humanPlayer?.chosenCard || !aiPlayer?.chosenCard) &&
        timeSinceLastChange > THRESHOLDS.BATTLE_PHASE_STUCK) {
      return { type: 'BATTLE_MISSING_CARDS', severity: 'high' };
    }

    // AI turn stuck
    if (aiPlayer?.active && !humanPlayer?.active && 
        !gameState.battlePhase && aiPlayer?.hand?.length > 0 &&
        timeSinceLastChange > THRESHOLDS.AI_TURN_STUCK) {
      return { type: 'AI_STUCK', severity: 'medium' };
    }

    // Player turn stuck (optional - player might just be thinking)
    if (humanPlayer?.active && !aiPlayer?.active && 
        !gameState.battlePhase && humanPlayer?.hand?.length > 0 &&
        timeSinceLastChange > THRESHOLDS.PLAYER_TURN_STUCK * 3) { // Longer threshold for player
      return { type: 'PLAYER_IDLE', severity: 'low' };
    }

    // Pending ability stuck
    if (gameState.pendingAbility && 
        !humanPlayer?.active && !aiPlayer?.active &&
        timeSinceLastChange > THRESHOLDS.PENDING_ABILITY_STUCK) {
      return { type: 'ABILITY_STUCK', severity: 'medium' };
    }

    return null;
  }

  /**
   * Attempt to recover from a stuck state
   */
  attemptRecovery(stuckState, gameState, humanPlayer, aiPlayer) {
    this.isRecovering = true;
    this.lastRecoveryAttempt = Date.now();

    console.log(`🔧 Attempting recovery for: ${stuckState.type}`);

    try {
      switch (stuckState.type) {
        case 'BOTH_INACTIVE':
          this.recoverBothInactive(humanPlayer, aiPlayer);
          break;

        case 'BATTLE_STUCK':
        case 'BATTLE_MISSING_CARDS':
          this.recoverBattleStuck(gameState, humanPlayer, aiPlayer);
          break;

        case 'AI_STUCK':
          this.recoverAIStuck(aiPlayer);
          break;

        case 'ABILITY_STUCK':
          this.recoverAbilityStuck();
          break;

        case 'PLAYER_IDLE':
          // Just log, don't force player action
          console.log('⏳ Player has been idle for a while');
          break;

        default:
          console.warn('❓ Unknown stuck state type:', stuckState.type);
      }
    } catch (error) {
      console.error('❌ Recovery attempt failed:', error);
    }

    // Reset recovery flag after a short delay
    setTimeout(() => {
      this.isRecovering = false;
    }, 1000);
  }

  /**
   * Recovery: Both players inactive
   */
  recoverBothInactive(humanPlayer, aiPlayer) {
    console.log('🔧 Recovery: Activating player turn');
    
    // Try to force a state update first
    if (this.callbacks.onForceStateUpdate) {
      this.callbacks.onForceStateUpdate({ 
        action: 'ACTIVATE_PLAYER',
        reason: 'both_inactive_recovery'
      });
    }
    
    // If player has cards, they should play
    if (humanPlayer?.hand?.length > 0 && this.callbacks.onPlayCard) {
      // Don't auto-play for player, just ensure they're active
      console.log('✅ Player should now be able to play');
    }
    // If player has no cards but has deck, draw
    else if (humanPlayer?.deck?.length > 0 && this.callbacks.onDrawFromReserve) {
      console.log('🎴 Auto-drawing card for stuck player');
      this.callbacks.onDrawFromReserve();
    }
  }

  /**
   * Recovery: Battle phase stuck
   */
  recoverBattleStuck(gameState, humanPlayer, aiPlayer) {
    console.log('🔧 Recovery: Force-resolving stuck battle');
    
    if (this.callbacks.onForceStateUpdate) {
      this.callbacks.onForceStateUpdate({
        action: 'RESOLVE_BATTLE',
        reason: 'battle_stuck_recovery'
      });
    }
  }

  /**
   * Recovery: AI turn stuck
   */
  recoverAIStuck(aiPlayer) {
    console.log('🔧 Recovery: Forcing AI to play');
    
    if (aiPlayer?.hand?.length > 0 && this.callbacks.onPlayCard) {
      const randomIndex = Math.floor(Math.random() * aiPlayer.hand.length);
      console.log(`🤖 Forcing AI to play card at index ${randomIndex}`);
      this.callbacks.onPlayCard(randomIndex, aiPlayer.id);
    }
  }

  /**
   * Recovery: Pending ability stuck
   */
  recoverAbilityStuck() {
    console.log('🔧 Recovery: Auto-skipping stuck ability');
    
    if (this.callbacks.onSkipAbility) {
      this.callbacks.onSkipAbility();
    }
  }

  /**
   * Get diagnostic info about the recovery system
   */
  getDiagnostics() {
    return {
      lastStateChange: this.lastStateChange,
      lastRecoveryAttempt: this.lastRecoveryAttempt,
      isRecovering: this.isRecovering,
      stateHistorySize: this.stateHistory.length,
      watchdogActive: !!this.watchdogInterval,
      recentHistory: this.stateHistory.slice(-5)
    };
  }

  /**
   * Reset the recovery system
   */
  reset() {
    this.stopWatchdog();
    this.lastStateChange = Date.now();
    this.lastRecoveryAttempt = 0;
    this.stateHistory = [];
    this.isRecovering = false;
    console.log('🔄 Game Recovery System reset');
  }
}

// Export singleton instance
const gameRecovery = new GameRecovery();

// Handle tab visibility changes - force check when user returns to tab
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log('👁️ Tab became visible - checking for stuck state');
      // Reset last state change to prevent false positives from long inactive period
      gameRecovery.lastStateChange = Date.now() - 2000; // Pretend last change was 2s ago
    }
  });
}

export default gameRecovery;
export { THRESHOLDS };

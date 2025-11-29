/**
 * Game Progress Manager
 * Centralized utility for persisting all player progress data
 * Handles: money/coins, completed levels, unlocked characters, game settings
 */

import secureStorage from './secureStorage';

const PROGRESS_KEY = 'gameProgress';

/**
 * Default game progress structure
 */
const DEFAULT_PROGRESS = {
  // Currency
  coins: 0,
  totalCoinsEarned: 0,
  
  // Story Mode Progress
  completedStoryStages: [],
  currentChapter: 1,
  storyModeHighestStage: 0,
  
  // Unlocked Characters (by defeating them in story mode)
  unlockedCharacters: ['EMBER'], // Ember is always unlocked
  
  // Special Unlocks
  unlockedCards: [], // Special cards like BLACKHOLE
  unlockedThemes: ['classic', 'standard', 'cosmic'], // Default themes
  unlockedArenas: ['cosmic'],
  
  // Player Stats
  playerLevel: 1,
  experience: 0,
  experienceToNextLevel: 100,
  
  // Game Statistics (summary)
  totalGamesPlayed: 0,
  totalWins: 0,
  totalLosses: 0,
  totalTies: 0,
  currentWinStreak: 0,
  longestWinStreak: 0,
  
  // Tutorial & Onboarding
  tutorialCompleted: false,
  firstGamePlayed: false,
  
  // Achievements
  achievements: [],
  
  // Timestamps
  lastPlayed: null,
  createdAt: Date.now(),
  lastSaved: Date.now()
};

/**
 * Get all game progress
 * @returns {Object} Game progress object
 */
export const getGameProgress = () => {
  try {
    const stored = secureStorage.getItem(PROGRESS_KEY);
    if (stored) {
      // Merge with defaults to ensure all properties exist
      return {
        ...DEFAULT_PROGRESS,
        ...stored,
        lastAccessed: Date.now()
      };
    }
    
    // Try to recover from legacy storage locations
    const legacyProgress = recoverLegacyProgress();
    if (legacyProgress) {
      // Save recovered progress
      saveGameProgress(legacyProgress);
      return legacyProgress;
    }
  } catch (error) {
    console.error('[GAME PROGRESS] Error loading progress:', error);
  }
  
  // Return defaults if nothing stored or error occurred
  return { ...DEFAULT_PROGRESS };
};

/**
 * Recover progress from legacy storage locations
 * @returns {Object|null} Recovered progress or null
 */
const recoverLegacyProgress = () => {
  try {
    console.log('🔄 [GAME PROGRESS] Attempting to recover from legacy storage...');
    
    const recovered = { ...DEFAULT_PROGRESS };
    let foundLegacyData = false;
    
    // Recover coins from playerThemes
    const themes = localStorage.getItem('playerThemes');
    if (themes) {
      try {
        const themesData = JSON.parse(themes);
        if (themesData.coins !== undefined) {
          recovered.coins = themesData.coins;
          recovered.unlockedThemes = themesData.ownedThemes || DEFAULT_PROGRESS.unlockedThemes;
          foundLegacyData = true;
          console.log('💰 [GAME PROGRESS] Recovered coins:', recovered.coins);
        }
      } catch (e) { /* ignore parse errors */ }
    }
    
    // Recover story progress
    const storyProgress = secureStorage.getItem('storyModeProgress');
    if (storyProgress) {
      if (Array.isArray(storyProgress)) {
        recovered.completedStoryStages = storyProgress;
      } else if (storyProgress.completedStages) {
        recovered.completedStoryStages = storyProgress.completedStages;
      }
      foundLegacyData = true;
      console.log('📖 [GAME PROGRESS] Recovered story stages:', recovered.completedStoryStages.length);
    }
    
    // Recover from storyModeBackup
    const backup = localStorage.getItem('storyModeBackup');
    if (backup && recovered.completedStoryStages.length === 0) {
      try {
        const backupData = JSON.parse(backup);
        if (backupData.progress) {
          recovered.completedStoryStages = backupData.progress;
          foundLegacyData = true;
        }
      } catch (e) { /* ignore */ }
    }
    
    // Recover unlocked characters based on completed stages
    recovered.unlockedCharacters = getUnlockedCharactersFromStages(recovered.completedStoryStages);
    
    // Recover tutorial status
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (tutorialCompleted === 'true') {
      recovered.tutorialCompleted = true;
      foundLegacyData = true;
    }
    
    // Recover player stats from statistics
    const stats = localStorage.getItem('elementalBattleStats');
    if (stats) {
      try {
        const statsData = JSON.parse(stats);
        recovered.totalGamesPlayed = statsData.gamesPlayed || 0;
        recovered.totalWins = statsData.gamesWon || 0;
        recovered.totalLosses = statsData.gamesLost || 0;
        recovered.totalTies = statsData.gamesTied || 0;
        recovered.currentWinStreak = statsData.currentWinStreak || 0;
        recovered.longestWinStreak = statsData.longestWinStreak || 0;
        recovered.lastPlayed = statsData.lastPlayed;
        foundLegacyData = true;
        console.log('📊 [GAME PROGRESS] Recovered stats:', recovered.totalGamesPlayed, 'games');
      } catch (e) { /* ignore */ }
    }
    
    // Recover player profile data
    const profile = secureStorage.getItem('playerProfile');
    if (profile) {
      if (profile.coins !== undefined) {
        recovered.coins = Math.max(recovered.coins, profile.coins);
      }
      foundLegacyData = true;
    }
    
    if (foundLegacyData) {
      recovered.lastSaved = Date.now();
      console.log('✅ [GAME PROGRESS] Legacy data recovery complete');
      return recovered;
    }
    
    return null;
  } catch (error) {
    console.error('[GAME PROGRESS] Error recovering legacy data:', error);
    return null;
  }
};

/**
 * Get unlocked characters based on completed story stages
 * @param {Array} completedStages - Array of completed stage IDs
 * @returns {Array} Array of unlocked character IDs
 */
const getUnlockedCharactersFromStages = (completedStages) => {
  const unlocked = ['EMBER']; // Always unlocked
  
  // Map of stage completion to character unlock
  const stageUnlockMap = {
    'trial-of-rage': 'DONOVAN',
    'frost-fortress': 'FROST',
    'aqua-depths': 'AQUA',
    'voltage-peak': 'VOLT',
    'terra-stronghold': 'TERRA',
    'light-sanctuary': 'LUMINA',
    'shadow-realm': 'SHADOW',
    'nexus-core': 'NEXUS',
    'chaos-dimension': 'CHAOS'
  };
  
  if (Array.isArray(completedStages)) {
    completedStages.forEach(stageId => {
      // Handle both string IDs and object format
      const id = typeof stageId === 'string' ? stageId : stageId?.id;
      if (id && stageUnlockMap[id] && !unlocked.includes(stageUnlockMap[id])) {
        unlocked.push(stageUnlockMap[id]);
      }
    });
  }
  
  return unlocked;
};

/**
 * Save game progress
 * @param {Object} progress - Full or partial progress object
 * @returns {Boolean} Success status
 */
export const saveGameProgress = (progress) => {
  try {
    const current = getGameProgress();
    const updated = {
      ...current,
      ...progress,
      lastSaved: Date.now()
    };
    
    const success = secureStorage.setItem(PROGRESS_KEY, updated);
    
    if (success) {
      console.log('💾 [GAME PROGRESS] Progress saved successfully');
      
      // Also backup to localStorage for extra safety
      try {
        localStorage.setItem('gameProgressBackup', JSON.stringify({
          ...updated,
          backupTimestamp: Date.now()
        }));
      } catch (e) { /* ignore backup errors */ }
      
      // Sync coins to playerThemes for backwards compatibility
      syncCoinsToThemes(updated.coins);
      
      // Trigger custom event for components to react to progress changes
      window.dispatchEvent(new CustomEvent('gameProgressUpdated', { 
        detail: updated 
      }));
    }
    
    return success;
  } catch (error) {
    console.error('[GAME PROGRESS] Error saving progress:', error);
    return false;
  }
};

/**
 * Sync coins to the themes system for backwards compatibility
 * @param {Number} coins - Coin amount
 */
const syncCoinsToThemes = (coins) => {
  try {
    const themes = localStorage.getItem('playerThemes');
    if (themes) {
      const themesData = JSON.parse(themes);
      themesData.coins = coins;
      localStorage.setItem('playerThemes', JSON.stringify(themesData));
    } else {
      // Create themes data if it doesn't exist
      localStorage.setItem('playerThemes', JSON.stringify({
        colorTheme: 'classic',
        handTheme: 'standard',
        arenaTheme: 'cosmic',
        ownedThemes: ['classic', 'standard', 'cosmic'],
        coins: coins
      }));
    }
  } catch (e) {
    console.error('[GAME PROGRESS] Error syncing coins to themes:', e);
  }
};

/**
 * Update specific progress fields
 * @param {Object} updates - Object with progress keys to update
 * @returns {Boolean} Success status
 */
export const updateProgress = (updates) => {
  const current = getGameProgress();
  return saveGameProgress({ ...current, ...updates });
};

// ============ COINS / CURRENCY ============

/**
 * Get current coin balance
 * @returns {Number} Coin count
 */
export const getCoins = () => {
  return getGameProgress().coins || 0;
};

/**
 * Add coins to player's balance
 * @param {Number} amount - Coins to add
 * @param {String} reason - Reason for adding (for logging)
 * @returns {Object} { success, newBalance, added }
 */
export const addCoins = (amount, reason = 'reward') => {
  const progress = getGameProgress();
  const newBalance = (progress.coins || 0) + amount;
  const newTotal = (progress.totalCoinsEarned || 0) + amount;
  
  const success = updateProgress({ 
    coins: newBalance, 
    totalCoinsEarned: newTotal 
  });
  
  if (success) {
    console.log(`💰 [GAME PROGRESS] +${amount} coins (${reason}). Balance: ${newBalance}`);
  }
  
  return { success, newBalance, added: amount };
};

/**
 * Spend coins from player's balance
 * @param {Number} amount - Coins to spend
 * @param {String} reason - Reason for spending (for logging)
 * @returns {Object} { success, newBalance, spent }
 */
export const spendCoins = (amount, reason = 'purchase') => {
  const progress = getGameProgress();
  const currentBalance = progress.coins || 0;
  
  if (currentBalance < amount) {
    return { success: false, newBalance: currentBalance, spent: 0, error: 'Insufficient coins' };
  }
  
  const newBalance = currentBalance - amount;
  const success = updateProgress({ coins: newBalance });
  
  if (success) {
    console.log(`💸 [GAME PROGRESS] -${amount} coins (${reason}). Balance: ${newBalance}`);
  }
  
  return { success, newBalance, spent: amount };
};

// ============ STORY PROGRESS ============

/**
 * Get completed story stages
 * @returns {Array} Array of completed stage IDs
 */
export const getCompletedStages = () => {
  return getGameProgress().completedStoryStages || [];
};

/**
 * Mark a story stage as completed
 * @param {String} stageId - Stage ID to mark complete
 * @returns {Boolean} Success status
 */
export const completeStoryStage = (stageId) => {
  const progress = getGameProgress();
  const stages = progress.completedStoryStages || [];
  
  if (!stages.includes(stageId)) {
    stages.push(stageId);
    
    // Update unlocked characters
    const unlockedCharacters = getUnlockedCharactersFromStages(stages);
    
    // Update highest stage
    const stageNumber = stages.length;
    const highestStage = Math.max(progress.storyModeHighestStage || 0, stageNumber);
    
    const success = updateProgress({ 
      completedStoryStages: stages,
      unlockedCharacters: unlockedCharacters,
      storyModeHighestStage: highestStage
    });
    
    if (success) {
      console.log(`📖 [GAME PROGRESS] Stage completed: ${stageId}. Total: ${stages.length}`);
      
      // Also save to legacy location for backwards compatibility
      secureStorage.setItem('storyModeProgress', stages);
      localStorage.setItem('storyModeBackup', JSON.stringify({
        progress: stages,
        timestamp: Date.now()
      }));
    }
    
    return success;
  }
  
  return true; // Already completed
};

/**
 * Check if a story stage is completed
 * @param {String} stageId - Stage ID to check
 * @returns {Boolean} Whether stage is completed
 */
export const isStageCompleted = (stageId) => {
  const stages = getCompletedStages();
  return stages.includes(stageId);
};

// ============ CHARACTER UNLOCKS ============

/**
 * Get all unlocked characters
 * @returns {Array} Array of unlocked character IDs
 */
export const getUnlockedCharacters = () => {
  return getGameProgress().unlockedCharacters || ['EMBER'];
};

/**
 * Unlock a character
 * @param {String} characterId - Character ID to unlock
 * @returns {Boolean} Success status
 */
export const unlockCharacter = (characterId) => {
  const progress = getGameProgress();
  const unlocked = progress.unlockedCharacters || ['EMBER'];
  
  if (!unlocked.includes(characterId)) {
    unlocked.push(characterId);
    const success = updateProgress({ unlockedCharacters: unlocked });
    
    if (success) {
      console.log(`🔓 [GAME PROGRESS] Character unlocked: ${characterId}`);
    }
    
    return success;
  }
  
  return true; // Already unlocked
};

/**
 * Check if a character is unlocked
 * @param {String} characterId - Character ID to check
 * @returns {Boolean} Whether character is unlocked
 */
export const isCharacterUnlocked = (characterId) => {
  const unlocked = getUnlockedCharacters();
  return unlocked.includes(characterId);
};

// ============ SPECIAL UNLOCKS ============

/**
 * Unlock a special card (like BLACKHOLE)
 * @param {String} cardId - Card ID to unlock
 * @returns {Boolean} Success status
 */
export const unlockCard = (cardId) => {
  const progress = getGameProgress();
  const unlockedCards = progress.unlockedCards || [];
  
  if (!unlockedCards.includes(cardId)) {
    unlockedCards.push(cardId);
    const success = updateProgress({ unlockedCards: unlockedCards });
    
    if (success) {
      console.log(`🃏 [GAME PROGRESS] Card unlocked: ${cardId}`);
    }
    
    return success;
  }
  
  return true;
};

/**
 * Get all unlocked special cards
 * @returns {Array} Array of unlocked card IDs
 */
export const getUnlockedCards = () => {
  return getGameProgress().unlockedCards || [];
};

/**
 * Unlock a theme
 * @param {String} themeId - Theme ID to unlock
 * @returns {Boolean} Success status
 */
export const unlockTheme = (themeId) => {
  const progress = getGameProgress();
  const unlockedThemes = progress.unlockedThemes || ['classic', 'standard', 'cosmic'];
  
  if (!unlockedThemes.includes(themeId)) {
    unlockedThemes.push(themeId);
    const success = updateProgress({ unlockedThemes: unlockedThemes });
    
    if (success) {
      console.log(`🎨 [GAME PROGRESS] Theme unlocked: ${themeId}`);
    }
    
    return success;
  }
  
  return true;
};

// ============ GAME STATS ============

/**
 * Record a game result
 * @param {Object} result - { won, lost, tied }
 * @returns {Object} Updated stats
 */
export const recordGameResult = (result) => {
  const progress = getGameProgress();
  
  const updates = {
    totalGamesPlayed: (progress.totalGamesPlayed || 0) + 1,
    lastPlayed: Date.now(),
    firstGamePlayed: true
  };
  
  if (result.won) {
    updates.totalWins = (progress.totalWins || 0) + 1;
    updates.currentWinStreak = (progress.currentWinStreak || 0) + 1;
    updates.longestWinStreak = Math.max(
      progress.longestWinStreak || 0, 
      updates.currentWinStreak
    );
  } else if (result.lost) {
    updates.totalLosses = (progress.totalLosses || 0) + 1;
    updates.currentWinStreak = 0;
  } else if (result.tied) {
    updates.totalTies = (progress.totalTies || 0) + 1;
    // Don't reset win streak on tie
  }
  
  // Add experience
  let expGained = result.won ? 25 : result.tied ? 10 : 5;
  const newExp = (progress.experience || 0) + expGained;
  const expToNext = progress.experienceToNextLevel || 100;
  
  if (newExp >= expToNext) {
    updates.playerLevel = (progress.playerLevel || 1) + 1;
    updates.experience = newExp - expToNext;
    updates.experienceToNextLevel = Math.floor(expToNext * 1.5);
    console.log(`🎉 [GAME PROGRESS] Level up! Now level ${updates.playerLevel}`);
  } else {
    updates.experience = newExp;
  }
  
  updateProgress(updates);
  
  return {
    ...progress,
    ...updates
  };
};

// ============ TUTORIAL ============

/**
 * Mark tutorial as completed
 * @returns {Boolean} Success status
 */
export const completeTutorial = () => {
  const success = updateProgress({ tutorialCompleted: true });
  if (success) {
    localStorage.setItem('tutorialCompleted', 'true');
    console.log('📚 [GAME PROGRESS] Tutorial completed');
  }
  return success;
};

/**
 * Check if tutorial is completed
 * @returns {Boolean} Whether tutorial is completed
 */
export const isTutorialCompleted = () => {
  // Check both new and legacy locations
  const progress = getGameProgress();
  const legacy = localStorage.getItem('tutorialCompleted') === 'true';
  return progress.tutorialCompleted || legacy;
};

// ============ SETTINGS SYNC ============

/**
 * Sync game settings from userPreferences
 * This ensures settings are part of the unified progress system
 */
export const syncSettings = () => {
  try {
    // Settings are handled by userPreferences.js
    // This function ensures they're backed up with game progress
    const progress = getGameProgress();
    
    // Create a backup entry for recovery
    localStorage.setItem('settingsBackup', JSON.stringify({
      timestamp: Date.now(),
      progressSnapshot: {
        coins: progress.coins,
        completedStoryStages: progress.completedStoryStages,
        unlockedCharacters: progress.unlockedCharacters
      }
    }));
    
    return true;
  } catch (error) {
    console.error('[GAME PROGRESS] Error syncing settings:', error);
    return false;
  }
};

// ============ RESET ============

/**
 * Reset all progress (use with caution!)
 * @returns {Boolean} Success status
 */
export const resetAllProgress = () => {
  console.warn('⚠️ [GAME PROGRESS] Resetting all progress!');
  return saveGameProgress(DEFAULT_PROGRESS);
};

// ============ EXPORT/IMPORT ============

/**
 * Export progress for backup
 * @returns {String} JSON string of progress
 */
export const exportProgress = () => {
  const progress = getGameProgress();
  return JSON.stringify(progress, null, 2);
};

/**
 * Import progress from backup
 * @param {String} jsonString - JSON string of progress
 * @returns {Boolean} Success status
 */
export const importProgress = (jsonString) => {
  try {
    const progress = JSON.parse(jsonString);
    return saveGameProgress(progress);
  } catch (error) {
    console.error('[GAME PROGRESS] Error importing progress:', error);
    return false;
  }
};

// Initialize on module load - recover any legacy data
const initializeProgress = () => {
  try {
    const current = secureStorage.getItem(PROGRESS_KEY);
    if (!current) {
      // First run - try to recover legacy data
      const recovered = recoverLegacyProgress();
      if (recovered) {
        saveGameProgress(recovered);
        console.log('✅ [GAME PROGRESS] Initialized with recovered legacy data');
      } else {
        saveGameProgress(DEFAULT_PROGRESS);
        console.log('✅ [GAME PROGRESS] Initialized with defaults');
      }
    }
  } catch (error) {
    console.error('[GAME PROGRESS] Initialization error:', error);
  }
};

// Run initialization
initializeProgress();

export default {
  getGameProgress,
  saveGameProgress,
  updateProgress,
  getCoins,
  addCoins,
  spendCoins,
  getCompletedStages,
  completeStoryStage,
  isStageCompleted,
  getUnlockedCharacters,
  unlockCharacter,
  isCharacterUnlocked,
  unlockCard,
  getUnlockedCards,
  unlockTheme,
  recordGameResult,
  completeTutorial,
  isTutorialCompleted,
  syncSettings,
  resetAllProgress,
  exportProgress,
  importProgress
};

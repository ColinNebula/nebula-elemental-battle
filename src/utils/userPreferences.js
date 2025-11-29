// User Preferences and Settings Manager
// Centralized utility for managing all user customizations, settings, and statistics

import secureStorage from './secureStorage';

const PREFERENCES_KEY = 'userPreferences';

/**
 * Default user preferences structure
 */
const DEFAULT_PREFERENCES = {
  // Display & Customization
  selectedAvatar: null,
  playerName: 'Player',
  
  // Game Settings
  difficulty: 'normal',
  gameSpeed: 'normal',
  autoSortHand: true,
  confirmActions: false,
  autoEndTurn: false,
  
  // Audio Settings
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 50,
  musicVolume: 30,
  
  // Visual Settings
  animationsEnabled: true,
  particleEffects: true,
  screenShake: true,
  showStats: true,
  showTooltips: true,
  
  // Gameplay Controls
  timerEnabled: true,
  keyboardEnabled: true,
  
  // Accessibility
  colorblindMode: 'none',
  highContrast: false,
  showElementIcons: true,
  textSize: 'medium',
  
  // Timestamps
  lastUpdated: Date.now(),
  createdAt: Date.now()
};

/**
 * Get all user preferences
 * @returns {Object} User preferences object
 */
export const getUserPreferences = () => {
  try {
    const stored = secureStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      // Merge with defaults to ensure all properties exist
      return {
        ...DEFAULT_PREFERENCES,
        ...stored,
        lastAccessed: Date.now()
      };
    }
  } catch (error) {
    console.error('[USER PREFS] Error loading preferences:', error);
  }
  
  // Return defaults if nothing stored or error occurred
  return { ...DEFAULT_PREFERENCES };
};

/**
 * Save user preferences
 * @param {Object} preferences - Full or partial preferences object
 * @returns {Boolean} Success status
 */
export const saveUserPreferences = (preferences) => {
  try {
    const current = getUserPreferences();
    const updated = {
      ...current,
      ...preferences,
      lastUpdated: Date.now()
    };
    
    const success = secureStorage.setItem(PREFERENCES_KEY, updated);
    
    if (success) {
      console.log('✅ [USER PREFS] Preferences saved successfully');
      
      // Trigger custom event for components to react to preference changes
      window.dispatchEvent(new CustomEvent('userPreferencesUpdated', { 
        detail: updated 
      }));
    }
    
    return success;
  } catch (error) {
    console.error('[USER PREFS] Error saving preferences:', error);
    return false;
  }
};

/**
 * Update specific preference fields
 * @param {Object} updates - Object with preference keys to update
 * @returns {Boolean} Success status
 */
export const updatePreferences = (updates) => {
  console.log('🔄 [USER PREFS] updatePreferences called with:', updates);
  const current = getUserPreferences();
  return saveUserPreferences({ ...current, ...updates });
};

/**
 * Get specific preference value
 * @param {String} key - Preference key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Preference value
 */
export const getPreference = (key, defaultValue = null) => {
  const prefs = getUserPreferences();
  return prefs[key] !== undefined ? prefs[key] : defaultValue;
};

/**
 * Set specific preference value
 * @param {String} key - Preference key
 * @param {*} value - Value to set
 * @returns {Boolean} Success status
 */
export const setPreference = (key, value) => {
  return updatePreferences({ [key]: value });
};

/**
 * Update avatar selection
 * @param {Object} avatar - Avatar object with id, name, image, icon, element
 * @returns {Boolean} Success status
 */
export const updateAvatar = (avatar) => {
  console.log('🎭 [USER PREFS] Updating avatar:', avatar?.name || avatar);
  const success = updatePreferences({ selectedAvatar: avatar });
  
  if (success) {
    // Also update playerProfile for backwards compatibility
    let playerProfile = secureStorage.getItem('playerProfile');
    
    // Ensure playerProfile is an object, not a string
    if (typeof playerProfile === 'string') {
      try {
        playerProfile = JSON.parse(playerProfile);
      } catch (e) {
        playerProfile = {};
      }
    }
    
    if (!playerProfile || typeof playerProfile !== 'object') {
      playerProfile = {};
    }
    
    playerProfile.selectedAvatar = avatar;
    if (avatar?.name) {
      playerProfile.avatar = avatar.icon || avatar.name;
    }
    secureStorage.setItem('playerProfile', playerProfile);
  }
  
  return success;
};

/**
 * Get selected avatar
 * @returns {Object|null} Avatar object or null
 */
export const getAvatar = () => {
  return getPreference('selectedAvatar', null);
};

/**
 * Update player name
 * @param {String} name - Player name
 * @returns {Boolean} Success status
 */
export const updatePlayerName = (name) => {
  console.log('📝 [USER PREFS] Updating player name:', name);
  const success = updatePreferences({ playerName: name });
  
  if (success) {
    // Also update playerProfile for backwards compatibility
    let playerProfile = secureStorage.getItem('playerProfile');
    
    // Ensure playerProfile is an object, not a string
    if (typeof playerProfile === 'string') {
      try {
        playerProfile = JSON.parse(playerProfile);
      } catch (e) {
        playerProfile = {};
      }
    }
    
    if (!playerProfile || typeof playerProfile !== 'object') {
      playerProfile = {};
    }
    
    playerProfile.name = name;
    secureStorage.setItem('playerProfile', playerProfile);
  }
  
  return success;
};

/**
 * Get player name
 * @returns {String} Player name
 */
export const getPlayerName = () => {
  return getPreference('playerName', 'Player');
};

/**
 * Update audio settings
 * @param {Object} audioSettings - Object with soundEnabled, musicEnabled, soundVolume, musicVolume
 * @returns {Boolean} Success status
 */
export const updateAudioSettings = (audioSettings) => {
  return updatePreferences(audioSettings);
};

/**
 * Get audio settings
 * @returns {Object} Audio settings object
 */
export const getAudioSettings = () => {
  const prefs = getUserPreferences();
  return {
    soundEnabled: prefs.soundEnabled,
    musicEnabled: prefs.musicEnabled,
    soundVolume: prefs.soundVolume,
    musicVolume: prefs.musicVolume
  };
};

/**
 * Update game settings
 * @param {Object} gameSettings - Object with difficulty, gameSpeed, etc.
 * @returns {Boolean} Success status
 */
export const updateGameSettings = (gameSettings) => {
  return updatePreferences(gameSettings);
};

/**
 * Get game settings
 * @returns {Object} Game settings object
 */
export const getGameSettings = () => {
  const prefs = getUserPreferences();
  return {
    difficulty: prefs.difficulty,
    gameSpeed: prefs.gameSpeed,
    autoSortHand: prefs.autoSortHand,
    confirmActions: prefs.confirmActions,
    autoEndTurn: prefs.autoEndTurn
  };
};

/**
 * Update accessibility settings
 * @param {Object} accessibilitySettings - Object with colorblindMode, highContrast, etc.
 * @returns {Boolean} Success status
 */
export const updateAccessibilitySettings = (accessibilitySettings) => {
  return updatePreferences(accessibilitySettings);
};

/**
 * Get accessibility settings
 * @returns {Object} Accessibility settings object
 */
export const getAccessibilitySettings = () => {
  const prefs = getUserPreferences();
  return {
    colorblindMode: prefs.colorblindMode,
    highContrast: prefs.highContrast,
    showElementIcons: prefs.showElementIcons,
    textSize: prefs.textSize
  };
};

/**
 * Reset all preferences to defaults
 * @returns {Boolean} Success status
 */
export const resetPreferences = () => {
  console.log('🔄 [USER PREFS] Resetting preferences to defaults');
  return saveUserPreferences(DEFAULT_PREFERENCES);
};

/**
 * Export preferences for backup
 * @returns {String} JSON string of preferences
 */
export const exportPreferences = () => {
  const prefs = getUserPreferences();
  return JSON.stringify(prefs, null, 2);
};

/**
 * Import preferences from backup
 * @param {String} jsonString - JSON string of preferences
 * @returns {Boolean} Success status
 */
export const importPreferences = (jsonString) => {
  try {
    const prefs = JSON.parse(jsonString);
    return saveUserPreferences(prefs);
  } catch (error) {
    console.error('[USER PREFS] Error importing preferences:', error);
    return false;
  }
};

/**
 * Migrate legacy settings to new preferences system
 * This ensures backwards compatibility with existing saved data
 */
export const migrateLegacySettings = () => {
  try {
    console.log('🔄 [USER PREFS] Checking for legacy settings to migrate...');
    
    // Check if migration already done
    const prefs = getUserPreferences();
    if (prefs.migrated) {
      return;
    }
    
    // Get legacy gameSettings
    const legacySettings = secureStorage.getItem('gameSettings');
    if (legacySettings) {
      console.log('📦 [USER PREFS] Migrating legacy gameSettings...');
      updatePreferences({
        ...legacySettings,
        migrated: true
      });
    }
    
    // Get legacy playerProfile for avatar and name
    const legacyProfile = secureStorage.getItem('playerProfile');
    if (legacyProfile) {
      console.log('📦 [USER PREFS] Migrating legacy playerProfile...');
      updatePreferences({
        selectedAvatar: legacyProfile.selectedAvatar,
        playerName: legacyProfile.name || 'Player',
        migrated: true
      });
    }
    
    // Mark migration complete
    if (!prefs.migrated) {
      updatePreferences({ migrated: true });
    }
    
    console.log('✅ [USER PREFS] Migration complete');
  } catch (error) {
    console.error('[USER PREFS] Error during migration:', error);
  }
};

// Auto-migrate on module load
migrateLegacySettings();

export default {
  getUserPreferences,
  saveUserPreferences,
  updatePreferences,
  getPreference,
  setPreference,
  updateAvatar,
  getAvatar,
  updatePlayerName,
  getPlayerName,
  updateAudioSettings,
  getAudioSettings,
  updateGameSettings,
  getGameSettings,
  updateAccessibilitySettings,
  getAccessibilitySettings,
  resetPreferences,
  exportPreferences,
  importPreferences,
  migrateLegacySettings
};

// Theme system for premium users
const THEMES_KEY = 'playerThemes';

// Available color themes
export const COLOR_THEMES = {
  classic: {
    name: 'Classic',
    cost: 0,
    primary: '#4a90e2',
    secondary: '#50c878',
    accent: '#ff6b6b',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBorder: '#3a7bd5',
    textColor: '#ffffff',
    premium: false
  },
  midnight: {
    name: 'Midnight',
    cost: 50,
    primary: '#2c3e50',
    secondary: '#8e44ad',
    accent: '#e74c3c',
    background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    cardBorder: '#8e44ad',
    textColor: '#ecf0f1',
    premium: true
  },
  ocean: {
    name: 'Ocean Depths',
    cost: 75,
    primary: '#006994',
    secondary: '#00a8cc',
    accent: '#40e0d0',
    background: 'linear-gradient(135deg, #667db6 0%, #0082c8 50%, #667db6 100%)',
    cardBorder: '#00a8cc',
    textColor: '#ffffff',
    premium: true
  },
  forest: {
    name: 'Forest',
    cost: 100,
    primary: '#27ae60',
    secondary: '#2ecc71',
    accent: '#f39c12',
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    cardBorder: '#27ae60',
    textColor: '#ffffff',
    premium: true
  },
  sunset: {
    name: 'Sunset',
    cost: 125,
    primary: '#e67e22',
    secondary: '#f39c12',
    accent: '#e74c3c',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    cardBorder: '#e67e22',
    textColor: '#2c3e50',
    premium: true
  },
  neon: {
    name: 'Neon',
    cost: 150,
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#ffff00',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBorder: '#ff00ff',
    textColor: '#ffffff',
    premium: true
  },
  // Seasonal Themes
  winter: {
    name: 'Winter Wonderland',
    cost: 100,
    primary: '#b3d9ff',
    secondary: '#e6f2ff',
    accent: '#4da6ff',
    background: 'linear-gradient(135deg, #d4e7ff 0%, #b3d9ff 50%, #ffffff 100%)',
    cardBorder: '#80bfff',
    textColor: '#003d66',
    premium: true,
    seasonal: 'winter'
  },
  spring: {
    name: 'Spring Blossom',
    cost: 100,
    primary: '#ff9ff3',
    secondary: '#feca57',
    accent: '#48dbfb',
    background: 'linear-gradient(135deg, #ffeaa7 0%, #ffb3ba 50%, #bae1ff 100%)',
    cardBorder: '#ff6b9d',
    textColor: '#2c3e50',
    premium: true,
    seasonal: 'spring'
  },
  summer: {
    name: 'Summer Sunset',
    cost: 100,
    primary: '#ff6b35',
    secondary: '#f7931e',
    accent: '#feca57',
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #ff6b35 100%)',
    cardBorder: '#ff9f1c',
    textColor: '#2c3e50',
    premium: true,
    seasonal: 'summer'
  },
  autumn: {
    name: 'Autumn Leaves',
    cost: 100,
    primary: '#d35400',
    secondary: '#e67e22',
    accent: '#c0392b',
    background: 'linear-gradient(135deg, #be4d25 0%, #d68910 50%, #c0392b 100%)',
    cardBorder: '#d35400',
    textColor: '#ffffff',
    premium: true,
    seasonal: 'autumn'
  },
  halloween: {
    name: 'Spooky Halloween',
    cost: 125,
    primary: '#ff6b35',
    secondary: '#9b59b6',
    accent: '#f39c12',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    cardBorder: '#ff6b35',
    textColor: '#ffffff',
    premium: true,
    seasonal: 'halloween'
  },
  christmas: {
    name: 'Christmas Joy',
    cost: 125,
    primary: '#c0392b',
    secondary: '#27ae60',
    accent: '#f39c12',
    background: 'linear-gradient(135deg, #e74c3c 0%, #27ae60 50%, #e74c3c 100%)',
    cardBorder: '#c0392b',
    textColor: '#ffffff',
    premium: true,
    seasonal: 'christmas'
  },
  valentines: {
    name: 'Valentine\'s Day',
    cost: 100,
    primary: '#e91e63',
    secondary: '#ff4081',
    accent: '#ff80ab',
    background: 'linear-gradient(135deg, #ff6b9d 0%, #ffc3a0 50%, #ff6b9d 100%)',
    cardBorder: '#e91e63',
    textColor: '#ffffff',
    premium: true,
    seasonal: 'valentines'
  },
  newyear: {
    name: 'New Year Celebration',
    cost: 125,
    primary: '#ffd700',
    secondary: '#ff6b35',
    accent: '#4a90e2',
    background: 'linear-gradient(135deg, #ffd700 0%, #ff6b35 50%, #9b59b6 100%)',
    cardBorder: '#ffd700',
    textColor: '#2c3e50',
    premium: true,
    seasonal: 'newyear'
  }
};

// Available hand themes
export const HAND_THEMES = {
  standard: {
    name: 'Standard',
    cost: 0,
    cardBack: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
    handBackground: 'rgba(0, 0, 0, 0.3)',
    glowEffect: 'none',
    premium: false
  },
  cosmic: {
    name: 'Cosmic',
    cost: 80,
    cardBack: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    handBackground: 'rgba(102, 126, 234, 0.2)',
    glowEffect: '0 0 20px rgba(102, 126, 234, 0.5)',
    premium: true
  },
  flame: {
    name: 'Flame',
    cost: 90,
    cardBack: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
    handBackground: 'rgba(255, 107, 107, 0.2)',
    glowEffect: '0 0 20px rgba(255, 107, 107, 0.5)',
    premium: true
  },
  ice: {
    name: 'Ice',
    cost: 85,
    cardBack: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
    handBackground: 'rgba(116, 185, 255, 0.2)',
    glowEffect: '0 0 20px rgba(116, 185, 255, 0.5)',
    premium: true
  },
  gold: {
    name: 'Gold',
    cost: 120,
    cardBack: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    handBackground: 'rgba(243, 156, 18, 0.2)',
    glowEffect: '0 0 25px rgba(243, 156, 18, 0.6)',
    premium: true
  },
  shadow: {
    name: 'Shadow',
    cost: 110,
    cardBack: 'linear-gradient(135deg, #2d3436 0%, #636e72 100%)',
    handBackground: 'rgba(45, 52, 54, 0.3)',
    glowEffect: '0 0 20px rgba(45, 52, 54, 0.7)',
    premium: true
  },
  // Seasonal Hand Themes
  snowflake: {
    name: 'Snowflake',
    cost: 95,
    cardBack: 'linear-gradient(135deg, #e6f2ff 0%, #b3d9ff 100%)',
    handBackground: 'rgba(179, 217, 255, 0.3)',
    glowEffect: '0 0 25px rgba(179, 217, 255, 0.8)',
    premium: true,
    seasonal: 'winter'
  },
  sakura: {
    name: 'Sakura Petals',
    cost: 95,
    cardBack: 'linear-gradient(135deg, #ffb3ba 0%, #ff9ff3 100%)',
    handBackground: 'rgba(255, 179, 186, 0.3)',
    glowEffect: '0 0 25px rgba(255, 159, 243, 0.6)',
    premium: true,
    seasonal: 'spring'
  },
  tropical: {
    name: 'Tropical',
    cost: 95,
    cardBack: 'linear-gradient(135deg, #feca57 0%, #ff6b35 100%)',
    handBackground: 'rgba(254, 202, 87, 0.3)',
    glowEffect: '0 0 25px rgba(255, 107, 53, 0.6)',
    premium: true,
    seasonal: 'summer'
  },
  harvest: {
    name: 'Harvest Moon',
    cost: 95,
    cardBack: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
    handBackground: 'rgba(230, 126, 34, 0.3)',
    glowEffect: '0 0 25px rgba(211, 84, 0, 0.7)',
    premium: true,
    seasonal: 'autumn'
  },
  pumpkin: {
    name: 'Pumpkin Spice',
    cost: 100,
    cardBack: 'linear-gradient(135deg, #ff6b35 0%, #9b59b6 100%)',
    handBackground: 'rgba(255, 107, 53, 0.3)',
    glowEffect: '0 0 30px rgba(155, 89, 182, 0.7)',
    premium: true,
    seasonal: 'halloween'
  },
  holly: {
    name: 'Holly Jolly',
    cost: 100,
    cardBack: 'linear-gradient(135deg, #e74c3c 0%, #27ae60 100%)',
    handBackground: 'rgba(231, 76, 60, 0.3)',
    glowEffect: '0 0 30px rgba(39, 174, 96, 0.7)',
    premium: true,
    seasonal: 'christmas'
  },
  cupid: {
    name: 'Cupid\'s Arrow',
    cost: 95,
    cardBack: 'linear-gradient(135deg, #e91e63 0%, #ff80ab 100%)',
    handBackground: 'rgba(233, 30, 99, 0.3)',
    glowEffect: '0 0 25px rgba(255, 128, 171, 0.7)',
    premium: true,
    seasonal: 'valentines'
  },
  fireworks: {
    name: 'Fireworks',
    cost: 100,
    cardBack: 'linear-gradient(135deg, #ffd700 0%, #ff6b35 50%, #9b59b6 100%)',
    handBackground: 'rgba(255, 215, 0, 0.3)',
    glowEffect: '0 0 30px rgba(255, 107, 53, 0.8)',
    premium: true,
    seasonal: 'newyear'
  }
};

// Arena/Battlefield Themes
export const ARENA_THEMES = {
  cosmic: {
    name: 'Cosmic Battlefield',
    cost: 0,
    background: 'radial-gradient(ellipse at center, rgba(30, 30, 60, 0.95) 0%, rgba(10, 10, 30, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(138, 43, 226, 0.1) 0%, transparent 50%, rgba(0, 191, 255, 0.1) 100%)',
    borderGlow: '0 0 40px rgba(138, 43, 226, 0.6), inset 0 0 40px rgba(0, 191, 255, 0.3)',
    particles: 'rgba(255, 255, 255, 0.8)',
    premium: false
  },
  volcano: {
    name: 'Volcanic Arena',
    cost: 75,
    background: 'radial-gradient(ellipse at center, rgba(50, 20, 10, 0.95) 0%, rgba(20, 10, 5, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(255, 69, 0, 0.2) 0%, transparent 50%, rgba(255, 140, 0, 0.15) 100%)',
    borderGlow: '0 0 40px rgba(255, 69, 0, 0.8), inset 0 0 40px rgba(255, 140, 0, 0.4)',
    particles: 'rgba(255, 140, 0, 0.9)',
    premium: true
  },
  ice: {
    name: 'Frozen Tundra',
    cost: 75,
    background: 'radial-gradient(ellipse at center, rgba(20, 40, 60, 0.95) 0%, rgba(10, 20, 35, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(173, 216, 230, 0.2) 0%, transparent 50%, rgba(135, 206, 250, 0.15) 100%)',
    borderGlow: '0 0 40px rgba(0, 191, 255, 0.8), inset 0 0 40px rgba(173, 216, 230, 0.4)',
    particles: 'rgba(173, 216, 230, 0.9)',
    premium: true
  },
  forest: {
    name: 'Enchanted Forest',
    cost: 80,
    background: 'radial-gradient(ellipse at center, rgba(20, 40, 20, 0.95) 0%, rgba(10, 25, 10, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(34, 139, 34, 0.2) 0%, transparent 50%, rgba(50, 205, 50, 0.15) 100%)',
    borderGlow: '0 0 40px rgba(34, 139, 34, 0.8), inset 0 0 40px rgba(50, 205, 50, 0.4)',
    particles: 'rgba(144, 238, 144, 0.9)',
    premium: true
  },
  desert: {
    name: 'Desert Wasteland',
    cost: 70,
    background: 'radial-gradient(ellipse at center, rgba(60, 50, 30, 0.95) 0%, rgba(40, 35, 20, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(244, 164, 96, 0.2) 0%, transparent 50%, rgba(210, 180, 140, 0.15) 100%)',
    borderGlow: '0 0 40px rgba(244, 164, 96, 0.7), inset 0 0 40px rgba(210, 180, 140, 0.3)',
    particles: 'rgba(244, 164, 96, 0.8)',
    premium: true
  },
  ocean: {
    name: 'Ocean Depths',
    cost: 85,
    background: 'radial-gradient(ellipse at center, rgba(10, 30, 50, 0.95) 0%, rgba(5, 15, 30, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(0, 119, 190, 0.2) 0%, transparent 50%, rgba(0, 150, 199, 0.15) 100%)',
    borderGlow: '0 0 40px rgba(0, 119, 190, 0.8), inset 0 0 40px rgba(0, 191, 255, 0.4)',
    particles: 'rgba(64, 224, 208, 0.9)',
    premium: true
  },
  electric: {
    name: 'Lightning Storm',
    cost: 90,
    background: 'radial-gradient(ellipse at center, rgba(30, 30, 50, 0.95) 0%, rgba(15, 15, 30, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(255, 255, 0, 0.15) 0%, transparent 50%, rgba(138, 43, 226, 0.1) 100%)',
    borderGlow: '0 0 50px rgba(255, 255, 0, 0.9), inset 0 0 40px rgba(138, 43, 226, 0.5)',
    particles: 'rgba(255, 255, 0, 1)',
    premium: true
  },
  shadow: {
    name: 'Shadow Realm',
    cost: 95,
    background: 'radial-gradient(ellipse at center, rgba(15, 15, 20, 0.98) 0%, rgba(5, 5, 10, 1) 100%)',
    overlay: 'linear-gradient(180deg, rgba(75, 0, 130, 0.2) 0%, transparent 50%, rgba(138, 43, 226, 0.15) 100%)',
    borderGlow: '0 0 40px rgba(75, 0, 130, 0.9), inset 0 0 40px rgba(138, 43, 226, 0.5)',
    particles: 'rgba(138, 43, 226, 0.9)',
    premium: true
  },
  celestial: {
    name: 'Celestial Palace',
    cost: 100,
    background: 'radial-gradient(ellipse at center, rgba(255, 250, 240, 0.15) 0%, rgba(255, 228, 196, 0.1) 50%, rgba(30, 30, 60, 0.95) 100%)',
    overlay: 'linear-gradient(180deg, rgba(255, 215, 0, 0.15) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)',
    borderGlow: '0 0 50px rgba(255, 215, 0, 0.9), inset 0 0 50px rgba(255, 255, 255, 0.5)',
    particles: 'rgba(255, 215, 0, 1)',
    premium: true
  },
  inferno: {
    name: 'Demonic Inferno',
    cost: 110,
    background: 'radial-gradient(ellipse at center, rgba(60, 10, 10, 0.95) 0%, rgba(30, 5, 5, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(220, 20, 60, 0.25) 0%, transparent 50%, rgba(255, 69, 0, 0.2) 100%)',
    borderGlow: '0 0 50px rgba(220, 20, 60, 0.9), inset 0 0 50px rgba(255, 69, 0, 0.6)',
    particles: 'rgba(220, 20, 60, 1)',
    premium: true
  }
};

// Get current themes
export const getCurrentThemes = () => {
  const stored = localStorage.getItem(THEMES_KEY);
  if (!stored) {
    return {
      colorTheme: 'classic',
      handTheme: 'standard',
      arenaTheme: 'cosmic',
      ownedThemes: ['classic', 'standard', 'cosmic'],
      coins: 0
    };
  }
  return JSON.parse(stored);
};

// Save themes
export const saveThemes = (themes) => {
  localStorage.setItem(THEMES_KEY, JSON.stringify(themes));
};

// Purchase theme
export const purchaseTheme = (themeType, themeId, currentThemes) => {
  const theme = themeType === 'color' ? COLOR_THEMES[themeId] : HAND_THEMES[themeId];
  
  if (!theme || !theme.premium) {
    return { success: false, message: 'Theme not found or already owned' };
  }
  
  if (currentThemes.coins < theme.cost) {
    return { success: false, message: 'Insufficient coins' };
  }
  
  if (currentThemes.ownedThemes.includes(themeId)) {
    return { success: false, message: 'Theme already owned' };
  }
  
  const updatedThemes = {
    ...currentThemes,
    coins: currentThemes.coins - theme.cost,
    ownedThemes: [...currentThemes.ownedThemes, themeId]
  };
  
  saveThemes(updatedThemes);
  return { success: true, message: `${theme.name} theme purchased!`, updatedThemes };
};

// Apply theme
export const applyTheme = (themeType, themeId, currentThemes) => {
  if (!currentThemes.ownedThemes.includes(themeId)) {
    return { success: false, message: 'Theme not owned' };
  }
  
  const themeKey = themeType === 'color' ? 'colorTheme' : 
                   themeType === 'hand' ? 'handTheme' : 
                   themeType === 'arena' ? 'arenaTheme' : 'colorTheme';
  
  const updatedThemes = {
    ...currentThemes,
    [themeKey]: themeId
  };
  
  saveThemes(updatedThemes);
  
  // Apply CSS variables for theme
  if (themeType === 'color') {
    applyColorTheme(themeId);
  } else if (themeType === 'hand') {
    applyHandTheme(themeId);
  } else if (themeType === 'arena') {
    applyArenaTheme(themeId);
  }
  
  // Dispatch custom event to notify components of theme change
  window.dispatchEvent(new CustomEvent('themeUpdated', { detail: { themeType, themeId } }));
  
  return { success: true, updatedThemes };
};

// Apply color theme to CSS variables
export const applyColorTheme = (themeId) => {
  const theme = COLOR_THEMES[themeId];
  if (!theme) return;
  
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-secondary', theme.secondary);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-background', theme.background);
  root.style.setProperty('--theme-card-border', theme.cardBorder);
  root.style.setProperty('--theme-text-color', theme.textColor);
};

// Apply hand theme
export const applyHandTheme = (themeId) => {
  const theme = HAND_THEMES[themeId];
  if (!theme) return;
  
  const root = document.documentElement;
  root.style.setProperty('--hand-card-back', theme.cardBack);
  root.style.setProperty('--hand-background', theme.handBackground);
  root.style.setProperty('--hand-glow-effect', theme.glowEffect);
};

// Apply arena theme
export const applyArenaTheme = (themeId) => {
  const theme = ARENA_THEMES[themeId];
  if (!theme) return;
  
  const root = document.documentElement;
  root.style.setProperty('--arena-background', theme.background);
  root.style.setProperty('--arena-overlay', theme.overlay);
  root.style.setProperty('--arena-border-glow', theme.borderGlow);
  root.style.setProperty('--arena-particles', theme.particles);
};

// Award coins for winning
export const awardCoins = (gameResult, isStoryMode = false) => {
  const currentThemes = getCurrentThemes();
  let coinsEarned = 0;
  
  if (gameResult.won) {
    coinsEarned = 10; // Base win reward
    
    if (gameResult.playerScore > gameResult.aiScore + 2) {
      coinsEarned += 5; // Bonus for dominating win
    }
    
    if (gameResult.playerScore > 0 && gameResult.aiScore === 0) {
      coinsEarned += 10; // Perfect game bonus
    }
    
    if (isStoryMode) {
      coinsEarned += 5; // Story mode bonus
    }
  } else if (gameResult.tied) {
    coinsEarned = 3; // Small reward for ties
  }
  
  const updatedThemes = {
    ...currentThemes,
    coins: currentThemes.coins + coinsEarned
  };
  
  saveThemes(updatedThemes);
  return { coinsEarned, totalCoins: updatedThemes.coins };
};

// Initialize themes on app load
export const initializeThemes = () => {
  const currentThemes = getCurrentThemes();
  applyColorTheme(currentThemes.colorTheme);
  applyHandTheme(currentThemes.handTheme);
  return currentThemes;
};
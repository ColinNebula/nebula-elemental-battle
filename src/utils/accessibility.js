// Accessibility utilities for colorblind modes, high contrast, and more

// Colorblind-friendly color palettes for elements
export const COLORBLIND_PALETTES = {
  none: {
    FIRE: '#ff4444',
    ICE: '#44ccff',
    WATER: '#4444ff',
    ELECTRICITY: '#ffff00',
    EARTH: '#8b4513',
    POWER: '#ff00ff',
    LIGHT: '#ffeb3b',
    DARK: '#9c27b0',
    NEUTRAL: '#9e9e9e',
    TECHNOLOGY: '#00ffff',
    METEOR: '#ff6600'
  },
  protanopia: { // Red-blind
    FIRE: '#d4a82f', // Gold instead of red
    ICE: '#00bfff',
    WATER: '#0066ff',
    ELECTRICITY: '#ffff66',
    EARTH: '#a0522d',
    POWER: '#9966ff',
    LIGHT: '#ffeb3b',
    DARK: '#6a1b9a',
    NEUTRAL: '#9e9e9e',
    TECHNOLOGY: '#00e5e5',
    METEOR: '#ff9933'
  },
  deuteranopia: { // Green-blind
    FIRE: '#ff6666',
    ICE: '#66b3ff',
    WATER: '#3366ff',
    ELECTRICITY: '#ffff99',
    EARTH: '#996633',
    POWER: '#cc66ff',
    LIGHT: '#ffdd66',
    DARK: '#9933cc',
    NEUTRAL: '#b3b3b3',
    TECHNOLOGY: '#33cccc',
    METEOR: '#ff8833'
  },
  tritanopia: { // Blue-blind
    FIRE: '#ff3333',
    ICE: '#33ffcc',
    WATER: '#00cc99',
    ELECTRICITY: '#ffff33',
    EARTH: '#cc6633',
    POWER: '#ff3399',
    LIGHT: '#ffff66',
    DARK: '#cc3366',
    NEUTRAL: '#999999',
    TECHNOLOGY: '#00ffcc',
    METEOR: '#ff6633'
  },
  achromatopsia: { // Total colorblind (grayscale)
    FIRE: '#e0e0e0',
    ICE: '#c0c0c0',
    WATER: '#a0a0a0',
    ELECTRICITY: '#f0f0f0',
    EARTH: '#808080',
    POWER: '#d0d0d0',
    LIGHT: '#f5f5f5',
    DARK: '#606060',
    NEUTRAL: '#909090',
    TECHNOLOGY: '#b0b0b0',
    METEOR: '#c8c8c8'
  }
};

// Element icons for better identification
export const ELEMENT_ICONS = {
  'FIRE': '🔥',
  'ICE': '❄️',
  'WATER': '💧',
  'ELECTRICITY': '⚡',
  'EARTH': '🌍',
  'POWER': '⭐',
  'LIGHT': '☀️',
  'DARK': '🌙',
  'NEUTRAL': '🔮',
  'TECHNOLOGY': '🤖',
  'METEOR': '☄️'
};

// Element text labels (in case icons are disabled)
export const ELEMENT_LABELS = {
  'FIRE': 'FIR',
  'ICE': 'ICE',
  'WATER': 'WAT',
  'ELECTRICITY': 'ELC',
  'EARTH': 'ERT',
  'POWER': 'POW',
  'LIGHT': 'LGT',
  'DARK': 'DRK',
  'NEUTRAL': 'NEU',
  'TECHNOLOGY': 'TEC',
  'METEOR': 'MET'
};

// Apply colorblind mode colors to the document
export const applyColorblindMode = (mode = 'none') => {
  const palette = COLORBLIND_PALETTES[mode] || COLORBLIND_PALETTES.none;
  const root = document.documentElement;
  
  Object.entries(palette).forEach(([element, color]) => {
    root.style.setProperty(`--element-${element.toLowerCase()}-color`, color);
  });
  
  // Save to localStorage
  localStorage.setItem('colorblindMode', mode);
};

// Apply high contrast mode
export const applyHighContrast = (enabled = false) => {
  const root = document.documentElement;
  
  if (enabled) {
    root.style.setProperty('--contrast-bg', '#000000');
    root.style.setProperty('--contrast-fg', '#ffffff');
    root.style.setProperty('--contrast-border', '#ffffff');
    root.style.setProperty('--contrast-accent', '#ffff00');
    root.classList.add('high-contrast');
  } else {
    root.style.setProperty('--contrast-bg', '');
    root.style.setProperty('--contrast-fg', '');
    root.style.setProperty('--contrast-border', '');
    root.style.setProperty('--contrast-accent', '');
    root.classList.remove('high-contrast');
  }
  
  localStorage.setItem('highContrast', enabled);
};

// Apply text size setting
export const applyTextSize = (size = 'medium') => {
  const root = document.documentElement;
  
  const sizeMap = {
    small: '0.875',   // 87.5%
    medium: '1',      // 100%
    large: '1.125',   // 112.5%
    xl: '1.25'        // 125%
  };
  
  const scale = sizeMap[size] || sizeMap.medium;
  root.style.setProperty('--text-scale', scale);
  
  localStorage.setItem('textSize', size);
};

// Get element color based on current colorblind mode
export const getElementColor = (element, colorblindMode = 'none') => {
  const palette = COLORBLIND_PALETTES[colorblindMode] || COLORBLIND_PALETTES.none;
  return palette[element] || '#666';
};

// Get element icon or label based on settings
export const getElementDisplay = (element, showIcons = true) => {
  if (showIcons) {
    return ELEMENT_ICONS[element] || '?';
  }
  return ELEMENT_LABELS[element] || '???';
};

// Initialize accessibility settings from localStorage
export const initializeAccessibility = () => {
  const colorblindMode = localStorage.getItem('colorblindMode') || 'none';
  const highContrast = localStorage.getItem('highContrast') === 'true';
  const textSize = localStorage.getItem('textSize') || 'medium';
  
  applyColorblindMode(colorblindMode);
  applyHighContrast(highContrast);
  applyTextSize(textSize);
  
  return {
    colorblindMode,
    highContrast,
    textSize,
    showElementIcons: localStorage.getItem('showElementIcons') !== 'false'
  };
};

// Generate accessible contrast ratios
export const getAccessibleColor = (baseColor, isHighContrast) => {
  if (isHighContrast) {
    // Return maximum contrast colors
    return '#ffffff';
  }
  return baseColor;
};

export default {
  applyColorblindMode,
  applyHighContrast,
  applyTextSize,
  getElementColor,
  getElementDisplay,
  initializeAccessibility,
  getAccessibleColor,
  ELEMENT_ICONS,
  ELEMENT_LABELS,
  COLORBLIND_PALETTES
};

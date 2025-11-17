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
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    premium: false
  },
  midnight: {
    name: 'Midnight Eclipse',
    cost: 50,
    primary: '#2c3e50',
    secondary: '#8e44ad',
    accent: '#e74c3c',
    background: 'linear-gradient(135deg, #2c3e50 0%, #4a148c 50%, #1a1a2e 100%)',
    cardBorder: '#8e44ad',
    textColor: '#ecf0f1',
    textShadow: '0 0 10px rgba(142, 68, 173, 0.8), 2px 2px 4px rgba(0,0,0,0.8)',
    premium: true
  },
  ocean: {
    name: 'Ocean Depths',
    cost: 75,
    primary: '#006994',
    secondary: '#00a8cc',
    accent: '#40e0d0',
    background: 'linear-gradient(135deg, #005c97 0%, #363795 50%, #005c97 100%)',
    cardBorder: '#00a8cc',
    textColor: '#ffffff',
    textShadow: '0 0 15px rgba(0, 168, 204, 0.8), 2px 2px 4px rgba(0,0,0,0.7)',
    premium: true
  },
  forest: {
    name: 'Mystic Forest',
    cost: 100,
    primary: '#27ae60',
    secondary: '#2ecc71',
    accent: '#f39c12',
    background: 'linear-gradient(135deg, #134e5e 0%, #71b280 50%, #134e5e 100%)',
    cardBorder: '#27ae60',
    textColor: '#ffffff',
    textShadow: '0 0 12px rgba(46, 204, 113, 0.8), 2px 2px 4px rgba(0,0,0,0.7)',
    premium: true
  },
  sunset: {
    name: 'Radiant Sunset',
    cost: 125,
    primary: '#e67e22',
    secondary: '#f39c12',
    accent: '#e74c3c',
    background: 'linear-gradient(135deg, #ff5e62 0%, #ff9966 50%, #ff5e62 100%)',
    cardBorder: '#e67e22',
    textColor: '#ffffff',
    textShadow: '0 0 15px rgba(243, 156, 18, 0.9), 2px 2px 4px rgba(0,0,0,0.6)',
    premium: true
  },
  neon: {
    name: 'Neon Cyberpunk',
    cost: 150,
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#ffff00',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
    cardBorder: '#ff00ff',
    textColor: '#ffffff',
    textShadow: '0 0 20px rgba(255, 0, 255, 1), 0 0 10px rgba(0, 255, 255, 0.8)',
    premium: true
  },
  galactic: {
    name: 'Galactic Void',
    cost: 175,
    primary: '#6a0dad',
    secondary: '#9d4edd',
    accent: '#c77dff',
    background: 'linear-gradient(135deg, #240046 0%, #5a189a 25%, #9d4edd 50%, #5a189a 75%, #240046 100%)',
    cardBorder: '#9d4edd',
    textColor: '#ffffff',
    textShadow: '0 0 25px rgba(157, 78, 221, 1), 0 0 15px rgba(106, 13, 173, 0.8)',
    premium: true
  },
  phoenix: {
    name: 'Phoenix Rising',
    cost: 200,
    primary: '#ff4500',
    secondary: '#ffa500',
    accent: '#ffff00',
    background: 'linear-gradient(135deg, #8b0000 0%, #ff4500 25%, #ffa500 50%, #ff4500 75%, #8b0000 100%)',
    cardBorder: '#ff4500',
    textColor: '#ffffff',
    textShadow: '0 0 30px rgba(255, 165, 0, 1), 0 0 20px rgba(255, 69, 0, 0.8), 2px 2px 4px rgba(0,0,0,0.8)',
    premium: true
  },
  // Seasonal Themes
  winter: {
    name: 'Winter Wonderland',
    cost: 100,
    primary: '#b3d9ff',
    secondary: '#e6f2ff',
    accent: '#4da6ff',
    background: 'linear-gradient(135deg, #d4e7ff 0%, #b3d9ff 25%, #ffffff 50%, #b3d9ff 75%, #d4e7ff 100%)',
    cardBorder: '#80bfff',
    textColor: '#003d66',
    textShadow: '0 0 8px rgba(179, 217, 255, 0.8), 1px 1px 3px rgba(0,0,0,0.4)',
    premium: true,
    seasonal: 'winter'
  },
  spring: {
    name: 'Spring Blossom',
    cost: 100,
    primary: '#ff9ff3',
    secondary: '#feca57',
    accent: '#48dbfb',
    background: 'linear-gradient(135deg, #ffeaa7 0%, #ffb3ba 25%, #ffaec9 50%, #bae1ff 75%, #ffeaa7 100%)',
    cardBorder: '#ff6b9d',
    textColor: '#2c3e50',
    textShadow: '0 0 8px rgba(255, 179, 186, 0.8), 1px 1px 3px rgba(0,0,0,0.3)',
    premium: true,
    seasonal: 'spring'
  },
  summer: {
    name: 'Summer Sunset',
    cost: 100,
    primary: '#ff6b35',
    secondary: '#f7931e',
    accent: '#feca57',
    background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 25%, #ff6b35 50%, #ffd200 75%, #f7971e 100%)',
    cardBorder: '#ff9f1c',
    textColor: '#2c3e50',
    textShadow: '0 0 10px rgba(255, 210, 0, 0.9), 1px 1px 3px rgba(0,0,0,0.4)',
    premium: true,
    seasonal: 'summer'
  },
  autumn: {
    name: 'Autumn Leaves',
    cost: 100,
    primary: '#d35400',
    secondary: '#e67e22',
    accent: '#c0392b',
    background: 'linear-gradient(135deg, #be4d25 0%, #d68910 25%, #c0392b 50%, #d68910 75%, #be4d25 100%)',
    cardBorder: '#d35400',
    textColor: '#ffffff',
    textShadow: '0 0 12px rgba(230, 126, 34, 0.9), 2px 2px 4px rgba(0,0,0,0.7)',
    premium: true,
    seasonal: 'autumn'
  },
  halloween: {
    name: 'Spooky Halloween',
    cost: 125,
    primary: '#ff6b35',
    secondary: '#9b59b6',
    accent: '#f39c12',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #ff6b35 50%, #16213e 75%, #1a1a2e 100%)',
    cardBorder: '#ff6b35',
    textColor: '#ffffff',
    textShadow: '0 0 20px rgba(255, 107, 53, 1), 0 0 10px rgba(155, 89, 182, 0.8)',
    premium: true,
    seasonal: 'halloween'
  },
  christmas: {
    name: 'Christmas Joy',
    cost: 125,
    primary: '#c0392b',
    secondary: '#27ae60',
    accent: '#f39c12',
    background: 'linear-gradient(135deg, #e74c3c 0%, #27ae60 25%, #ffffff 50%, #27ae60 75%, #e74c3c 100%)',
    cardBorder: '#c0392b',
    textColor: '#ffffff',
    textShadow: '0 0 15px rgba(231, 76, 60, 0.9), 0 0 10px rgba(39, 174, 96, 0.8)',
    premium: true,
    seasonal: 'christmas'
  },
  valentines: {
    name: 'Valentine\'s Day',
    cost: 100,
    primary: '#e91e63',
    secondary: '#ff4081',
    accent: '#ff80ab',
    background: 'linear-gradient(135deg, #ff6b9d 0%, #ffc3a0 25%, #ff6b9d 50%, #ffc3a0 75%, #ff6b9d 100%)',
    cardBorder: '#e91e63',
    textColor: '#ffffff',
    textShadow: '0 0 15px rgba(255, 64, 129, 0.9), 2px 2px 4px rgba(0,0,0,0.5)',
    premium: true,
    seasonal: 'valentines'
  },
  newyear: {
    name: 'New Year Celebration',
    cost: 125,
    primary: '#ffd700',
    secondary: '#ff6b35',
    accent: '#4a90e2',
    background: 'linear-gradient(135deg, #ffd700 0%, #ff6b35 20%, #9b59b6 40%, #4a90e2 60%, #9b59b6 80%, #ffd700 100%)',
    cardBorder: '#ffd700',
    textColor: '#2c3e50',
    textShadow: '0 0 20px rgba(255, 215, 0, 1), 0 0 15px rgba(255, 107, 53, 0.8)',
    premium: true,
    seasonal: 'newyear'
  }
};

// Available hand themes
export const HAND_THEMES = {
  standard: {
    name: 'Standard',
    cost: 0,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(0, 0, 0, 0.3)',
    glowEffect: 'none',
    borderStyle: '2px solid rgba(74, 144, 226, 0.5)',
    animation: 'none',
    premium: false
  },
  cosmic: {
    name: 'Cosmic Void',
    cost: 80,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(102, 126, 234, 0.25)',
    glowEffect: '0 0 25px rgba(102, 126, 234, 0.6), 0 0 40px rgba(118, 75, 162, 0.4)',
    borderStyle: '3px solid rgba(102, 126, 234, 0.7)',
    animation: 'pulse 3s ease-in-out infinite',
    premium: true
  },
  flame: {
    name: 'Infernal Flame',
    cost: 90,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(255, 107, 107, 0.25)',
    glowEffect: '0 0 30px rgba(255, 107, 107, 0.7), 0 0 50px rgba(238, 90, 82, 0.5)',
    borderStyle: '3px solid rgba(255, 107, 107, 0.8)',
    animation: 'flicker 2s ease-in-out infinite',
    premium: true
  },
  ice: {
    name: 'Frozen Crystal',
    cost: 85,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(116, 185, 255, 0.25)',
    glowEffect: '0 0 25px rgba(116, 185, 255, 0.7), 0 0 45px rgba(9, 132, 227, 0.5)',
    borderStyle: '3px solid rgba(116, 185, 255, 0.8)',
    animation: 'shimmer 4s ease-in-out infinite',
    premium: true
  },
  gold: {
    name: 'Royal Gold',
    cost: 120,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(243, 156, 18, 0.3)',
    glowEffect: '0 0 35px rgba(243, 156, 18, 0.8), 0 0 60px rgba(230, 126, 34, 0.6)',
    borderStyle: '4px solid rgba(243, 156, 18, 0.9)',
    animation: 'goldShine 3s ease-in-out infinite',
    premium: true
  },
  shadow: {
    name: 'Shadow Realm',
    cost: 110,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(45, 52, 54, 0.4)',
    glowEffect: '0 0 30px rgba(45, 52, 54, 0.9), 0 0 50px rgba(99, 110, 114, 0.7)',
    borderStyle: '3px solid rgba(99, 110, 114, 0.9)',
    animation: 'shadowPulse 3.5s ease-in-out infinite',
    premium: true
  },
  rainbow: {
    name: 'Rainbow Prism',
    cost: 150,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(255, 140, 0, 0.2)',
    glowEffect: '0 0 40px rgba(255, 0, 128, 0.6), 0 0 60px rgba(64, 224, 208, 0.5)',
    borderStyle: '4px solid rgba(255, 140, 0, 0.8)',
    animation: 'rainbowShift 5s linear infinite',
    premium: true
  },
  plasma: {
    name: 'Plasma Storm',
    cost: 175,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(255, 0, 255, 0.25)',
    glowEffect: '0 0 45px rgba(255, 0, 255, 0.8), 0 0 70px rgba(0, 255, 255, 0.6)',
    borderStyle: '5px solid rgba(255, 0, 255, 1)',
    animation: 'plasmaFlow 4s ease-in-out infinite',
    premium: true
  },
  // Seasonal Hand Themes
  snowflake: {
    name: 'Snowflake Frost',
    cost: 95,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(179, 217, 255, 0.3)',
    glowEffect: '0 0 30px rgba(179, 217, 255, 0.9), 0 0 50px rgba(230, 242, 255, 0.7)',
    borderStyle: '3px solid rgba(179, 217, 255, 1)',
    animation: 'snowfall 5s linear infinite',
    premium: true,
    seasonal: 'winter'
  },
  sakura: {
    name: 'Sakura Petals',
    cost: 95,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(255, 179, 186, 0.3)',
    glowEffect: '0 0 30px rgba(255, 159, 243, 0.8), 0 0 50px rgba(255, 179, 186, 0.6)',
    borderStyle: '3px solid rgba(255, 159, 243, 0.9)',
    animation: 'petalFloat 6s ease-in-out infinite',
    premium: true,
    seasonal: 'spring'
  },
  tropical: {
    name: 'Tropical Paradise',
    cost: 95,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(254, 202, 87, 0.3)',
    glowEffect: '0 0 35px rgba(255, 107, 53, 0.8), 0 0 55px rgba(254, 202, 87, 0.6)',
    borderStyle: '3px solid rgba(255, 107, 53, 0.9)',
    animation: 'heatWave 3s ease-in-out infinite',
    premium: true,
    seasonal: 'summer'
  },
  harvest: {
    name: 'Harvest Moon',
    cost: 95,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(230, 126, 34, 0.3)',
    glowEffect: '0 0 30px rgba(211, 84, 0, 0.9), 0 0 50px rgba(230, 126, 34, 0.7)',
    borderStyle: '3px solid rgba(211, 84, 0, 1)',
    animation: 'autumnGlow 4s ease-in-out infinite',
    premium: true,
    seasonal: 'autumn'
  },
  pumpkin: {
    name: 'Pumpkin Spice',
    cost: 100,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(255, 107, 53, 0.3)',
    glowEffect: '0 0 40px rgba(155, 89, 182, 0.9), 0 0 60px rgba(255, 107, 53, 0.7)',
    borderStyle: '4px solid rgba(155, 89, 182, 1)',
    animation: 'spookyPulse 2s ease-in-out infinite',
    premium: true,
    seasonal: 'halloween'
  },
  holly: {
    name: 'Holly Jolly',
    cost: 100,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(231, 76, 60, 0.3)',
    glowEffect: '0 0 40px rgba(39, 174, 96, 0.9), 0 0 60px rgba(231, 76, 60, 0.7)',
    borderStyle: '4px solid rgba(39, 174, 96, 1)',
    animation: 'festiveGlow 3s ease-in-out infinite',
    premium: true,
    seasonal: 'christmas'
  },
  cupid: {
    name: 'Cupid\'s Arrow',
    cost: 95,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(233, 30, 99, 0.3)',
    glowEffect: '0 0 35px rgba(255, 128, 171, 0.9), 0 0 55px rgba(233, 30, 99, 0.7)',
    borderStyle: '3px solid rgba(255, 128, 171, 1)',
    animation: 'heartbeat 2s ease-in-out infinite',
    premium: true,
    seasonal: 'valentines'
  },
  fireworks: {
    name: 'Fireworks Burst',
    cost: 100,
    cardBack: `url(${process.env.PUBLIC_URL}/cards-back.png)`,
    handBackground: 'rgba(255, 215, 0, 0.3)',
    glowEffect: '0 0 45px rgba(255, 107, 53, 1), 0 0 65px rgba(155, 89, 182, 0.8)',
    borderStyle: '4px solid rgba(255, 215, 0, 1)',
    animation: 'fireworksPop 2.5s ease-in-out infinite',
    premium: true,
    seasonal: 'newyear'
  }
};

// Arena/Battlefield Themes
export const ARENA_THEMES = {
  cosmic: {
    name: 'Cosmic Battlefield',
    cost: 0,
    background: 'radial-gradient(ellipse at center, rgba(30, 30, 60, 0.95) 0%, rgba(15, 15, 45, 0.97) 50%, rgba(10, 10, 30, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(138, 43, 226, 0.15) 0%, rgba(75, 0, 130, 0.05) 25%, transparent 50%, rgba(0, 119, 190, 0.05) 75%, rgba(0, 191, 255, 0.15) 100%)',
    borderGlow: '0 0 50px rgba(138, 43, 226, 0.7), 0 0 80px rgba(0, 191, 255, 0.4), inset 0 0 50px rgba(0, 191, 255, 0.35)',
    particles: 'rgba(255, 255, 255, 0.9)',
    particleCount: 60,
    animation: 'cosmicFloat 8s ease-in-out infinite',
    premium: false
  },
  volcano: {
    name: 'Volcanic Arena',
    cost: 75,
    background: 'radial-gradient(ellipse at center, rgba(50, 20, 10, 0.95) 0%, rgba(35, 15, 8, 0.97) 50%, rgba(20, 10, 5, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(255, 69, 0, 0.25) 0%, rgba(255, 100, 30, 0.1) 25%, transparent 50%, rgba(255, 140, 0, 0.1) 75%, rgba(255, 140, 0, 0.2) 100%)',
    borderGlow: '0 0 55px rgba(255, 69, 0, 0.9), 0 0 85px rgba(255, 140, 0, 0.5), inset 0 0 60px rgba(255, 140, 0, 0.45)',
    particles: 'rgba(255, 140, 0, 1)',
    particleCount: 100,
    animation: 'lavaFlow 5s ease-in-out infinite',
    premium: true
  },
  ice: {
    name: 'Frozen Tundra',
    cost: 75,
    background: 'radial-gradient(ellipse at center, rgba(20, 40, 60, 0.95) 0%, rgba(15, 30, 48, 0.97) 50%, rgba(10, 20, 35, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(173, 216, 230, 0.25) 0%, rgba(135, 206, 250, 0.1) 25%, transparent 50%, rgba(100, 180, 220, 0.1) 75%, rgba(135, 206, 250, 0.2) 100%)',
    borderGlow: '0 0 55px rgba(0, 191, 255, 0.9), 0 0 85px rgba(173, 216, 230, 0.5), inset 0 0 60px rgba(173, 216, 230, 0.5)',
    particles: 'rgba(173, 216, 230, 1)',
    particleCount: 120,
    animation: 'frostShimmer 6s ease-in-out infinite',
    premium: true
  },
  forest: {
    name: 'Enchanted Forest',
    cost: 80,
    background: 'radial-gradient(ellipse at center, rgba(20, 40, 20, 0.95) 0%, rgba(15, 32, 15, 0.97) 50%, rgba(10, 25, 10, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(34, 139, 34, 0.25) 0%, rgba(40, 180, 40, 0.1) 25%, transparent 50%, rgba(50, 205, 50, 0.1) 75%, rgba(50, 205, 50, 0.2) 100%)',
    borderGlow: '0 0 50px rgba(34, 139, 34, 0.9), 0 0 80px rgba(50, 205, 50, 0.5), inset 0 0 55px rgba(50, 205, 50, 0.45)',
    particles: 'rgba(144, 238, 144, 1)',
    particleCount: 85,
    animation: 'leafRustle 7s ease-in-out infinite',
    premium: true
  },
  desert: {
    name: 'Desert Wasteland',
    cost: 70,
    background: 'radial-gradient(ellipse at center, rgba(60, 50, 30, 0.95) 0%, rgba(50, 43, 25, 0.97) 50%, rgba(40, 35, 20, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(244, 164, 96, 0.25) 0%, rgba(230, 150, 90, 0.1) 25%, transparent 50%, rgba(210, 180, 140, 0.1) 75%, rgba(210, 180, 140, 0.2) 100%)',
    borderGlow: '0 0 50px rgba(244, 164, 96, 0.8), 0 0 75px rgba(210, 180, 140, 0.4), inset 0 0 50px rgba(210, 180, 140, 0.4)',
    particles: 'rgba(244, 164, 96, 0.9)',
    particleCount: 110,
    animation: 'sandStorm 4s ease-in-out infinite',
    premium: true
  },
  ocean: {
    name: 'Ocean Depths',
    cost: 85,
    background: 'radial-gradient(ellipse at center, rgba(10, 30, 50, 0.95) 0%, rgba(8, 23, 40, 0.97) 50%, rgba(5, 15, 30, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(0, 119, 190, 0.25) 0%, rgba(0, 140, 200, 0.1) 25%, transparent 50%, rgba(0, 150, 199, 0.1) 75%, rgba(0, 150, 199, 0.2) 100%)',
    borderGlow: '0 0 55px rgba(0, 119, 190, 0.9), 0 0 90px rgba(0, 191, 255, 0.5), inset 0 0 60px rgba(0, 191, 255, 0.5)',
    particles: 'rgba(64, 224, 208, 1)',
    particleCount: 130,
    animation: 'waveFlow 8s ease-in-out infinite',
    premium: true
  },
  electric: {
    name: 'Lightning Storm',
    cost: 90,
    background: 'radial-gradient(ellipse at center, rgba(30, 30, 50, 0.95) 0%, rgba(23, 23, 40, 0.97) 50%, rgba(15, 15, 30, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(255, 255, 0, 0.2) 0%, rgba(255, 255, 100, 0.08) 25%, transparent 50%, rgba(138, 43, 226, 0.08) 75%, rgba(138, 43, 226, 0.15) 100%)',
    borderGlow: '0 0 60px rgba(255, 255, 0, 1), 0 0 95px rgba(138, 43, 226, 0.6), inset 0 0 65px rgba(138, 43, 226, 0.6)',
    particles: 'rgba(255, 255, 0, 1)',
    particleCount: 150,
    animation: 'electricPulse 2s ease-in-out infinite',
    premium: true
  },
  shadow: {
    name: 'Shadow Realm',
    cost: 95,
    background: 'radial-gradient(ellipse at center, rgba(15, 15, 20, 0.98) 0%, rgba(10, 10, 15, 0.99) 50%, rgba(5, 5, 10, 1) 100%)',
    overlay: 'linear-gradient(180deg, rgba(75, 0, 130, 0.25) 0%, rgba(100, 20, 150, 0.1) 25%, transparent 50%, rgba(138, 43, 226, 0.1) 75%, rgba(138, 43, 226, 0.2) 100%)',
    borderGlow: '0 0 55px rgba(75, 0, 130, 1), 0 0 85px rgba(138, 43, 226, 0.6), inset 0 0 60px rgba(138, 43, 226, 0.6)',
    particles: 'rgba(138, 43, 226, 1)',
    particleCount: 75,
    animation: 'shadowDrift 9s ease-in-out infinite',
    premium: true
  },
  celestial: {
    name: 'Celestial Palace',
    cost: 100,
    background: 'radial-gradient(ellipse at center, rgba(255, 250, 240, 0.18) 0%, rgba(255, 240, 220, 0.12) 30%, rgba(255, 228, 196, 0.1) 50%, rgba(50, 50, 100, 0.96) 75%, rgba(30, 30, 60, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 230, 100, 0.1) 25%, transparent 50%, rgba(255, 255, 255, 0.08) 75%, rgba(255, 255, 255, 0.15) 100%)',
    borderGlow: '0 0 65px rgba(255, 215, 0, 1), 0 0 100px rgba(255, 255, 255, 0.6), inset 0 0 70px rgba(255, 255, 255, 0.6)',
    particles: 'rgba(255, 215, 0, 1)',
    particleCount: 180,
    animation: 'holyGlow 5s ease-in-out infinite',
    premium: true
  },
  inferno: {
    name: 'Demonic Inferno',
    cost: 110,
    background: 'radial-gradient(ellipse at center, rgba(60, 10, 10, 0.95) 0%, rgba(45, 8, 8, 0.97) 50%, rgba(30, 5, 5, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(220, 20, 60, 0.3) 0%, rgba(240, 40, 70, 0.12) 25%, transparent 50%, rgba(255, 69, 0, 0.12) 75%, rgba(255, 69, 0, 0.25) 100%)',
    borderGlow: '0 0 65px rgba(220, 20, 60, 1), 0 0 100px rgba(255, 69, 0, 0.7), inset 0 0 70px rgba(255, 69, 0, 0.7)',
    particles: 'rgba(220, 20, 60, 1)',
    particleCount: 200,
    animation: 'infernalBlaze 3s ease-in-out infinite',
    premium: true
  },
  aurora: {
    name: 'Aurora Borealis',
    cost: 125,
    background: 'radial-gradient(ellipse at center, rgba(10, 30, 50, 0.95) 0%, rgba(8, 35, 55, 0.97) 50%, rgba(5, 25, 45, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(0, 230, 184, 0.25) 0%, rgba(50, 240, 200, 0.1) 25%, transparent 50%, rgba(100, 200, 255, 0.1) 75%, rgba(150, 150, 255, 0.2) 100%)',
    borderGlow: '0 0 70px rgba(0, 230, 184, 1), 0 0 110px rgba(150, 150, 255, 0.7), inset 0 0 75px rgba(0, 230, 184, 0.6)',
    particles: 'rgba(0, 230, 184, 1)',
    particleCount: 160,
    animation: 'auroraShift 10s ease-in-out infinite',
    premium: true
  },
  nebula: {
    name: 'Nebula Expanse',
    cost: 140,
    background: 'radial-gradient(ellipse at center, rgba(26, 0, 51, 0.95) 0%, rgba(50, 10, 80, 0.97) 30%, rgba(77, 0, 153, 0.98) 60%, rgba(50, 10, 80, 0.97) 85%, rgba(26, 0, 51, 0.98) 100%)',
    overlay: 'linear-gradient(180deg, rgba(153, 51, 255, 0.3) 0%, rgba(200, 100, 255, 0.12) 25%, transparent 50%, rgba(255, 0, 255, 0.12) 75%, rgba(255, 0, 255, 0.25) 100%)',
    borderGlow: '0 0 80px rgba(255, 0, 255, 1), 0 0 130px rgba(153, 51, 255, 0.8), inset 0 0 85px rgba(255, 0, 255, 0.7)',
    particles: 'rgba(255, 0, 255, 1)',
    particleCount: 250,
    animation: 'nebulaSwirl 12s ease-in-out infinite',
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
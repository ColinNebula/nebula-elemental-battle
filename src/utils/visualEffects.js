// Visual Effects Utility
// Handles critical hits, elemental particles, and advanced visual effects

import soundManager from './sounds';

// Detect mobile for performance optimization
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         ('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0);
};

// Screen shake effect for critical hits
export const createScreenShake = (intensity = 'medium', duration = 400) => {
  const gameBoard = document.querySelector('.game-board');
  if (!gameBoard) return;

  const intensityMap = {
    light: 5,
    medium: 10,
    heavy: 15
  };

  const shakeAmount = intensityMap[intensity] || 10;
  
  gameBoard.style.animation = `screenShake ${duration}ms ease-in-out`;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes screenShake {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      10% { transform: translate(-${shakeAmount}px, ${shakeAmount}px) rotate(-1deg); }
      20% { transform: translate(${shakeAmount}px, -${shakeAmount}px) rotate(1deg); }
      30% { transform: translate(-${shakeAmount}px, -${shakeAmount}px) rotate(-1deg); }
      40% { transform: translate(${shakeAmount}px, ${shakeAmount}px) rotate(1deg); }
      50% { transform: translate(-${shakeAmount}px, ${shakeAmount}px) rotate(-1deg); }
      60% { transform: translate(${shakeAmount}px, -${shakeAmount}px) rotate(1deg); }
      70% { transform: translate(-${shakeAmount}px, -${shakeAmount}px) rotate(-1deg); }
      80% { transform: translate(${shakeAmount}px, ${shakeAmount}px) rotate(1deg); }
      90% { transform: translate(-${shakeAmount}px, ${shakeAmount}px) rotate(-1deg); }
    }
  `;
  
  if (!document.getElementById('shake-style')) {
    style.id = 'shake-style';
    document.head.appendChild(style);
  }

  setTimeout(() => {
    gameBoard.style.animation = '';
  }, duration);
};

// Critical hit detection and effect
export const handleCriticalHit = (card, cardElement, container) => {
  const power = card?.modifiedStrength || card?.strength || 0;
  const isCritical = power >= 8;

  if (!isCritical || !cardElement || !container) return false;

  // Screen shake
  const intensity = power >= 10 ? 'heavy' : 'medium';
  createScreenShake(intensity, 500);

  // Critical hit overlay positioned on the card being hit
  const critOverlay = document.createElement('div');
  critOverlay.className = 'critical-hit-overlay';
  critOverlay.innerHTML = `
    <div class="critical-hit-burst"></div>
    <div class="critical-hit-text">CRITICAL HIT!</div>
    <div class="critical-hit-damage">×${power}</div>
  `;
  
  // Append to the card element instead of container for relative positioning
  cardElement.style.position = 'relative';
  cardElement.appendChild(critOverlay);

  setTimeout(() => {
    critOverlay.remove();
  }, 2000);

  // Add critical glow to card
  cardElement.classList.add('critical-hit-glow');
  setTimeout(() => {
    cardElement.classList.remove('critical-hit-glow');
  }, 2000);

  return true;
};

// Meteor strike effect on card
export const handleMeteorStrike = (cardElement, container) => {
  if (!cardElement || !container) return;

  // Play meteor strike sound effect
  if (soundManager) {
    soundManager.playSound('meteorStrike');
  }

  // Create meteor strike overlay on the card
  const meteorOverlay = document.createElement('div');
  meteorOverlay.className = 'meteor-strike-card-overlay';
  meteorOverlay.innerHTML = `
    <div class="meteor-impact">☄️</div>
    <div class="meteor-strike-card-text">METEOR!</div>
  `;
  
  // Append to the card element for relative positioning
  cardElement.style.position = 'relative';
  cardElement.appendChild(meteorOverlay);

  // Add impact glow to card
  cardElement.classList.add('meteor-impact-glow');

  setTimeout(() => {
    meteorOverlay.remove();
    cardElement.classList.remove('meteor-impact-glow');
  }, 1500);

  // Small screen shake
  createScreenShake('light', 300);
};

// Elemental weather particles
export const createElementalWeather = (element, container) => {
  if (!container) return;

  const weatherContainer = document.createElement('div');
  weatherContainer.className = `elemental-weather ${element.toLowerCase()}-weather`;
  
  // Significantly reduce particles on mobile
  const particleCount = isMobile() ? 8 : 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = `weather-particle ${element.toLowerCase()}-particle`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 3}s`;
    particle.style.animationDuration = `${3 + Math.random() * 2}s`;
    
    // Element-specific particle content
    switch(element.toLowerCase()) {
      case 'water':
        particle.textContent = '💧';
        break;
      case 'fire':
        particle.textContent = '🔥';
        break;
      case 'earth':
        particle.textContent = '🍃';
        break;
      case 'air':
        particle.textContent = '💨';
        break;
      case 'ice':
        particle.textContent = '❄️';
        break;
      case 'lightning':
        particle.textContent = '⚡';
        break;
      case 'shadow':
        particle.textContent = '🌑';
        break;
      case 'light':
        particle.textContent = '✨';
        break;
      default:
        particle.textContent = '✦';
    }
    
    weatherContainer.appendChild(particle);
  }
  
  container.appendChild(weatherContainer);

  setTimeout(() => {
    weatherContainer.remove();
  }, 4000);
};

// Card rarity glow/shimmer effect
export const applyCardRarityGlow = (cardElement, power) => {
  if (!cardElement) return;

  let rarityClass = '';
  
  if (power >= 10) {
    rarityClass = 'legendary-card';
  } else if (power >= 8) {
    rarityClass = 'epic-card';
  } else if (power >= 6) {
    rarityClass = 'rare-card';
  } else if (power >= 4) {
    rarityClass = 'uncommon-card';
  }

  if (rarityClass) {
    cardElement.classList.add(rarityClass);
  }
};

// Victory pose animation for winning card
export const createWinnerVictoryPose = (cardElement) => {
  if (!cardElement) return;

  cardElement.classList.add('victory-pose-winner');
  
  // Add sparkles
  const sparkles = document.createElement('div');
  sparkles.className = 'victory-sparkles';
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.setProperty('--angle', `${i * 30}deg`);
    sparkles.appendChild(sparkle);
  }
  cardElement.appendChild(sparkles);

  setTimeout(() => {
    sparkles.remove();
    cardElement.classList.remove('victory-pose-winner');
  }, 3000);
};

// Defeat animation for losing card
export const createDefeatAnimation = (cardElement) => {
  if (!cardElement) return;

  // Crumble effect
  cardElement.classList.add('card-defeat-crumble');
  
  // Create shatter particles
  const shatterContainer = document.createElement('div');
  shatterContainer.className = 'card-shatter-particles';
  
  for (let i = 0; i < 8; i++) {
    const shard = document.createElement('div');
    shard.className = 'shard';
    shard.style.setProperty('--shard-x', `${(Math.random() - 0.5) * 200}px`);
    shard.style.setProperty('--shard-y', `${(Math.random() - 0.5) * 200}px`);
    shard.style.setProperty('--shard-rotation', `${Math.random() * 720}deg`);
    shatterContainer.appendChild(shard);
  }
  
  cardElement.appendChild(shatterContainer);

  setTimeout(() => {
    shatterContainer.remove();
    cardElement.classList.remove('card-defeat-crumble');
  }, 1500);
};

// Dynamic background based on winning element
export const applyElementalBackground = (element, container) => {
  if (!container) return;

  const bgOverlay = document.createElement('div');
  bgOverlay.className = `elemental-background-overlay ${element.toLowerCase()}-background`;
  
  container.appendChild(bgOverlay);

  setTimeout(() => {
    bgOverlay.classList.add('active');
  }, 50);

  return () => {
    bgOverlay.classList.remove('active');
    setTimeout(() => bgOverlay.remove(), 1000);
  };
};

// Slow-motion replay effect
export const createSlowMotionReplay = (container, callback) => {
  if (!container) return;

  const replayOverlay = document.createElement('div');
  replayOverlay.className = 'slow-motion-overlay';
  replayOverlay.innerHTML = `
    <div class="slow-motion-indicator">
      <div class="slow-motion-icon">🎬</div>
      <div class="slow-motion-text">REPLAY</div>
    </div>
  `;
  
  container.appendChild(replayOverlay);
  container.classList.add('slow-motion-active');

  setTimeout(() => {
    container.classList.remove('slow-motion-active');
    replayOverlay.classList.add('fade-out');
    setTimeout(() => {
      replayOverlay.remove();
      if (callback) callback();
    }, 500);
  }, 2500);
};

// Decisive play detection (close match or game-winning)
export const isDecisivePlay = (humanPower, aiPower, isGameOver) => {
  const powerDifference = Math.abs(humanPower - aiPower);
  const isCloseMatch = powerDifference <= 2;
  return isCloseMatch || isGameOver;
};

// Combined effect for epic moments
export const createEpicMoment = (winningCard, losingCard, element, container) => {
  if (!container) return;

  // Slow-motion effect
  createSlowMotionReplay(container);

  // Critical hit check
  const power = winningCard?.modifiedStrength || winningCard?.strength || 0;
  if (power >= 8) {
    setTimeout(() => {
      const winnerElement = container.querySelector('.player-row .played-card-wrapper:last-child, .ai-row .played-card-wrapper:last-child');
      if (winnerElement) {
        handleCriticalHit(winningCard, winnerElement, container);
      }
    }, 500);
  }

  // Elemental weather
  setTimeout(() => {
    createElementalWeather(element, container);
  }, 800);

  // Victory/defeat animations
  setTimeout(() => {
    if (winningCard) {
      const winnerElement = container.querySelector('.player-row .played-card-wrapper:last-child, .ai-row .played-card-wrapper:last-child');
      if (winnerElement) createWinnerVictoryPose(winnerElement);
    }
    if (losingCard) {
      const loserElement = container.querySelector('.ai-row .played-card-wrapper:last-child, .player-row .played-card-wrapper:last-child');
      if (loserElement) createDefeatAnimation(loserElement);
    }
  }, 1200);

  // Dynamic background
  setTimeout(() => {
    applyElementalBackground(element, container);
  }, 1500);
};

// ============================================================================
// ULTIMATE ABILITY VISUAL EFFECTS
// ============================================================================

// Ultimate ability configuration for visual effects
const ULTIMATE_VISUALS = {
  meteor_strike: {
    icon: '☄️',
    color: '#ff6b35',
    particles: ['☄️', '🔥', '💥', '✨'],
    screenEffect: 'meteor-flash',
    soundType: 'meteorStrike'
  },
  phoenix_rebirth: {
    icon: '🔥',
    color: '#ff4500',
    particles: ['🔥', '🦅', '✨', '💫'],
    screenEffect: 'phoenix-flash',
    soundType: 'fire'
  },
  void_collapse: {
    icon: '🌑',
    color: '#4a0080',
    particles: ['🌑', '🌀', '⚫', '💀'],
    screenEffect: 'void-flash',
    soundType: 'magic'
  },
  divine_intervention: {
    icon: '✨',
    color: '#ffd700',
    particles: ['✨', '💫', '⭐', '🌟'],
    screenEffect: 'divine-flash',
    soundType: 'fairy'
  },
  elemental_fury: {
    icon: '💥',
    color: '#ff1744',
    particles: ['💥', '⚡', '🔥', '❄️'],
    screenEffect: 'fury-flash',
    soundType: 'fireball'
  },
  time_freeze: {
    icon: '❄️',
    color: '#00bcd4',
    particles: ['❄️', '🕐', '💠', '⏰'],
    screenEffect: 'freeze-flash',
    soundType: 'ice'
  },
  card_shuffle: {
    icon: '🔄',
    color: '#9c27b0',
    particles: ['🃏', '🔄', '✨', '💫'],
    screenEffect: 'shuffle-flash',
    soundType: 'swoosh'
  },
  mirror_image: {
    icon: '👥',
    color: '#2196f3',
    particles: ['👥', '🪞', '✨', '💠'],
    screenEffect: 'mirror-flash',
    soundType: 'magic'
  }
};

// Create the ultimate activation effect
export const createUltimateActivation = (ultimateId, container) => {
  if (!container) return;

  const visualConfig = ULTIMATE_VISUALS[ultimateId] || ULTIMATE_VISUALS.meteor_strike;
  
  // Play ultimate sound
  if (soundManager) {
    soundManager.playSound(visualConfig.soundType);
  }

  // Create full-screen flash overlay
  const flashOverlay = document.createElement('div');
  flashOverlay.className = `ultimate-flash-overlay ${visualConfig.screenEffect}`;
  flashOverlay.style.setProperty('--ultimate-color', visualConfig.color);
  container.appendChild(flashOverlay);

  // Create the central burst effect
  const burstContainer = document.createElement('div');
  burstContainer.className = 'ultimate-burst-container';
  
  // Main icon burst
  const mainIcon = document.createElement('div');
  mainIcon.className = 'ultimate-main-icon';
  mainIcon.textContent = visualConfig.icon;
  mainIcon.style.setProperty('--ultimate-color', visualConfig.color);
  burstContainer.appendChild(mainIcon);

  // Expanding rings
  for (let i = 0; i < 3; i++) {
    const ring = document.createElement('div');
    ring.className = 'ultimate-ring';
    ring.style.setProperty('--ring-delay', `${i * 0.15}s`);
    ring.style.setProperty('--ultimate-color', visualConfig.color);
    burstContainer.appendChild(ring);
  }

  container.appendChild(burstContainer);

  // Create particle explosion
  const particleContainer = document.createElement('div');
  particleContainer.className = 'ultimate-particle-container';
  
  const particleCount = isMobile() ? 15 : 30;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'ultimate-particle';
    particle.textContent = visualConfig.particles[i % visualConfig.particles.length];
    
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 150 + Math.random() * 200;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    
    particle.style.setProperty('--particle-x', `${x}px`);
    particle.style.setProperty('--particle-y', `${y}px`);
    particle.style.setProperty('--particle-delay', `${Math.random() * 0.3}s`);
    particle.style.setProperty('--particle-rotation', `${Math.random() * 720}deg`);
    
    particleContainer.appendChild(particle);
  }
  
  container.appendChild(particleContainer);

  // Screen shake - heavy for ultimates
  createScreenShake('heavy', 600);

  // Add ultimate-specific effects
  switch (ultimateId) {
    case 'meteor_strike':
      createMeteorRain(container, visualConfig);
      break;
    case 'phoenix_rebirth':
      createPhoenixRise(container, visualConfig);
      break;
    case 'void_collapse':
      createVoidVortex(container, visualConfig);
      break;
    case 'time_freeze':
      createTimeFreezeEffect(container, visualConfig);
      break;
    case 'divine_intervention':
      createDivineLight(container, visualConfig);
      break;
    default:
      break;
  }

  // Cleanup
  setTimeout(() => {
    flashOverlay.remove();
    burstContainer.remove();
    particleContainer.remove();
  }, 2500);
};

// Meteor rain effect for Meteor Strike
const createMeteorRain = (container, config) => {
  const meteorContainer = document.createElement('div');
  meteorContainer.className = 'meteor-rain-container';
  
  const meteorCount = isMobile() ? 5 : 10;
  
  for (let i = 0; i < meteorCount; i++) {
    const meteor = document.createElement('div');
    meteor.className = 'falling-meteor';
    meteor.innerHTML = `
      <span class="meteor-head">☄️</span>
      <span class="meteor-trail"></span>
    `;
    meteor.style.left = `${10 + Math.random() * 80}%`;
    meteor.style.animationDelay = `${i * 0.15}s`;
    meteorContainer.appendChild(meteor);
  }
  
  container.appendChild(meteorContainer);
  
  setTimeout(() => meteorContainer.remove(), 2500);
};

// Phoenix rise effect
const createPhoenixRise = (container, config) => {
  const phoenixContainer = document.createElement('div');
  phoenixContainer.className = 'phoenix-rise-container';
  
  // Phoenix figure
  const phoenix = document.createElement('div');
  phoenix.className = 'rising-phoenix';
  phoenix.innerHTML = `
    <div class="phoenix-body">🔥</div>
    <div class="phoenix-wings">🦅</div>
    <div class="phoenix-aura"></div>
  `;
  phoenixContainer.appendChild(phoenix);
  
  // Fire particles
  for (let i = 0; i < (isMobile() ? 10 : 20); i++) {
    const flame = document.createElement('div');
    flame.className = 'phoenix-flame';
    flame.textContent = '🔥';
    flame.style.left = `${40 + Math.random() * 20}%`;
    flame.style.animationDelay = `${Math.random() * 1}s`;
    phoenixContainer.appendChild(flame);
  }
  
  container.appendChild(phoenixContainer);
  
  setTimeout(() => phoenixContainer.remove(), 3000);
};

// Void vortex effect
const createVoidVortex = (container, config) => {
  const vortexContainer = document.createElement('div');
  vortexContainer.className = 'void-vortex-container';
  
  // Central vortex
  const vortex = document.createElement('div');
  vortex.className = 'void-vortex';
  vortexContainer.appendChild(vortex);
  
  // Swirling particles
  for (let i = 0; i < (isMobile() ? 12 : 24); i++) {
    const particle = document.createElement('div');
    particle.className = 'void-particle';
    particle.textContent = config.particles[i % config.particles.length];
    particle.style.setProperty('--orbit-delay', `${i * 0.1}s`);
    particle.style.setProperty('--orbit-distance', `${60 + (i % 3) * 40}px`);
    vortexContainer.appendChild(particle);
  }
  
  container.appendChild(vortexContainer);
  
  setTimeout(() => vortexContainer.remove(), 2500);
};

// Time freeze effect
const createTimeFreezeEffect = (container, config) => {
  const freezeContainer = document.createElement('div');
  freezeContainer.className = 'time-freeze-container';
  
  // Frozen clock
  const clock = document.createElement('div');
  clock.className = 'frozen-clock';
  clock.innerHTML = `
    <div class="clock-face">🕐</div>
    <div class="clock-shatter"></div>
  `;
  freezeContainer.appendChild(clock);
  
  // Ice crystals
  for (let i = 0; i < (isMobile() ? 8 : 16); i++) {
    const crystal = document.createElement('div');
    crystal.className = 'ice-crystal';
    crystal.textContent = '❄️';
    crystal.style.left = `${Math.random() * 100}%`;
    crystal.style.top = `${Math.random() * 100}%`;
    crystal.style.animationDelay = `${Math.random() * 0.5}s`;
    freezeContainer.appendChild(crystal);
  }
  
  // Freeze wave
  const freezeWave = document.createElement('div');
  freezeWave.className = 'freeze-wave';
  freezeContainer.appendChild(freezeWave);
  
  container.appendChild(freezeContainer);
  
  setTimeout(() => freezeContainer.remove(), 2500);
};

// Divine light effect
const createDivineLight = (container, config) => {
  const divineContainer = document.createElement('div');
  divineContainer.className = 'divine-light-container';
  
  // Light beams
  for (let i = 0; i < 8; i++) {
    const beam = document.createElement('div');
    beam.className = 'divine-beam';
    beam.style.setProperty('--beam-angle', `${i * 45}deg`);
    beam.style.animationDelay = `${i * 0.1}s`;
    divineContainer.appendChild(beam);
  }
  
  // Central light
  const centralLight = document.createElement('div');
  centralLight.className = 'divine-center';
  centralLight.textContent = '✨';
  divineContainer.appendChild(centralLight);
  
  // Healing sparkles
  for (let i = 0; i < (isMobile() ? 10 : 20); i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'divine-sparkle';
    sparkle.textContent = config.particles[i % config.particles.length];
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 1}s`;
    divineContainer.appendChild(sparkle);
  }
  
  container.appendChild(divineContainer);
  
  setTimeout(() => divineContainer.remove(), 2500);
};

// ============================================
// NEW AAA-QUALITY VISUAL EFFECTS
// ============================================

/**
 * Card Trail Effect - Creates a glowing trail when cards are played
 * @param {HTMLElement} cardElement - The card being played
 * @param {HTMLElement} container - The game board container
 * @param {string} element - The element type for color
 */
export const createCardTrail = (cardElement, container, element = 'NEUTRAL') => {
  if (!cardElement || !container) return;
  
  const elementColors = {
    FIRE: '#ff4500',
    WATER: '#00bfff',
    ICE: '#87ceeb',
    EARTH: '#8b4513',
    ELECTRICITY: '#ffd700',
    LIGHT: '#fffacd',
    DARK: '#4b0082',
    NEUTRAL: '#9370db',
    TECHNOLOGY: '#00ffff'
  };
  
  const color = elementColors[element] || elementColors.NEUTRAL;
  const trailCount = isMobile() ? 5 : 10;
  
  // Get card position
  const rect = cardElement.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  for (let i = 0; i < trailCount; i++) {
    const trail = document.createElement('div');
    trail.className = 'card-trail-particle';
    trail.style.cssText = `
      position: absolute;
      left: ${rect.left - containerRect.left + rect.width / 2}px;
      top: ${rect.top - containerRect.top + rect.height / 2}px;
      width: ${12 - i}px;
      height: ${12 - i}px;
      background: radial-gradient(circle, ${color}, transparent);
      border-radius: 50%;
      pointer-events: none;
      opacity: ${1 - i * 0.1};
      animation: trailFade ${0.3 + i * 0.05}s ease-out forwards;
      animation-delay: ${i * 0.03}s;
      z-index: 100;
      filter: blur(${i * 0.5}px);
      box-shadow: 0 0 ${10 - i}px ${color};
    `;
    container.appendChild(trail);
    
    setTimeout(() => trail.remove(), 500 + i * 50);
  }
};

/**
 * Floating Damage Numbers - Shows damage dealt with floating animation
 * @param {number} damage - The damage amount
 * @param {HTMLElement} targetElement - Where to show the damage
 * @param {string} type - 'damage', 'heal', 'critical', 'blocked'
 */
export const createFloatingDamage = (damage, targetElement, type = 'damage') => {
  if (!targetElement) return;
  
  const typeConfig = {
    damage: { color: '#ff4444', prefix: '-', icon: '💥' },
    heal: { color: '#44ff44', prefix: '+', icon: '💚' },
    critical: { color: '#ffaa00', prefix: '💀', icon: '⚡' },
    blocked: { color: '#4488ff', prefix: '🛡️', icon: '' },
    bonus: { color: '#ff00ff', prefix: '+', icon: '✨' }
  };
  
  const config = typeConfig[type] || typeConfig.damage;
  const rect = targetElement.getBoundingClientRect();
  
  const damageEl = document.createElement('div');
  damageEl.className = `floating-damage ${type}`;
  damageEl.innerHTML = `
    <span class="damage-icon">${config.icon}</span>
    <span class="damage-number">${config.prefix}${damage}</span>
  `;
  damageEl.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top}px;
    color: ${config.color};
    font-size: ${type === 'critical' ? '32px' : '24px'};
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.8), 0 0 10px ${config.color};
    pointer-events: none;
    z-index: 10000;
    animation: floatDamageUp 1.5s ease-out forwards;
    transform: translateX(-50%);
    white-space: nowrap;
  `;
  
  document.body.appendChild(damageEl);
  
  setTimeout(() => damageEl.remove(), 1500);
};

/**
 * Impact Sparks - Creates spark explosion when cards clash
 * @param {HTMLElement} container - The game board container
 * @param {number} x - X position (percentage)
 * @param {number} y - Y position (percentage)
 * @param {string} winnerElement - Element of the winning card
 */
export const createImpactSparks = (container, x = 50, y = 50, winnerElement = 'NEUTRAL') => {
  if (!container) return;
  
  const elementColors = {
    FIRE: ['#ff4500', '#ff8c00', '#ffd700'],
    WATER: ['#00bfff', '#4169e1', '#87ceeb'],
    ICE: ['#87ceeb', '#e0ffff', '#b0e0e6'],
    EARTH: ['#8b4513', '#daa520', '#228b22'],
    ELECTRICITY: ['#ffd700', '#ffff00', '#ffffff'],
    LIGHT: ['#fffacd', '#ffffff', '#ffd700'],
    DARK: ['#4b0082', '#8b008b', '#9400d3'],
    NEUTRAL: ['#9370db', '#dda0dd', '#ee82ee'],
    TECHNOLOGY: ['#00ffff', '#00ced1', '#40e0d0']
  };
  
  const colors = elementColors[winnerElement] || elementColors.NEUTRAL;
  const sparkCount = isMobile() ? 12 : 24;
  
  const sparkContainer = document.createElement('div');
  sparkContainer.className = 'impact-spark-container';
  sparkContainer.style.cssText = `
    position: absolute;
    left: ${x}%;
    top: ${y}%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 500;
  `;
  
  // Central flash
  const flash = document.createElement('div');
  flash.className = 'impact-flash';
  flash.style.cssText = `
    position: absolute;
    width: 100px;
    height: 100px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, white, ${colors[0]}, transparent);
    border-radius: 50%;
    animation: impactFlash 0.3s ease-out forwards;
  `;
  sparkContainer.appendChild(flash);
  
  // Sparks flying outward
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement('div');
    const angle = (i / sparkCount) * 360;
    const distance = 50 + Math.random() * 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 4 + Math.random() * 8;
    
    spark.className = 'impact-spark';
    spark.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 0 ${size * 2}px ${color};
      animation: sparkFly 0.6s ease-out forwards;
      --angle: ${angle}deg;
      --distance: ${distance}px;
    `;
    sparkContainer.appendChild(spark);
  }
  
  // Shockwave ring
  const shockwave = document.createElement('div');
  shockwave.className = 'impact-shockwave';
  shockwave.style.cssText = `
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 3px solid ${colors[0]};
    border-radius: 50%;
    animation: shockwaveExpand 0.5s ease-out forwards;
    box-shadow: 0 0 20px ${colors[0]};
  `;
  sparkContainer.appendChild(shockwave);
  
  container.appendChild(sparkContainer);
  
  // Play impact sound
  if (soundManager) {
    soundManager.playSound('cardClash');
  }
  
  setTimeout(() => sparkContainer.remove(), 800);
};

/**
 * Power Charge-up Aura - High power cards pulse with energy before impact
 * @param {HTMLElement} cardElement - The card to add aura to
 * @param {number} power - Card power level
 * @param {string} element - Element type
 */
export const createPowerChargeAura = (cardElement, power, element = 'NEUTRAL') => {
  if (!cardElement || power < 6) return; // Only for strong cards
  
  const elementColors = {
    FIRE: '#ff4500',
    WATER: '#00bfff',
    ICE: '#87ceeb',
    EARTH: '#8b4513',
    ELECTRICITY: '#ffd700',
    LIGHT: '#fffacd',
    DARK: '#4b0082',
    NEUTRAL: '#9370db',
    TECHNOLOGY: '#00ffff'
  };
  
  const color = elementColors[element] || elementColors.NEUTRAL;
  const intensity = Math.min((power - 5) / 5, 1); // 0-1 based on power 6-10
  
  const aura = document.createElement('div');
  aura.className = 'power-charge-aura';
  aura.style.cssText = `
    position: absolute;
    inset: -${10 + intensity * 10}px;
    border-radius: 12px;
    background: radial-gradient(ellipse, ${color}40, transparent 70%);
    animation: powerPulse ${1.5 - intensity * 0.5}s ease-in-out infinite;
    pointer-events: none;
    z-index: -1;
    filter: blur(${5 + intensity * 5}px);
  `;
  
  // Energy particles orbiting the card
  const particleCount = isMobile() ? 4 : 8;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'charge-particle';
    particle.style.cssText = `
      position: absolute;
      width: ${6 + intensity * 4}px;
      height: ${6 + intensity * 4}px;
      background: ${color};
      border-radius: 50%;
      box-shadow: 0 0 10px ${color};
      animation: orbitCard ${2 - intensity * 0.5}s linear infinite;
      animation-delay: ${(i / particleCount) * (2 - intensity * 0.5)}s;
      --orbit-angle: ${(i / particleCount) * 360}deg;
    `;
    aura.appendChild(particle);
  }
  
  cardElement.style.position = 'relative';
  cardElement.appendChild(aura);
  
  // Remove after animation plays
  setTimeout(() => aura.remove(), 3000);
  
  return aura;
};

/**
 * Combo Chain Lines - Visual links when element combos happen
 * @param {HTMLElement[]} cards - Array of cards in the combo
 * @param {HTMLElement} container - The game board container
 * @param {string} element - Element type for color
 */
export const createComboChain = (cards, container, element = 'NEUTRAL') => {
  if (!cards || cards.length < 2 || !container) return;
  
  const elementColors = {
    FIRE: '#ff4500',
    WATER: '#00bfff',
    ICE: '#87ceeb',
    EARTH: '#8b4513',
    ELECTRICITY: '#ffd700',
    LIGHT: '#fffacd',
    DARK: '#4b0082',
    NEUTRAL: '#9370db',
    TECHNOLOGY: '#00ffff'
  };
  
  const color = elementColors[element] || elementColors.NEUTRAL;
  const containerRect = container.getBoundingClientRect();
  
  // Create SVG for chain lines
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'combo-chain-svg');
  svg.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 200;
    overflow: visible;
  `;
  
  // Draw lines between consecutive cards
  for (let i = 0; i < cards.length - 1; i++) {
    const rect1 = cards[i].getBoundingClientRect();
    const rect2 = cards[i + 1].getBoundingClientRect();
    
    const x1 = rect1.left - containerRect.left + rect1.width / 2;
    const y1 = rect1.top - containerRect.top + rect1.height / 2;
    const x2 = rect2.left - containerRect.left + rect2.width / 2;
    const y2 = rect2.top - containerRect.top + rect2.height / 2;
    
    // Glowing line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.style.cssText = `
      filter: drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color});
      animation: chainPulse 0.5s ease-in-out infinite alternate;
    `;
    svg.appendChild(line);
    
    // Energy orb traveling along the line
    const orb = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    orb.setAttribute('r', '8');
    orb.setAttribute('fill', color);
    orb.style.cssText = `
      filter: drop-shadow(0 0 10px ${color});
    `;
    
    const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
    animate.setAttribute('dur', '0.5s');
    animate.setAttribute('repeatCount', '2');
    animate.setAttribute('path', `M${x1},${y1} L${x2},${y2}`);
    orb.appendChild(animate);
    svg.appendChild(orb);
  }
  
  container.appendChild(svg);
  
  // Combo text
  const comboText = document.createElement('div');
  comboText.className = 'combo-chain-text';
  comboText.innerHTML = `<span>⚡ ${cards.length}x COMBO! ⚡</span>`;
  comboText.style.cssText = `
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: ${color};
    font-size: 28px;
    font-weight: bold;
    text-shadow: 0 0 10px ${color}, 0 0 20px ${color}, 2px 2px 4px black;
    animation: comboTextPop 0.5s ease-out forwards;
    z-index: 300;
    pointer-events: none;
  `;
  container.appendChild(comboText);
  
  setTimeout(() => {
    svg.remove();
    comboText.remove();
  }, 1500);
};

/**
 * 3D Card Hover Tilt - Cards tilt in 3D when hovered
 * @param {HTMLElement} cardElement - The card element
 */
export const add3DCardTilt = (cardElement) => {
  if (!cardElement || isMobile()) return; // Skip on mobile for performance
  
  cardElement.style.transformStyle = 'preserve-3d';
  cardElement.style.transition = 'transform 0.1s ease-out';
  
  const handleMouseMove = (e) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    cardElement.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };
  
  const handleMouseLeave = () => {
    cardElement.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
  };
  
  cardElement.addEventListener('mousemove', handleMouseMove);
  cardElement.addEventListener('mouseleave', handleMouseLeave);
  
  // Store cleanup function
  cardElement._cleanup3DTilt = () => {
    cardElement.removeEventListener('mousemove', handleMouseMove);
    cardElement.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Win Streak Fire Effect - Flaming aura on win streaks
 * @param {HTMLElement} avatarElement - Player avatar element
 * @param {number} streakCount - Current win streak
 */
export const createWinStreakFire = (avatarElement, streakCount) => {
  if (!avatarElement || streakCount < 2) return;
  
  // Remove existing fire
  const existing = avatarElement.querySelector('.win-streak-fire');
  if (existing) existing.remove();
  
  const fireContainer = document.createElement('div');
  fireContainer.className = 'win-streak-fire';
  
  const intensity = Math.min(streakCount / 5, 1); // Max at 5 streak
  const flameCount = Math.min(3 + streakCount, 10);
  
  fireContainer.style.cssText = `
    position: absolute;
    inset: -${15 + intensity * 10}px;
    pointer-events: none;
    z-index: -1;
    border-radius: 50%;
    overflow: visible;
  `;
  
  for (let i = 0; i < flameCount; i++) {
    const flame = document.createElement('div');
    flame.className = 'streak-flame';
    flame.textContent = '🔥';
    flame.style.cssText = `
      position: absolute;
      left: ${Math.random() * 100}%;
      bottom: 0;
      font-size: ${16 + intensity * 8}px;
      animation: flameRise ${0.5 + Math.random() * 0.5}s ease-out infinite;
      animation-delay: ${Math.random() * 0.5}s;
      opacity: ${0.7 + intensity * 0.3};
      filter: drop-shadow(0 0 5px #ff4500);
    `;
    fireContainer.appendChild(flame);
  }
  
  // Streak counter badge
  const badge = document.createElement('div');
  badge.className = 'streak-badge';
  badge.innerHTML = `🔥${streakCount}`;
  badge.style.cssText = `
    position: absolute;
    top: -10px;
    right: -10px;
    background: linear-gradient(135deg, #ff4500, #ff8c00);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: bold;
    box-shadow: 0 0 10px #ff4500;
    animation: badgePulse 1s ease-in-out infinite;
    z-index: 10;
  `;
  fireContainer.appendChild(badge);
  
  avatarElement.style.position = 'relative';
  avatarElement.appendChild(fireContainer);
};

/**
 * Card Played Impact - Full impact effect when card is played
 * @param {HTMLElement} cardElement - The played card
 * @param {HTMLElement} container - Game board container
 * @param {Object} card - Card data
 */
export const createCardPlayedImpact = (cardElement, container, card) => {
  if (!cardElement || !container || !card) return;
  
  const power = card.modifiedStrength || card.strength || card.power || 0;
  const element = card.element || 'NEUTRAL';
  
  // Trail effect
  createCardTrail(cardElement, container, element);
  
  // Power charge for strong cards
  if (power >= 6) {
    createPowerChargeAura(cardElement, power, element);
  }
  
  // Screen shake for powerful cards
  if (power >= 8) {
    createScreenShake(power >= 10 ? 'heavy' : 'medium', 300);
  }
};

/**
 * Round Clash Effect - When both cards are revealed
 * @param {HTMLElement} playerCard - Player's card element
 * @param {HTMLElement} aiCard - AI's card element
 * @param {HTMLElement} container - Game board container
 * @param {Object} result - Round result { winner: 'player'|'ai'|'tie', playerCard, aiCard }
 */
export const createRoundClash = (playerCard, aiCard, container, result) => {
  if (!playerCard || !aiCard || !container) return;
  
  const playerRect = playerCard.getBoundingClientRect();
  const aiRect = aiCard.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Calculate center point between cards
  const centerX = ((playerRect.left + playerRect.width / 2) + (aiRect.left + aiRect.width / 2)) / 2;
  const centerY = ((playerRect.top + playerRect.height / 2) + (aiRect.top + aiRect.height / 2)) / 2;
  const relativeX = ((centerX - containerRect.left) / containerRect.width) * 100;
  const relativeY = ((centerY - containerRect.top) / containerRect.height) * 100;
  
  // Impact sparks at center
  const winnerElement = result.winner === 'player' 
    ? (result.playerCard?.element || 'NEUTRAL')
    : result.winner === 'ai' 
      ? (result.aiCard?.element || 'NEUTRAL')
      : 'NEUTRAL';
  
  createImpactSparks(container, relativeX, relativeY, winnerElement);
  
  // Floating damage numbers
  if (result.winner !== 'tie') {
    const winnerCard = result.winner === 'player' ? result.playerCard : result.aiCard;
    const loserCard = result.winner === 'player' ? result.aiCard : result.playerCard;
    const loserElement = result.winner === 'player' ? aiCard : playerCard;
    
    const damage = (winnerCard?.modifiedStrength || winnerCard?.strength || 0) - 
                   (loserCard?.modifiedStrength || loserCard?.strength || 0);
    
    if (damage > 0) {
      createFloatingDamage(damage, loserElement, 'damage');
    }
  }
};

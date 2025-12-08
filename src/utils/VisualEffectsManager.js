/**
 * Visual Effects Manager
 * Provides easy-to-use functions for triggering visual effects
 */

import particleEffects from './ParticleEffects';

/**
 * Trigger a screen shake effect
 * @param {number} intensity - Shake intensity (1-10)
 * @param {number} duration - Duration in ms
 */
export function shakeScreen(intensity = 5, duration = 300) {
  particleEffects.screenShake(intensity, duration);
}

/**
 * Trigger critical hit effect at a position
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 */
export function criticalHitEffect(x, y) {
  particleEffects.criticalHitImpact(x, y);
  shakeScreen(8, 400);
}

/**
 * Trigger element-specific attack effect
 * @param {string} element - Element type (fire, ice, water, etc.)
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {Object} target - Optional target coordinates
 */
export function elementAttackEffect(element, x, y, target = null) {
  const elementMap = {
    fire: () => particleEffects.fireParticles(x, y, 'up', 30),
    ice: () => particleEffects.iceParticles(x, y, 25),
    water: () => particleEffects.waterSplash(x, y, 30),
    electricity: () => {
      if (target) {
        particleEffects.lightningParticles(x, y, target.x, target.y);
      } else {
        particleEffects.lightningParticles(x, y, x + 100, y - 50);
      }
    },
    earth: () => particleEffects.earthDebris(x, y, 20),
    light: () => particleEffects.lightRays(x, y, 8),
    dark: () => particleEffects.darkEnergy(x, y, 40),
    meteor: () => {
      if (target) {
        particleEffects.meteorTrail(x, y - 200, target.x, target.y, 500);
      } else {
        particleEffects.fireParticles(x, y, 'down', 40);
      }
    }
  };

  const effect = elementMap[element.toLowerCase()];
  if (effect) {
    effect();
  } else {
    // Default golden burst for unknown elements
    particleEffects.goldenBurst(x, y, 30);
  }
}

/**
 * Trigger legendary card entrance effect
 * @param {HTMLElement} cardElement - The card DOM element
 */
export function legendaryEntranceEffect(cardElement) {
  if (!cardElement) return;

  const rect = cardElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Add shake to the game container
  shakeScreen(6, 500);

  // Trigger golden burst
  particleEffects.goldenBurst(centerX, centerY, 60);

  // Add the slam animation class
  cardElement.classList.add('legendary-card-slam');
  setTimeout(() => {
    cardElement.classList.remove('legendary-card-slam');
  }, 800);
}

/**
 * Trigger victory celebration effects
 * @param {string} result - 'victory', 'defeat', or 'tie'
 */
export function victoryCelebration(result = 'victory') {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  if (result === 'victory') {
    // Multiple confetti bursts
    particleEffects.victoryConfetti(centerX, centerY - 100, 100);
    setTimeout(() => {
      particleEffects.victoryConfetti(centerX - 200, centerY, 50);
      particleEffects.victoryConfetti(centerX + 200, centerY, 50);
    }, 300);
    
    // Golden burst at center
    setTimeout(() => {
      particleEffects.goldenBurst(centerX, centerY, 80);
    }, 500);

    // Level up celebration
    particleEffects.levelUpCelebration(centerX, centerY);
  } else if (result === 'defeat') {
    // Fire particles rising from bottom
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        particleEffects.fireParticles(
          Math.random() * window.innerWidth,
          window.innerHeight,
          'up',
          20
        );
      }, i * 200);
    }
  }
}

/**
 * Trigger card play effect
 * @param {HTMLElement} cardElement - The card DOM element
 * @param {string} rarity - Card rarity (common, rare, epic, legendary)
 */
export function cardPlayEffect(cardElement, rarity = 'common') {
  if (!cardElement) return;

  const rect = cardElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  switch (rarity.toLowerCase()) {
    case 'legendary':
    case 'mythic':
      legendaryEntranceEffect(cardElement);
      break;
    case 'epic':
      particleEffects.goldenBurst(centerX, centerY, 40);
      break;
    case 'rare':
      particleEffects.iceParticles(centerX, centerY, 15);
      break;
    default:
      // Subtle shimmer for common/uncommon
      particleEffects.shimmerEffect(cardElement);
  }
}

/**
 * Trigger damage effect on a card
 * @param {HTMLElement} cardElement - The card DOM element
 * @param {number} damage - Amount of damage
 * @param {boolean} isCritical - Whether it's a critical hit
 */
export function damageEffect(cardElement, damage, isCritical = false) {
  if (!cardElement) return;

  const rect = cardElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Add damage animation class
  cardElement.classList.add('card-damage-taken');
  setTimeout(() => {
    cardElement.classList.remove('card-damage-taken');
  }, 500);

  // Show damage number
  showDamageNumber(centerX, centerY, damage, isCritical ? 'critical' : 'damage');

  // Particle effects
  if (isCritical) {
    particleEffects.criticalHitImpact(centerX, centerY);
    shakeScreen(10, 500);
  } else if (damage >= 10) {
    shakeScreen(5, 300);
  }
}

/**
 * Show a floating damage number
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number|string} value - The value to display
 * @param {string} type - 'damage', 'heal', 'critical', 'buff'
 */
export function showDamageNumber(x, y, value, type = 'damage') {
  const number = document.createElement('div');
  number.className = `damage-number ${type}`;
  number.textContent = type === 'heal' ? `+${value}` : `-${value}`;
  number.style.left = `${x}px`;
  number.style.top = `${y}px`;

  document.body.appendChild(number);

  // Remove after animation
  setTimeout(() => {
    number.remove();
  }, 1200);
}

/**
 * Apply status effect visual to a card
 * @param {HTMLElement} cardElement - The card DOM element
 * @param {string} status - Status type (poisoned, frozen, burning, shielded, stunned, buffed, debuffed)
 */
export function applyStatusEffect(cardElement, status) {
  if (!cardElement) return;

  // Remove any existing status classes
  cardElement.classList.remove(
    'status-poisoned', 'status-frozen', 'status-burning',
    'status-shielded', 'status-stunned', 'status-buffed', 'status-debuffed'
  );

  // Add new status class
  cardElement.classList.add(`status-${status.toLowerCase()}`);
}

/**
 * Remove status effect visual from a card
 * @param {HTMLElement} cardElement - The card DOM element
 * @param {string} status - Status type to remove
 */
export function removeStatusEffect(cardElement, status) {
  if (!cardElement) return;
  cardElement.classList.remove(`status-${status.toLowerCase()}`);
}

/**
 * Create a flash overlay effect
 * @param {string} type - 'damage' (red) or 'heal' (green)
 */
export function flashScreen(type = 'damage') {
  const flash = document.createElement('div');
  flash.className = type === 'heal' ? 'heal-flash' : 'damage-flash';
  document.body.appendChild(flash);

  setTimeout(() => {
    flash.remove();
  }, 300);
}

/**
 * Trigger combo effect
 * @param {number} comboCount - Current combo count
 */
export function comboEffect(comboCount) {
  // Remove existing combo counter
  const existing = document.querySelector('.combo-counter');
  if (existing) {
    existing.remove();
  }

  const counter = document.createElement('div');
  counter.className = 'combo-counter';
  counter.innerHTML = `<span>${comboCount}x</span> COMBO!`;
  document.body.appendChild(counter);

  // Trigger particles
  particleEffects.goldenBurst(window.innerWidth - 150, window.innerHeight * 0.2, 30);

  // Remove after animation
  setTimeout(() => {
    counter.remove();
  }, 2000);
}

/**
 * Initialize the visual effects system
 * Call this once when the app starts
 */
export function initVisualEffects() {
  particleEffects.init();
}

/**
 * Clean up visual effects
 * Call this when unmounting or leaving the game
 */
export function cleanupVisualEffects() {
  particleEffects.stop();
  
  // Comprehensive list of all dynamically created effect element selectors
  const effectSelectors = [
    // Damage and score displays
    '.damage-number',
    '.combo-counter', 
    '.damage-flash',
    '.heal-flash',
    '.floating-damage',
    '.score-popup',
    '.match-bonus-display',
    
    // Ultimate and ability effects
    '.ultimate-flash-overlay',
    '.ultimate-burst-container',
    '.ultimate-damage-display',
    '.ultimate-card-damage',
    '.ai-ultimate-display',
    '.meteor-container',
    '.phoenix-container',
    '.vortex-container',
    '.freeze-container',
    '.divine-container',
    
    // Battle and combo effects
    '.combo-notification',
    '.counter-notification',
    '.trap-notification',
    '.fusion-notification',
    '.element-play-animation',
    '.battle-result-overlay',
    '.round-announcement-overlay',
    
    // Particle and visual containers
    '.particle-container',
    '.weather-container',
    '.spark-container',
    '.fire-container',
    '.aura-container',
    '.shockwave',
    '.flash-overlay',
    '.tint-overlay',
    '.critical-overlay',
    '.meteor-overlay',
    '.sparkles-container',
    '.shatter-container',
    '.bg-overlay',
    '.replay-overlay',
    
    // Video effects
    '.video-effect-container',
    '.video-effect-fallback',
    '.ember-battle-overlay',
    '.screen-burn-effect',
    '.critical-fire-overlay',
    
    // Card effects
    '.card-trail',
    '.win-badge',
    '.legendary-glow-effect',
    '.card-defeat-crumble',
    '.victory-pose-winner',
    
    // Status effects
    '[class*="status-effect-"]',
    
    // Animations and overlays
    '.environmental-effect',
    '.screen-transition',
    '.slow-motion-active',
    
    // Achievement and notification popups
    '.achievement-popup',
    '.reward-popup',
    '.notification-popup'
  ];
  
  // Remove all matching elements from the document
  effectSelectors.forEach(selector => {
    try {
      document.querySelectorAll(selector).forEach(el => {
        el.remove();
      });
    } catch (e) {
      // Ignore selector errors
    }
  });
  
  // Also clean up any elements with animation-related inline styles that may be leftover
  document.querySelectorAll('[style*="animation"]').forEach(el => {
    // Only remove if it's a dynamically created effect element (not part of React components)
    if (el.classList.contains('effect') || 
        el.classList.contains('particle') ||
        el.classList.contains('overlay') ||
        el.classList.contains('notification')) {
      el.remove();
    }
  });
  
  // Remove any fixed position overlays that shouldn't persist
  document.querySelectorAll('.game-overlay-effect').forEach(el => {
    el.remove();
  });
  
  // Clear any CSS classes that might have been added to the body
  document.body.classList.remove(
    'slow-motion-active',
    'screen-shake',
    'critical-hit',
    'damage-taken',
    'victory-mode',
    'defeat-mode'
  );
  
  console.log('🧹 Visual effects cleaned up');
}

export default {
  shakeScreen,
  criticalHitEffect,
  elementAttackEffect,
  legendaryEntranceEffect,
  victoryCelebration,
  cardPlayEffect,
  damageEffect,
  showDamageNumber,
  applyStatusEffect,
  removeStatusEffect,
  flashScreen,
  comboEffect,
  initVisualEffects,
  cleanupVisualEffects
};

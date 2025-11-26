// Visual Effects Utility
// Handles critical hits, elemental particles, and advanced visual effects

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

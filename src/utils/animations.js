// Animation utilities for game effects

export const createParticles = (element, x, y, container) => {
  const particleCount = 20; // Increased from 12
  const particles = [];
  
  const elementEmojis = {
    FIRE: '🔥',
    ICE: '❄️',
    WATER: '💧',
    ELECTRICITY: '⚡',
    EARTH: '🌍',
    POWER: '💪',
    LIGHT: '✨',
    DARK: '🌑',
    NEUTRAL: '⭐'
  };

  const emoji = elementEmojis[element] || '✨';

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.textContent = emoji;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // More varied and dynamic particle trajectories
    const angle = (i / particleCount) * Math.PI * 2;
    const distance = 150 + Math.random() * 100;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);
    particle.style.animationDelay = `${Math.random() * 0.2}s`;
    particle.style.fontSize = `${16 + Math.random() * 12}px`; // Varied sizes
    
    container.appendChild(particle);
    particles.push(particle);

    setTimeout(() => {
      particle.remove();
    }, 2500); // Increased from 1800
  }

  return particles;
};

export const createDamageNumber = (strength, x, y, container, isWinner, isTie, isMeteorDamage = false) => {
  const damageNum = document.createElement('div');
  
  if (isMeteorDamage) {
    damageNum.className = 'damage-number meteor-damage';
    damageNum.textContent = strength;
    damageNum.style.fontSize = '32px';
    damageNum.style.fontWeight = '900';
    damageNum.style.color = '#ff6600';
    damageNum.style.textShadow = '0 0 10px #ff3300, 0 0 20px #ff6600, 2px 2px 4px rgba(0,0,0,0.8)';
  } else {
    damageNum.className = `damage-number ${isTie ? 'tie' : isWinner ? 'winner' : 'loser'}`;
    damageNum.textContent = strength;
  }
  
  damageNum.style.left = `${x}px`;
  damageNum.style.top = `${y}px`;
  
  container.appendChild(damageNum);

  setTimeout(() => {
    damageNum.remove();
  }, isMeteorDamage ? 2000 : 1000);

  return damageNum;
};

export const triggerScreenShake = (element, minStrength = 10) => {
  if (!element) return;
  
  element.classList.add('shake');
  setTimeout(() => {
    element.classList.remove('shake');
  }, 500);
};

export const createVictoryCelebration = (winner, container) => {
  // Guard against null container
  if (!container) {
    console.warn('Victory celebration: container is null');
    return null;
  }
  
  // Create victory overlay
  const celebration = document.createElement('div');
  celebration.className = 'victory-celebration';
  
  const victoryText = document.createElement('div');
  victoryText.className = 'victory-text';
  victoryText.textContent = winner === 'tie' ? 'TIE!' : 'VICTORY!';
  
  const subText = document.createElement('div');
  subText.className = 'victory-subtext';
  subText.textContent = winner === 'tie' ? 'Perfect Balance' : `${winner} Wins!`;
  
  celebration.appendChild(victoryText);
  celebration.appendChild(subText);
  container.appendChild(celebration);

  // Create confetti
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700'];
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
    confetti.style.setProperty('--left', `${Math.random() * 100}%`);
    confetti.style.setProperty('--delay', `${Math.random() * 0.5}s`);
    container.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 3500);
  }

  setTimeout(() => {
    celebration.remove();
  }, 4000);

  return celebration;
};

// Card draw animation
export const createCardDrawAnimation = (container, count = 1) => {
  if (!container) return [];
  
  const animations = [];
  
  for (let i = 0; i < count; i++) {
    const cardDraw = document.createElement('div');
    cardDraw.className = 'card-draw-animation';
    cardDraw.innerHTML = '🎴';
    cardDraw.style.animationDelay = `${i * 0.15}s`;
    
    container.appendChild(cardDraw);
    animations.push(cardDraw);
    
    setTimeout(() => {
      cardDraw.remove();
    }, 1000 + (i * 150));
  }
  
  return animations;
};

// Victory pose for winning card
export const createVictoryPose = (cardElement, element) => {
  if (!cardElement) return null;
  
  // Add victory class
  cardElement.classList.add('victory-pose');
  
  // Create glow effect
  const glow = document.createElement('div');
  glow.className = 'victory-glow';
  cardElement.appendChild(glow);
  
  // Create sparkles
  const sparkleCount = 12;
  for (let i = 0; i < sparkleCount; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'victory-sparkle';
    sparkle.textContent = '✨';
    sparkle.style.setProperty('--angle', `${(i / sparkleCount) * 360}deg`);
    sparkle.style.animationDelay = `${i * 0.1}s`;
    cardElement.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 2000);
  }
  
  setTimeout(() => {
    cardElement.classList.remove('victory-pose');
    glow.remove();
  }, 2500);
  
  return { glow, sparkleCount };
};

// Environmental effects
export const createEnvironmentalEffect = (type, container) => {
  if (!container) return null;
  
  const effect = document.createElement('div');
  effect.className = `environmental-effect ${type}`;
  
  switch (type) {
    case 'rain':
      for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        effect.appendChild(drop);
      }
      break;
      
    case 'snow':
      for (let i = 0; i < 40; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.textContent = '❄️';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random() * 3}s`;
        flake.style.animationDuration = `${3 + Math.random() * 2}s`;
        flake.style.fontSize = `${12 + Math.random() * 8}px`;
        effect.appendChild(flake);
      }
      break;
      
    case 'leaves':
      for (let i = 0; i < 30; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'falling-leaf';
        leaf.textContent = ['🍂', '🍁'][Math.floor(Math.random() * 2)];
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDelay = `${Math.random() * 5}s`;
        leaf.style.animationDuration = `${4 + Math.random() * 3}s`;
        effect.appendChild(leaf);
      }
      break;
      
    case 'embers':
      for (let i = 0; i < 25; i++) {
        const ember = document.createElement('div');
        ember.className = 'floating-ember';
        ember.textContent = '🔥';
        ember.style.left = `${Math.random() * 100}%`;
        ember.style.animationDelay = `${Math.random() * 3}s`;
        ember.style.animationDuration = `${2 + Math.random() * 2}s`;
        ember.style.fontSize = `${8 + Math.random() * 6}px`;
        effect.appendChild(ember);
      }
      break;
      
    case 'lightning':
      const lightning = document.createElement('div');
      lightning.className = 'lightning-flash';
      effect.appendChild(lightning);
      setTimeout(() => {
        lightning.remove();
      }, 200);
      break;
  }
  
  container.appendChild(effect);
  return effect;
};

// Remove environmental effect
export const removeEnvironmentalEffect = (container) => {
  if (!container) return;
  const effects = container.querySelectorAll('.environmental-effect');
  effects.forEach(effect => effect.remove());
};

// Phase transition animation
export const createPhaseTransition = (message, container) => {
  if (!container) return null;
  
  const transition = document.createElement('div');
  transition.className = 'phase-transition entering';
  transition.textContent = message;
  
  container.appendChild(transition);
  
  // Remove after animation
  setTimeout(() => {
    transition.classList.remove('entering');
    transition.classList.add('leaving');
    
    setTimeout(() => {
      transition.remove();
    }, 500);
  }, 2000);
  
  return transition;
};

// Shuffle animation for deck
export const createShuffleAnimation = (container) => {
  if (!container) return null;
  
  const shuffle = document.createElement('div');
  shuffle.className = 'shuffle-animation';
  
  for (let i = 0; i < 5; i++) {
    const card = document.createElement('div');
    card.className = 'shuffle-card';
    card.textContent = '🎴';
    card.style.animationDelay = `${i * 0.1}s`;
    shuffle.appendChild(card);
  }
  
  container.appendChild(shuffle);
  
  setTimeout(() => {
    shuffle.remove();
  }, 1500);
  
  return shuffle;
};

// Card flip animation
export const createCardFlipAnimation = (cardElement) => {
  if (!cardElement) return;
  
  cardElement.classList.add('card-flipping');
  
  setTimeout(() => {
    cardElement.classList.remove('card-flipping');
  }, 600);
};

// Combo multiplier animation
export const createComboMultiplierAnimation = (text, x, y, container) => {
  if (!container) return null;
  
  const combo = document.createElement('div');
  combo.className = 'combo-multiplier';
  combo.textContent = text;
  combo.style.left = `${x}px`;
  combo.style.top = `${y}px`;
  
  container.appendChild(combo);
  
  setTimeout(() => {
    combo.remove();
  }, 1000);
  
  return combo;
};

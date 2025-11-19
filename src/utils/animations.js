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

// Enhanced element-specific play animations
export const createElementPlayAnimation = (element, cardElement, container) => {
  if (!cardElement || !container) return null;

  const animations = [];
  
  try {
    // Additional safety check for DOM elements
    if (!cardElement.getBoundingClientRect || !container.getBoundingClientRect) {
      console.warn('getBoundingClientRect not available on element');
      return null;
    }
    
    const rect = cardElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const centerX = rect.left - containerRect.left + rect.width / 2;
    const centerY = rect.top - containerRect.top + rect.height / 2;

  switch (element) {
    case 'FIRE':
      // Burst into flames
      for (let i = 0; i < 15; i++) {
        const flame = document.createElement('div');
        flame.className = 'element-animation fire-burst';
        flame.textContent = ['🔥', '🔴', '🟠'][Math.floor(Math.random() * 3)];
        flame.style.left = `${centerX}px`;
        flame.style.top = `${centerY}px`;
        const angle = (i / 15) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        flame.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
        flame.style.setProperty('--ty', `${Math.sin(angle) * distance - 50}px`);
        flame.style.animationDelay = `${i * 0.05}s`;
        container.appendChild(flame);
        animations.push(flame);
        setTimeout(() => flame.remove(), 1200);
      }
      cardElement.classList.add('fire-glow');
      setTimeout(() => cardElement.classList.remove('fire-glow'), 1000);
      break;

    case 'ICE':
      // Freeze effect with ice crystals
      const iceOverlay = document.createElement('div');
      iceOverlay.className = 'element-animation ice-overlay';
      iceOverlay.style.left = `${centerX - 75}px`;
      iceOverlay.style.top = `${centerY - 75}px`;
      container.appendChild(iceOverlay);
      animations.push(iceOverlay);
      setTimeout(() => iceOverlay.remove(), 1500);

      for (let i = 0; i < 20; i++) {
        const crystal = document.createElement('div');
        crystal.className = 'element-animation ice-crystal';
        crystal.textContent = '❄️';
        crystal.style.left = `${centerX + (Math.random() - 0.5) * 150}px`;
        crystal.style.top = `${centerY + (Math.random() - 0.5) * 150}px`;
        crystal.style.animationDelay = `${i * 0.05}s`;
        container.appendChild(crystal);
        animations.push(crystal);
        setTimeout(() => crystal.remove(), 1500);
      }
      break;

    case 'WATER':
      // Splash and ripple effect
      const ripple = document.createElement('div');
      ripple.className = 'element-animation water-ripple';
      ripple.style.left = `${centerX}px`;
      ripple.style.top = `${centerY}px`;
      container.appendChild(ripple);
      animations.push(ripple);
      setTimeout(() => ripple.remove(), 1500);

      for (let i = 0; i < 12; i++) {
        const drop = document.createElement('div');
        drop.className = 'element-animation water-splash';
        drop.textContent = '💧';
        drop.style.left = `${centerX}px`;
        drop.style.top = `${centerY}px`;
        const angle = (i / 12) * Math.PI * 2;
        drop.style.setProperty('--tx', `${Math.cos(angle) * 60}px`);
        drop.style.setProperty('--ty', `${Math.sin(angle) * 60}px`);
        container.appendChild(drop);
        animations.push(drop);
        setTimeout(() => drop.remove(), 1000);
      }
      break;

    case 'ELECTRICITY':
      // Lightning bolts and sparks
      for (let i = 0; i < 8; i++) {
        const bolt = document.createElement('div');
        bolt.className = 'element-animation electric-bolt';
        bolt.textContent = '⚡';
        bolt.style.left = `${centerX}px`;
        bolt.style.top = `${centerY}px`;
        const angle = (i / 8) * Math.PI * 2;
        bolt.style.setProperty('--tx', `${Math.cos(angle) * 100}px`);
        bolt.style.setProperty('--ty', `${Math.sin(angle) * 100}px`);
        bolt.style.animationDelay = `${i * 0.08}s`;
        container.appendChild(bolt);
        animations.push(bolt);
        setTimeout(() => bolt.remove(), 800);
      }
      
      const flash = document.createElement('div');
      flash.className = 'element-animation electric-flash';
      flash.style.left = `${centerX - 100}px`;
      flash.style.top = `${centerY - 100}px`;
      container.appendChild(flash);
      animations.push(flash);
      setTimeout(() => flash.remove(), 300);
      break;

    case 'EARTH':
      // Rocks and dust
      for (let i = 0; i < 10; i++) {
        const rock = document.createElement('div');
        rock.className = 'element-animation earth-rock';
        rock.textContent = ['🪨', '🌍', '⛰️'][Math.floor(Math.random() * 3)];
        rock.style.left = `${centerX + (Math.random() - 0.5) * 100}px`;
        rock.style.top = `${centerY + 50}px`;
        rock.style.setProperty('--ty', `${-100 - Math.random() * 50}px`);
        rock.style.animationDelay = `${i * 0.1}s`;
        container.appendChild(rock);
        animations.push(rock);
        setTimeout(() => rock.remove(), 1500);
      }
      break;

    case 'LIGHT':
      // Radiant beams
      const lightBurst = document.createElement('div');
      lightBurst.className = 'element-animation light-burst';
      lightBurst.style.left = `${centerX}px`;
      lightBurst.style.top = `${centerY}px`;
      container.appendChild(lightBurst);
      animations.push(lightBurst);
      setTimeout(() => lightBurst.remove(), 1000);

      for (let i = 0; i < 16; i++) {
        const beam = document.createElement('div');
        beam.className = 'element-animation light-beam';
        beam.style.left = `${centerX}px`;
        beam.style.top = `${centerY}px`;
        beam.style.transform = `rotate(${i * 22.5}deg)`;
        container.appendChild(beam);
        animations.push(beam);
        setTimeout(() => beam.remove(), 800);
      }
      break;

    case 'DARK':
      // Shadow expansion
      const shadow = document.createElement('div');
      shadow.className = 'element-animation dark-shadow';
      shadow.style.left = `${centerX}px`;
      shadow.style.top = `${centerY}px`;
      container.appendChild(shadow);
      animations.push(shadow);
      setTimeout(() => shadow.remove(), 1200);

      for (let i = 0; i < 12; i++) {
        const wisp = document.createElement('div');
        wisp.className = 'element-animation dark-wisp';
        wisp.textContent = '🌑';
        wisp.style.left = `${centerX}px`;
        wisp.style.top = `${centerY}px`;
        const angle = (i / 12) * Math.PI * 2;
        wisp.style.setProperty('--tx', `${Math.cos(angle) * 80}px`);
        wisp.style.setProperty('--ty', `${Math.sin(angle) * 80}px`);
        wisp.style.animationDelay = `${i * 0.06}s`;
        container.appendChild(wisp);
        animations.push(wisp);
        setTimeout(() => wisp.remove(), 1500);
      }
      break;

    case 'TECHNOLOGY':
      // Digital glitch effect
      const glitch = document.createElement('div');
      glitch.className = 'element-animation tech-glitch';
      glitch.style.left = `${centerX - 75}px`;
      glitch.style.top = `${centerY - 75}px`;
      glitch.textContent = '⚙️';
      container.appendChild(glitch);
      animations.push(glitch);
      setTimeout(() => glitch.remove(), 1000);

      for (let i = 0; i < 8; i++) {
        const pixel = document.createElement('div');
        pixel.className = 'element-animation tech-pixel';
        pixel.style.left = `${centerX + (Math.random() - 0.5) * 120}px`;
        pixel.style.top = `${centerY + (Math.random() - 0.5) * 120}px`;
        pixel.style.backgroundColor = ['#00ff00', '#0000ff', '#ff00ff'][Math.floor(Math.random() * 3)];
        container.appendChild(pixel);
        animations.push(pixel);
        setTimeout(() => pixel.remove(), 800);
      }
      break;

    case 'METEOR':
      // Meteor impact
      const impact = document.createElement('div');
      impact.className = 'element-animation meteor-impact';
      impact.textContent = '☄️';
      impact.style.left = `${centerX}px`;
      impact.style.top = `${centerY - 150}px`;
      container.appendChild(impact);
      animations.push(impact);
      setTimeout(() => impact.remove(), 1000);

      const shockwave = document.createElement('div');
      shockwave.className = 'element-animation meteor-shockwave';
      shockwave.style.left = `${centerX}px`;
      shockwave.style.top = `${centerY}px`;
      container.appendChild(shockwave);
      animations.push(shockwave);
      setTimeout(() => shockwave.remove(), 1200);
      break;

    default:
      // Default sparkle effect
      for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'element-animation default-sparkle';
        sparkle.textContent = '✨';
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        const angle = (i / 8) * Math.PI * 2;
        sparkle.style.setProperty('--tx', `${Math.cos(angle) * 60}px`);
        sparkle.style.setProperty('--ty', `${Math.sin(angle) * 60}px`);
        container.appendChild(sparkle);
        animations.push(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
      }
  }

  return animations;
  } catch (error) {
    console.warn('Error in createElementPlayAnimation:', error);
    return [];
  }
};

// Victory pose with enhanced animations
export const createEnhancedVictoryPose = (winner, container) => {
  if (!container) return null;

  const pose = document.createElement('div');
  pose.className = 'enhanced-victory-pose';
  
  // Animated character/trophy
  const trophy = document.createElement('div');
  trophy.className = 'victory-trophy';
  trophy.textContent = '🏆';
  pose.appendChild(trophy);

  // Winner text
  const text = document.createElement('div');
  text.className = 'victory-pose-text';
  text.textContent = winner === 'Tie' ? '🤝 TIE GAME! 🤝' : `🎉 ${winner} WINS! 🎉`;
  pose.appendChild(text);

  // Fireworks
  for (let i = 0; i < 20; i++) {
    const firework = document.createElement('div');
    firework.className = 'victory-firework';
    firework.textContent = ['💫', '⭐', '✨', '🌟'][Math.floor(Math.random() * 4)];
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.animationDelay = `${Math.random() * 2}s`;
    pose.appendChild(firework);
  }

  container.appendChild(pose);

  setTimeout(() => {
    pose.remove();
  }, 4000);

  return pose;
};

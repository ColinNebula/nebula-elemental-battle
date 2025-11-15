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

export const createDamageNumber = (strength, x, y, container, isWinner, isTie) => {
  const damageNum = document.createElement('div');
  damageNum.className = `damage-number ${isTie ? 'tie' : isWinner ? 'winner' : 'loser'}`;
  damageNum.textContent = strength;
  damageNum.style.left = `${x}px`;
  damageNum.style.top = `${y}px`;
  
  container.appendChild(damageNum);

  setTimeout(() => {
    damageNum.remove();
  }, 1000);

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

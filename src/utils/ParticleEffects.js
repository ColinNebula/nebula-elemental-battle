/**
 * ParticleEffects - Advanced particle and animation system
 * Inspired by Hearthstone, MTG Arena, LoR, Yu-Gi-Oh, Pokemon, Marvel Snap
 */

class ParticleEffects {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrame = null;
    this.isRunning = false;
  }

  /**
   * Initialize the canvas for particle effects
   */
  init() {
    // Check if canvas already exists
    if (document.getElementById('particle-canvas')) {
      this.canvas = document.getElementById('particle-canvas');
      this.ctx = this.canvas.getContext('2d');
      return;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  /**
   * Start the animation loop
   */
  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  /**
   * Animation loop
   */
  animate() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    this.particles = this.particles.filter(particle => {
      particle.update();
      particle.draw(this.ctx);
      return particle.life > 0;
    });

    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
    } else {
      this.isRunning = false;
    }
  }

  /**
   * Stop the animation loop
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.particles = [];
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  // ==========================================
  // PARTICLE EFFECTS
  // ==========================================

  /**
   * Golden sparkle burst (Hearthstone legendary style)
   */
  goldenBurst(x, y, count = 50) {
    this.init();
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 3 + Math.random() * 5;
      
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 4,
        color: `hsla(${45 + Math.random() * 20}, 100%, ${60 + Math.random() * 30}%, 1)`,
        life: 60 + Math.random() * 30,
        decay: 0.97,
        gravity: 0.05,
        glow: true,
        glowColor: '#ffd700'
      }));
    }
    
    this.startLoop();
  }

  /**
   * Fire particles (element attack)
   */
  fireParticles(x, y, direction = 'up', count = 30) {
    this.init();
    
    for (let i = 0; i < count; i++) {
      const baseVx = direction === 'right' ? 5 : direction === 'left' ? -5 : (Math.random() - 0.5) * 4;
      const baseVy = direction === 'up' ? -5 : direction === 'down' ? 5 : -3 - Math.random() * 3;
      
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: baseVx + (Math.random() - 0.5) * 3,
        vy: baseVy + (Math.random() - 0.5) * 2,
        size: 5 + Math.random() * 8,
        color: `hsla(${20 + Math.random() * 30}, 100%, ${50 + Math.random() * 30}%, 0.9)`,
        life: 40 + Math.random() * 30,
        decay: 0.95,
        gravity: -0.1,
        shrink: 0.97,
        glow: true,
        glowColor: '#ff6b35'
      }));
    }
    
    this.startLoop();
  }

  /**
   * Ice crystals (freeze effect)
   */
  iceParticles(x, y, count = 25) {
    this.init();
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
      const speed = 1 + Math.random() * 3;
      
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        size: 4 + Math.random() * 6,
        color: `hsla(${190 + Math.random() * 20}, 80%, ${70 + Math.random() * 20}%, 0.9)`,
        life: 50 + Math.random() * 30,
        decay: 0.98,
        gravity: 0.02,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        shape: 'crystal',
        glow: true,
        glowColor: '#87ceeb'
      }));
    }
    
    this.startLoop();
  }

  /**
   * Lightning sparks (electricity element)
   */
  lightningParticles(x, y, targetX, targetY) {
    this.init();
    
    const segments = 10;
    const points = this.generateLightningPath(x, y, targetX, targetY, segments);
    
    // Create particles along the lightning path
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      
      for (let j = 0; j < 3; j++) {
        const t = j / 3;
        const px = p1.x + (p2.x - p1.x) * t;
        const py = p1.y + (p2.y - p1.y) * t;
        
        this.particles.push(new Particle({
          x: px,
          y: py,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 2 + Math.random() * 3,
          color: `hsla(${50 + Math.random() * 10}, 100%, ${70 + Math.random() * 30}%, 1)`,
          life: 15 + Math.random() * 10,
          decay: 0.9,
          glow: true,
          glowColor: '#ffff00'
        }));
      }
    }
    
    this.startLoop();
  }

  generateLightningPath(x1, y1, x2, y2, segments) {
    const points = [{ x: x1, y: y1 }];
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;
    
    for (let i = 1; i < segments; i++) {
      const offset = (Math.random() - 0.5) * 40;
      points.push({
        x: x1 + dx * i + offset,
        y: y1 + dy * i + offset
      });
    }
    
    points.push({ x: x2, y: y2 });
    return points;
  }

  /**
   * Water splash effect
   */
  waterSplash(x, y, count = 30) {
    this.init();
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 4;
      
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: 4 + Math.random() * 5,
        color: `hsla(${200 + Math.random() * 20}, 80%, ${50 + Math.random() * 30}%, 0.8)`,
        life: 40 + Math.random() * 20,
        decay: 0.96,
        gravity: 0.15,
        shrink: 0.98,
        glow: true,
        glowColor: '#3b9ae1'
      }));
    }
    
    this.startLoop();
  }

  /**
   * Earth debris (ground attack)
   */
  earthDebris(x, y, count = 20) {
    this.init();
    
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.6;
      const speed = 3 + Math.random() * 5;
      
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 60,
        y: y + Math.random() * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 6 + Math.random() * 10,
        color: `hsla(${25 + Math.random() * 15}, ${40 + Math.random() * 30}%, ${30 + Math.random() * 20}%, 1)`,
        life: 50 + Math.random() * 30,
        decay: 0.98,
        gravity: 0.25,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        shape: 'square'
      }));
    }
    
    this.startLoop();
  }

  /**
   * Dark energy swirl
   */
  darkEnergy(x, y, count = 40) {
    this.init();
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const distance = 50 + Math.random() * 50;
      
      this.particles.push(new Particle({
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        targetX: x,
        targetY: y,
        size: 5 + Math.random() * 5,
        color: `hsla(${270 + Math.random() * 30}, 80%, ${20 + Math.random() * 20}%, 0.8)`,
        life: 60 + Math.random() * 30,
        decay: 0.98,
        behavior: 'spiral',
        spiralSpeed: 0.1,
        spiralRadius: distance,
        spiralAngle: angle,
        glow: true,
        glowColor: '#4b0082'
      }));
    }
    
    this.startLoop();
  }

  /**
   * Light rays (divine effect)
   */
  lightRays(x, y, count = 8) {
    this.init();
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      
      for (let j = 0; j < 20; j++) {
        const distance = j * 15;
        const delay = j * 2;
        
        this.particles.push(new Particle({
          x: x + Math.cos(angle) * distance,
          y: y + Math.sin(angle) * distance,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          size: 6 - j * 0.2,
          color: `hsla(${50 + Math.random() * 10}, 100%, ${80 + Math.random() * 20}%, 0.9)`,
          life: 30 + Math.random() * 20,
          delay,
          decay: 0.95,
          glow: true,
          glowColor: '#fffacd'
        }));
      }
    }
    
    this.startLoop();
  }

  /**
   * Meteor trail effect
   */
  meteorTrail(startX, startY, endX, endY, duration = 500) {
    this.init();
    
    const startTime = Date.now();
    const createTrailParticles = () => {
      const progress = (Date.now() - startTime) / duration;
      
      if (progress >= 1) return;
      
      const currentX = startX + (endX - startX) * progress;
      const currentY = startY + (endY - startY) * progress;
      
      for (let i = 0; i < 5; i++) {
        this.particles.push(new Particle({
          x: currentX + (Math.random() - 0.5) * 20,
          y: currentY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 2 - (endX - startX) * 0.002,
          vy: (Math.random() - 0.5) * 2 - (endY - startY) * 0.002,
          size: 8 + Math.random() * 8,
          color: `hsla(${20 + Math.random() * 30}, 100%, ${50 + Math.random() * 30}%, 0.9)`,
          life: 30 + Math.random() * 20,
          decay: 0.92,
          shrink: 0.95,
          glow: true,
          glowColor: '#ff4500'
        }));
      }
      
      requestAnimationFrame(createTrailParticles);
    };
    
    createTrailParticles();
    this.startLoop();
  }

  /**
   * Victory confetti explosion
   */
  victoryConfetti(x, y, count = 100) {
    this.init();
    
    const colors = [
      '#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
      '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe', '#00b894'
    ];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 5 + Math.random() * 10;
      
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        size: 8 + Math.random() * 8,
        width: 6 + Math.random() * 6,
        height: 12 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 120 + Math.random() * 60,
        decay: 0.99,
        gravity: 0.15,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        shape: 'confetti',
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.1 + Math.random() * 0.1
      }));
    }
    
    this.startLoop();
  }

  /**
   * Critical hit impact
   */
  criticalHitImpact(x, y) {
    this.init();
    
    // Central flash
    for (let i = 0; i < 20; i++) {
      const angle = (Math.PI * 2 * i) / 20;
      const speed = 8 + Math.random() * 6;
      
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 10 + Math.random() * 10,
        color: `hsla(${Math.random() > 0.5 ? 0 : 45}, 100%, ${60 + Math.random() * 30}%, 1)`,
        life: 25 + Math.random() * 15,
        decay: 0.9,
        shrink: 0.9,
        glow: true,
        glowColor: '#ff0000'
      }));
    }
    
    // Sparks
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 8;
      
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: '#ffffff',
        life: 40 + Math.random() * 30,
        decay: 0.97,
        gravity: 0.1,
        glow: true,
        glowColor: '#ffff00'
      }));
    }
    
    this.startLoop();
  }

  /**
   * Level up celebration
   */
  levelUpCelebration(x, y) {
    this.init();
    
    // Rising energy particles
    for (let i = 0; i < 50; i++) {
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 100,
        y: y + 50 + Math.random() * 50,
        vx: (Math.random() - 0.5) * 2,
        vy: -3 - Math.random() * 4,
        size: 4 + Math.random() * 6,
        color: `hsla(${45 + Math.random() * 30}, 100%, ${60 + Math.random() * 30}%, 0.9)`,
        life: 60 + Math.random() * 40,
        decay: 0.98,
        shrink: 0.98,
        glow: true,
        glowColor: '#ffd700'
      }));
    }
    
    // Circular ring
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60;
      const delay = i;
      
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * 4,
        vy: Math.sin(angle) * 4,
        size: 5,
        color: '#ffd700',
        life: 40,
        delay,
        decay: 0.95,
        glow: true,
        glowColor: '#ffa500'
      }));
    }
    
    this.startLoop();
  }

  /**
   * Shimmer effect (for premium cards)
   */
  shimmerEffect(element) {
    const rect = element.getBoundingClientRect();
    const shimmer = document.createElement('div');
    shimmer.className = 'premium-shimmer';
    shimmer.style.cssText = `
      position: absolute;
      top: 0;
      left: -100%;
      width: 50%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: shimmerSlide 2s ease-in-out;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(shimmer);
    
    shimmer.addEventListener('animationend', () => {
      shimmer.remove();
    });
  }

  /**
   * Screen shake effect
   */
  screenShake(intensity = 5, duration = 300) {
    const gameContainer = document.querySelector('.game-container, .game-board, #root > div');
    if (!gameContainer) return;
    
    const originalTransform = gameContainer.style.transform;
    const startTime = Date.now();
    
    const shake = () => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= duration) {
        gameContainer.style.transform = originalTransform;
        return;
      }
      
      const progress = elapsed / duration;
      const currentIntensity = intensity * (1 - progress);
      
      const x = (Math.random() - 0.5) * currentIntensity * 2;
      const y = (Math.random() - 0.5) * currentIntensity * 2;
      const rotation = (Math.random() - 0.5) * currentIntensity * 0.2;
      
      gameContainer.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      requestAnimationFrame(shake);
    };
    
    shake();
  }
}

/**
 * Particle class for individual particles
 */
class Particle {
  constructor(options) {
    this.x = options.x || 0;
    this.y = options.y || 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.size = options.size || 5;
    this.width = options.width || this.size;
    this.height = options.height || this.size;
    this.color = options.color || '#ffffff';
    this.life = options.life || 60;
    this.maxLife = this.life;
    this.delay = options.delay || 0;
    this.decay = options.decay || 0.98;
    this.gravity = options.gravity || 0;
    this.shrink = options.shrink || 1;
    this.rotation = options.rotation || 0;
    this.rotationSpeed = options.rotationSpeed || 0;
    this.shape = options.shape || 'circle';
    this.glow = options.glow || false;
    this.glowColor = options.glowColor || this.color;
    this.targetX = options.targetX;
    this.targetY = options.targetY;
    this.behavior = options.behavior;
    this.spiralSpeed = options.spiralSpeed || 0.1;
    this.spiralRadius = options.spiralRadius || 50;
    this.spiralAngle = options.spiralAngle || 0;
    this.wobble = options.wobble || 0;
    this.wobbleSpeed = options.wobbleSpeed || 0;
  }

  update() {
    if (this.delay > 0) {
      this.delay--;
      return;
    }

    if (this.behavior === 'spiral' && this.targetX !== undefined) {
      this.spiralAngle += this.spiralSpeed;
      this.spiralRadius *= 0.98;
      this.x = this.targetX + Math.cos(this.spiralAngle) * this.spiralRadius;
      this.y = this.targetY + Math.sin(this.spiralAngle) * this.spiralRadius;
    } else {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= this.decay;
      this.vy *= this.decay;
    }

    this.size *= this.shrink;
    this.rotation += this.rotationSpeed;
    this.wobble += this.wobbleSpeed;
    this.life--;
  }

  draw(ctx) {
    if (this.delay > 0 || this.life <= 0) return;

    const alpha = Math.min(1, this.life / 30);
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = alpha;

    if (this.glow) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.glowColor;
    }

    ctx.fillStyle = this.color;

    switch (this.shape) {
      case 'square':
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
      
      case 'crystal':
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.5, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.5, 0);
        ctx.closePath();
        ctx.fill();
        break;
      
      case 'confetti':
        // Wobble effect for confetti
        const wobbleX = Math.sin(this.wobble) * 0.3;
        ctx.rotate(wobbleX);
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        break;
      
      default: // circle
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
  }
}

// Create singleton instance
const particleEffects = new ParticleEffects();

// Export for both module and non-module usage
export default particleEffects;
export { ParticleEffects, Particle };

// Video Effects Utility
// Handles video-based visual effects (fire, smoke, etc.)

// Video effect configurations
export const VIDEO_EFFECTS = {
  // Fire effects for fire card plays, critical hits, combos
  FIRE: {
    videos: [
      'Cartoon_Fire_1_3991_HD.mp4',
      'Cartoon_Fire_3_3993_HD.mp4',
      'Cartoon_Fire_4_3994_HD.mp4',
      'Cartoon_Fire_6_3996_HD.mp4',
      'Cartoon_Fire_8_3998_HD.mp4'
    ],
    looping: 'Looping_Fire_1_4000_HD.mp4',
    defaultDuration: 1500,
    fallbackEmoji: '🔥'
  },
  // Smoke effects for defeat, card destruction, special abilities
  SMOKE: {
    videos: [
      'Cartoon_Smoke_2_4003_HD.mp4'
    ],
    defaultDuration: 2000,
    fallbackEmoji: '💨'
  }
};

// Preloaded video elements for performance
const videoCache = new Map();

// Detect mobile for performance optimization
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         ('ontouchstart' in window) ||
         (navigator.maxTouchPoints > 0);
};

/**
 * Preload videos for smoother playback
 * Call this during app initialization
 */
export const preloadVideoEffects = () => {
  // Skip preloading on mobile to save bandwidth
  if (isMobile()) return;

  Object.values(VIDEO_EFFECTS).forEach(effect => {
    const allVideos = [...(effect.videos || []), effect.looping].filter(Boolean);
    allVideos.forEach(videoFile => {
      if (!videoCache.has(videoFile)) {
        const video = document.createElement('video');
        video.src = `${process.env.PUBLIC_URL}/${videoFile}`;
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        videoCache.set(videoFile, video);
      }
    });
  });
};

/**
 * Get a random video from an effect type
 */
const getRandomVideo = (effectType) => {
  const effect = VIDEO_EFFECTS[effectType];
  if (!effect || !effect.videos || effect.videos.length === 0) return null;
  return effect.videos[Math.floor(Math.random() * effect.videos.length)];
};

/**
 * Create a video effect overlay at a specific position
 * @param {string} effectType - 'FIRE' or 'SMOKE'
 * @param {HTMLElement} targetElement - Element to position the effect on
 * @param {HTMLElement} container - Container to append the effect to
 * @param {Object} options - Additional options
 */
export const createVideoEffect = (effectType, targetElement, container, options = {}) => {
  const {
    duration = VIDEO_EFFECTS[effectType]?.defaultDuration || 1500,
    scale = 1,
    opacity = 0.9,
    loop = false,
    position = 'center', // 'center', 'top', 'bottom', 'left', 'right'
    blendMode = 'screen', // CSS blend mode for better integration
    onComplete = null,
    useLooping = false, // Use the looping version if available
    playbackRate = 1 // Speed multiplier
  } = options;

  if (!targetElement || !container) {
    console.warn('VideoEffects: Missing target element or container');
    return null;
  }

  // Skip on mobile for performance, use CSS fallback instead
  if (isMobile()) {
    return createFallbackEffect(effectType, targetElement, container, options);
  }

  const effect = VIDEO_EFFECTS[effectType];
  if (!effect) {
    console.warn(`VideoEffects: Unknown effect type "${effectType}"`);
    return null;
  }

  // Get video file
  const videoFile = useLooping && effect.looping ? effect.looping : getRandomVideo(effectType);
  if (!videoFile) {
    return createFallbackEffect(effectType, targetElement, container, options);
  }

  // Calculate position
  const rect = targetElement.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  let centerX = rect.left - containerRect.left + rect.width / 2;
  let centerY = rect.top - containerRect.top + rect.height / 2;

  // Adjust based on position option
  switch (position) {
    case 'top':
      centerY -= rect.height / 3;
      break;
    case 'bottom':
      centerY += rect.height / 3;
      break;
    case 'left':
      centerX -= rect.width / 3;
      break;
    case 'right':
      centerX += rect.width / 3;
      break;
    default:
      break;
  }

  // Create video container
  const videoContainer = document.createElement('div');
  videoContainer.className = `video-effect-container video-effect-${effectType.toLowerCase()}`;
  videoContainer.style.cssText = `
    position: absolute;
    left: ${centerX}px;
    top: ${centerY}px;
    transform: translate(-50%, -50%) scale(${scale});
    pointer-events: none;
    z-index: 500;
    mix-blend-mode: ${blendMode};
    opacity: ${opacity};
  `;

  // Create video element
  const video = document.createElement('video');
  video.className = 'video-effect';
  video.src = `${process.env.PUBLIC_URL}/${videoFile}`;
  video.muted = true;
  video.playsInline = true;
  video.loop = loop;
  video.playbackRate = playbackRate;
  video.autoplay = true;
  
  // Style the video
  video.style.cssText = `
    width: 200px;
    height: 200px;
    object-fit: contain;
  `;

  videoContainer.appendChild(video);
  container.appendChild(videoContainer);

  // Add entrance animation
  videoContainer.classList.add('video-effect-enter');

  // Play the video
  video.play().catch(err => {
    console.warn('VideoEffects: Could not play video', err);
    // Fallback to CSS animation
    videoContainer.remove();
    createFallbackEffect(effectType, targetElement, container, options);
  });

  // Cleanup
  const cleanup = () => {
    videoContainer.classList.add('video-effect-exit');
    setTimeout(() => {
      videoContainer.remove();
      if (onComplete) onComplete();
    }, 300);
  };

  if (!loop) {
    // Remove after duration or when video ends
    const timeoutId = setTimeout(cleanup, duration);
    video.onended = () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }

  // Return control object
  return {
    element: videoContainer,
    video: video,
    stop: cleanup
  };
};

/**
 * CSS-only fallback effect for mobile or when videos fail
 */
const createFallbackEffect = (effectType, targetElement, container, options = {}) => {
  const effect = VIDEO_EFFECTS[effectType];
  if (!effect) return null;

  const rect = targetElement.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const centerX = rect.left - containerRect.left + rect.width / 2;
  const centerY = rect.top - containerRect.top + rect.height / 2;

  const fallback = document.createElement('div');
  fallback.className = `video-effect-fallback video-fallback-${effectType.toLowerCase()}`;
  fallback.textContent = effect.fallbackEmoji;
  fallback.style.cssText = `
    position: absolute;
    left: ${centerX}px;
    top: ${centerY}px;
    transform: translate(-50%, -50%);
    font-size: 80px;
    pointer-events: none;
    z-index: 500;
    animation: videoEffectFallback 1s ease-out forwards;
  `;

  container.appendChild(fallback);
  
  setTimeout(() => fallback.remove(), 1000);
  
  return { element: fallback, stop: () => fallback.remove() };
};

/**
 * Fire burst effect - plays when a fire card is played
 */
export const createFireBurst = (cardElement, container, options = {}) => {
  return createVideoEffect('FIRE', cardElement, container, {
    scale: 1.5,
    blendMode: 'screen',
    duration: 1200,
    playbackRate: 1.2,
    ...options
  });
};

/**
 * Fire explosion effect - for critical hits or combos
 */
export const createFireExplosion = (targetElement, container, options = {}) => {
  return createVideoEffect('FIRE', targetElement, container, {
    scale: 2,
    blendMode: 'screen',
    duration: 1500,
    playbackRate: 1,
    ...options
  });
};

/**
 * Looping fire aura - for win streaks or powered-up state
 */
export const createFireAura = (targetElement, container, options = {}) => {
  return createVideoEffect('FIRE', targetElement, container, {
    useLooping: true,
    loop: true,
    scale: 1.2,
    opacity: 0.7,
    blendMode: 'screen',
    ...options
  });
};

/**
 * Smoke puff effect - for card destruction or defeat
 */
export const createSmokePuff = (targetElement, container, options = {}) => {
  return createVideoEffect('SMOKE', targetElement, container, {
    scale: 1.5,
    blendMode: 'multiply',
    duration: 2000,
    playbackRate: 0.8,
    ...options
  });
};

/**
 * Ember effect for Ember the Firestarter battles
 */
export const createEmberEffect = (container, options = {}) => {
  if (!container) return null;

  // Create multiple fire effects around the arena
  const effects = [];
  const positions = ['top', 'bottom', 'left', 'right'];
  
  positions.forEach((position, index) => {
    setTimeout(() => {
      const dummyTarget = document.createElement('div');
      dummyTarget.style.cssText = `
        position: absolute;
        ${position}: 10%;
        ${['top', 'bottom'].includes(position) ? 'left: 50%' : 'top: 50%'};
        width: 1px;
        height: 1px;
      `;
      container.appendChild(dummyTarget);
      
      const effect = createVideoEffect('FIRE', dummyTarget, container, {
        scale: 0.8,
        opacity: 0.6,
        duration: 2000,
        onComplete: () => dummyTarget.remove(),
        ...options
      });
      
      if (effect) effects.push(effect);
    }, index * 200);
  });

  return {
    effects,
    stop: () => effects.forEach(e => e?.stop?.())
  };
};

/**
 * Victory fire celebration effect
 */
export const createVictoryFire = (container, count = 5) => {
  if (!container) return null;

  const effects = [];
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight;
      
      const dummyTarget = document.createElement('div');
      dummyTarget.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 1px;
        height: 1px;
      `;
      container.appendChild(dummyTarget);
      
      const effect = createVideoEffect('FIRE', dummyTarget, container, {
        scale: 1 + Math.random() * 0.5,
        opacity: 0.8,
        duration: 1500 + Math.random() * 500,
        onComplete: () => dummyTarget.remove()
      });
      
      if (effect) effects.push(effect);
    }, i * 300);
  }

  return {
    effects,
    stop: () => effects.forEach(e => e?.stop?.())
  };
};

// Export effect types for external use
export const VideoEffectTypes = {
  FIRE: 'FIRE',
  SMOKE: 'SMOKE'
};

export default {
  createVideoEffect,
  createFireBurst,
  createFireExplosion,
  createFireAura,
  createSmokePuff,
  createEmberEffect,
  createVictoryFire,
  preloadVideoEffects,
  VideoEffectTypes,
  VIDEO_EFFECTS
};

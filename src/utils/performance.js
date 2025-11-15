/**
 * Performance Utilities
 * Collection of performance optimization helpers for the game
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function to limit execution rate
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Memoize function results for performance
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * RAF-based animation frame scheduler
 * Better performance than setTimeout for animations
 */
export class AnimationScheduler {
  constructor() {
    this.tasks = [];
    this.isRunning = false;
  }

  schedule(callback, delay = 0) {
    const task = {
      callback,
      executeAt: performance.now() + delay
    };
    this.tasks.push(task);
    if (!this.isRunning) {
      this.start();
    }
  }

  start() {
    this.isRunning = true;
    this.tick();
  }

  tick() {
    const now = performance.now();
    const remainingTasks = [];

    for (const task of this.tasks) {
      if (now >= task.executeAt) {
        try {
          task.callback();
        } catch (error) {
          console.error('Task execution error:', error);
        }
      } else {
        remainingTasks.push(task);
      }
    }

    this.tasks = remainingTasks;

    if (this.tasks.length > 0) {
      requestAnimationFrame(() => this.tick());
    } else {
      this.isRunning = false;
    }
  }
}

/**
 * Lazy initialization wrapper
 * Delays initialization until first use
 */
export const lazy = (initializer) => {
  let instance;
  let initialized = false;
  
  return () => {
    if (!initialized) {
      instance = initializer();
      initialized = true;
    }
    return instance;
  };
};

/**
 * Object pool for reducing garbage collection
 */
export class ObjectPool {
  constructor(factory, reset, initialSize = 10) {
    this.factory = factory;
    this.reset = reset;
    this.pool = [];
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(factory());
    }
  }

  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.factory();
  }

  release(obj) {
    this.reset(obj);
    if (this.pool.length < 100) { // Max pool size
      this.pool.push(obj);
    }
  }
}

/**
 * Batch updates to reduce re-renders
 */
export class BatchUpdater {
  constructor(callback, delay = 16) { // ~60fps
    this.callback = callback;
    this.delay = delay;
    this.pending = [];
    this.timer = null;
  }

  add(update) {
    this.pending.push(update);
    if (!this.timer) {
      this.timer = setTimeout(() => {
        const updates = this.pending.slice();
        this.pending = [];
        this.timer = null;
        this.callback(updates);
      }, this.delay);
    }
  }

  flush() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
      const updates = this.pending.slice();
      this.pending = [];
      this.callback(updates);
    }
  }
}

export default {
  debounce,
  throttle,
  memoize,
  lazy,
  AnimationScheduler,
  ObjectPool,
  BatchUpdater
};

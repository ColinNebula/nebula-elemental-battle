// Mobile screen management utilities

class MobileScreenManager {
  constructor() {
    this.wakeLock = null;
    this.isSupported = 'wakeLock' in navigator;
    this.performanceMode = false;
  }

  // Detect if device is mobile
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0);
  }

  // Enable performance optimizations for low-end devices
  enablePerformanceMode() {
    this.performanceMode = true;
    document.body.classList.add('performance-mode');
    
    // Reduce CSS animations
    const style = document.createElement('style');
    style.id = 'performance-mode-style';
    style.textContent = `
      .performance-mode * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
      }
      .performance-mode .particle {
        display: none !important;
      }
      .performance-mode .cosmic-particle {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    console.log('🚀 Performance mode enabled');
  }

  // Disable performance mode
  disablePerformanceMode() {
    this.performanceMode = false;
    document.body.classList.remove('performance-mode');
    const style = document.getElementById('performance-mode-style');
    if (style) style.remove();
    console.log('✨ Performance mode disabled');
  }

  // Request wake lock to prevent screen from turning off
  async requestWakeLock() {
    if (!this.isSupported) {
      console.log('Wake Lock API not supported');
      return false;
    }

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      console.log('Wake Lock acquired');

      this.wakeLock.addEventListener('release', () => {
        console.log('Wake Lock released');
      });

      return true;
    } catch (err) {
      console.error('Failed to acquire Wake Lock:', err);
      return false;
    }
  }

  // Release wake lock
  async releaseWakeLock() {
    if (this.wakeLock) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
        console.log('Wake Lock released manually');
      } catch (err) {
        console.error('Failed to release Wake Lock:', err);
      }
    }
  }

  // Re-acquire wake lock on visibility change
  handleVisibilityChange() {
    if (document.visibilityState === 'visible' && this.isSupported) {
      this.requestWakeLock();
    }
  }

  // Initialize listeners
  init() {
    if (this.isSupported) {
      document.addEventListener('visibilitychange', () => {
        this.handleVisibilityChange();
      });

      // Request initial wake lock
      this.requestWakeLock();
    }

    // Auto-enable performance mode on mobile devices
    if (this.isMobile()) {
      this.enablePerformanceMode();
    }

    // Prevent mobile browser from hiding content
    this.preventMobileBlank();
  }

  // Prevent mobile browser blank screens
  preventMobileBlank() {
    // Force minimum height
    const root = document.getElementById('root');
    if (root) {
      root.style.minHeight = '100vh';
      root.style.minHeight = '-webkit-fill-available';
    }

    // Prevent iOS Safari from collapsing
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta) {
      meta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content'
      );
    }

    // Add CSS to prevent blank screens
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        height: 100%;
        min-height: 100vh;
        min-height: -webkit-fill-available;
        overflow: hidden;
      }
      #root {
        height: 100%;
        min-height: 100vh;
        min-height: -webkit-fill-available;
      }
      .App {
        height: 100%;
        min-height: 100vh;
        min-height: -webkit-fill-available;
      }
    `;
    document.head.appendChild(style);

    // Handle page visibility to maintain rendering
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // Force repaint when coming back to page
        document.body.style.display = 'none';
        void document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
      }
    });

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
    });

    // Prevent iOS momentum scrolling issues
    document.body.addEventListener('touchmove', (e) => {
      if (e.target === document.body) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Cleanup
  destroy() {
    this.releaseWakeLock();
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

// Create singleton instance
const mobileScreenManager = new MobileScreenManager();

export default mobileScreenManager;

/**
 * Security Configuration and Utilities
 * Handles client-side security measures and validation
 */

class SecurityManager {
  constructor() {
    this.config = {
      maxInputLength: 1000,
      allowedCommands: ['CREATE_ROOM', 'JOIN_ROOM', 'START_GAME', 'PLAY_CARD', 'GET_STATE', 'SELECT_CARDS', 'COIN_TOSS'],
      rateLimitWindow: 60000, // 1 minute
      maxRequestsPerWindow: 30,
      enableCSRFProtection: true,
      enableXSSProtection: true
    };
    
    this.requestHistory = new Map();
    this.init();
  }

  init() {
    // Set up client-side security headers if supported
    if (typeof document !== 'undefined') {
      this.setupContentSecurityPolicy();
      this.preventClickjacking();
      this.disableDebugFeatures();
    }
  }

  setupContentSecurityPolicy() {
    // Note: CSP should ideally be set server-side, this is additional client-side protection
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' ws: wss:;";
    
    if (document.head && !document.head.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      document.head.appendChild(meta);
    }
  }

  preventClickjacking() {
    // Prevent the page from being embedded in frames
    try {
      if (window.self !== window.top) {
        // Try to redirect, but handle permission errors gracefully
        window.top.location = window.self.location;
      }
    } catch (error) {
      // If we can't redirect (e.g., in VS Code Simple Browser), just log it
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SECURITY] Clickjacking prevention blocked by browser security policy');
      }
    }
  }

  disableDebugFeatures() {
    // Disable debug features in production
    if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_DEBUG_MODE !== 'true') {
      // Disable console in production
      if (typeof console !== 'undefined') {
        console.log = () => {};
        console.warn = () => {};
        console.error = () => {};
        console.debug = () => {};
      }
      
      // Disable right-click context menu
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      
      // Disable F12 and other developer shortcuts
      document.addEventListener('keydown', (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          return false;
        }
      });
    }
  }

  sanitizeInput(input) {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    if (input.length > this.config.maxInputLength) {
      throw new Error('Input exceeds maximum length');
    }

    // Remove potentially dangerous characters
    const sanitized = input
      .replace(/[<>"'&]/g, '') // Basic XSS protection
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '') // Control characters
      .trim();

    return sanitized;
  }

  validateCommand(command) {
    const sanitizedCommand = this.sanitizeInput(command);
    const parts = sanitizedCommand.split(' ');
    const action = parts[0];

    if (!this.config.allowedCommands.includes(action)) {
      throw new Error(`Invalid command: ${action}`);
    }

    return sanitizedCommand;
  }

  checkRateLimit(identifier = 'default') {
    const now = Date.now();
    const windowStart = now - this.config.rateLimitWindow;

    // Clean old requests
    if (!this.requestHistory.has(identifier)) {
      this.requestHistory.set(identifier, []);
    }

    const userRequests = this.requestHistory.get(identifier)
      .filter(timestamp => timestamp > windowStart);

    if (userRequests.length >= this.config.maxRequestsPerWindow) {
      throw new Error('Rate limit exceeded. Please slow down.');
    }

    // Add current request
    userRequests.push(now);
    this.requestHistory.set(identifier, userRequests);

    return true;
  }

  logSecurityEvent(event, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.warn('[SECURITY]', logEntry);
    }
  }

  // Public method to validate and process game commands securely
  processSecureCommand(command, userId = null) {
    try {
      // Rate limiting
      this.checkRateLimit(userId || 'anonymous');
      
      // Command validation
      const validatedCommand = this.validateCommand(command);
      
      // Log the command for security monitoring
      this.logSecurityEvent('command_processed', {
        command: validatedCommand.split(' ')[0], // Only log the action, not sensitive data
        userId: userId || 'anonymous'
      });
      
      return validatedCommand;
    } catch (error) {
      this.logSecurityEvent('security_violation', {
        error: error.message,
        command: command?.substring(0, 100), // Limit logged command length
        userId: userId || 'anonymous'
      });
      throw error;
    }
  }
}

// Create and export singleton instance
const securityManager = new SecurityManager();

export default securityManager;
export { SecurityManager };
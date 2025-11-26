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
      enableXSSProtection: true,
      encryptionKey: this.generateEncryptionKey()
    };
    
    this.requestHistory = new Map();
    this.tamperAttempts = 0;
    this.maxTamperAttempts = 3;
    this.init();
  }

  // Generate a consistent encryption key based on browser fingerprint
  generateEncryptionKey() {
    // Check if we already have a stored key
    const storedKey = localStorage.getItem('_encKey');
    if (storedKey) {
      return storedKey;
    }
    
    // Generate new key based on stable browser properties
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      'nebula-game-v1' // Static salt for consistency
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const newKey = Math.abs(hash).toString(36);
    // Store the key for future use
    localStorage.setItem('_encKey', newKey);
    return newKey;
  }

  // Simple XOR encryption
  encrypt(data) {
    try {
      const jsonStr = JSON.stringify(data);
      const key = this.config.encryptionKey;
      const encrypted = [];
      
      for (let i = 0; i < jsonStr.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const strChar = jsonStr.charCodeAt(i);
        encrypted.push(strChar ^ keyChar);
      }
      
      // Convert to hex string instead of using btoa
      return encrypted.map(byte => byte.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      console.error('[SECURITY] Encryption failed:', error);
      return null;
    }
  }

  // Decrypt XOR encrypted data
  decrypt(encryptedData) {
    try {
      // Convert hex string back to byte array
      const bytes = [];
      for (let i = 0; i < encryptedData.length; i += 2) {
        bytes.push(parseInt(encryptedData.substr(i, 2), 16));
      }
      
      const key = this.config.encryptionKey;
      let decrypted = '';
      
      for (let i = 0; i < bytes.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(bytes[i] ^ keyChar);
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      // Only log in development, not a security issue during migration
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SECURITY] Decryption failed - possibly legacy unencrypted data');
      }
      // Don't treat as tampering during initial migration
      return null;
    }
  }

  // Generate checksum for data integrity
  generateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  // Verify data integrity
  verifyChecksum(data, expectedChecksum) {
    const actualChecksum = this.generateChecksum(data);
    return actualChecksum === expectedChecksum;
  }

  // Save to localStorage with encryption and integrity check
  secureStore(key, data) {
    try {
      const checksum = this.generateChecksum(data);
      const package_data = {
        data: data,
        checksum: checksum,
        timestamp: Date.now(),
        version: '1.0'
      };
      
      const encrypted = this.encrypt(package_data);
      if (encrypted) {
        localStorage.setItem(key, encrypted);
        return true;
      }
      return false;
    } catch (error) {
      this.logSecurityEvent('storage_error', { key, error: error.message });
      return false;
    }
  }

  // Retrieve from localStorage with decryption and integrity verification
  secureRetrieve(key) {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      const package_data = this.decrypt(encrypted);
      if (!package_data) {
        // Decryption failed - might be legacy unencrypted data
        try {
          const legacyData = JSON.parse(encrypted);
          if (process.env.NODE_ENV === 'development') {
            console.log('[SECURITY] Loading legacy unencrypted data for:', key);
          }
          // Re-save with encryption for next time
          this.secureStore(key, legacyData);
          return legacyData;
        } catch {
          // Not valid JSON either, data is corrupted
          return null;
        }
      }
      
      // Verify checksum
      if (!this.verifyChecksum(package_data.data, package_data.checksum)) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[SECURITY] Checksum mismatch for:', key);
        }
        return null;
      }
      
      // Check for data age (optional - flag old data)
      const age = Date.now() - package_data.timestamp;
      if (age > 30 * 24 * 60 * 60 * 1000) { // 30 days
        if (process.env.NODE_ENV === 'development') {
          console.log('[SECURITY] Old data detected for key:', key);
        }
      }
      
      return package_data.data;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SECURITY] Retrieval error for key:', key, error.message);
      }
      return null;
    }
  }

  // Handle tamper detection
  handleTamperDetection(reason, details = null) {
    this.tamperAttempts++;
    
    this.logSecurityEvent('tamper_detected', {
      reason,
      details,
      attempt: this.tamperAttempts
    });
    
    if (this.tamperAttempts >= this.maxTamperAttempts) {
      this.handleTamperThresholdExceeded();
    }
  }

  // Action when tamper threshold is exceeded
  handleTamperThresholdExceeded() {
    this.logSecurityEvent('tamper_threshold_exceeded', {
      attempts: this.tamperAttempts
    });
    
    // Show warning to user
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
      const warningDiv = document.createElement('div');
      warningDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(244, 67, 54, 0.95);
        color: white;
        padding: 30px;
        border-radius: 10px;
        z-index: 999999;
        text-align: center;
        font-family: Arial, sans-serif;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      `;
      warningDiv.innerHTML = `
        <h2>⚠️ Security Warning</h2>
        <p>Data tampering detected.</p>
        <p>Game data has been corrupted or modified.</p>
        <p>Please refresh the page to continue.</p>
        <button onclick="location.reload()" style="
          margin-top: 15px;
          padding: 10px 20px;
          background: white;
          color: #f44336;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        ">Refresh Page</button>
      `;
      document.body.appendChild(warningDiv);
    }
  }

  // Monitor for localStorage tampering
  monitorStorageTampering() {
    if (typeof window === 'undefined') return;
    
    const protectedKeys = ['playerProfile', 'inventory', 'gameSettings', 'statistics'];
    
    // Import secureStorage for proper decryption
    const secureStorage = require('./secureStorage').default;
    
    // Store checksums of decrypted data
    const checksums = new Map();
    
    protectedKeys.forEach(key => {
      try {
        const data = secureStorage.getItem(key);
        if (data) {
          checksums.set(key, this.generateChecksum(JSON.stringify(data)));
        }
      } catch (err) {
        console.warn(`[SECURITY] Failed to read ${key} for monitoring:`, err);
      }
    });
    
    // Check for tampering periodically
    setInterval(() => {
      protectedKeys.forEach(key => {
        try {
          const data = secureStorage.getItem(key);
          if (data) {
            const storedChecksum = checksums.get(key);
            const currentChecksum = this.generateChecksum(JSON.stringify(data));
            
            if (storedChecksum && storedChecksum !== currentChecksum) {
              // Data changed outside normal flow - legitimate if done through secureStorage
              // Only flag as tampering if decryption fails or data is corrupted
              console.log(`[SECURITY] Data updated for ${key} - this is normal`);
            }
            
            // Update checksum for next check
            checksums.set(key, currentChecksum);
          }
        } catch (err) {
          // Decryption failed - this is actual tampering
          console.error(`[SECURITY] Tampering detected for ${key}:`, err);
          this.handleTamperDetection('storage_modified', key);
        }
      });
    }, 5000); // Check every 5 seconds
  }

  init() {
    // Set up client-side security headers if supported
    if (typeof document !== 'undefined') {
      this.setupContentSecurityPolicy();
      this.preventClickjacking();
      this.disableDebugFeatures();
      // Only enable monitoring after migration is complete
      setTimeout(() => {
        const migrated = localStorage.getItem('secureStorageMigrated');
        if (migrated === 'true') {
          this.monitorStorageTampering();
        }
      }, 5000);
      this.detectDebugger();
    }
  }

  // Detect if debugger is open
  detectDebugger() {
    if (process.env.NODE_ENV !== 'production') return;
    
    setInterval(() => {
      const start = performance.now();
      debugger; // This line will pause if debugger is open
      const end = performance.now();
      
      // If more than 100ms passed, debugger was likely open
      if (end - start > 100) {
        this.handleTamperDetection('debugger_detected');
      }
    }, 1000);
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
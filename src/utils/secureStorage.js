/**
 * Secure Storage Utility
 * Wrapper for encrypted localStorage with integrity checks
 */

import securityManager from './security';

class SecureStorage {
  constructor() {
    this.protectedKeys = [
      'playerProfile',
      'inventory', 
      'gameSettings',
      'statistics',
      'themeUnlocks',
      'storyProgress',
      'achievements'
    ];
  }

  /**
   * Save data securely with encryption and integrity checks
   */
  setItem(key, value) {
    try {
      // For protected keys, use encryption
      if (this.protectedKeys.includes(key)) {
        return securityManager.secureStore(key, value);
      }
      
      // For non-sensitive data, use regular storage with checksum
      const checksum = securityManager.generateChecksum(value);
      const package_data = { data: value, checksum };
      localStorage.setItem(key, JSON.stringify(package_data));
      return true;
    } catch (error) {
      console.error('[SECURE STORAGE] Save failed:', error);
      return false;
    }
  }

  /**
   * Retrieve data securely with decryption and integrity verification
   */
  getItem(key) {
    try {
      // For protected keys, use decryption
      if (this.protectedKeys.includes(key)) {
        const data = securityManager.secureRetrieve(key);
        if (data !== null) return data;
        
        // If decryption failed, try reading as plain JSON (legacy data)
        try {
          const plain = localStorage.getItem(key);
          if (plain) {
            const parsed = JSON.parse(plain);
            // Re-save with encryption
            this.setItem(key, parsed);
            return parsed;
          }
        } catch {
          // Not valid data
        }
        return null;
      }
      
      // For non-sensitive data, verify checksum
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      try {
        const package_data = JSON.parse(stored);
        if (!package_data.checksum) {
          // Old format, return as-is
          if (process.env.NODE_ENV === 'development') {
            console.log('[SECURE STORAGE] Legacy format for:', key);
          }
          return package_data;
        }
        
        if (!securityManager.verifyChecksum(package_data.data, package_data.checksum)) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[SECURE STORAGE] Checksum mismatch for:', key);
          }
          return null;
        }
        
        return package_data.data;
      } catch {
        // Not JSON, return as string
        return stored;
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[SECURE STORAGE] Retrieval error for:', key, error.message);
      }
      // Fallback to regular localStorage for backwards compatibility
      try {
        const fallback = localStorage.getItem(key);
        return fallback ? JSON.parse(fallback) : fallback;
      } catch {
        return localStorage.getItem(key);
      }
    }
  }

  /**
   * Remove item from storage
   */
  removeItem(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('[SECURE STORAGE] Remove failed:', error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('[SECURE STORAGE] Clear failed:', error);
      return false;
    }
  }

  /**
   * Migrate existing unencrypted data to encrypted format
   */
  migrateToSecureStorage() {
    console.log('[SECURE STORAGE] Starting migration...');
    
    this.protectedKeys.forEach(key => {
      try {
        const existing = localStorage.getItem(key);
        if (existing) {
          // Try to parse as JSON
          let data;
          try {
            data = JSON.parse(existing);
          } catch {
            data = existing;
          }
          
          // Re-save with encryption
          this.setItem(key, data);
          console.log('[SECURE STORAGE] Migrated:', key);
        }
      } catch (error) {
        console.error('[SECURE STORAGE] Migration failed for:', key, error);
      }
    });
    
    console.log('[SECURE STORAGE] Migration complete');
  }

  /**
   * Validate all stored data integrity
   */
  validateIntegrity() {
    const results = {
      valid: [],
      invalid: [],
      missing: []
    };
    
    this.protectedKeys.forEach(key => {
      const data = this.getItem(key);
      if (data === null) {
        const exists = localStorage.getItem(key) !== null;
        if (exists) {
          results.invalid.push(key);
        } else {
          results.missing.push(key);
        }
      } else {
        results.valid.push(key);
      }
    });
    
    return results;
  }
}

// Create and export singleton instance
const secureStorage = new SecureStorage();

export default secureStorage;
export { SecureStorage };

import React, { useState, useEffect } from 'react';
import './UpdatePrompt.css';

const UpdatePrompt = ({ onUpdate, onDismiss }) => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [newVersion, setNewVersion] = useState(null);

  useEffect(() => {
    // Check for app updates on mount and periodically
    checkForUpdates();
    
    // Check for updates every 5 minutes
    const interval = setInterval(checkForUpdates, 5 * 60 * 1000);
    
    // Listen for service worker update events
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // New service worker has taken control
        console.log('🔄 New service worker activated');
      });
    }
    
    // Listen for custom update event from App.js
    const handleUpdateAvailable = (e) => {
      console.log('📦 Update available event received:', e.detail);
      setNewVersion(e.detail?.version || 'New');
      setUpdateAvailable(true);
      setShowPrompt(true);
    };
    
    window.addEventListener('appUpdateAvailable', handleUpdateAvailable);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('appUpdateAvailable', handleUpdateAvailable);
    };
  }, []);

  const checkForUpdates = async () => {
    try {
      // Check if there's a new version by comparing with stored version
      const currentVersion = localStorage.getItem('appVersion');
      const latestVersion = '2.1.0'; // This should match APP_VERSION in App.js
      
      if (currentVersion && currentVersion !== latestVersion) {
        console.log('📦 Update available:', currentVersion, '→', latestVersion);
        setNewVersion(latestVersion);
        setUpdateAvailable(true);
        
        // Show prompt after a short delay (don't interrupt initial load)
        setTimeout(() => {
          const dismissed = localStorage.getItem('update-dismissed');
          const dismissedVersion = localStorage.getItem('update-dismissed-version');
          
          // Only show if not dismissed for this version
          if (!dismissed || dismissedVersion !== latestVersion) {
            setShowPrompt(true);
          }
        }, 2000);
      }
      
      // Also try to check via service worker if registered
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
        }
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  };

  const handleUpdate = () => {
    // Clear the dismissed flag
    localStorage.removeItem('update-dismissed');
    localStorage.removeItem('update-dismissed-version');
    
    // Notify parent component
    if (onUpdate) {
      onUpdate();
    }
    
    // Force reload to get latest version
    // Clear caches first if possible
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
    
    // Hard reload
    window.location.reload(true);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('update-dismissed', Date.now().toString());
    localStorage.setItem('update-dismissed-version', newVersion);
    
    if (onDismiss) {
      onDismiss();
    }
  };

  const handleRemindLater = () => {
    setShowPrompt(false);
    // Will show again next time they open the app
    localStorage.setItem('update-remind-later', Date.now().toString());
  };

  if (!showPrompt || !updateAvailable) return null;

  return (
    <div className="update-prompt-overlay">
      <div className="update-prompt">
        <div className="update-header">
          <div className="update-icon">🚀</div>
          <h3 className="update-title">Update Available!</h3>
        </div>
        
        <div className="update-content">
          <p className="update-version">
            Version <span className="version-badge">{newVersion}</span> is ready
          </p>
          <p className="update-description">
            Get the latest features, bug fixes, and improvements!
          </p>
          
          <div className="update-features">
            <div className="feature-item">✨ New Features</div>
            <div className="feature-item">🐛 Bug Fixes</div>
            <div className="feature-item">⚡ Performance</div>
          </div>
        </div>
        
        <div className="update-actions">
          <button className="update-button primary" onClick={handleUpdate}>
            <span className="btn-icon">⬆️</span>
            <span>Update Now</span>
          </button>
          <button className="update-button secondary" onClick={handleRemindLater}>
            Later
          </button>
          <button className="update-dismiss" onClick={handleDismiss}>
            ✕
          </button>
        </div>
        
        <p className="update-note">
          💾 Your progress will be saved
        </p>
      </div>
    </div>
  );
};

export default UpdatePrompt;

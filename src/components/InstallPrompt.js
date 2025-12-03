import React, { useState, useEffect } from 'react';
import './InstallPrompt.css';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if prompt was previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show for 7 days after dismissal
      }
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    // For iOS, show prompt after delay if not installed
    if (iOS) {
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000); // 30 seconds
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }
    
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  const handleRemindLater = () => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    // Will show again next session
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <div className="install-prompt-overlay">
      <div className="install-prompt">
        <button className="install-close" onClick={handleDismiss}>✕</button>
        
        <div className="install-header">
          <div className="install-icon-wrapper">
            <img src="/logo192.png" alt="Elemental Battle" className="install-app-icon" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            <div className="install-icon-fallback" style={{display: 'none'}}>🎮</div>
          </div>
          <div className="install-title-area">
            <h3 className="install-title">Install Elemental Battle</h3>
            <p className="install-subtitle">Play anytime, even offline!</p>
          </div>
        </div>
        
        {showIOSInstructions ? (
          <div className="ios-instructions">
            <p className="ios-title">📱 Install on iOS:</p>
            <ol className="ios-steps">
              <li>
                <span className="step-number">1</span>
                <span className="step-text">
                  Tap the <strong>Share</strong> button 
                  <span className="share-icon">📤</span>
                </span>
              </li>
              <li>
                <span className="step-number">2</span>
                <span className="step-text">
                  Scroll and tap <strong>"Add to Home Screen"</strong>
                  <span className="add-icon">➕</span>
                </span>
              </li>
              <li>
                <span className="step-number">3</span>
                <span className="step-text">
                  Tap <strong>"Add"</strong> to confirm
                  <span className="confirm-icon">✅</span>
                </span>
              </li>
            </ol>
            <button className="install-button secondary" onClick={handleRemindLater}>
              Got it!
            </button>
          </div>
        ) : (
          <>
            <div className="install-benefits">
              <div className="benefit-item">
                <span className="benefit-icon">⚡</span>
                <span className="benefit-text">Instant Access</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🎮</span>
                <span className="benefit-text">Fullscreen Mode</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">📴</span>
                <span className="benefit-text">Play Offline</span>
              </div>
              <div className="benefit-item">
                <span className="benefit-icon">🔔</span>
                <span className="benefit-text">Get Updates</span>
              </div>
            </div>
            
            <div className="install-actions">
              <button className="install-button primary" onClick={handleInstall}>
                <span className="install-btn-icon">📲</span>
                <span>{isIOS ? 'How to Install' : 'Install Now'}</span>
              </button>
              <button className="install-button secondary" onClick={handleRemindLater}>
                Maybe Later
              </button>
            </div>
            
            <p className="install-note">
              🛡️ No app store needed • Free forever
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default InstallPrompt;

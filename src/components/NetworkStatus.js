import React, { useState, useEffect } from 'react';
import './NetworkStatus.css';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowBanner(true);
        // Hide the "back online" banner after 3 seconds
        setTimeout(() => setShowBanner(false), 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Don't show anything if online and no recent state change
  if (isOnline && !showBanner) return null;

  return (
    <div className={`network-status ${isOnline ? 'online' : 'offline'} ${showBanner ? 'show' : ''}`}>
      <div className="network-status-content">
        {isOnline ? (
          <>
            <span className="network-icon">✅</span>
            <span className="network-message">Back online!</span>
          </>
        ) : (
          <>
            <span className="network-icon">📴</span>
            <span className="network-message">You're offline - Some features may be limited</span>
          </>
        )}
      </div>
      {!isOnline && (
        <button 
          className="network-retry" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default NetworkStatus;

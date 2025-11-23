import React, { useState, useEffect } from 'react';
import './SecurityIndicator.css';
import secureStorage from '../utils/secureStorage';

const SecurityIndicator = ({ showInProduction = false }) => {
  const [status, setStatus] = useState('active'); // active, warning, danger
  const [corruptedKeys, setCorruptedKeys] = useState([]);

  useEffect(() => {
    // Validate integrity on mount
    const checkIntegrity = () => {
      const integrity = secureStorage.validateIntegrity();
      
      if (integrity.invalid.length > 0) {
        setStatus('danger');
        setCorruptedKeys(integrity.invalid);
      } else if (integrity.missing.length > 0) {
        setStatus('warning');
      } else {
        setStatus('active');
      }
    };

    checkIntegrity();

    // Re-check every 30 seconds
    const interval = setInterval(checkIntegrity, 30000);

    return () => clearInterval(interval);
  }, []);

  // Hide in production unless explicitly enabled
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction && !showInProduction) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'danger':
        return '⚠️';
      case 'warning':
        return '⚡';
      default:
        return '🔒';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'danger':
        return 'Data Corrupted';
      case 'warning':
        return 'Partial Protection';
      default:
        return 'Protected';
    }
  };

  const getTooltipContent = () => {
    switch (status) {
      case 'danger':
        return (
          <>
            <h4>⚠️ Security Alert</h4>
            <p>Corrupted or tampered data detected:</p>
            <ul>
              {corruptedKeys.map(key => (
                <li key={key}>{key}</li>
              ))}
            </ul>
            <p>Refresh the page to reset data.</p>
          </>
        );
      case 'warning':
        return (
          <>
            <h4>⚡ Partial Protection</h4>
            <p>Some data not yet migrated to secure storage.</p>
            <p>Protection active for:</p>
            <ul>
              <li>Player Profile</li>
              <li>Inventory</li>
              <li>Statistics</li>
            </ul>
          </>
        );
      default:
        return (
          <>
            <h4>🔒 Security Active</h4>
            <p>Your game data is protected with:</p>
            <ul>
              <li>✓ Encryption</li>
              <li>✓ Integrity Checks</li>
              <li>✓ Tamper Detection</li>
              <li>✓ Anti-Debugging</li>
            </ul>
            <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '10px' }}>
              Note: Client-side protection only
            </p>
          </>
        );
    }
  };

  return (
    <div className={`security-indicator ${status}`}>
      <span className="security-icon">{getStatusIcon()}</span>
      <span className="security-text">{getStatusText()}</span>
      <div className="security-tooltip">
        {getTooltipContent()}
      </div>
    </div>
  );
};

export default SecurityIndicator;

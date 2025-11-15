import React, { useState, useEffect } from 'react';
import './DonationBanner.css';

const DonationBanner = ({ onClose }) => {
  const [donationInfo, setDonationInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem('donationBannerDismissed');
    if (dismissed) {
      setIsDismissed(true);
      setIsVisible(false);
      return;
    }

    // Load donation configuration
    loadDonationInfo();
  }, []);

  const loadDonationInfo = async () => {
    try {
      // Always show donation banner with default config
      const donationData = {
        enabled: true,
        links: {
          paypal: 'https://paypal.me/yourpaypal',
          kofi: 'https://ko-fi.com/yourkofi',
          github: 'https://github.com/sponsors/yourgithub'
        },
        message: 'Support Nebula 3D Dev - Your contributions help keep this project alive!'
      };

      setDonationInfo(donationData);
    } catch (error) {
      console.error('Failed to load donation info:', error);
      setIsVisible(false);
    }
  };

  const handleDismiss = (permanent = false) => {
    if (permanent) {
      localStorage.setItem('donationBannerDismissed', 'true');
      setIsDismissed(true);
    }
    setIsVisible(false);
    if (onClose) onClose();
  };

  const handleDonate = (platform) => {
    if (donationInfo?.links?.[platform]) {
      window.open(donationInfo.links[platform], '_blank', 'noopener,noreferrer');
      
      // Track donation click (optional analytics)
      if (window.gtag) {
        window.gtag('event', 'donation_click', {
          platform: platform,
          source: 'donation_banner'
        });
      }
    }
  };

  if (!isVisible || isDismissed || !donationInfo?.enabled) {
    return null;
  }

  return (
    <div className="donation-banner">
      <div className="donation-content">
        <div className="donation-icon">
          ❤️
        </div>
        <div className="donation-message">
          <h3>Support Nebula 3D Development</h3>
          <p>{donationInfo.message}</p>
        </div>
        <div className="donation-buttons">
          {donationInfo.links?.paypal && (
            <button 
              className="donate-btn paypal"
              onClick={() => handleDonate('paypal')}
              aria-label="Donate via PayPal"
            >
              💳 PayPal
            </button>
          )}
          {donationInfo.links?.kofi && (
            <button 
              className="donate-btn kofi"
              onClick={() => handleDonate('kofi')}
              aria-label="Support on Ko-fi"
            >
              ☕ Ko-fi
            </button>
          )}
          {donationInfo.links?.github && (
            <button 
              className="donate-btn github"
              onClick={() => handleDonate('github')}
              aria-label="Sponsor on GitHub"
            >
              ⭐ GitHub
            </button>
          )}
        </div>
        <div className="donation-controls">
          <button 
            className="close-btn temporary"
            onClick={() => handleDismiss(false)}
            aria-label="Close banner"
          >
            ✕
          </button>
          <button 
            className="close-btn permanent"
            onClick={() => handleDismiss(true)}
            aria-label="Don't show again"
            title="Don't show again"
          >
            🚫
          </button>
        </div>
      </div>
      <div className="developer-credit">
        <small>Created by <strong>Developer Colin Nebula</strong> for Nebula 3D Dev</small>
      </div>
    </div>
  );
};

export default DonationBanner;
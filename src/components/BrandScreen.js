import React, { useEffect, useState } from 'react';
import './BrandScreen.css';

const BrandScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log('BrandScreen mounted, PUBLIC_URL:', process.env.PUBLIC_URL);
    
    // Show for 3.5 seconds then fade out
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 3500);

    // Complete after fade out animation
    const completeTimer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const handleImageError = () => {
    console.error('Failed to load brand image');
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Brand image loaded successfully');
  };

  return (
    <div className={`brand-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="brand-content">
        {!imageError ? (
          <img 
            src={`${process.env.PUBLIC_URL}/nebulamedia.png`} 
            alt="Nebula Media" 
            className="brand-logo"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#333' }}>
            NEBULA MEDIA
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandScreen;

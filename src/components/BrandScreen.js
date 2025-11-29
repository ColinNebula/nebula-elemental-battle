import React, { useEffect, useState } from 'react';
import './BrandScreen.css';

const BrandScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);

  const playBrandSound = () => {
    if (!soundPlayed) {
      const audioPath = process.env.PUBLIC_URL 
        ? `${process.env.PUBLIC_URL}/mixkit-terror-sweep-of-darkness-2630.mp3`
        : '/mixkit-terror-sweep-of-darkness-2630.mp3';
      const brandSound = new Audio(audioPath);
      brandSound.volume = 0.7;
      brandSound.setAttribute('playsinline', 'true');
      brandSound.setAttribute('webkit-playsinline', 'true');
      
      const playPromise = brandSound.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✅ NebulaMedia brand sound playing');
            setSoundPlayed(true);
          })
          .catch(err => {
            console.log('⏸️ Brand sound autoplay prevented:', err);
          });
      }
    }
  };

  useEffect(() => {
    console.log('BrandScreen mounted, PUBLIC_URL:', process.env.PUBLIC_URL);
    
    // Try to play brand sound immediately
    playBrandSound();
    
    // Also set up click/touch listener for autoplay fallback
    const handleInteraction = () => {
      playBrandSound();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
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
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [onComplete]);

  const handleImageError = () => {
    console.error('Failed to load brand image');
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Brand image loaded successfully');
    // Play sound when image loads
    playBrandSound();
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

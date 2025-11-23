import React, { useEffect, useState } from 'react';
import './BrandScreen.css';

const BrandScreen = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
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

  return (
    <div className={`brand-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="brand-content">
        <img 
          src={`${process.env.PUBLIC_URL}/nebulamedia.png`} 
          alt="Nebula Media" 
          className="brand-logo"
        />
      </div>
    </div>
  );
};

export default BrandScreen;

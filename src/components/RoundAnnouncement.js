import React, { useState, useEffect, useRef } from 'react';
import './RoundAnnouncement.css';

const RoundAnnouncement = ({ roundNumber, show, onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState('entrance');
  const hasStartedRef = useRef(false);
  const lastRoundNumberRef = useRef(roundNumber);

  useEffect(() => {
    if (!show) {
      hasStartedRef.current = false;
      return;
    }

    // Reset if round number changes (new round starting)
    if (roundNumber !== lastRoundNumberRef.current) {
      hasStartedRef.current = false;
      lastRoundNumberRef.current = roundNumber;
    }

    // Prevent re-triggering if already started for this round
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    setAnimationPhase('entrance');
    
    // Entrance animation duration
    const entranceTimer = setTimeout(() => {
      setAnimationPhase('display');
    }, 800);

    // Display duration
    const displayTimer = setTimeout(() => {
      setAnimationPhase('exit');
    }, 2200);

    // Exit animation duration - call onComplete after exit
    const exitTimer = setTimeout(() => {
      console.log('Round announcement animation complete, calling onComplete');
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(entranceTimer);
      clearTimeout(displayTimer);
      clearTimeout(exitTimer);
    };
  }, [show, roundNumber]);

  if (!show) {
    return null;
  }

  return (
    <div className={`round-announcement ${animationPhase}`}>
      <div className="round-announcement-content">
        <div className="round-background-effect">
          <div className="round-circle-1"></div>
          <div className="round-circle-2"></div>
          <div className="round-circle-3"></div>
        </div>
        
        <div className="round-text-container">
          <div className="round-label">Round</div>
          <div className="round-number">{roundNumber}</div>
          <div className="round-subtitle">Battle Begins!</div>
        </div>

        <div className="round-decorative-elements">
          <div className="round-star star-1">⭐</div>
          <div className="round-star star-2">⭐</div>
          <div className="round-star star-3">⭐</div>
          <div className="round-star star-4">⭐</div>
          <div className="round-lightning">⚡</div>
          <div className="round-swords">⚔️</div>
        </div>
      </div>
    </div>
  );
};

export default RoundAnnouncement;
import React, { useEffect, useState, useRef } from 'react';
import './TurnTimer.css';

const TurnTimer = ({ 
  timeRemaining, 
  maxTime = 20, 
  isActive = true, 
  onTimeWarning,
  onTimeCritical,
  onTimeNormal 
}) => {
  const [warningTriggered, setWarningTriggered] = useState(false);
  const [criticalTriggered, setCriticalTriggered] = useState(false);
  const [normalTriggered, setNormalTriggered] = useState(true);
  const audioRef = useRef(null);
  const tickAudioRef = useRef(null);

  // Calculate percentage
  const percentage = (timeRemaining / maxTime) * 100;
  
  // Determine urgency level
  const getUrgencyLevel = () => {
    if (timeRemaining <= 5) return 'critical';
    if (timeRemaining <= 10) return 'warning';
    return 'normal';
  };

  const urgencyLevel = getUrgencyLevel();

  // Trigger warning callbacks and sounds
  useEffect(() => {
    if (!isActive) return;

    // Warning at 10 seconds
    if (timeRemaining <= 10 && timeRemaining > 5 && !warningTriggered) {
      setWarningTriggered(true);
      onTimeWarning?.();
      
      // Play warning sound
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 440;
        gain.gain.value = 0.1;
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch (e) {}
    }

    // Critical at 5 seconds
    if (timeRemaining <= 5 && !criticalTriggered) {
      setCriticalTriggered(true);
      onTimeCritical?.();
    }

    // Tick sound for last 5 seconds
    if (timeRemaining <= 5 && timeRemaining > 0) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.value = 0.15;
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } catch (e) {}
    }

    // Reset when time goes back up
    if (timeRemaining > 10) {
      setWarningTriggered(false);
      setCriticalTriggered(false);
      if (!normalTriggered) {
        setNormalTriggered(true);
        onTimeNormal?.();
      }
    }
    
    // Mark normal as no longer triggered when entering warning/critical
    if (timeRemaining <= 10 && normalTriggered) {
      setNormalTriggered(false);
    }
  }, [timeRemaining, isActive, warningTriggered, criticalTriggered, normalTriggered, onTimeWarning, onTimeCritical, onTimeNormal]);

  if (!isActive) return null;

  return (
    <div className={`turn-timer ${urgencyLevel}`}>
      {/* Burning rope container */}
      <div className="rope-container">
        {/* Rope background (burned) */}
        <div className="rope-burned"></div>
        
        {/* Rope remaining */}
        <div 
          className="rope-remaining" 
          style={{ width: `${percentage}%` }}
        >
          {/* Fire at the end of the rope */}
          <div className="rope-fire">
            <div className="flame flame-1">🔥</div>
            <div className="flame flame-2">🔥</div>
            <div className="flame flame-3">🔥</div>
          </div>
          
          {/* Sparks */}
          {urgencyLevel !== 'normal' && (
            <div className="rope-sparks">
              {[...Array(8)].map((_, i) => (
                <span 
                  key={i} 
                  className="spark"
                  style={{
                    '--delay': `${Math.random() * 0.5}s`,
                    '--x': `${(Math.random() - 0.5) * 30}px`,
                    '--y': `${-Math.random() * 40 - 10}px`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Time display */}
      <div className="timer-number">
        <span className="timer-value">{timeRemaining}</span>
        <span className="timer-label">sec</span>
      </div>

      {/* Urgency effects */}
      {urgencyLevel === 'critical' && (
        <>
          <div className="critical-pulse"></div>
          <div className="critical-text">HURRY!</div>
        </>
      )}

      {urgencyLevel === 'warning' && (
        <div className="warning-text">Time running out...</div>
      )}
    </div>
  );
};

export default TurnTimer;

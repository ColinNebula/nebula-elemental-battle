import React from 'react';
import './PauseMenu.css';

const PauseMenu = ({ onResume, onForfeit, onQuit }) => {
  return (
    <div className="pause-menu-overlay">
      <div className="pause-menu">
        <h2>Game Paused</h2>
        
        <div className="pause-menu-buttons">
          <button className="pause-btn resume-btn" onClick={onResume}>
            Resume Game
          </button>
          
          <button className="pause-btn forfeit-btn" onClick={onForfeit}>
            Forfeit Match
          </button>
          
          <button className="pause-btn quit-btn" onClick={onQuit}>
            Quit to Menu
          </button>
        </div>
        
        <div className="pause-menu-hint">
          Press ESC to resume
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;

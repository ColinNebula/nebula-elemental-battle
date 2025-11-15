import React from 'react';
import './Credits.css';

function Credits({ onClose }) {
  return (
    <div className="credits-overlay">
      <div className="credits-container">
        <div className="credits-content">
          <h1 className="credits-title">🎮 Thank You for Playing! 🎮</h1>
          
          <div className="credits-section">
            <h2>Created By</h2>
            <p className="credits-name">Colin Nebula</p>
            <p className="credits-company">for Nebula 3D Development</p>
          </div>

          <div className="credits-section">
            <p className="credits-message">
              We appreciate you and your contribution to keep us building better games in the future.
            </p>
          </div>

          <div className="credits-section support-section">
            <h2>💙 Support Local Development 💙</h2>
            <p>Your support helps us create amazing experiences!</p>
            <button className="donate-button">Donate</button>
          </div>

          <div className="credits-section">
            <p className="credits-footer">
              Thank you for being part of our journey!
            </p>
          </div>

          <button className="close-credits-button" onClick={onClose}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default Credits;

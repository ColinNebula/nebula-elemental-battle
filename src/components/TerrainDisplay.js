import React from 'react';
import './TerrainDisplay.css';

const TerrainDisplay = ({ terrain }) => {
  if (!terrain) return null;
  
  return (
    <div className="terrain-display" style={{ background: terrain.background }}>
      <div className="terrain-content">
        <div className="terrain-icon">{terrain.icon}</div>
        <div className="terrain-info">
          <div className="terrain-name">{terrain.name}</div>
          <div className="terrain-description">{terrain.description}</div>
        </div>
      </div>
      {terrain.bonusElement && (
        <div className="terrain-bonus">
          <span className="bonus-badge">
            {terrain.bonusElement} +{terrain.bonus}
          </span>
        </div>
      )}
    </div>
  );
};

export default TerrainDisplay;

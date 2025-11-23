import React, { useState } from 'react';
import { GAME_MODES, TERRAIN_TYPES } from '../utils/strategicSystems';
import './StrategicSettings.css';

const StrategicSettings = ({ onStart, onCancel }) => {
  const [settings, setSettings] = useState({
    manaEnabled: true,
    weatherEnabled: true,
    terrainEnabled: true,
    positioningEnabled: false, // Coming soon
    selectedTerrain: 'NEUTRAL'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTerrainSelect = (terrainKey) => {
    setSettings(prev => ({
      ...prev,
      selectedTerrain: terrainKey
    }));
  };

  const handleStart = () => {
    onStart({
      mode: GAME_MODES.STRATEGIC,
      ...settings
    });
  };

  const selectedTerrain = TERRAIN_TYPES[settings.selectedTerrain];

  return (
    <div className="strategic-settings-overlay">
      <div className="strategic-settings-container">
        <h1 className="strategic-title">⚔️ Strategic Mode Settings</h1>
        <p className="strategic-subtitle">
          Customize your gameplay with advanced tactical systems
        </p>

        <div className="settings-section">
          <h2 className="section-title">Game Systems</h2>
          
          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.manaEnabled}
                onChange={() => handleToggle('manaEnabled')}
                className="setting-checkbox"
              />
              <div className="setting-info">
                <div className="setting-name">
                  💎 Mana System
                </div>
                <div className="setting-description">
                  Cards cost mana to play. Regenerates each turn.
                </div>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.weatherEnabled}
                onChange={() => handleToggle('weatherEnabled')}
                className="setting-checkbox"
              />
              <div className="setting-info">
                <div className="setting-name">
                  🌦️ Weather Effects
                </div>
                <div className="setting-description">
                  Environmental conditions modify card strength each round.
                </div>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.terrainEnabled}
                onChange={() => handleToggle('terrainEnabled')}
                className="setting-checkbox"
              />
              <div className="setting-info">
                <div className="setting-name">
                  🏔️ Terrain Advantages
                </div>
                <div className="setting-description">
                  Arena bonuses for specific element types.
                </div>
              </div>
            </label>
          </div>

          <div className="setting-item disabled">
            <label className="setting-label">
              <input
                type="checkbox"
                checked={settings.positioningEnabled}
                onChange={() => handleToggle('positioningEnabled')}
                className="setting-checkbox"
                disabled
              />
              <div className="setting-info">
                <div className="setting-name">
                  🎯 Card Positioning
                  <span className="coming-soon-badge">Coming Soon</span>
                </div>
                <div className="setting-description">
                  Front/back row mechanics with tactical bonuses.
                </div>
              </div>
            </label>
          </div>
        </div>

        {settings.terrainEnabled && (
          <div className="settings-section">
            <h2 className="section-title">Select Terrain</h2>
            <div className="terrain-grid">
              {Object.entries(TERRAIN_TYPES).map(([key, terrain]) => (
                <div
                  key={key}
                  className={`terrain-option ${settings.selectedTerrain === key ? 'selected' : ''}`}
                  onClick={() => handleTerrainSelect(key)}
                  style={{ background: terrain.background }}
                >
                  <div className="terrain-option-icon">{terrain.icon}</div>
                  <div className="terrain-option-name">{terrain.name}</div>
                  {settings.selectedTerrain === key && (
                    <div className="terrain-selected-indicator">✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="strategic-actions">
          <button className="strategic-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="strategic-start-btn" onClick={handleStart}>
            <span className="btn-icon">🎮</span>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategicSettings;

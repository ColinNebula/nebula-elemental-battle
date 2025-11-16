import React from 'react';
import './Settings.css';

const Settings = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleToggle = (key) => {
    onSettingsChange({
      ...settings,
      [key]: !settings[key]
    });
  };

  const handleSelectChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="settings-content">
          <div className="setting-item">
            <label>
              <span className="setting-label">🔊 Sound Effects</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">🎵 Background Music</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.musicEnabled}
                  onChange={() => handleToggle('musicEnabled')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">✨ Animations</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.animationsEnabled}
                  onChange={() => handleToggle('animationsEnabled')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">⏱️ Turn Timer</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.timerEnabled}
                  onChange={() => handleToggle('timerEnabled')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">⌨️ Keyboard Shortcuts</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.keyboardEnabled}
                  onChange={() => handleToggle('keyboardEnabled')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="settings-divider"></div>
          <h3 className="settings-section-title">♿ Accessibility</h3>

          <div className="setting-item">
            <label>
              <span className="setting-label">🎨 Colorblind Mode</span>
              <select 
                className="setting-select"
                value={settings.colorblindMode || 'none'}
                onChange={(e) => handleSelectChange('colorblindMode', e.target.value)}
              >
                <option value="none">None</option>
                <option value="protanopia">Protanopia (Red-Blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                <option value="achromatopsia">Achromatopsia (Total)</option>
              </select>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">🔲 High Contrast</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.highContrast}
                  onChange={() => handleToggle('highContrast')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">🏷️ Show Element Icons</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showElementIcons !== false}
                  onChange={() => handleToggle('showElementIcons')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">📏 Text Size</span>
              <select 
                className="setting-select"
                value={settings.textSize || 'medium'}
                onChange={(e) => handleSelectChange('textSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <p className="settings-info">💡 Press ESC to close settings</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

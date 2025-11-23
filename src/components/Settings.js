import React, { useState, useEffect } from 'react';
import './Settings.css';
import soundManager from '../utils/sounds';

const Settings = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [soundVolume, setSoundVolume] = useState(50);
  const [musicVolume, setMusicVolume] = useState(30);
  const [currentTrack, setCurrentTrack] = useState('None');

  useEffect(() => {
    if (soundManager) {
      setSoundVolume(Math.round(soundManager.volume * 100));
      setMusicVolume(Math.round(soundManager.musicVolume * 100));
      if (isOpen) {
        const track = soundManager.getCurrentTrack();
        setCurrentTrack(track);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key]
    };
    
    // Handle music toggle
    if (key === 'musicEnabled' && soundManager) {
      soundManager.toggleMusic();
    }
    
    // Handle sound effects toggle
    if (key === 'soundEnabled' && soundManager) {
      soundManager.toggleSound();
    }
    
    onSettingsChange(newSettings);
  };

  const handleSelectChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleSoundVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    setSoundVolume(volume);
    if (soundManager) {
      soundManager.setVolume(volume / 100);
      soundManager.playSound('cardFlip'); // Preview sound
    }
  };

  const handleMusicVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    setMusicVolume(volume);
    if (soundManager) {
      soundManager.setMusicVolume(volume / 100);
    }
  };

  const handleChangeTrack = () => {
    if (soundManager) {
      soundManager.changeTrack();
      setTimeout(() => {
        setCurrentTrack(soundManager.getCurrentTrack());
      }, 100);
    }
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-container" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>⚙️ Settings</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
        
        <div className="settings-content">
          <div className="settings-divider"></div>
          <h3 className="settings-section-title">🎮 Game Settings</h3>

          <div className="setting-item">
            <label>
              <span className="setting-label">🎯 AI Difficulty</span>
              <select 
                className="setting-select"
                value={settings.difficulty || 'normal'}
                onChange={(e) => handleSelectChange('difficulty', e.target.value)}
              >
                <option value="easy">Easy - Casual Play</option>
                <option value="normal">Normal - Balanced</option>
                <option value="hard">Hard - Strategic</option>
                <option value="expert">Expert - Challenging</option>
              </select>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">⚡ Game Speed</span>
              <select 
                className="setting-select"
                value={settings.gameSpeed || 'normal'}
                onChange={(e) => handleSelectChange('gameSpeed', e.target.value)}
              >
                <option value="slow">Slow - More Time</option>
                <option value="normal">Normal - Standard</option>
                <option value="fast">Fast - Quick Matches</option>
              </select>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">🃏 Auto-Sort Hand</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoSortHand !== false}
                  onChange={() => handleToggle('autoSortHand')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="settings-divider"></div>
          <h3 className="settings-section-title">🔊 Audio Settings</h3>

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

          <div className="setting-item volume-setting">
            <label>
              <span className="setting-label">🎚️ Sound Volume</span>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={handleSoundVolumeChange}
                  className="volume-slider"
                  disabled={!settings.soundEnabled}
                />
                <span className="volume-value">{soundVolume}%</span>
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

          <div className="setting-item volume-setting">
            <label>
              <span className="setting-label">🎚️ Music Volume</span>
              <div className="volume-control">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={handleMusicVolumeChange}
                  className="volume-slider"
                  disabled={!settings.musicEnabled}
                />
                <span className="volume-value">{musicVolume}%</span>
              </div>
            </label>
          </div>

          <div className="setting-item music-track-setting">
            <div className="music-track-info">
              <span className="setting-label">🎼 Now Playing</span>
              <span className="current-track">{currentTrack}</span>
            </div>
            <button 
              className="change-track-button"
              onClick={handleChangeTrack}
              disabled={!settings.musicEnabled}
            >
              ⏭️ Next Track
            </button>
          </div>

          <div className="settings-divider"></div>
          <h3 className="settings-section-title">✨ Visual & Display</h3>

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
              <span className="setting-label">🎆 Particle Effects</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.particleEffects !== false}
                  onChange={() => handleToggle('particleEffects')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">💫 Screen Shake</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.screenShake !== false}
                  onChange={() => handleToggle('screenShake')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">📊 Show Statistics</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showStats !== false}
                  onChange={() => handleToggle('showStats')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">💬 Show Tooltips</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.showTooltips !== false}
                  onChange={() => handleToggle('showTooltips')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="settings-divider"></div>
          <h3 className="settings-section-title">⚙️ Gameplay Controls</h3>

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

          <div className="setting-item">
            <label>
              <span className="setting-label">⚠️ Confirm Actions</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.confirmActions}
                  onChange={() => handleToggle('confirmActions')}
                />
                <span className="toggle-slider"></span>
              </div>
            </label>
          </div>

          <div className="setting-item">
            <label>
              <span className="setting-label">🔄 Auto-End Turn</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.autoEndTurn}
                  onChange={() => handleToggle('autoEndTurn')}
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
          <button 
            className="reset-settings-button"
            onClick={() => {
              if (window.confirm('Reset all settings to default values?')) {
                onSettingsChange({
                  soundEnabled: true,
                  musicEnabled: true,
                  animationsEnabled: true,
                  timerEnabled: true,
                  keyboardEnabled: true,
                  colorblindMode: 'none',
                  highContrast: false,
                  showElementIcons: true,
                  textSize: 'medium',
                  difficulty: 'normal',
                  gameSpeed: 'normal',
                  autoSortHand: true,
                  particleEffects: true,
                  screenShake: true,
                  showStats: true,
                  showTooltips: true,
                  confirmActions: false,
                  autoEndTurn: false
                });
                if (soundManager) {
                  soundManager.setVolume(0.5);
                  soundManager.setMusicVolume(0.3);
                  setSoundVolume(50);
                  setMusicVolume(30);
                }
              }
            }}
          >
            🔄 Reset to Defaults
          </button>
          <p className="settings-info">💡 Press ESC to close settings</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

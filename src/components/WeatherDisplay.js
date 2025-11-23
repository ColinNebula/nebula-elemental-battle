import React from 'react';
import './WeatherDisplay.css';

const WeatherDisplay = ({ weather, roundsUntilChange }) => {
  if (!weather) return null;
  
  const getModifierText = () => {
    if (!weather.modifiers || Object.keys(weather.modifiers).length === 0) {
      return 'No effects';
    }
    
    return Object.entries(weather.modifiers)
      .map(([element, value]) => {
        const sign = value > 0 ? '+' : '';
        return `${element} ${sign}${value}`;
      })
      .join(', ');
  };
  
  return (
    <div className="weather-display">
      <div className="weather-header">
        <div className="weather-icon">{weather.icon}</div>
        <div className="weather-info">
          <div className="weather-name">{weather.name}</div>
          <div className="weather-description">{weather.description}</div>
        </div>
      </div>
      <div className="weather-footer">
        <div className="weather-change-indicator">
          Changes in {roundsUntilChange} {roundsUntilChange === 1 ? 'round' : 'rounds'}
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;

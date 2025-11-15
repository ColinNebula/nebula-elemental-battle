import React, { useState } from 'react';
import './Tutorial.css';

const Tutorial = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Welcome to Elemental Battle!",
      icon: "🎮",
      content: "A strategic card game where you battle using elemental powers. The player with the highest score when all cards are played wins!"
    },
    {
      title: "Game Setup",
      icon: "📋",
      content: "At the start, you'll receive 10 cards. Select your best 5 cards for battle. The remaining 5 go to your reserve deck."
    },
    {
      title: "Elements & Strength",
      icon: "⚡",
      content: "Each card has an element and strength value:\n🔥 Fire | ❄️ Ice | 💧 Water | ⚡ Electricity | 🌍 Earth | ⭐ Power\n\nHigher strength wins the round!"
    },
    {
      title: "Special Abilities",
      icon: "✨",
      content: "🌍 EARTH: Draw a card from your reserve deck\n⭐ POWER: Automatically plays another random POWER card from your hand\n\nMore abilities coming soon!"
    },
    {
      title: "Element Matching",
      icon: "🎯",
      content: "Play 2 cards of the same element in a row to activate DOUBLE STRENGTH! Your current card's strength is doubled for that round."
    },
    {
      title: "Keyboard Shortcuts",
      icon: "⌨️",
      content: "Press 1, 2, 3, 4, or 5 to quickly play cards from your hand.\n\nPress ESC to close menus.\n\nPress S to open Settings."
    },
    {
      title: "Winning Strategy",
      icon: "🏆",
      content: "• Save powerful cards for critical moments\n• Plan element combos for double strength\n• Use Earth ability to replenish your hand\n• Watch your opponent's patterns\n\nGood luck!"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    onClose();
  };

  return (
    <div className="tutorial-overlay" onClick={handleSkip}>
      <div className="tutorial-container" onClick={(e) => e.stopPropagation()}>
        <div className="tutorial-header">
          <h2>{steps[currentStep].icon} {steps[currentStep].title}</h2>
          <button className="tutorial-close" onClick={handleSkip}>✕</button>
        </div>

        <div className="tutorial-content">
          <div className="tutorial-step">
            <p>{steps[currentStep].content}</p>
          </div>

          <div className="tutorial-progress">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>

        <div className="tutorial-footer">
          <button
            className="tutorial-button secondary"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            ← Previous
          </button>

          <span className="tutorial-step-counter">
            {currentStep + 1} / {steps.length}
          </span>

          <button
            className="tutorial-button primary"
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 ? "Let's Play! 🎮" : "Next →"}
          </button>
        </div>

        <div className="tutorial-skip">
          <button className="skip-button" onClick={handleSkip}>
            Skip Tutorial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;

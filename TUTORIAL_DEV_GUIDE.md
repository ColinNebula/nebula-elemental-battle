# Tutorial Mode - Developer Guide

## Architecture Overview

The Tutorial Mode is built as a standalone orchestration component that wraps existing game components (CharacterSelection, CardSelection, GameBoard) and provides contextual overlays and step management.

## Component Structure

```
TutorialMode (Orchestrator)
├── Tutorial Overlay (Instruction Modal)
├── CharacterSelection (Wrapped)
├── CardSelection (Wrapped)
└── GameBoard (Wrapped with tutorial props)
```

## Key Design Patterns

### 1. Step-Based State Machine

```javascript
const [tutorialStep, setTutorialStep] = useState('welcome');

const tutorialSteps = {
  welcome: { title, message, actions },
  characterSelected: { title, message, actions },
  // ... more steps
};
```

**Benefits:**
- Easy to add/remove steps
- Clear progression logic
- Self-documenting code

### 2. Event-Driven Progression

```javascript
useEffect(() => {
  if (tutorialStep === 'firstCardPlay' && cardsPlayed === 1) {
    setTimeout(() => {
      setTutorialStep('cardStrength');
      setShowOverlay(true);
    }, 2000);
  }
}, [gameState, tutorialStep, cardsPlayed]);
```

**Benefits:**
- Responds to actual game events
- No manual advancement needed
- Natural progression

### 3. Component Reuse

The tutorial doesn't duplicate game logic—it uses the same components as regular gameplay:
- `CharacterSelection`: Unchanged
- `CardSelection`: Same card selection logic
- `GameBoard`: Receives `isTutorial` flag for minor adjustments

## Adding New Tutorial Steps

### Step 1: Define the Step

```javascript
const tutorialSteps = {
  // ... existing steps
  
  newFeature: {
    title: "🌟 New Feature Title",
    message: "Detailed explanation of the feature...",
    actions: ['continue'] // or ['play-card', 'select-option', etc.]
  }
};
```

### Step 2: Add Progression Logic

```javascript
useEffect(() => {
  // ... existing progression logic
  
  if (tutorialStep === 'previousStep' && someCondition) {
    setTimeout(() => {
      setTutorialStep('newFeature');
      setShowOverlay(true);
    }, delayMs);
  }
}, [gameState, tutorialStep, someTrackedValue]);
```

### Step 3: Update Progress Dots

Progress dots automatically render based on `Object.keys(tutorialSteps)`, so no manual update needed!

## Customization Points

### Changing AI Difficulty

```javascript
// In handleCharacterSelect()
const result = await gameClient.createRoom('EMBER'); // Options: EMBER (Easy), FROST/AQUA (Medium), VOLT/TERRA (Hard), LUMINA/SHADOW (Expert), NEXUS/CHAOS (Master)
```

### Adjusting Step Delays

```javascript
setTimeout(() => {
  setTutorialStep('nextStep');
  setShowOverlay(true);
}, 2000); // Change delay here (milliseconds)
```

### Modifying Overlay Appearance

Edit `TutorialMode.css`:
```css
.tutorial-modal {
  border: 3px solid #4caf50; /* Change color */
  max-width: 700px; /* Change size */
  padding: 40px; /* Adjust padding */
}
```

## Advanced Features

### Highlighting Specific UI Elements

To add visual highlights to game elements during tutorial:

```javascript
// In TutorialMode.js
const [highlightedElement, setHighlightedElement] = useState(null);

// When showing specific step
setHighlightedElement('.player-hand-card');

// Add to render
{highlightedElement && (
  <div className="tutorial-pointer" style={{
    top: calculatePosition(),
    left: calculatePosition()
  }}>
    👆
  </div>
)}
```

Then add CSS:
```css
.tutorial-highlight {
  animation: tutorialPulse 2s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
  z-index: 9999;
}
```

### Conditional Step Branching

For different paths based on player actions:

```javascript
const [tutorialPath, setTutorialPath] = useState('standard');

useEffect(() => {
  if (tutorialStep === 'decision' && userChoice === 'advanced') {
    setTutorialPath('advanced');
    setTutorialStep('advancedPath1');
  } else if (tutorialStep === 'decision' && userChoice === 'basic') {
    setTutorialPath('basic');
    setTutorialStep('basicPath1');
  }
}, [tutorialStep, userChoice]);
```

### Saving Tutorial Progress

To allow resuming mid-tutorial:

```javascript
// Save on each step change
useEffect(() => {
  localStorage.setItem('tutorialProgress', JSON.stringify({
    step: tutorialStep,
    cardsPlayed,
    roomId
  }));
}, [tutorialStep, cardsPlayed, roomId]);

// Load on mount
useEffect(() => {
  const saved = localStorage.getItem('tutorialProgress');
  if (saved) {
    const { step, cardsPlayed: savedCardsPlayed } = JSON.parse(saved);
    // Restore state
  }
}, []);
```

## Integration with Game Systems

### Power-Up System

The tutorial introduces power-ups but doesn't fully enable them. To add power-up practice:

```javascript
// In tutorialSteps
powerUpPractice: {
  title: "⚡ Try Your Ultimate!",
  message: "Click the Ultimate Ability in the right sidebar to activate it!",
  actions: ['use-ultimate']
}

// In progression logic
if (tutorialStep === 'powerUpPractice' && ultimateUsed) {
  setTutorialStep('nextStep');
}
```

### Strategic Systems (Weather, Terrain)

To introduce advanced mechanics:

```javascript
weatherIntro: {
  title: "🌩️ Weather Effects",
  message: "Weather affects element strength! Fire is stronger in sunny weather, Water in rainy weather.",
  actions: ['continue']
}
```

## Testing Tutorial Changes

### Manual Testing Checklist

```javascript
// Reset tutorial completion
localStorage.removeItem('tutorialCompleted');

// Test each step
tutorialSteps.forEach(step => {
  // 1. Verify overlay appears
  // 2. Check message clarity
  // 3. Test progression trigger
  // 4. Verify UI state
});

// Test edge cases
- Skip button at each step
- Losing the tutorial battle
- Winning the tutorial battle
- Closing and reopening
```

### Automated Testing (Future)

```javascript
describe('TutorialMode', () => {
  it('should progress through all steps', async () => {
    const { getByText, getByRole } = render(<TutorialMode />);
    
    // Verify welcome screen
    expect(getByText(/Welcome to Tutorial/)).toBeInTheDocument();
    
    // Click continue
    fireEvent.click(getByRole('button', { name: /Let's Begin/}));
    
    // ... test each step
  });
});
```

## Performance Optimization

### Preventing Unnecessary Re-renders

```javascript
// Memoize expensive computations
const tutorialStepData = useMemo(() => 
  tutorialSteps[tutorialStep], 
  [tutorialStep]
);

// Callback memoization
const handleOverlayContinue = useCallback(() => {
  setShowOverlay(false);
  // ...
}, [tutorialStep]);
```

### Lazy Loading Tutorial Assets

```javascript
const TutorialMode = lazy(() => import('./components/TutorialMode'));

// In App.js
<Suspense fallback={<LoadingScreen />}>
  {showTutorialMode && <TutorialMode {...props} />}
</Suspense>
```

## Localization Support

To add multi-language support:

```javascript
// Create translation files
const translations = {
  en: {
    welcome_title: "Welcome to Tutorial Mode!",
    welcome_message: "I'll guide you through...",
  },
  es: {
    welcome_title: "¡Bienvenido al Modo Tutorial!",
    welcome_message: "Te guiaré a través de...",
  }
};

// Use in component
const t = translations[language];
const step = {
  title: t.welcome_title,
  message: t.welcome_message
};
```

## Common Pitfalls & Solutions

### Issue: Tutorial doesn't progress
**Cause:** Condition in useEffect never triggers
**Solution:** Add console.logs to debug conditions

```javascript
useEffect(() => {
  console.log('Tutorial Check:', { tutorialStep, cardsPlayed, currentPlayer });
  // ... progression logic
}, [gameState, tutorialStep, cardsPlayed]);
```

### Issue: Overlay gets stuck
**Cause:** showOverlay not being set to false
**Solution:** Ensure all paths set overlay state

```javascript
const handleOverlayContinue = () => {
  setShowOverlay(false); // Always do this first
  
  if (tutorialStep === 'victory' || tutorialStep === 'defeat') {
    localStorage.setItem('tutorialCompleted', 'true');
    onComplete();
  }
};
```

### Issue: Game state not updating
**Cause:** Not polling game state
**Solution:** Ensure pollGameState is called

```javascript
useEffect(() => {
  if (roomId && gameState?.gameStarted) {
    pollGameState(roomId);
  }
}, [roomId, gameState?.gameStarted]);
```

## Future Enhancement Ideas

### 1. Interactive Tooltips
Add persistent hints that appear on hover:

```javascript
<div className="tutorial-tooltip" data-step="mana-system">
  <span className="tooltip-icon">?</span>
  <div className="tooltip-content">
    Mana regenerates each turn!
  </div>
</div>
```

### 2. Achievement System
Track tutorial milestones:

```javascript
const achievements = {
  firstCard: { earned: false, icon: '🎴' },
  firstCombo: { earned: false, icon: '🔥' },
  firstVictory: { earned: false, icon: '🏆' }
};
```

### 3. Video Demonstrations
Embed short clips for complex mechanics:

```javascript
<video 
  src="/tutorials/fusion-demo.mp4" 
  autoplay 
  loop 
  className="tutorial-video"
/>
```

### 4. Practice Battles
Add optional practice rounds after tutorial:

```javascript
practiceMode: {
  title: "⚔️ Practice Battle",
  message: "Want to practice what you learned? Fight another easy opponent!",
  actions: ['practice', 'skip']
}
```

### 5. Difficulty Selection
Let players choose tutorial difficulty:

```javascript
difficultySelect: {
  title: "Choose Your Challenge",
  message: "Select tutorial difficulty:",
  actions: ['easy', 'normal', 'challenging']
}
```

## Code Quality Standards

### Naming Conventions
- Steps: lowercase with underscores (`first_card_play`)
- Functions: camelCase (`handleOverlayContinue`)
- Components: PascalCase (`TutorialMode`)
- Constants: UPPER_SNAKE_CASE (`TUTORIAL_STEPS`)

### Comment Style
```javascript
/**
 * Handles progression to next tutorial step
 * @param {string} nextStep - The step identifier to transition to
 * @param {number} delay - Delay in ms before transition (default: 2000)
 */
const progressToStep = (nextStep, delay = 2000) => {
  // Implementation
};
```

### Error Handling
```javascript
try {
  const result = await gameClient.createRoom('EMBER');
  if (!result || !result.roomId) {
    throw new Error('Failed to create tutorial room');
  }
  // Continue...
} catch (error) {
  console.error('Tutorial room creation failed:', error);
  // Fallback or retry logic
}
```

## Deployment Checklist

Before deploying tutorial changes:

- [ ] All steps tested manually
- [ ] Skip button works from all steps
- [ ] Completion saves correctly
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessible (keyboard navigation)
- [ ] Performance profiled (no lag)
- [ ] Translations updated (if applicable)
- [ ] Documentation updated
- [ ] Git commit with clear message

## Resources

### Related Files
- `src/components/TutorialMode.js` - Main component
- `src/components/TutorialMode.css` - Styling
- `src/App.js` - Integration point
- `src/components/MainMenu.js` - Entry point

### Useful Commands
```bash
# Run dev server
npm start

# Check for errors
npm run build

# Format code
npm run format

# Run tests
npm test
```

### External References
- [React Hooks Documentation](https://react.dev/reference/react)
- [CSS Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Accessibility Best Practices](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Happy Tutorial Development!** 🎓✨

# React Performance Optimizations

## Overview
This document outlines the React-specific performance optimizations implemented to improve mobile performance and reduce unnecessary re-renders.

## Optimizations Implemented

### 1. Card Component Memoization
**File:** `src/components/Card.js`

**Changes:**
- Wrapped the Card component with `React.memo()` to prevent re-renders when props haven't changed
- Added custom comparison function to check only critical props:
  - `card.id`
  - `card.strength`
  - `card.modifiedStrength`
  - `isPlayable`
  - `canAfford`
  - `canOverdraft`
  - `manaCost`

**Impact:**
- Cards only re-render when their actual state changes
- Significant performance improvement since 10-20 cards are rendered simultaneously
- Reduces CPU usage during gameplay

### 2. GameBoard Component Optimizations
**File:** `src/components/GameBoard.js`

#### a. Player Lookups Memoized
```javascript
const currentPlayer = useMemo(() => 
  gameState?.players?.find(p => p.id === currentPlayerId),
  [gameState?.players, currentPlayerId]
);

const humanPlayer = useMemo(() => 
  gameState?.players?.find(p => !p.isAI),
  [gameState?.players]
);

const aiPlayer = useMemo(() => 
  gameState?.players?.find(p => p.isAI),
  [gameState?.players]
);
```
- Prevents re-finding players on every render
- Only recalculates when players array or currentPlayerId changes

#### b. Total Strength Calculations
```javascript
const calculateTotalStrength = useCallback((player) => {
  // ... calculation logic
}, [strategicSettings.weatherEnabled, strategicSettings.terrainEnabled, 
    weatherState?.current, terrainState?.current]);

const humanTotalStrength = useMemo(() => 
  calculateTotalStrength(humanPlayer), 
  [humanPlayer?.playedCards, calculateTotalStrength]
);

const aiTotalStrength = useMemo(() => 
  calculateTotalStrength(aiPlayer), 
  [aiPlayer?.playedCards, calculateTotalStrength]
);
```
- Wrapped calculation function in `useCallback`
- Memoized results with `useMemo`
- Only recalculates when played cards or strategic settings change

#### c. Event Handlers Memoized
```javascript
const handleCardClick = useCallback((cardIndex) => {
  // ... click logic
}, [isMyTurn, gameState?.gameOver, gameState?.pendingAbility, isPaused, 
    showInitialArena, showRoundAnnouncement, showTrapUI, selectedTrapCard, 
    onPlayCard, currentPlayer, strategicSettings?.manaEnabled, manaState]);

const handleReviveCard = useCallback(async (cardIndex) => {
  // ... revive logic
}, [isMyTurn, humanPlayer, onReviveFromGraveyard]);
```
- Prevents recreation of handler functions on every render
- Maintains referential equality for child component props
- Reduces unnecessary Card component re-renders

#### d. Hand Sorting Optimized
```javascript
const getSortedHand = useCallback((hand) => {
  // ... sorting logic
}, [sortBy]);

const sortedHumanHand = useMemo(() => 
  humanPlayer?.hand ? getSortedHand(humanPlayer.hand) : [],
  [humanPlayer?.hand, getSortedHand]
);
```
- Sort function wrapped in `useCallback`
- Sorted result cached with `useMemo`
- Only re-sorts when hand changes or sort criteria changes
- Eliminates expensive array operations on every render

## Combined Mobile Optimizations

These React optimizations work together with existing mobile optimizations:

### Existing Mobile Optimizations (from previous work):
1. **Particle System** - Reduced particle count on mobile (8 vs 20)
2. **GPU Acceleration** - CSS transforms for hardware acceleration
3. **Performance Mode** - Auto-enabled on mobile with reduced animations
4. **Animation Duration** - Shorter animations on mobile (1500ms vs 2500ms)

### React Optimizations (this update):
1. **Memoization** - Prevents unnecessary re-renders
2. **useCallback** - Stable function references
3. **useMemo** - Cached expensive calculations
4. **Custom Comparison** - Fine-grained control over re-renders

## Performance Impact

### Before Optimizations:
- Card components re-rendered on every parent update
- Expensive calculations ran on every render
- Event handlers recreated on every render
- Array operations (sorting, filtering) ran unnecessarily

### After Optimizations:
- Cards only re-render when props actually change
- Calculations cached and reused
- Event handlers maintain stable references
- Sorting only happens when hand or sort criteria changes

### Expected Improvements:
- **Reduced Re-renders:** 70-80% reduction in Card component re-renders
- **Lower CPU Usage:** Fewer calculations per render cycle
- **Smoother Gameplay:** Especially on mobile devices
- **Better Battery Life:** Reduced CPU usage on mobile

## Testing Recommendations

1. **Mobile Devices:**
   - Test on actual mobile hardware
   - Monitor FPS during gameplay
   - Check for smooth card animations
   - Verify no lag during intensive moments (combos, special effects)

2. **React DevTools:**
   - Use React Profiler to measure render times
   - Check "Highlight updates" to see re-render frequency
   - Compare before/after performance metrics

3. **Chrome DevTools:**
   - Use Performance tab to record gameplay
   - Check CPU usage and frame rate
   - Monitor memory consumption

## Future Optimization Opportunities

1. **Code Splitting:**
   - Lazy load heavy components (StoryMode, Tutorial)
   - Split audio files into chunks
   - Dynamic imports for advanced features

2. **Virtual Scrolling:**
   - If deck/graveyard lists become large
   - Implement windowing for long lists

3. **State Management:**
   - Consider React Context optimization
   - Evaluate state update batching
   - Review unnecessary state updates

4. **Bundle Size:**
   - Analyze bundle size with webpack-bundle-analyzer
   - Tree-shake unused code
   - Compress audio assets further

## Best Practices Applied

✅ **Memoization** - Used for expensive calculations
✅ **useCallback** - Applied to event handlers passed to children
✅ **useMemo** - Applied to derived state and computations
✅ **React.memo** - Wrapped frequently rendered components
✅ **Custom Comparison** - Fine-tuned memo behavior
✅ **Dependency Arrays** - Carefully managed to prevent stale closures

## Maintenance Notes

- When adding new props to Card component, update the custom comparison function
- When adding new event handlers in GameBoard, wrap them in useCallback
- Monitor bundle size as optimizations are added
- Profile performance regularly on target devices

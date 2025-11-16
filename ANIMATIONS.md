# Animation System

## Overview
The game features a comprehensive animation system that provides visual feedback and enhances the player experience through dynamic effects, transitions, and environmental atmosphere.

## Animation Types

### 1. Card Draw Animations
**Location**: `src/utils/animations.js` - `createCardDrawAnimation()`

Animates cards as they're drawn from the deck into the player's hand.

**Features**:
- Smooth slide and scale animation from deck position
- Rotation effect during transition
- Fade-in for smooth appearance
- 0.5s duration with elastic easing

**CSS Class**: `.card-draw-animation`

**Usage**:
```javascript
createCardDrawAnimation(cardElement);
```

### 2. Victory Pose
**Location**: `src/utils/animations.js` - `createVictoryPose()`

Celebrates winning cards with dramatic visual effects.

**Features**:
- Golden glow pulsing effect
- Sparkle particles orbiting the card
- 6 sparkles appearing in circular pattern
- Continuous glow animation (1s cycle)
- Sparkles animate for 1s each

**CSS Classes**: 
- `.victory-pose` (applied to card)
- `.victory-sparkle` (sparkle particles)

**Trigger**: Automatically applied to the winning card after both players play in a round

**Usage**:
```javascript
createVictoryPose(cardElement);
```

### 3. Environmental Effects
**Location**: `src/utils/animations.js` - `createEnvironmentalEffect()`

Adds atmospheric weather and environmental effects to the battle arena.

**Available Effects**:

#### Rain
- Thin vertical droplets falling
- Semi-transparent blue gradient
- Random positioning and timing
- 2-4 second fall duration

#### Snow
- Circular snowflakes
- Gentle sideways drift while falling
- White gradient with soft edges
- 3-6 second fall duration

#### Leaves
- Leaf-shaped particles
- Rotating as they fall
- Green gradient coloring
- 4-8 second fall duration

#### Embers
- Small glowing particles
- Float upward (opposite of rain/snow)
- Orange-red glow with shadow
- 3-6 second float duration

#### Lightning
- Full-screen flash effect
- Multiple quick flashes in sequence
- Semi-transparent yellow-white overlay
- 0.5s total duration

**CSS Classes**:
- `.rain-drop`
- `.snow-flake`
- `.falling-leaf`
- `.floating-ember`
- `.lightning-flash`

**Trigger**: Changes with each round, matched to arena theme

**Usage**:
```javascript
// Add effect
createEnvironmentalEffect('rain', containerElement);
createEnvironmentalEffect('snow', containerElement);
createEnvironmentalEffect('leaves', containerElement);
createEnvironmentalEffect('embers', containerElement);
createEnvironmentalEffect('lightning', containerElement, 3); // Lightning flashes 3 times

// Remove effect
removeEnvironmentalEffect(containerElement);
```

**Arena Theme Matching**:
- Ice/Frost arenas → Snow
- Fire/Flame arenas → Embers
- Forest/Nature arenas → Leaves
- Water/Ocean arenas → Rain
- Other arenas → Random effect

### 4. Phase Transitions
**Location**: `src/utils/animations.js` - `createPhaseTransition()`

Displays messages during important game phase changes.

**Features**:
- Large centered text overlay
- Scale and fade in animation
- Pink glow effect
- Automatically removes after 2 seconds
- Non-blocking (pointer-events: none)

**CSS Classes**:
- `.phase-transition`
- `.entering` (during fade-in)
- `.leaving` (during fade-out)

**Triggers**:
- "Battle Begin!" at game start
- "Round X" at each round start

**Usage**:
```javascript
createPhaseTransition('Round 3', containerElement);
createPhaseTransition('Battle Begin!', containerElement);
```

### 5. Shuffle Animation
**Location**: `src/utils/animations.js` - `createShuffleAnimation()`

Animates deck shuffling with a swaying card motion.

**Features**:
- Left-right swaying motion
- Slight vertical bounce
- Rotation during sway
- 0.6s duration
- Easing for natural movement

**CSS Class**: `.shuffle-animation`

**Trigger**: Automatically plays on all decks when game starts

**Usage**:
```javascript
createShuffleAnimation(deckElement);
```

### 6. Card Flip Animation
**Location**: `src/utils/animations.js` - `createCardFlipAnimation()`

3D flip effect when cards are played.

**Features**:
- 180° Y-axis rotation
- 3D perspective maintained
- 0.6s duration
- Smooth ease-in-out timing

**CSS Class**: `.card-flipping`

**Trigger**: Automatically applies when cards are played to the arena

**Usage**:
```javascript
createCardFlipAnimation(cardElement);
```

### 7. Combo Multiplier Display
**Location**: `src/utils/animations.js` - `createComboMultiplierAnimation()`

Shows floating text for combo bonuses and multipliers.

**Features**:
- Scales up from small to large
- Floats upward while visible
- Fades out smoothly
- Golden color with glow effect
- 1s duration

**CSS Class**: `.combo-multiplier`

**Trigger**: Shows "MATCH!" text when element match bonus occurs on winning card

**Usage**:
```javascript
const x = 100; // horizontal position
const y = 200; // vertical position
createComboMultiplierAnimation('MATCH!', x, y, containerElement);
createComboMultiplierAnimation('x3 COMBO', x, y, containerElement);
```

## Integration Points

### GameBoard Component
The animations are integrated into `GameBoard.js` at the following points:

1. **Game Start** (line ~285):
   - Shuffle animation on all decks
   - "Battle Begin!" phase transition
   
2. **Card Play** (line ~118):
   - Card flip animation on newly played cards
   - Existing particle and sound effects maintained

3. **Round Start** (line ~310):
   - Phase transition message ("Round X")
   - Environmental effect (matched to arena theme)
   - Previous environmental effect cleanup

4. **Round Winner** (line ~505):
   - Victory pose on winning card
   - Combo multiplier text for match bonus

5. **Game End** (line ~316):
   - Environmental effect cleanup

## Performance Considerations

### Particle Limits
- Rain: 50 particles
- Snow: 30 particles
- Leaves: 20 particles
- Embers: 25 particles
- Lightning: Single overlay flash

### Cleanup
All environmental effects are properly cleaned up:
- When new effect starts (replaces old)
- When round changes
- When game ends
- Elements automatically removed after animation completes

### Animation Duration
- Short animations (< 1s): Card flip, sparkles, combo text
- Medium animations (1-2s): Victory pose, phase transitions
- Continuous: Environmental effects (particles respawn continuously)

## Customization

### Adding New Environmental Effects
To add a new environmental effect:

1. Add CSS animation in `GameBoard.css`:
```css
@keyframes myNewEffect {
  0% { /* start state */ }
  100% { /* end state */ }
}

.my-new-effect {
  /* styling */
  animation: myNewEffect 3s linear forwards;
  pointer-events: none;
}
```

2. Add case in `createEnvironmentalEffect()`:
```javascript
case 'myeffect':
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'my-new-effect';
    // positioning and timing...
    container.appendChild(particle);
  }
  break;
```

### Modifying Animation Timing
Animation durations can be adjusted in the CSS:
- Change `animation` duration values
- Modify `setTimeout` delays in JavaScript
- Adjust `animationDelay` for staggered effects

## Browser Compatibility

All animations use standard CSS animations and transforms:
- `@keyframes` - All modern browsers
- `transform` (translate, rotate, scale) - All modern browsers
- `opacity` - All modern browsers
- `box-shadow` - All modern browsers
- `clip-path` (for leaf shape) - Modern browsers (fallback to square)

## Accessibility

Animations respect user preferences:
- Can be disabled via CSS: `@media (prefers-reduced-motion)`
- Phase transitions are non-blocking
- Environmental effects don't interfere with gameplay
- Victory poses enhance but don't obscure card information

## Future Enhancements

Potential additions:
- Chain combo animations (2x, 3x, 4x multipliers)
- Element-specific victory poses
- Arena-entering animation for characters
- Card hover preview animations
- Deck glow when able to draw
- Status effect application animations (already exist separately)

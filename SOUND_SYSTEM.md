# Sound System Enhancement

## Overview
The game now features a comprehensive audio system with unique sound effects per element, character voice lines, dynamic music intensity, crowd reactions, and combo sound chains.

## Features Implemented

### 1. Unique Element Sound Effects
Each of the 11 elements has a distinct sound signature created using Web Audio API:

- **FIRE**: Descending sawtooth wave (200Hz → 100Hz) - crackling flames
- **ICE**: High sine wave (1200Hz → 600Hz) - crystalline freezing
- **WATER**: Oscillating sine wave (400Hz ↔ 350Hz) - flowing water
- **ELECTRICITY**: Filtered white noise (2000Hz bandpass) - electric zap
- **EARTH**: Low triangle wave (80Hz → 40Hz) - rumbling impact
- **POWER**: Ascending square wave (150Hz → 300Hz) - energy surge
- **LIGHT**: Rising sine wave (800Hz → 1600Hz) - radiant beam
- **DARK**: Descending sawtooth (100Hz → 50Hz) - ominous void
- **NEUTRAL**: Steady sine wave (440Hz) - balanced tone
- **TECHNOLOGY**: Beeping square wave (1000-1200Hz) - digital sound
- **METEOR**: Dual oscillators falling (500→50Hz + 250→25Hz) - devastating impact

### 2. Character Voice Lines
Four distinct avatar personalities with unique voice pitches and dialogue:

#### Warrior (Pitch: 0.8 - Deep voice)
- **Card Play**: "For honor!", "Strike true!", "Witness my strength!", "Victory awaits!"
- **Victory**: "The battle is won!", "Glory is mine!", "I stand victorious!"
- **Defeat**: "I shall return...", "Not today...", "This is not the end..."
- **Combo**: "Behold my power!", "A masterful strike!", "Unstoppable!"
- **Counter**: "You dare challenge me?!", "Not so fast!", "I counter your move!"

#### Mage (Pitch: 1.1 - Mystical voice)
- **Card Play**: "By arcane force!", "Magic flows through me!", "Witness this!", "The elements obey!"
- **Victory**: "My magic prevails!", "The spell is complete!", "Knowledge conquers all!"
- **Defeat**: "The stars were not aligned...", "Magic fades...", "I must study further..."
- **Combo**: "Arcane mastery!", "The perfect incantation!", "Spellcraft perfected!"
- **Counter**: "Your magic is weak!", "I dispel your power!", "Not this time!"

#### Rogue (Pitch: 1.2 - Quick, agile voice)
- **Card Play**: "Here we go!", "Watch this!", "Quick and deadly!", "Time to strike!"
- **Victory**: "Too easy!", "Never saw it coming!", "Victory is mine!"
- **Defeat**: "I'll get you next time...", "Just a setback...", "This isn't over..."
- **Combo**: "Multi-strike!", "Chain attack!", "Like a shadow!"
- **Counter**: "Gotcha!", "Nice try!", "Intercepted!"

#### Sage (Pitch: 0.9 - Calm, wise voice)
- **Card Play**: "Wisdom guides me.", "As foretold.", "Balance in all things.", "The path is clear."
- **Victory**: "Peace returns.", "As it should be.", "Harmony restored."
- **Defeat**: "The cycle continues...", "Another lesson learned...", "I accept this outcome..."
- **Combo**: "Synergy achieved.", "Perfect balance.", "Harmony in motion."
- **Counter**: "I foresaw this.", "Already anticipated.", "Expected."

### 3. Dynamic Music Intensity
Music automatically adapts to match the tension of the game:

#### Intensity Levels
- **Calm**: Normal music volume (30% of max)
- **Moderate**: Increased volume (33% of max) - activated when:
  - Score difference ≤ 2 points
  - Round progress > 70%
- **Intense**: Maximum volume (39% of max) - activated when:
  - Score difference ≤ 1 point AND round progress > 50%
  - Creates close match excitement

#### Track Selection
- **Intense mode** prioritizes battle tracks:
  - Battle_of_the_Pixelated_Cyborgs.mp3
  - Boss_Battle_Loop_1.mp3
  - When_You_Risk_it_All.mp3
- **Calm/Moderate mode** uses any available track

#### Real-time Updates
- Music volume smoothly transitions over 1 second
- Updates automatically each round based on game state
- Crowd cheers when intensity increases to "intense"

### 4. Crowd Reactions
Simulated crowd sounds using filtered white noise:

#### Cheer Sound
- Duration: 1.5 seconds
- Filtered noise (800Hz bandpass, Q=2)
- Smooth fade in/out
- Triggered on:
  - Player victory
  - Music intensity increases to "intense"
  - 3+ card combos

#### Gasp Sound
- Duration: 0.4 seconds
- High-pass filtered noise (1000Hz+)
- Quick burst effect
- Triggered on:
  - Counter card activation
  - Unexpected plays

### 5. Combo Sound Chains
Escalating musical notes for card combinations:

- **Combo detection**: Tracks combos from last 5 seconds
- **Sound generation**: Ascending sine waves
  - Base frequency: 400Hz
  - Each combo note: 1.2× previous frequency
  - Up to 5 notes maximum
- **Visual feedback**: Combo indicator with bonus display
- **Voice line**: Character exclaims combo achievement
- **Crowd reaction**: Cheer sound for 3+ combos

## Technical Implementation

### Sound Manager Class
Location: `src/utils/sounds.js`

#### Key Methods
```javascript
// Element sounds
playElementSound(element)

// Voice lines
playVoiceLine(avatarType, action)
getVoicePitch(avatarType)

// Combo chains
playComboChain(comboCount)

// Crowd reactions
playCrowdReaction(reactionType) // 'cheer' or 'gasp'

// Dynamic music
updateMusicIntensity(playerScore, opponentScore, round, maxRounds)
smoothVolumeTransition(targetVolume, duration)
getMusicVolumeForIntensity(intensity)
```

### GameBoard Integration
Location: `src/components/GameBoard.js`

#### Sound Triggers
1. **Card Play** (line ~316):
   - Element sound
   - Card flip sound
   - Voice line (player cards only)

2. **Combo Detection** (line ~1223):
   - Combo chain sound
   - Voice line
   - Crowd cheer (3+ combos)

3. **Counter Activation** (line ~1255):
   - Voice line
   - Crowd gasp

4. **Victory/Defeat** (line ~454):
   - Victory/defeat sound
   - Voice line
   - Crowd cheer (victory)

5. **Music Intensity** (line ~355):
   - Automatic updates each round
   - Based on score difference and progress

### Avatar Personality State
```javascript
const [avatarPersonality, setAvatarPersonality] = useState('warrior');
```
Currently defaults to 'warrior', can be expanded to allow player selection.

## Browser Compatibility

### Web Audio API
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ⚠️ Older browsers: Graceful degradation

### Speech Synthesis
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Limited voice options
- ⚠️ No support: Falls back silently

## Performance Considerations

- **Web Audio API**: Lightweight oscillator-based sounds (no audio files)
- **Speech Synthesis**: Native browser API (no additional resources)
- **Background Music**: Single MP3 stream
- **Memory**: Minimal footprint, sounds generated on-demand
- **CPU**: Efficient synthesis, automatic cleanup

## User Controls

All sounds respect existing settings:
- `soundManager.enabled`: Master sound toggle
- `soundManager.musicEnabled`: Music toggle
- `soundManager.volume`: Sound effects volume (0-1)
- `soundManager.musicVolume`: Music volume (0-1)

## Future Enhancements

### Potential Additions
1. **Avatar Selection**: UI to choose personality type
2. **Custom Voice Lines**: Player-recorded audio
3. **Spatial Audio**: 3D positioning for multiplayer
4. **Sound Themes**: Alternative sound packs
5. **Ambient Sounds**: Environmental audio layers
6. **Achievement Sounds**: Special fanfares
7. **Card Rarity Sounds**: Different tones per rarity tier
8. **Fusion/Evolution Sounds**: Transformation effects

### Accessibility Options
- Visual indicators for all sounds
- Subtitle system for voice lines
- Sound effect legends
- Individual volume controls per category

## Testing

### Sound Verification
1. Play cards of each element → Hear unique sounds
2. Trigger 3+ card combo → Hear ascending notes + crowd cheer + voice line
3. Activate counter card → Hear voice line + crowd gasp
4. Win/lose game → Hear appropriate sounds + voice line
5. Play close match → Music intensifies automatically

### Edge Cases
- No sound when volume = 0 ✅
- No crashes when Audio API unavailable ✅
- Graceful fallback when Speech Synthesis unavailable ✅
- Sound overlap handling (multiple simultaneous sounds) ✅

## Code Example

```javascript
// Play element sound
soundManager.playElementSound('FIRE');

// Play voice line
soundManager.playVoiceLine('mage', 'victory');

// Play combo chain (3 combos)
soundManager.playComboChain(3);

// Play crowd reaction
soundManager.playCrowdReaction('cheer');

// Update music intensity
soundManager.updateMusicIntensity(5, 4, 6, 7);
// playerScore: 5, opponentScore: 4, round: 6, maxRounds: 7
// Result: Intense music (close match, late game)
```

## Audio Design Philosophy

1. **Clarity**: Each sound has distinct characteristics
2. **Feedback**: Immediate audio response to actions
3. **Atmosphere**: Dynamic music creates emotional engagement
4. **Character**: Voice lines add personality and immersion
5. **Celebration**: Crowd reactions amplify exciting moments
6. **Progression**: Combo chains reward skillful play

## Credits

- **Web Audio API**: Mozilla, Google, W3C
- **Speech Synthesis**: W3C Web Speech API
- **Sound Design**: Procedural generation using oscillators
- **Music Tracks**: Kevin MacLeod (royalty-free)

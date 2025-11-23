# AI Personalities Reference

## Overview
The game includes 9 distinct AI personalities with varying difficulty levels and play styles. Each personality has unique characteristics that affect how the AI plays.

## Available Personalities

### Easy Difficulty

#### EMBER 🔥
- **Difficulty**: Easy
- **Aggressiveness**: 0.8 (High)
- **Conservativeness**: 0.2 (Low)
- **Counter Priority**: 0.4 (Low)
- **Preferred Elements**: Fire, Earth, Power
- **Play Style**: Aggressive but predictable
- **Best For**: Beginners, Tutorial Mode

---

### Medium Difficulty

#### FROST ❄️
- **Difficulty**: Medium
- **Aggressiveness**: 0.3 (Low)
- **Conservativeness**: 0.7 (High)
- **Counter Priority**: 0.7 (High)
- **Preferred Elements**: Ice, Water, Neutral
- **Play Style**: Defensive and reactive
- **Best For**: Learning defensive strategies

#### AQUA 💧
- **Difficulty**: Medium
- **Aggressiveness**: 0.5 (Balanced)
- **Conservativeness**: 0.5 (Balanced)
- **Counter Priority**: 0.6 (Medium)
- **Preferred Elements**: Water, Ice, Neutral
- **Special Traits**: **Adaptive** - Adjusts strategy based on player behavior
- **Play Style**: Balanced and learning
- **Best For**: Intermediate players, adaptive challenge

---

### Hard Difficulty

#### VOLT ⚡
- **Difficulty**: Hard
- **Aggressiveness**: 0.7 (High)
- **Conservativeness**: 0.4 (Medium)
- **Counter Priority**: 0.8 (High)
- **Preferred Elements**: Electricity, Light, Power
- **Special Traits**: **Combo Focus** - Prioritizes element matching
- **Play Style**: Aggressive combo specialist
- **Best For**: Learning advanced combos

#### TERRA 🌍
- **Difficulty**: Hard
- **Aggressiveness**: 0.4 (Medium)
- **Conservativeness**: 0.8 (Very High)
- **Counter Priority**: 0.9 (Very High)
- **Preferred Elements**: Earth, Fire, Dark
- **Special Traits**: **Defensive** - Excellent at countering
- **Play Style**: Patient and counter-focused
- **Best For**: Learning counter-play

---

### Expert Difficulty

#### LUMINA ☀️
- **Difficulty**: Expert
- **Aggressiveness**: 0.6 (High)
- **Conservativeness**: 0.6 (High)
- **Counter Priority**: 0.8 (High)
- **Preferred Elements**: Light, Power, Electricity
- **Special Traits**: **Perfect Play** - Makes optimal decisions
- **Play Style**: Near-perfect execution
- **Best For**: Advanced players seeking challenge

#### SHADOW 🌙
- **Difficulty**: Expert
- **Aggressiveness**: 0.5 (Balanced)
- **Conservativeness**: 0.7 (High)
- **Counter Priority**: 0.9 (Very High)
- **Preferred Elements**: Dark, Power, Neutral
- **Special Traits**: **Exploitative** & **Unpredictable** - Exploits weaknesses, hard to read
- **Play Style**: Cunning and unpredictable
- **Best For**: Players wanting mind games

---

### Master Difficulty

#### NEXUS ⭐
- **Difficulty**: Master
- **Aggressiveness**: 0.7 (High)
- **Conservativeness**: 0.7 (High)
- **Counter Priority**: 1.0 (Perfect)
- **Preferred Elements**: Power, Legendary
- **Special Traits**: 
  - **Perfect Play** - Optimal decisions
  - **Adaptive** - Learns from player
  - **Combo Focus** - Advanced combinations
  - **Exploitative** - Punishes mistakes
- **Play Style**: Ultimate AI, all traits combined
- **Best For**: Master players, ultimate challenge

#### CHAOS 🔮
- **Difficulty**: Master
- **Aggressiveness**: 0.5 (Random)
- **Conservativeness**: 0.5 (Random)
- **Counter Priority**: 0.5 (Random)
- **Preferred Elements**: Neutral, Random
- **Special Traits**: **Random** & **Unpredictable** - Completely unpredictable
- **Play Style**: Chaotic and random
- **Best For**: Fun chaos, testing adaptability

---

## Usage in Code

### Creating a Game with Specific AI

```javascript
// Easy - Tutorial/Beginner
const result = await gameClient.createRoom('EMBER');

// Medium - Learning
const result = await gameClient.createRoom('FROST');
const result = await gameClient.createRoom('AQUA');

// Hard - Intermediate
const result = await gameClient.createRoom('VOLT');
const result = await gameClient.createRoom('TERRA');

// Expert - Advanced
const result = await gameClient.createRoom('LUMINA');
const result = await gameClient.createRoom('SHADOW');

// Master - Elite
const result = await gameClient.createRoom('NEXUS');
const result = await gameClient.createRoom('CHAOS');
```

### Recommended AI for Different Modes

**Tutorial Mode**: `EMBER` - Easiest, good for learning basics

**Story Mode**:
- Early Chapters: `EMBER`, `FROST`
- Mid Chapters: `AQUA`, `VOLT`, `TERRA`
- Late Chapters: `LUMINA`, `SHADOW`
- Final Boss: `NEXUS`

**Quick Play**:
- Beginner: `EMBER`, `FROST`
- Intermediate: `AQUA`, `VOLT`, `TERRA`
- Advanced: `LUMINA`, `SHADOW`
- Expert: `NEXUS`, `CHAOS`

**Practice Mode**:
- Defensive Practice: `FROST`, `TERRA`
- Aggressive Practice: `EMBER`, `VOLT`
- Combo Practice: `VOLT`, `NEXUS`
- Adaptive Practice: `AQUA`, `NEXUS`
- Chaos Practice: `CHAOS`

---

## AI Behavior Traits

### Aggressiveness
- **High (0.7+)**: Plays strong cards early, takes risks
- **Medium (0.4-0.6)**: Balanced approach
- **Low (0.3-)**: Plays weak cards first, saves strong cards

### Conservativeness
- **High (0.7+)**: Saves powerful cards for later
- **Medium (0.4-0.6)**: Balanced card management
- **Low (0.3-)**: Uses powerful cards early

### Counter Priority
- **High (0.8+)**: Actively tries to counter opponent's elements
- **Medium (0.5-0.7)**: Sometimes counters
- **Low (0.4-)**: Rarely considers countering

### Special Traits

**Adaptive**: AI learns from player patterns and adjusts strategy

**Combo Focus**: Prioritizes element matching for double strength

**Defensive**: Focuses on countering and protecting

**Perfect Play**: Makes mathematically optimal decisions

**Exploitative**: Identifies and punishes player weaknesses

**Unpredictable**: Uses non-standard strategies, hard to predict

**Random**: Completely random decisions, chaotic gameplay

---

## Element Preferences

Each AI has preferred elements they're more likely to play when multiple options exist:

- **EMBER**: Fire, Earth, Power
- **FROST**: Ice, Water, Neutral
- **AQUA**: Water, Ice, Neutral
- **VOLT**: Electricity, Light, Power
- **TERRA**: Earth, Fire, Dark
- **LUMINA**: Light, Power, Electricity
- **SHADOW**: Dark, Power, Neutral
- **NEXUS**: Power, Legendary
- **CHAOS**: Neutral, Random (any)

---

## Common Mistakes

### ❌ Using Invalid Personality
```javascript
// WRONG - 'FRIENDLY' doesn't exist
const result = await gameClient.createRoom('FRIENDLY');
// Result: Falls back to random AI (usually AQUA)
```

### ✅ Correct Usage
```javascript
// CORRECT - Use valid personality
const result = await gameClient.createRoom('EMBER');
```

---

## Testing Different AI Personalities

```javascript
// Quick test function
const testAI = async (personality) => {
  console.log(`Testing ${personality}...`);
  const result = await gameClient.createRoom(personality);
  await gameClient.joinRoom(result.roomId, playerId, 'TestPlayer');
  await gameClient.startGame(result.roomId);
};

// Test all personalities
['EMBER', 'FROST', 'AQUA', 'VOLT', 'TERRA', 'LUMINA', 'SHADOW', 'NEXUS', 'CHAOS']
  .forEach(ai => testAI(ai));
```

---

## File Location

AI personalities are defined in:
```
server/aiPersonalities.js
```

To add new personalities or modify existing ones, edit this file.

---

## Related Documentation

- [Tutorial Mode Guide](TUTORIAL_MODE.md)
- [Story Mode Documentation](STORY_MODE_ENHANCEMENTS.md)
- [Game Flow Analysis](GAME_FLOW_ANALYSIS.md)

---

**Last Updated**: November 22, 2025

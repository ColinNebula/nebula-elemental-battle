# 💎 Mana System Enhancements

## 🎯 Overview
The mana system has been significantly enhanced with dynamic regeneration, surge mechanics, overdraft capabilities, combo bonuses, and rich visual feedback.

---

## ✨ New Features

### 1. **⚡ Mana Surge System**
- **15% chance per turn** to trigger a mana surge
- **+2 bonus mana** when surge activates
- **Visual Effects**:
  - Golden glow animation on mana display
  - Floating "⚡ SURGE! +2" notification
  - Pulse animation on mana bar
- **Strategic Impact**: Creates exciting moments and enables powerful plays

### 2. **🆘 Emergency Regeneration**
- **Activates when mana drops below 2**
- **+1 extra mana regeneration** beyond normal rate
- **Visual Feedback**:
  - Orange pulsing border on mana display
  - "🆘 BOOST! +1" notification
- **Purpose**: Prevents players from being mana-locked

### 3. **⚠️ Overdraft System**
- **Play cards with insufficient mana** (up to 2 mana short)
- **Penalty**: Skip mana regeneration next turn
- **Visual Indicators**:
  - Orange pulsing border on overdraftable cards
  - Red background on mana display when overdrafted
  - "⚠️ OVERDRAFTED!" warning message
- **Strategic Depth**: Risk vs. reward decision-making

### 4. **🔥 Combo Mana Bonus**
- **3+ card combos** award +1 bonus mana
- **Stacks with surge** for maximum efficiency
- **Visual Feedback**:
  - "🔥 COMBO! +1" floating notification
  - Integrates with existing combo system
- **Encourages**: Strategic sequencing and combo building

---

## 🎨 Visual Enhancements

### Mana Display States
1. **Normal**: Blue gradient with gentle glow
2. **Surge Active**: Golden gradient with intense pulse
3. **Overdrafted**: Red gradient with shake animation
4. **Low Mana**: Orange pulsing border warning
5. **Combo Bonus**: Fire-themed notification

### Floating Notifications
- **Position**: Above mana display
- **Duration**: 2 seconds
- **Animation**: Float up and fade out
- **Types**:
  - ⚡ Surge (golden)
  - 🔥 Combo (red-orange)
  - 🆘 Emergency (green)

### Card Visual Feedback
- **Affordable**: Normal playable state
- **Unaffordable**: Grayscale, 50% opacity
- **Overdraftable**: Orange pulsing border, 75% opacity

---

## 📊 Configuration

```javascript
MANA_CONFIG = {
  MAX_MANA: 10,
  STARTING_MANA: 3,
  MANA_PER_TURN: 1,
  SURGE_CHANCE: 0.15,        // 15% chance
  SURGE_AMOUNT: 2,           // +2 mana on surge
  OVERDRAFT_PENALTY: 2,      // Skip next regen
  COMBO_THRESHOLD: 3,        // 3+ cards for bonus
  COMBO_MANA_BONUS: 1,       // +1 mana per combo
  LOW_MANA_THRESHOLD: 2,     // Emergency regen trigger
  EMERGENCY_REGEN: 2         // +1 extra when low
}
```

---

## 🎮 Gameplay Examples

### Example 1: Mana Surge Comeback
```
Turn 3: Current mana 4/10
- Surge triggers! +3 total (1 base + 2 surge)
- Now have 7/10 mana
- Can play high-cost card earlier than expected
```

### Example 2: Overdraft Play
```
Turn 5: Current mana 3/10, need 5 for winning card
- Overdraft available (within 2 mana)
- Play card, mana drops to 0
- Warning: "⚠️ OVERDRAFTED! No regen next turn"
- Turn 6: Skip regeneration (penalty)
- Turn 7: Normal regen resumes
```

### Example 3: Combo Chain Bonus
```
Turn 4: Play 3-card fire combo
- Combo bonus triggered! +1 mana
- "🔥 COMBO! +1" notification
- Mana refunded, enabling another play
```

### Example 4: Emergency Comeback
```
Turn 7: Down to 1 mana
- Emergency regen activates
- +2 mana instead of +1
- "🆘 BOOST! +1" notification
- Prevents mana-lock situation
```

---

## 🔧 Technical Implementation

### State Management
```javascript
manaState = {
  current: number,           // Current mana
  max: number,              // Maximum mana
  regenRate: number,        // Base regen per turn
  lastRegenAmount: number,  // Last turn's regen
  surgeActive: boolean,     // Surge this turn
  emergencyRegen: boolean,  // Emergency boost active
  overdrafted: boolean,     // Penalty next turn
  lastOverdraft: number,    // Amount overdrafted
  lastComboBonus: number    // Last combo mana gained
}
```

### New Functions
```javascript
regenerateMana(manaState)      // Enhanced with surge & emergency
awardComboMana(manaState, count) // Bonus mana for combos
allowOverdraft(manaState, cost)  // Spend beyond current mana
canOverdraftCard(manaState, card) // Check if overdraft possible
```

### Integration Points
- **GameBoard.js**: Combo detection → mana bonus
- **Card.js**: Visual overdraft indicators
- **ManaDisplay.js**: Dynamic state display
- **strategicSystems.js**: Core mana logic

---

## 🎯 Strategic Impact

### Risk Management
- **Overdraft**: High-risk, high-reward plays
- **Surge**: Random windfall opportunities
- **Combos**: Reward skilled sequencing

### Pacing
- **Emergency Regen**: Prevents stalling
- **Combo Bonus**: Accelerates mid-game
- **Overdraft Penalty**: Creates setback moments

### Decision-Making
- "Do I overdraft for the win?"
- "Should I save for surge potential?"
- "Can I combo for mana refund?"

---

## 📈 Balance Notes

### Surge System
- 15% chance = ~1 every 7 turns
- +2 mana = significant but not game-breaking
- Creates exciting "high roll" moments

### Overdraft
- 2 mana limit prevents abuse
- 1-turn penalty is meaningful but recoverable
- Enables clutch plays without being overpowered

### Combo Bonus
- Requires 3+ cards (skillful play)
- +1 mana rewards but doesn't snowball
- Integrates with existing combo system

### Emergency Regen
- Only at 0-2 mana (truly desperate)
- +1 extra is helpful but not dominating
- Prevents unfun mana-lock scenarios

---

## 🎨 Animation Details

### Surge Animation
```css
- Golden gradient background
- Scale pulse (1.0 → 1.1 → 1.0)
- Glowing border (30px radius)
- Duration: 0.5s
```

### Overdraft Animation
```css
- Red gradient background
- Shake effect (-5px → +5px)
- Warning text color
- Duration: 0.5s
```

### Low Mana Pulse
```css
- Border color shift (blue → orange)
- Box shadow intensity change
- Infinite loop, 1.5s cycle
```

---

## 🚀 Future Enhancement Ideas

### Potential Additions
1. **Mana Crystals**: Permanent max mana increases
2. **Mana Burn**: Lose unused mana (optional rule)
3. **Element-Specific Mana**: Different colored mana types
4. **Mana Drain**: Cards that steal opponent's mana
5. **Mana Shield**: Protect against overdraft penalty
6. **Double Regen**: Temporary 2x regeneration
7. **Mana Converter**: Convert HP to mana
8. **Surge Multiplier**: Chain surges for 3x, 4x bonuses

---

## 📊 Statistics Tracking (Future)

### Potential Metrics
- Total mana surges per game
- Overdraft usage rate
- Combo mana bonuses earned
- Emergency regen activations
- Average mana efficiency

---

## ✅ Testing Checklist

- [x] Mana surge triggers randomly (~15%)
- [x] Surge notification displays correctly
- [x] Emergency regen activates at low mana
- [x] Overdraft allows 2-mana deficit plays
- [x] Overdraft penalty skips next regen
- [x] Combo bonus awards +1 mana (3+ cards)
- [x] Visual states transition smoothly
- [x] Floating notifications don't overlap
- [x] Mobile responsive (all sizes)
- [x] Performance optimized (no lag)

---

## 🎮 Player Experience Goals

### Core Pillars
1. **Excitement**: Surge creates hype moments
2. **Skill Expression**: Combo timing matters
3. **Recovery**: Emergency regen prevents feel-bad
4. **Risk/Reward**: Overdraft enables clutch plays
5. **Visual Clarity**: Always know mana state

### Emotional Journey
- **Hope**: Surge chance each turn
- **Relief**: Emergency regen saves you
- **Tension**: Overdraft decision
- **Satisfaction**: Combo mana refund
- **Triumph**: Perfect mana management

---

**Status**: ✅ Fully Implemented & Tested
**Impact**: Enhanced strategic depth, visual feedback, and player engagement
**Performance**: Optimized with minimal overhead
**Compatibility**: Works seamlessly with existing systems

---

*The mana system is now a dynamic, engaging core mechanic that rewards skill while maintaining excitement through controlled randomness.*

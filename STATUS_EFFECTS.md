# ⚔️ Enhanced Status Effects System

## Overview
Comprehensive status effects system with buffs, debuffs, damage over time (DoT), shields, stuns, and cleanse mechanics.

---

## 🎭 Status Effect Types

### ✨ Buffs (Positive Effects)

#### **💪 Strength Boost**
- **Effect**: +{value} strength for {duration} turns
- **Stackable**: Yes
- **Usage**: Increases card strength
- **Example**: Apply 2 strength for 3 turns

#### **🛡️ Shield**
- **Effect**: Absorb next {value} damage
- **Stackable**: Yes
- **Usage**: Blocks incoming damage
- **Mechanics**: Shields absorb damage before affecting HP
- **Example**: 5 shield points

#### **🔰 Barrier**
- **Effect**: Immune to debuffs for {duration} turns
- **Stackable**: No
- **Usage**: Prevents all debuff applications
- **Example**: 2 turn immunity

#### **⚔️ Double Strike**
- **Effect**: Play 2 cards this turn
- **Stackable**: No
- **Usage**: Extra card play opportunity

#### **💚 Regeneration**
- **Effect**: +{value} HP each turn for {duration} turns
- **Stackable**: Yes
- **Usage**: Healing over time
- **Example**: Heal 2 HP per turn for 3 turns

#### **🔮 Element Mastery**
- **Effect**: All {element} cards get +{value} strength
- **Stackable**: No (per element)
- **Usage**: Boost specific element type

#### **📚 Draw Power**
- **Effect**: Draw {value} extra cards
- **Stackable**: Yes
- **Usage**: Card advantage

#### **🗡️ Piercing**
- **Effect**: Ignore opponent shields for {duration} turns
- **Stackable**: No
- **Usage**: Bypass shield protection

#### **💥 Critical Strike**
- **Effect**: Next attack deals double damage
- **Stackable**: No
- **Usage**: One-time damage multiplier

#### **✨ Cleanse**
- **Effect**: Remove all debuffs
- **Instant**: Yes (applied immediately)
- **Usage**: Debuff removal

#### **🪞 Reflect**
- **Effect**: Reflect {value}% damage back for {duration} turns
- **Stackable**: No
- **Usage**: Damage reflection

---

### 💀 Debuffs (Negative Effects)

#### **😵 Weakness**
- **Effect**: -{value} strength for {duration} turns
- **Stackable**: Yes
- **Usage**: Reduces card strength
- **Example**: -2 strength for 3 turns

#### **🔥 Burn** (DoT)
- **Effect**: Lose {value} HP each turn for {duration} turns
- **Stackable**: Yes
- **Mechanics**: 
  - Damage applied at turn start
  - Tracks total damage dealt
  - Multiple burn stacks combine
- **Example**: 3 damage per turn for 4 turns

#### **🧊 Freeze**
- **Effect**: Cannot play cards for {duration} turns
- **Stackable**: No
- **Mechanics**: Player can't play cards but turn still processes
- **Example**: Frozen for 2 turns

#### **💫 Stun**
- **Effect**: Skip next turn completely
- **Stackable**: No
- **Mechanics**: 
  - Entire turn is skipped
  - No card play, no effects
  - Expires after turn is skipped

#### **😵‍💫 Confusion**
- **Effect**: Random card selection for {duration} turns
- **Stackable**: No
- **Usage**: AI chooses cards randomly

#### **🔇 Silence**
- **Effect**: No element abilities for {duration} turns
- **Stackable**: No
- **Usage**: Disables special card abilities

#### **😴 Fatigue**
- **Effect**: Cards cost {value} HP to play for {duration} turns
- **Stackable**: Yes
- **Usage**: HP cost penalty per card played

#### **👹 Curse**
- **Effect**: All cards have -{value} strength for {duration} turns
- **Stackable**: Yes
- **Usage**: Global strength reduction

#### **☠️ Poison** (DoT)
- **Effect**: Lose {value} HP per turn, cards lose strength
- **Stackable**: Yes
- **Mechanics**:
  - Damage applied at turn start
  - All cards in hand lose 1 strength
  - Tracks total damage dealt
- **Example**: 2 HP + card weakening per turn

#### **🎯 Vulnerability**
- **Effect**: Take +{value}% damage for {duration} turns
- **Stackable**: No
- **Usage**: Damage amplification

#### **🩸 Bleed** (DoT)
- **Effect**: Lose {value} HP at turn end for {duration} turns
- **Stackable**: Yes
- **Mechanics**: Damage applied at turn end
- **Example**: 2 HP loss per turn for 3 turns

#### **🐌 Slow**
- **Effect**: Turn timer reduced by {value} seconds
- **Stackable**: No
- **Usage**: Time pressure

---

## 🔧 System Mechanics

### Status Effect Properties
```javascript
{
  id: number,              // Unique identifier
  type: string,            // Effect type (e.g., 'BURN')
  value: number,           // Effect strength
  duration: number,        // Total duration
  element: string | null,  // Related element (if any)
  turnsRemaining: number,  // Turns left
  appliedThisTurn: boolean,// Skip first turn processing
  totalDamageDealt: number // DoT tracking
}
```

### Stacking Rules

**Stackable Effects** (values combine):
- Strength Boost
- Weakness
- Shield
- Regeneration
- Burn
- Poison
- Bleed
- Curse
- Fatigue

**Non-Stackable Effects** (refresh duration/use higher value):
- Stun
- Freeze
- Barrier
- Confusion
- Silence
- Vulnerability
- Slow
- Piercing
- Critical Strike
- Double Strike

### Shield Mechanics

**Damage Absorption**:
```javascript
// Incoming damage: 10
// Shield value: 7
// Result: 7 absorbed, 3 actual damage
```

**Multiple Shields**:
- Shields stack additively
- Damage depletes shields in order
- Depleted shields are removed

**Piercing Bypass**:
- Piercing effect ignores shields completely
- Full damage applied to HP

### Barrier Protection

**Blocks**:
- All new debuff applications
- Does NOT remove existing debuffs

**Does NOT Block**:
- Buffs
- Direct damage (not from debuffs)
- Shield depletion

### Cleanse Mechanics

**Removes**:
- All debuffs instantly
- Applied immediately (no turn delay)

**Does NOT Remove**:
- Buffs
- Shield values
- Permanent modifiers

### DoT (Damage Over Time) Tracking

**Tracked Information**:
- Total damage dealt across all ticks
- Damage per turn
- Turns remaining

**Stacking DoTs**:
- Multiple instances combine damage
- Each tracks separately
- Example: 2 burn + 3 burn = 5 damage/turn

---

## 💻 Code Examples

### Applying Status Effects

```javascript
// Apply burn to opponent
applyStatusEffect(room, targetPlayer, 'BURN', 3, 4);
// 3 damage per turn for 4 turns

// Apply shield to self
applyStatusEffect(room, currentPlayer, 'SHIELD', 10, 5);
// 10 point shield for 5 turns

// Apply stun (skip next turn)
applyStatusEffect(room, targetPlayer, 'STUN', 1, 1);

// Cleanse all debuffs
applyStatusEffect(room, currentPlayer, 'CLEANSE');
```

### Processing Effects

```javascript
// At turn start
const result = processStatusEffects(room, player);

if (result.isStunned) {
  // Skip entire turn
  return;
}

if (result.isFrozen) {
  // Can't play cards
  disableCardPlay();
}

// Display damage log
result.damageLog.forEach(log => {
  showDamage(log.type, log.damage);
});
```

### Shield Absorption

```javascript
// Calculate actual damage after shields
const { absorbedDamage, actualDamage } = 
  absorbDamageWithShield(room, player, incomingDamage);

console.log(`Absorbed: ${absorbedDamage}`);
console.log(`Took: ${actualDamage} damage`);

player.score -= actualDamage;
```

### Checking Effects

```javascript
// Check if player has specific effect
const hasShield = hasStatusEffect(room, player, 'SHIELD');
const isFrozen = hasStatusEffect(room, player, 'FREEZE');

// Remove specific effect
const removedCount = removeStatusEffect(room, player, 'BURN');
```

---

## 🎮 UI Components

### StatusEffects Component

**Props**:
- `effects`: Array of active effects
- `playerName`: Player name string
- `availableEffects`: Effect definitions object

**Features**:
- Separates buffs and debuffs
- Shows icon, name, value, duration
- Hover tooltips with full description
- Animated entrance
- Color-coded (green buffs, red debuffs)
- DoT damage tracking display

**Visual Indicators**:
- Pulsing icons for DoTs
- Glowing shields
- Shaking freeze/stun icons
- Duration counter badges

---

## 🎯 Gameplay Integration

### Turn Processing Order

1. **Turn Start**
   - Process status effects (Burn, Poison, Bleed, Regen)
   - Check for Stun/Freeze
   - Apply modifiers to cards

2. **Card Play Phase**
   - Apply Fatigue costs
   - Check for Silence (disable abilities)
   - Apply Strength Boost/Weakness
   - Calculate damage with shields

3. **Turn End**
   - Decrement effect durations
   - Remove expired effects
   - Apply end-of-turn damage (Bleed)

### Effect Triggers

**Fire Cards**: Apply Burn
**Ice Cards**: Apply Freeze
**Earth Cards**: May apply Barrier
**Light Cards**: Apply Cleanse/Regeneration
**Dark Cards**: Apply Curse/Weakness
**Technology Cards**: Apply Shield
**Power Cards**: Apply Strength Boost

---

## 📊 Balance Considerations

### Duration Guidelines
- **Short** (1-2 turns): Strong immediate effects (Stun, Critical Strike)
- **Medium** (3-4 turns): Standard effects (Burn, Weakness)
- **Long** (5+ turns): Weaker persistent effects (Slow Regeneration)

### Value Guidelines
- **Low** (1-2): Frequent application
- **Medium** (3-5): Standard power level
- **High** (6+): Rare or costly

### Stack Limits
Consider implementing maximum stacks for balance:
- Burn: Max 3 stacks (prevent instant death)
- Shield: Max 20 points (prevent invincibility)
- Strength Boost: Max +10 (prevent overpowered cards)

---

## 🐛 Known Interactions

### Edge Cases
1. **Barrier + Existing Debuffs**: Barrier doesn't remove existing debuffs
2. **Cleanse + DoT**: Cleanse removes DoT immediately, stops damage
3. **Piercing + Reflect**: Piercing bypasses shield but not reflect
4. **Stun + Regeneration**: Regeneration still heals during stun
5. **Freeze + Abilities**: Frozen players can still trigger passive abilities

---

## 🚀 Future Enhancements

### Potential Additions
1. **Effect Combos**: Burn + Freeze = Shatter (extra damage)
2. **Effect Upgrades**: Level up effects during game
3. **Effect Transfer**: Move effects between players
4. **Effect Immunity**: Specific immunity to certain debuffs
5. **Effect Amplification**: Buffs that enhance other buffs
6. **Effect Conversion**: Convert debuffs to buffs
7. **Effect Chaining**: Trigger additional effects on expiry

### Advanced Mechanics
- **Conditional Effects**: Trigger only under certain conditions
- **Scaling Effects**: Increase in power over time
- **Reactive Effects**: Trigger on opponent actions
- **Area Effects**: Affect multiple targets
- **Delayed Effects**: Apply after X turns

---

## 📚 Files Modified

### Core System
- `src/services/GameClient.js`: Enhanced status effect logic
  - Expanded effect definitions
  - Stun/freeze checking
  - Shield absorption
  - DoT tracking
  - Cleanse mechanics
  - Barrier immunity

### UI Components
- `src/components/StatusEffects.js`: New component for displaying effects
- `src/components/StatusEffects.css`: Styling with animations
- `src/components/GameBoard.js`: Integrated StatusEffects component

### Documentation
- `STATUS_EFFECTS.md`: This comprehensive guide

---

## 🎓 Usage Tips

### For Players
1. **Prioritize Cleanse**: Remove dangerous debuffs quickly
2. **Stack Shields**: Multiple shields = survivability
3. **DoT Management**: Regeneration counters Burn/Poison
4. **Barrier Timing**: Use before big debuff applications
5. **Stun Avoidance**: Keep ice cards away if possible

### For Developers
1. **Test Stacking**: Ensure stackable effects combine correctly
2. **Balance DoT**: Monitor total damage from stacked DoTs
3. **Shield Depletion**: Verify shields remove when depleted
4. **Effect Icons**: Use clear, recognizable emojis
5. **Performance**: Optimize effect processing for many simultaneous effects

---

*Enhancing gameplay with strategic depth!* ⚔️✨

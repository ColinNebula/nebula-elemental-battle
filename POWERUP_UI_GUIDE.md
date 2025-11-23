# Power-Up System UI Guide

## Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                        GAME BOARD                               │
│                                                                 │
│  ┌──────────┐                                 ┌──────────────┐ │
│  │ ACTIVE   │                                 │   💪         │ │
│  │ BOOSTS   │                                 │   Booster    │ │
│  │          │                                 │   Toggle     │ │
│  │ 💪 +3 STR│                                 └──────────────┘ │
│  │ 2 turns  │                                                  │
│  └──────────┘                                 ┌──────────────┐ │
│                                               │   ⚔️         │ │
│                  [Opponent Cards]             │   Equipment  │ │
│                                               │   Toggle     │ │
│                                               └──────────────┘ │
│                                                                 │
│                  [Center Arena]                                 │
│                                                                 │
│                  [Your Cards]                                   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         ⚡ ULTIMATE ABILITY BAR                          │  │
│  │  ┌────────────────────────────────────────┐              │  │
│  │  │ Meteor Strike                          │              │  │
│  │  │ Deal 15 damage to all opponent cards   │              │  │
│  │  └────────────────────────────────────────┘              │  │
│  │  ┌───┐ [████████████░░░░░] 80%                          │  │
│  │  │ 1 │ Cooldown                                         │  │
│  │  └───┘                                                   │  │
│  │  [         COOLDOWN: 1         ]                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Panel Overlays

### Booster Panel (Right Side)
When clicking the 💪 toggle button:

```
┌──────────────────┐
│  ⚡ BOOSTERS    │
├──────────────────┤
│ 💪 Strength Surge│
│ +3 STR to cards  │
│ [3T]             │
├──────────────────┤
│ 🛡️ Shield Barrier│
│ -50% damage taken│
│ [2T]             │
├──────────────────┤
│ 💎 Mana Burst    │
│ +5 mana instant  │
│ [1T]             │
├──────────────────┤
│ 🎴 Card Draw     │
│ Draw +2 cards    │
│ [1T]             │
├──────────────────┤
│ 🌟 Element Master│
│ +2 elemental bon │
│ [4T]             │
├──────────────────┤
│ ⚡ Double Damage │
│ 2x damage multi  │
│ [1T]             │
├──────────────────┤
│ 🩸 Life Drain    │
│ 30% lifesteal    │
│ [2T]             │
├──────────────────┤
│ ⏰ Time Warp     │
│ Extra turn       │
│ [1T]             │
└──────────────────┘
```

### Equipment Panel (Right Side)
When clicking the ⚔️ toggle button:

```
┌────────────────────────┐
│   ⚔️ EQUIPMENT         │
├────────────────────────┤
│ ┌─────┐  ┌─────┐      │
│ │ 👑  │  │ 📿  │      │
│ │HEAD │  │NECK │      │
│ │Crown│  │Empty│      │
│ └─────┘  └─────┘      │
│                        │
│ ┌─────┐  ┌─────┐      │
│ │ 🐉  │  │ 🔱  │      │
│ │BODY │  │HAND │      │
│ │Scale│  │Gaunt│      │
│ └─────┘  └─────┘      │
│                        │
│ ┌─────┐  ┌─────┐      │
│ │ 💍  │  │ 👢  │      │
│ │RING │  │FEET │      │
│ │Elem │  │Empty│      │
│ └─────┘  └─────┘      │
│                        │
│ ┌─────┐  ┌─────┐      │
│ │ 🔮  │  │ 🍀  │      │
│ │WEAP │  │TRIN │      │
│ │Staff│  │Empty│      │
│ └─────┘  └─────┘      │
├────────────────────────┤
│ ⭐ TOTAL STATS        │
│ Strength      +5       │
│ Defense       +5       │
│ Spell Power   +4       │
│ Elemental     +3       │
│ Mana Regen    +0       │
└────────────────────────┘
```

## UI Elements

### 1. Active Boost Indicators (Top-Right)
Floating boxes showing currently active boosters:
```
┌──────────────────┐
│ 💪 Strength Surge│
│    2 turns left  │
└──────────────────┘
┌──────────────────┐
│ 🛡️ Shield Barrier│
│    1 turn left   │
└──────────────────┘
```

### 2. Ultimate Ability Bar (Bottom-Center)
Large prominent bar with:
- **Ability Name**: "Meteor Strike"
- **Description**: "Deal 15 damage to all opponent cards"
- **Cooldown Number**: Large "3" or "✨" when ready
- **Progress Bar**: Visual cooldown indicator (orange → green)
- **Activation Button**: "ACTIVATE ULTIMATE" (green pulse when ready)

### 3. Toggle Buttons
Two circular buttons on the right edge:
- **Top**: 💪 (Green) - Opens Booster Panel
- **Bottom**: ⚔️ (Orange) - Opens Equipment Panel

## Color Coding

### Boosters
- **Border**: Green (#4caf50)
- **Active Glow**: Bright green pulsing
- **Used**: Gray (#666), semi-transparent

### Ultimate Ability
- **On Cooldown**: Orange (#ff9800)
- **Ready**: Green (#4caf50) with pulse animation
- **Progress Bar**: Orange → Green gradient

### Equipment
- **Border**: Orange (#ff9800)
- **Common**: White
- **Rare**: Blue (#2196f3)
- **Epic**: Purple (#9c27b0)
- **Legendary**: Gold (#ffd700) with glow animation

## Interactions

### Activating a Booster
1. Click the 💪 toggle button
2. Booster panel slides in from right
3. Click a booster to activate (if not used)
4. Panel stays open, booster marked as active
5. Active indicator appears in top-right
6. Booster effects apply to your cards

### Using Ultimate Ability
1. Wait for cooldown to reach 0
2. Button turns green and starts pulsing
3. Click "ACTIVATE ULTIMATE"
4. Ultimate effect triggers immediately
5. Banner message shows activation
6. Cooldown resets to maximum

### Managing Equipment
1. Click the ⚔️ toggle button
2. Equipment panel slides in from right
3. View all 8 equipment slots
4. Click equipped item to unequip
5. See total stats at bottom
6. Equipment effects apply automatically

### Keyboard Shortcuts (Future)
- `B` - Toggle Booster Panel
- `E` - Toggle Equipment Panel
- `U` - Activate Ultimate (when ready)
- `S` - Toggle Sideboard Panel

## Visual Feedback

### Booster Activation
- ✅ Green checkmark animation
- 📣 Banner message: "💪 STRENGTH SURGE ACTIVATED!"
- 🔊 Fire element sound effect
- ⏱️ Duration timer starts counting down

### Ultimate Activation
- ⚡ Screen flash effect
- 📣 Banner message: "⚡ METEOR STRIKE!"
- 🔊 Combo voice line plays
- 💫 Particle effects

### Equipment Effects
- ✨ Card glow when equipment bonus applies
- 📊 Stat numbers show +X modifiers
- 🎯 Critical hit indicator for crit chance
- 🔮 Spell echo effect for double cast

## Mobile Optimization

On screens < 1024px:
- Booster and Equipment panels hidden
- Ultimate bar remains visible (smaller)
- Active boost indicators remain (smaller)
- Touch-friendly button sizes

On screens < 768px:
- Ultimate bar further compressed
- Cooldown number smaller
- Description text abbreviated
- Single-line layout

## Animation Highlights

### Booster Active Pulse
```
box-shadow: 0 0 15px → 0 0 25px (green glow)
Duration: 2s infinite
```

### Ultimate Ready Pulse
```
transform: scale(1) → scale(1.1)
text-shadow: 15px → 25px (green glow)
Duration: 1.5s infinite
```

### Legendary Equipment Glow
```
box-shadow: 0 0 20px → 0 0 35px (gold glow)
Duration: 3s infinite
```

### Active Boost Appear
```
opacity: 0 → 1
transform: translateX(100px) → translateX(0)
Duration: 0.5s ease-out
```

## Tips for Players

### Booster Strategy
- **Save powerful boosters** (Double Damage, Time Warp) for crucial moments
- **Stack defensive boosters** (Shield Barrier) when opponent has strong cards
- **Use mana boosters** early in strategic mode to enable expensive plays
- **Activate Element Mastery** when you have many matching element cards

### Ultimate Timing
- **Meteor Strike**: Best when opponent has multiple cards on board
- **Phoenix Rebirth**: Save for when you lose your strongest card
- **Time Freeze**: Use to skip opponent's crucial turn
- **Card Shuffle**: Use when your hand is weak

### Equipment Builds
- **Offensive Build**: Power Gauntlet + Crown of Power + Staff of Wisdom
- **Defensive Build**: Dragon Scales + Crystal Pendant + Ring of Elements
- **Balanced Build**: Mix of all equipment for versatile play
- **Mana Build**: Crystal Pendant + Lucky Charm for resource management

### Synergy Combos
- **Double Damage + Strength Surge** = Massive damage boost
- **Element Mastery + Ring of Elements** = +5 elemental bonus
- **Life Drain + Double Damage** = 60% lifesteal
- **Crown of Power + Regal Presence** = Compound stat growth

---

**Ready to dominate with power-ups!** 🎮⚡

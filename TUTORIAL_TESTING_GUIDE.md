# Tutorial Mode Testing Guide

## How to Test the Fixed Tutorial

### Pre-Test Setup
1. Clear localStorage (to reset tutorial completion status):
   - Open browser DevTools (F12)
   - Go to Application/Storage → Local Storage
   - Delete `tutorialCompleted` key
   - Refresh the page

2. Start the game and navigate to Main Menu

---

## Test Cases

### ✅ Test 1: Tutorial Entry
**Steps:**
1. Click "GAMEPLAY" section on Main Menu
2. Click "TUTORIAL MODE" button

**Expected:**
- Welcome overlay appears with title "🎓 Welcome to Tutorial Mode!"
- "Let's Begin!" button is visible
- 5 elemental icons animate in preview

**❌ Failure Signs:**
- No overlay appears
- Multiple overlays stack
- Button doesn't work

---

### ✅ Test 2: Character Selection
**Steps:**
1. Click "Let's Begin!" button
2. Character selection screen appears
3. Select any character (e.g., Fire Warrior)

**Expected:**
- Character selection appears immediately (no duplicates)
- After selection, "✅ Great Choice!" overlay shows
- Overlay auto-dismisses after 2 seconds
- "Preparing your deck..." loading screen appears briefly
- Card selection phase loads within 3-5 seconds

**❌ Failure Signs:**
- Character selection appears twice
- "Let's Begin!" requires multiple clicks
- Stuck on loading screen
- No card selection appears

---

### ✅ Test 3: Card Selection Phase
**Steps:**
1. "📋 Card Selection Phase" overlay appears
2. Click "Continue" on overlay
3. Select 5 cards from the 10 shown
4. Click "Confirm Selection"

**Expected:**
- Card selection overlay shows once with explanation
- After clicking Continue, cards are interactive
- Can select exactly 5 cards
- After confirmation, game board loads
- "⚔️ Your First Turn!" overlay appears

**❌ Failure Signs:**
- Multiple card selection overlays
- Can't select cards
- Stuck after confirmation
- Game doesn't start

---

### ✅ Test 4: First Card Play
**Steps:**
1. Click "Continue" on "Your First Turn!" overlay
2. Play any card from your hand

**Expected:**
- After clicking Continue, hand cards are playable
- After playing card, "💪 Understanding Strength" overlay appears within 2 seconds
- Overlay explains the strength value

**❌ Failure Signs:**
- Can't play cards
- Multiple overlays appear
- No strength explanation

---

### ✅ Test 5: Element Matching Tutorial
**Steps:**
1. Click "Continue" on strength overlay
2. Wait for AI to play
3. Your turn comes again

**Expected:**
- "🎯 Element Matching Bonus" overlay appears
- Explains double strength bonus
- Overlay dismisses when you click Continue (not auto)

**❌ Failure Signs:**
- Overlay doesn't appear
- Multiple overlays stack
- Auto-dismisses without user input

---

### ✅ Test 6: Special Abilities (Manual Continue)
**Steps:**
1. Play your second card
2. "✨ Special Abilities" overlay appears
3. Click "Continue" button

**Expected:**
- Overlay explains Earth, Power, and Fire special abilities
- **MUST** click "Continue" to proceed (no auto-advance)
- After clicking Continue, "💠 Mana System" overlay appears
- Transitions smoothly without duplicates

**❌ Failure Signs:**
- Auto-advances without clicking Continue
- Multiple overlays appear
- Gets stuck on this step

---

### ✅ Test 7: Mana System
**Steps:**
1. Click "Continue" on Mana System overlay
2. Play your third card

**Expected:**
- After clicking Continue, can play next card
- After playing third card, "⚡ Power-Ups" overlay appears
- No duplicate overlays

**❌ Failure Signs:**
- Can't play card
- No power-ups overlay
- Multiple overlays stack

---

### ✅ Test 8: Power-Ups (Manual Continue)
**Steps:**
1. "⚡ Power-Ups" overlay appears
2. Click "Continue" button

**Expected:**
- Overlay explains Boosters, Ultimate Abilities, and Equipment
- **MUST** click "Continue" to proceed (no auto-advance)
- After clicking Continue, "🎲 Advanced Features" overlay appears
- Smooth transition without duplicates

**❌ Failure Signs:**
- Auto-advances without clicking Continue
- Multiple overlays appear
- Tutorial gets stuck

---

### ✅ Test 9: Advanced Mechanics (Manual Continue)
**Steps:**
1. "🎲 Advanced Features" overlay appears
2. Click "Continue" button

**Expected:**
- Overlay explains Fusion and Trap buttons
- **MUST** click "Continue" to proceed (no auto-advance)
- After clicking Continue, "🏁 Finish the Battle!" overlay appears
- AI starts playing automatically from now on

**❌ Failure Signs:**
- Auto-advances without clicking Continue
- Multiple overlays appear
- AI doesn't auto-play
- Tutorial freezes

---

### ✅ Test 10: Complete Battle
**Steps:**
1. Click "Continue" on final overlay
2. Play out the rest of the battle
3. Game ends with win or loss

**Expected:**
- Can play remaining cards normally
- AI plays automatically
- When game ends, either "🏆 Congratulations!" (win) or "💪 Keep Learning!" (loss) overlay appears
- "Finish Tutorial 🎉" button appears

**❌ Failure Signs:**
- Gets stuck before game end
- No victory/defeat overlay
- Multiple end-game overlays

---

### ✅ Test 11: Tutorial Completion
**Steps:**
1. Click "Finish Tutorial 🎉" button

**Expected:**
- Returns to Main Menu
- Tutorial is marked as completed in localStorage
- Can start another tutorial if desired

**❌ Failure Signs:**
- Doesn't return to menu
- Error in console
- Can't exit tutorial

---

### ✅ Test 12: Skip Tutorial
**Steps:**
1. Start tutorial
2. At any overlay (except Welcome), click "Skip Tutorial ✕"

**Expected:**
- Immediately returns to Main Menu
- No errors in console
- Tutorial state is cleaned up

**❌ Failure Signs:**
- Doesn't exit properly
- Errors in console
- Stuck in partial tutorial state

---

## Critical Bug Checks

### 🔍 Check for Duplicate Overlays
**During steps 3-9, watch for:**
- ❌ Two overlays appearing at once
- ❌ Overlay content flickering/changing rapidly
- ❌ Multiple progress dots active simultaneously

**Expected:**
- ✅ Only one overlay visible at a time
- ✅ Smooth transitions between steps
- ✅ Single progress dot active per step

---

### 🔍 Check for Stuck States
**If tutorial freezes:**
1. Open browser console (F12)
2. Check for error messages
3. Check game state: `localStorage.getItem('tutorialCompleted')`
4. Verify no infinite loops or repeated log messages

**Expected:**
- ✅ No errors in console
- ✅ Smooth progression through all steps
- ✅ Each step advances when conditions met

---

### 🔍 Check Auto vs Manual Progression
**Steps that SHOULD auto-progress:**
- Welcome → Character Selection (after clicking "Let's Begin!")
- Character Selected → Card Selection (after 2 seconds)
- First Card Play → Strength (after playing card)
- Element Matching → Special Abilities (after playing 2nd card)
- Mana System → Power-Ups (after playing 3rd card)

**Steps that REQUIRE "Continue" click:**
- Card Selection Intro (must click to dismiss)
- Strength (must click to continue playing)
- Element Matching (must click to continue)
- **Special Abilities → Mana System** (must click Continue)
- Mana System (must click to continue playing)
- **Power-Ups → Advanced Mechanics** (must click Continue)
- **Advanced Mechanics → Final Rounds** (must click Continue)
- Victory/Defeat (must click to exit)

---

## Performance Checks

### ⏱️ Loading Times
- Character selection → Card phase: < 5 seconds
- Card selection → Game start: < 3 seconds
- Overlay transitions: < 500ms

### 💾 Memory Leaks
- No console errors after tutorial completion
- localStorage properly cleaned on exit
- No infinite polling after exit

---

## Browser Compatibility
Test in:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (if available)

---

## Success Criteria
✅ No duplicate overlays at any step
✅ No stuck/frozen states
✅ All manual continue steps require user click
✅ Auto-progression happens only when appropriate
✅ Smooth transitions between all 13 steps
✅ Tutorial completes successfully (win or loss)
✅ Skip function works at any point
✅ No console errors throughout
✅ Clean localStorage state after completion

---

## Known Issues (If Any)
*None* - All progression bugs have been fixed!

---

## Reporting Bugs
If you find issues during testing:

1. **Note the step** where it occurred
2. **Check console** for errors (F12)
3. **Describe behavior:**
   - Expected: [what should happen]
   - Actual: [what actually happened]
4. **Include:**
   - Browser and version
   - Any console errors
   - Steps to reproduce

---

## Developer Notes
- Progression tracking uses `progressionHandledRef` (Set-based deduplication)
- Early returns prevent multiple transitions per useEffect run
- Manual continue steps use separate tracking keys (e.g., 'specialAbilities-continue')
- Cleanup runs on tutorial exit and completion
- All timeouts are intentional for smooth UX (brief pauses let players read)

Happy testing! 🎮

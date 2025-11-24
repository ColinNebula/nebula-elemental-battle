# Nebula Elemental Battle - Optimization Plan

## Current Size: 96.87 MB
**Target: < 20 MB**

---

## Phase 1: Asset Optimization (Save ~65 MB)

### Audio Compression (Save ~25 MB)
```powershell
# Use FFmpeg to compress audio
ffmpeg -i input.mp3 -codec:a libopus -b:a 96k output.opus
```

**Actions:**
- [ ] Convert all MP3s to Opus/OGG at 96kbps
- [ ] Implement lazy loading for music tracks
- [ ] Add audio preload only for essential sounds
- [ ] Consider streaming for longer tracks

**Files to compress:**
- `Figuring_it_All_Out.mp3` (4.8 MB → ~600 KB)
- `Strange_Dealings_Afoot.mp3` (4.7 MB → ~600 KB)
- `Cooler_Heads_Prevail.mp3` (4.3 MB → ~550 KB)
- `Under_Cover_of_the_Myst.mp3` (4.1 MB → ~520 KB)
- `Treat_or_Trick.mp3` (4.0 MB → ~510 KB)
- `At_the_End_of_All_Things.mp3` (3.4 MB → ~430 KB)
- `The_Fallout.mp3` (2.8 MB → ~360 KB)

### Image Optimization (Save ~40 MB)

**Convert to WebP:**
```powershell
# Using cwebp
cwebp -q 85 input.png -o output.webp
```

**High-priority images (largest):**
- [ ] `mech3.png` (3.0 MB → ~300 KB with WebP)
- [ ] `earth_card.png` (3.2 MB → ~320 KB)
- [ ] `meteor-card.png` (3.2 MB → ~320 KB)
- [ ] `cards-back.png` (2.7 MB → ~270 KB)
- [ ] All card images (28 files, ~60 MB total → ~6 MB)
- [ ] All avatar images (12 files, ~18 MB → ~2 MB)

**Actions:**
- [ ] Create WebP versions with fallback
- [ ] Implement lazy loading for off-screen images
- [ ] Use CSS sprites for small icons
- [ ] Consider SVG for card backs and frames

---

## Phase 2: Code Optimization (Save ~100-200 KB)

### Bundle Analysis
```bash
npm run build:analyze
```

**Actions:**
- [ ] Remove unused dependencies
- [ ] Implement code splitting by route
- [ ] Lazy load heavy components (BackstoryViewer, Tutorial, etc.)
- [ ] Tree-shake unused exports
- [ ] Use production React build

### Code Splitting Example
```javascript
// Instead of:
import BackstoryViewer from './components/BackstoryViewer';

// Use:
const BackstoryViewer = React.lazy(() => import('./components/BackstoryViewer'));
```

---

## Phase 3: WebAssembly Integration (C++)

### Why Use C++ for Game Logic?

**Performance Benefits:**
- **3-10x faster** execution for game logic
- Near-native performance for calculations
- Smaller binary size than equivalent JS
- Better memory management

**Current JS Logic to Move:**
1. ✅ Card game engine (already in C++)
2. ✅ Battle resolution
3. ✅ AI decision making
4. Element interaction calculations
5. Score tracking
6. Deck management

### Implementation Steps

#### 1. Compile C++ to WebAssembly

**Install Emscripten:**
```bash
# Windows
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
emsdk install latest
emsdk activate latest
```

**Build Script (`scripts/build-wasm.ps1`):**
```powershell
# Compile card_game.cpp to WASM
emcc server/card_game.cpp `
    -o public/game-engine.js `
    -s WASM=1 `
    -s EXPORTED_FUNCTIONS="['_createRoom', '_joinRoom', '_playCard', '_getGameState']" `
    -s EXPORTED_RUNTIME_METHODS="['ccall', 'cwrap']" `
    -s MODULARIZE=1 `
    -s EXPORT_NAME="GameEngine" `
    -O3 `
    --closure 1

Write-Host "✓ WASM module built successfully"
```

#### 2. Create WASM Wrapper Service

**`src/services/WasmGameEngine.js`:**
```javascript
class WasmGameEngine {
  constructor() {
    this.module = null;
    this.initialized = false;
  }

  async initialize() {
    const GameEngine = await import('../../public/game-engine.js');
    this.module = await GameEngine.default();
    
    // Wrap C++ functions
    this.createRoom = this.module.cwrap('createRoom', 'string', ['number']);
    this.joinRoom = this.module.cwrap('joinRoom', 'number', ['string', 'string', 'string']);
    this.playCard = this.module.cwrap('playCard', 'number', ['string', 'string', 'number']);
    this.getGameState = this.module.cwrap('getGameState', 'string', ['string']);
    
    this.initialized = true;
    return this;
  }

  createGameRoom(maxPlayers = 2) {
    if (!this.initialized) throw new Error('WASM not initialized');
    return this.createRoom(maxPlayers);
  }

  // ... more wrapper methods
}

export default new WasmGameEngine();
```

#### 3. Integrate into React

**`src/components/Game.js`:**
```javascript
import { useEffect, useState } from 'react';
import WasmGameEngine from '../services/WasmGameEngine';

function Game() {
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    WasmGameEngine.initialize().then(() => {
      setEngineReady(true);
      console.log('Game engine loaded');
    });
  }, []);

  const handlePlayCard = (cardIndex) => {
    if (!engineReady) return;
    
    // Use C++ game logic instead of JS
    const result = WasmGameEngine.playCard(roomId, playerId, cardIndex);
    const newState = WasmGameEngine.getGameState(roomId);
    
    updateGameState(JSON.parse(newState));
  };

  // ...
}
```

### Expected Benefits

**Size Reduction:**
- C++ game logic compiled to WASM: ~50-100 KB
- Remove equivalent JS code: ~150-200 KB
- **Net savings: ~100 KB**

**Performance Improvement:**
- Game logic execution: **5-10x faster**
- AI calculations: **3-8x faster**
- Battle resolution: **Instant** (< 1ms)
- Smoother animations and interactions

**Code Maintainability:**
- Single source of truth for game rules
- Type-safe game logic
- Easier to test and debug
- Can reuse for native mobile apps

---

## Phase 4: Advanced Optimizations

### Service Worker & Caching
- [ ] Implement aggressive caching strategy
- [ ] Cache audio/images separately
- [ ] Use IndexedDB for large assets
- [ ] Implement update strategy

### Progressive Loading
- [ ] Show game shell immediately
- [ ] Load critical assets first
- [ ] Defer non-critical features
- [ ] Show loading progress

### CDN & Compression
- [ ] Serve assets via CDN
- [ ] Enable Brotli compression
- [ ] Use HTTP/2 push
- [ ] Implement resource hints (preload, prefetch)

---

## Implementation Priority

### Week 1: Quick Wins
1. ✅ Audio compression (25 MB saved)
2. ✅ Image optimization (40 MB saved)
3. Code splitting (200 KB saved)

### Week 2: WASM Integration
1. Setup Emscripten toolchain
2. Create WASM build script
3. Implement wrapper service
4. Integrate with React components
5. Test performance improvements

### Week 3: Polish
1. Service worker optimization
2. Progressive loading
3. Performance testing
4. Deploy optimized build

---

## Measurement & Validation

### Before Optimization
- Total size: 96.87 MB
- Load time: ~15-30s (on slow 3G)
- First Contentful Paint: ~8s

### Target After Optimization
- Total size: < 20 MB (79% reduction)
- Load time: < 5s (on slow 3G)
- First Contentful Paint: < 2s

### Tools
```bash
# Build and analyze
npm run build:analyze

# Lighthouse audit
npm install -g lighthouse
lighthouse http://localhost:3000 --view

# Bundle size analysis
npm install -g webpack-bundle-analyzer
```

---

## Notes

- Keep original high-res assets in `src/assets/original/` for future use
- Test WebP fallbacks for Safari < 14
- Consider progressive JPEGs for photos
- Use CSS animations instead of JS where possible
- Implement virtualization for long lists

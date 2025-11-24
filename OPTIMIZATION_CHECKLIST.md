# Optimization Checklist

## Phase 1: Asset Optimization

### Audio Files (30.21 MB → ~6 MB)
- [ ] Figuring_it_All_Out.mp3 (4.8 MB)
- [ ] Strange_Dealings_Afoot.mp3 (4.7 MB)
- [ ] Cooler_Heads_Prevail.mp3 (4.3 MB)
- [ ] Under_Cover_of_the_Myst.mp3 (4.1 MB)
- [ ] Treat_or_Trick.mp3 (4.0 MB)
- [ ] At_the_End_of_All_Things.mp3 (3.4 MB)
- [ ] The_Fallout.mp3 (2.8 MB)

**Tool**: Use https://www.freeconvert.com/audio-compressor
**Settings**: 96kbps bitrate, Opus or OGG format

### Image Files (62.79 MB → ~15 MB)
- [ ] mech3.png (3.0 MB)
- [ ] earth_card.png (3.2 MB)
- [ ] meteor-card.png (3.2 MB)
- [ ] cards-back.png (2.7 MB)
- [ ] All card images (~40 files)
- [ ] All avatar images (~12 files)

**Tool**: Use https://squoosh.app
**Settings**: WebP format, quality 85

## Phase 2: Code Optimization

### Lazy Loading
- [ ] Implement React.lazy() for BackstoryViewer
- [ ] Implement React.lazy() for Tutorial components
- [ ] Implement React.lazy() for Story mode
- [ ] Add Suspense boundaries

### Build Configuration
- [ ] Run: npm run build:production
- [ ] Verify source maps disabled
- [ ] Check bundle size with: npm run build:analyze

## Phase 3: WebAssembly (Advanced)

- [ ] Install Emscripten SDK
- [ ] Run: .\scripts\build-wasm.ps1
- [ ] Test WASM game engine
- [ ] Integrate with React components

## Expected Results

**Current**: 96.87 MB
**Target**: ~18-20 MB (79% reduction)
**Load Time**: 15-30s → 3-5s (on slow 3G)

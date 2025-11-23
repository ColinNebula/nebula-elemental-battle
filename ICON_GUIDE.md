# PWA Icon Setup Guide

## Current Issue
The React logo appears when adding the app to your mobile home screen because `logo192.png` and `logo512.png` are still the default React icons.

## Quick Fix: Replace Icons

### Required Icon Sizes
You need to replace these files in the `/public` folder:

1. **logo192.png** - 192x192 pixels (Android, iOS)
2. **logo512.png** - 512x512 pixels (Android splash screen)
3. **apple-touch-icon.png** - 180x180 pixels (iOS home screen)
4. **favicon.ico** - 16x16, 32x32, 64x64 pixels (browser tab)

### Design Recommendations

**Icon Design Ideas:**
- Use one of your card elements (fire, water, lightning)
- Use the mech image (`mech3.png`)
- Create a stylized logo with game title
- Use elemental symbols combined

**Design Guidelines:**
- Simple and recognizable at small sizes
- High contrast colors
- No text (or minimal, large text only)
- Solid background color matching theme (#0f0c29)
- Center the main icon element

### Option 1: Use Existing Asset (Quick)

You can use the mech image or one of your card images:
```bash
# Use image editor to resize mech3.png to:
# - 192x192 → save as logo192.png
# - 512x512 → save as logo512.png
# - 180x180 → save as apple-touch-icon.png
```

### Option 2: Generate from Single Image (Recommended)

Use online tools like:
- **Favicon.io** (https://favicon.io/favicon-converter/)
- **RealFaviconGenerator** (https://realfavicongenerator.net/)
- **PWA Asset Generator** (https://github.com/elegantapp/pwa-asset-generator)

**Steps:**
1. Create/choose a 512x512 px source image (PNG with transparent background)
2. Upload to RealFaviconGenerator
3. Download generated package
4. Replace files in `/public` folder

### Option 3: Use NPM Package

Install and use pwa-asset-generator:
```bash
npm install --global pwa-asset-generator

# Generate all icons from a single source image
pwa-asset-generator source-icon.png ./public --icon-only --favicon --type png
```

### Files to Replace

```
public/
├── favicon.ico          # Browser tab icon
├── logo192.png          # Android/iOS icon (192x192)
├── logo512.png          # Android splash (512x512)
├── apple-touch-icon.png # iOS home screen (180x180)
└── logo.svg             # Browser icon (SVG, optional)
```

## After Replacing Icons

1. **Clear browser cache**
   - Chrome DevTools → Application → Clear storage
   - Or use incognito mode

2. **Rebuild the app**
   ```bash
   npm run build
   ```

3. **Test PWA**
   - Serve production build: `npx serve -s build`
   - Open DevTools → Application → Manifest
   - Verify icons appear correctly

4. **Deploy**
   ```bash
   npm run deploy
   ```

5. **Test on mobile**
   - Clear mobile browser cache
   - Visit site in browser
   - Add to home screen
   - Check icon displays correctly

## Quick Icon Creation in GIMP/Photoshop

1. Create new image: 512x512 px, transparent background
2. Add gradient background (#0f0c29 to #302b63)
3. Add centered element (card, mech, or symbol)
4. Save as PNG
5. Resize copies: 192x192, 180x180, 64x64
6. Convert smallest to .ico format for favicon.ico

## Color Scheme (from app)
- Background: #0f0c29
- Gradient end: #302b63
- Theme color: #0f0c29
- Accent: Use element colors (fire = #f44336, water = #2196f3, etc.)

## Verification Checklist

- [ ] Icons replaced in `/public` folder
- [ ] All sizes generated (192, 512, 180, favicon)
- [ ] Manifest.json references correct files
- [ ] App rebuilt (`npm run build`)
- [ ] Tested in browser DevTools → Application → Manifest
- [ ] Deployed to GitHub Pages
- [ ] Tested on mobile device
- [ ] Icon appears on home screen (not React logo)
- [ ] Splash screen looks good (Android)

## Note

Until you replace these icon files, the React logo will continue to appear. The game itself works perfectly, but custom branding requires custom icons!

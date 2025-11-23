# Update App Icons Guide

## Current Issue
Some logo files (logo192.png, logo512.png) appear to be default React logos showing on mobile devices.

## Quick Fix Options

### Option 1: Use Online Icon Generator (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload `public/nebulamedia.png` or a custom game logo
3. Download the generated icon pack
4. Replace files in `public/` folder:
   - favicon.ico
   - logo72.png
   - logo96.png
   - logo128.png
   - logo144.png
   - logo152.png
   - logo180.png
   - logo192.png
   - logo384.png
   - logo512.png
   - apple-touch-icon.png

### Option 2: Manual Image Editing
Use image editing software to resize your brand logo:
- 72x72, 96x96, 128x128, 144x144, 152x152, 180x180
- 192x192, 384x384, 512x512

### Option 3: Use ImageMagick (Command Line)
```powershell
# Install ImageMagick
choco install imagemagick

# Generate all sizes
$sizes = @(72, 96, 128, 144, 152, 180, 192, 384, 512)
foreach ($size in $sizes) {
    magick public/nebulamedia.png -resize ${size}x${size} public/logo${size}.png
}

# Generate favicon
magick public/nebulamedia.png -resize 32x32 public/favicon.ico
```

## Files That Need Custom Icons
- ✅ `public/logo72.png` - 72x72 app icon
- ✅ `public/logo96.png` - 96x96 app icon
- ✅ `public/logo128.png` - 128x128 app icon
- ✅ `public/logo144.png` - 144x144 app icon
- ✅ `public/logo152.png` - 152x152 app icon
- ✅ `public/logo180.png` - 180x180 app icon
- ⚠️ `public/logo192.png` - 192x192 PWA icon (likely React logo)
- ✅ `public/logo384.png` - 384x384 app icon
- ⚠️ `public/logo512.png` - 512x512 PWA icon (likely React logo)
- ✅ `public/favicon.ico` - Browser favicon
- ✅ `public/apple-touch-icon.png` - Apple device icon

## Quick Test
After updating, clear browser cache and check:
1. Mobile home screen icon after "Add to Home Screen"
2. Browser tab icon
3. PWA splash screen

## References
- PWA Icon Requirements: https://web.dev/add-manifest/
- Apple Touch Icon Guide: https://developer.apple.com/design/human-interface-guidelines/app-icons

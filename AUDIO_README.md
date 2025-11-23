# 🎵 Audio Optimization Guide

Reduce music file size from **103MB to ~32MB** (70% smaller) while keeping great audio quality!

## Quick Compression Guide

### Step 1: Install ffmpeg
Choose one method:
```powershell
# Option A: Chocolatey
choco install ffmpeg

# Option B: winget  
winget install ffmpeg

# Option C: Download from https://ffmpeg.org/download.html
```

### Step 2: Run Compression Script
```powershell
.\scripts\compress-audio.ps1
```

This will:
- ✅ Backup original files to `public/audio-backup/`
- ✅ Compress from 320kbps → 96kbps (optimal for game music)
- ✅ Reduce size by ~70% with minimal quality loss
- ✅ Keep files in repository for deployment

## Music Files - Size Comparison

| File Name | Original | Compressed (96kbps) | Savings |
|-----------|----------|---------------------|---------|

| Burnt_Out_Space_Hulk.mp3 | 13.4 MB | ~4.0 MB | 70% |
| Battle_of_the_Pixelated_Cyborgs.mp3 | 11.5 MB | ~3.5 MB | 70% |
| At_the_End_of_All_Things.mp3 | 6.3 MB | ~1.9 MB | 70% |
| When_You_Risk_it_All.mp3 | 10.2 MB | ~3.1 MB | 70% |
| Sunrise_in_Megalopolis.mp3 | 9.0 MB | ~2.7 MB | 70% |
| Figuring_it_All_Out.mp3 | 8.8 MB | ~2.6 MB | 70% |
| Further_Investigation.mp3 | 8.8 MB | ~2.6 MB | 70% |
| Cooler_Heads_Prevail.mp3 | 8.0 MB | ~2.4 MB | 70% |
| Strange_Dealings_Afoot.mp3 | 7.4 MB | ~2.2 MB | 70% |
| Treat_or_Trick.mp3 | 7.1 MB | ~2.1 MB | 70% |
| Under_Cover_of_the_Myst.mp3 | 7.0 MB | ~2.1 MB | 70% |
| Boss_Battle_Loop_1.mp3 | 3.1 MB | ~0.9 MB | 71% |
| The_Fallout.mp3 | 2.5 MB | ~0.8 MB | 68% |
| **TOTAL** | **~103 MB** | **~31 MB** | **~70%** |

## Deployment Options

### ✅ Option 1: Compressed Files (Recommended)
- Run compression script above
- Commit compressed MP3s to repository
- **Best for GitHub Pages** - under 100MB file limit
- Great audio quality for game music
- Total app size: ~35MB

### Option 2: Git LFS (Full Quality)
```bash
git lfs install
git lfs track "*.mp3"
git add .gitattributes public/*.mp3
git commit -m "Track audio with Git LFS"
```
- Keeps original 320kbps quality
- Uses Git LFS bandwidth/storage
- Good for professional deployments

### Option 3: External CDN
- Upload MP3s to cloud storage (AWS S3, Cloudflare R2)
- Update sound loading URLs in code
- Best for high-traffic sites
- Additional hosting cost

### Option 4: No Music
- Current state - music files gitignored
- Smallest download: ~5MB
- All sound effects still work (procedural)

## Testing Compressed Audio

1. Run: `.\scripts\compress-audio.ps1`
2. Start game: `npm start`
3. Test music in different scenes
4. Compare with backups in `public/audio-backup/`
5. If satisfied, commit and deploy!

## Quality Guide

- **96kbps stereo**: Recommended for game music - great quality, small size
- **64kbps**: Acceptable if you need even smaller files
- **128kbps**: Overkill for background music, wastes bandwidth
- **320kbps**: Original quality, unnecessarily large for web games

## Important Notes

- ✅ Game works perfectly without music (procedural sound effects)
- ✅ Compression script creates backups automatically
- ✅ 96kbps is ideal for game background music
- ✅ GitHub Pages supports up to 100MB per file
- ⚠️ After compression, remove backups before deployment

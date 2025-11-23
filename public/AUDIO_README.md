# 🎵 Audio Files Notice

The background music files have been excluded from the repository to reduce the download size.

## Current Status

**Without Music Files:** ~5MB download  
**With Music Files:** ~105MB download

## Music Files (Optional)

The following music files are optional and not included in the repository:

- `At_the_End_of_All_Things.mp3` (6.3 MB)
- `Battle_of_the_Pixelated_Cyborgs.mp3` (11.5 MB)
- `Boss_Battle_Loop_1.mp3` (3.1 MB)
- `Burnt_Out_Space_Hulk.mp3` (13.4 MB)
- `Cooler_Heads_Prevail.mp3` (8.0 MB)
- `Figuring_it_All_Out.mp3` (8.8 MB)
- `Further_Investigation.mp3` (8.8 MB)
- `Strange_Dealings_Afoot.mp3` (7.4 MB)
- `Sunrise_in_Megalopolis.mp3` (9.0 MB)
- `The_Fallout.mp3` (2.5 MB)
- `Treat_or_Trick.mp3` (7.1 MB)
- `Under_Cover_of_the_Myst.mp3` (7.0 MB)
- `When_You_Risk_it_All.mp3` (10.2 MB)

**Total:** ~103 MB

## How to Add Music (Optional)

If you want to include background music:

1. Download the music pack from [releases page]
2. Extract to `public/` directory
3. Music will automatically load when available

## Alternative: Streaming

For production deployments, consider:
- Hosting music files on a CDN
- Streaming from external services
- Using browser's built-in audio capabilities

## Game Functionality

The game works perfectly without music files:
- ✅ All sound effects work (procedurally generated)
- ✅ All gameplay features functional
- ✅ UI interactions have audio feedback
- ❌ Background music disabled when files not present

## For Developers

Music files are gitignored to keep repository lightweight. The sound manager automatically detects missing files and disables music playback gracefully.

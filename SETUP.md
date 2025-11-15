# Nebula Elemental Battle - Setup Guide

## Quick Start

### Prerequisites
- Node.js 16+ and npm 8+
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nebula-elemental-battle.git
   cd nebula-elemental-battle
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment (optional)**
   ```bash
   cp .env.example .env
   # Edit .env if you want to customize settings
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Game runs entirely in the browser (no backend needed!)

## Build for Production

```bash
npm run build
```

The optimized build will be in the `build/` directory.

## Project Structure

```
nebula/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── services/    # Game logic & mock backend
│   └── utils/       # Helper functions
├── .env.example     # Environment template
└── README.md        # Main documentation
```

## Configuration Options

Edit `.env` file:

- `REACT_APP_MOCK_BACKEND=true` - Run without server (default)
- `REACT_APP_ENABLE_AI_OPPONENTS=true` - Enable AI personalities
- `REACT_APP_DEBUG_MODE=false` - Console logging
- `REACT_APP_ENABLE_DONATIONS=false` - Show donation banner

## Troubleshooting

### Port already in use
```bash
# Change port in .env
PORT=3001
```

### Dependencies issues
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build issues
```bash
npm run security:audit
npm run security:fix
```

## Development

- `npm start` - Development server with hot reload
- `npm test` - Run test suite
- `npm run build` - Production build
- `npm run lint` - Check code style
- `npm run lint:fix` - Auto-fix code style

## Features

- ✨ Single-player vs AI with 10 unique personalities
- 📖 Story mode with 9 stages
- 🎨 Theme shop with seasonal themes
- 🃏 11 elemental types with unique abilities
- 💾 LocalStorage persistence (themes, progress, stats)
- 📱 PWA support (install as app)
- 🎮 Keyboard shortcuts support
- ⚡ No backend required - runs entirely in browser

## Optional: Backend Server

The game includes optional server files for multiplayer (future feature):
- Files: `*-server.js` in root directory
- Not required for single-player mode
- Currently experimental

To run with server:
```bash
npm run dev
```

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers supported

## License

MIT - See LICENSE file for details

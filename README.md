# 🎮 Nebula Elemental Battle

<div align="center">

![Nebula Elemental Battle](https://img.shields.io/badge/Nebula-Elemental%20Battle-667eea?style=for-the-badge&logo=gamepad&logoColor=white)

**An immersive strategic card battle game featuring elemental powers, AI opponents, story mode, and advanced gameplay mechanics**

[![Play Now](https://img.shields.io/badge/🎮%20PLAY%20NOW-Live%20Game-4caf50?style=for-the-badge)](https://colinnebula.github.io/nebula-elemental-battle/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://reactjs.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-blue.svg)](#progressive-web-app)
[![Security](https://img.shields.io/badge/Security-Hardened-brightgreen.svg)](#security)

*Created by **Colin Nebula** for **[Nebula 3D Development](https://www.nebula3ddev.com)***

</div>

---

## 💖 Support This Project

If you enjoy **Nebula Elemental Battle**, please consider supporting its development! Your donations help cover hosting costs, enable new features, and keep the game free for everyone.

<div align="center">

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/colinnebula)
[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/ColinNebula)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/colinnebula)

**Every contribution, no matter how small, makes a difference! ❤️**

</div>

---

## 📖 Table of Contents

- [Play Online](#-play-online)
- [Features](#-features)
- [Game Mechanics](#-game-mechanics)
- [Getting Started](#-getting-started)
- [Controls](#-controls)
- [Advanced Systems](#-advanced-systems)
- [Accessibility](#-accessibility)
- [Technical Details](#-technical-details)
- [Development](#-development)
- [Security](#-security)
- [Contributing](#-contributing)
- [Credits](#-credits)
- [License](#-license)

---

## 🎯 Play Online

**🌐 Live Game**: [https://colinnebula.github.io/nebula-elemental-battle/](https://colinnebula.github.io/nebula-elemental-battle/)

- ✅ **No installation required** - Play instantly in your browser
- ✅ **Cross-platform** - Works on desktop, tablet, and mobile
- ✅ **Offline capable** - Install as a Progressive Web App
- ✅ **Free forever** - No ads, no paywalls

---

## ✨ Features

### 🎮 Game Modes

| Mode | Description |
|------|-------------|
| **Story Mode** | Battle through 20 progressive stages with unique opponents and challenges |
| **VS AI** | Face off against AI opponents with 10 distinct personalities |
| **Strategic Mode** | Advanced tactical gameplay with mana, weather, and terrain systems |
| **Quick Match** | Jump straight into battle with a random AI opponent |

### ⚔️ Elements & Combat

**10 Elemental Types** with unique abilities and interactions:

| Element | Icon | Special Ability |
|---------|------|-----------------|
| Fire | 🔥 | Apply burn (3 damage/turn for 4 turns) |
| Ice | ❄️ | Freeze opponent (skip 1 turn) |
| Water | 💧 | Grant 5 HP shield |
| Earth | 🌍 | Gain barrier (immune to debuffs for 2 turns) |
| Electricity | ⚡ | Deal 3 bonus damage |
| Nature | 🌿 | Heal 3 HP |
| Light | ✨ | Cleanse all debuffs |
| Dark | 🌑 | Apply weakness (-2 strength for 3 turns) |
| Technology | 🔧 | Grant 3 shield |
| Power | 💪 | Gain +3 strength for 2 turns |

### 🧠 AI Opponents

**10 Unique AI Personalities**:
- **Aggressive** - High-risk offensive play
- **Defensive** - Shield-focused protection
- **Balanced** - Adaptable strategy
- **Strategic** - Long-term planning
- **Random** - Unpredictable chaos
- **Combo Master** - Element-matching specialist
- **Counter Player** - Reactive strategy
- **Power Player** - High-strength focus
- **Adaptive** - Learning opponent patterns
- **Elemental Master** - Single-element mastery

### 💥 Status Effects System

**20+ Buffs & Debuffs**:
- **Buffs**: Strength boost, shields, regeneration, barriers, piercing, critical strike, reflect
- **Debuffs**: Weakness, burn, freeze, stun, poison, bleed, curse, confusion, silence, vulnerability

### 🎴 Power-Ups & Items

- **Rare Cards** - Phoenix Rebirth, Earthquake, Time Warp, and more
- **Consumables** - Potions, boosters, and tactical items
- **Equipment** - Persistent upgrades (weapons, armor, accessories)
- **Currency System** - Earn gold from victories to purchase items

### 🎨 Customization

**20+ Visual Themes**: Classic, Cyberpunk, Forest, Ocean, Desert, Volcano, Ice Kingdom, Neon City, Space, Steampunk, Gothic, Candy Land, and more!

**Player Profile**: Level system, avatar customization, title unlocking, and comprehensive statistics tracking.

### 📱 Progressive Web App

- **Installable** on mobile and desktop
- **Offline play** with full functionality
- **Fast loading** with service worker caching
- **Responsive design** for all screen sizes

---

## 🎲 Game Mechanics

### Element Strengths & Weaknesses

| Element | Strong Against | Weak Against |
|---------|---------------|--------------|
| 🔥 Fire | ❄️ Ice, 🌿 Nature | 💧 Water, 🌍 Earth |
| ❄️ Ice | 💧 Water, 🌿 Nature | 🔥 Fire, ⚡ Electricity |
| 💧 Water | 🔥 Fire, 🌍 Earth | ❄️ Ice, ⚡ Electricity |
| 🌍 Earth | ⚡ Electricity, 🔥 Fire | 💧 Water, 🌿 Nature |
| ⚡ Electricity | 💧 Water, ❄️ Ice | 🌍 Earth, 🌑 Dark |
| 🌿 Nature | 💧 Water, 🌍 Earth | 🔥 Fire, ❄️ Ice |
| ✨ Light | 🌑 Dark, 🌿 Nature | 🔧 Technology, 💪 Power |
| 🌑 Dark | ✨ Light, ⚡ Electricity | 🌿 Nature, ✨ Light |
| 🔧 Technology | ✨ Light, 🌑 Dark | ⚡ Electricity, 💪 Power |
| 💪 Power | 🔧 Technology, 🌍 Earth | ✨ Light, 🌑 Dark |

### Scoring System

- **Base Score**: Card strength value (1-10)
- **Element Advantage**: +2 bonus when strong against opponent
- **Match Bonus**: +1 for consecutive matching elements
- **Special Abilities**: Additional effects and damage
- **Status Effects**: Ongoing modifiers

---

## 🚀 Getting Started

### Play Online (Recommended)

1. Visit [https://colinnebula.github.io/nebula-elemental-battle/](https://colinnebula.github.io/nebula-elemental-battle/)
2. Click **"VS AI"** or **"Story Mode"**
3. Select your starting cards
4. Battle!

### Local Development

```bash
# Clone the repository
git clone https://github.com/ColinNebula/nebula-elemental-battle.git
cd nebula-elemental-battle

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build    # Create optimized build
npm run deploy   # Deploy to GitHub Pages
```

---

## ⌨️ Controls

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1-5` | Play cards from hand (positions 1-5) |
| `S` | Open Settings |
| `T` | Open Tutorial |
| `P` | Open Statistics |
| `I` | Open Inventory |
| `ESC` | Close overlays / Pause game |

### Mouse/Touch

- **Click/Tap Card**: Play card during your turn
- **Hover Card**: View details and keyboard shortcut

---

## 🎯 Advanced Systems

### Strategic Mode

**Strategic Mode** adds tactical depth with three core systems:

**💎 Mana System**
- Cards cost 1-6 mana based on power
- Mana regenerates +1 per turn (max 10)
- Strategic resource management required

**🌦️ Weather Effects**
- 8 weather types: Clear, Rain, Storm, Drought, Blizzard, Windstorm, Fog, Eclipse
- Changes every 2-4 rounds
- Element-specific modifiers (±1 to ±3 strength)

**🏔️ Terrain Advantages**
- 9 terrain types with element bonuses
- +2 strength to matching elements
- Strategic terrain-deck synergy

---

## ♿ Accessibility

### Colorblind Support
- **Protanopia** (Red-blind)
- **Deuteranopia** (Green-blind)
- **Tritanopia** (Blue-blind)
- **Achromatopsia** (Total colorblind)

### Visual Adjustments
- High contrast mode (WCAG AAA compliant)
- Adjustable text size (4 options)
- Element icon/text labels toggle

### Input Support
- Full keyboard navigation
- ARIA labels for screen readers
- Compatible with NVDA, JAWS, VoiceOver, TalkBack

---

## 🔧 Technical Details

### Tech Stack

- **Frontend**: React 19.2.0
- **Styling**: CSS3 with animations
- **State**: React Hooks
- **Storage**: LocalStorage
- **PWA**: Service Workers
- **Build**: Create React App
- **Deployment**: GitHub Pages

### Project Structure

```
nebula-elemental-battle/
├── public/              # Static assets & PWA files
├── src/
│   ├── components/      # React components (25+)
│   ├── services/        # Game logic engine
│   └── utils/           # AI, animations, themes, etc.
├── server/              # Optional C++ backend
└── build/               # Production build
```

### Data Persistence

All data stored locally via `localStorage`:
- Game settings & preferences
- Player profile & statistics
- Inventory (cards, items, equipment)
- Story progress & theme unlocks

---

## 🔒 Security

### Security Features
- Input validation with sanitization
- Rate limiting on API endpoints
- Security headers with Helmet.js
- XSS and CSRF protection
- Debug protection in production

### Reporting Vulnerabilities

**Do NOT create public issues for security vulnerabilities.**

Email: security@nebula3ddev.com

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

Response time: Within 24 hours

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Quick Start

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'feat: add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- Use functional React components with hooks
- Follow existing code style
- Add comments for complex logic
- Ensure responsive design
- Test accessibility features

### Security Requirements

- Never commit sensitive data (API keys, credentials)
- Validate all user inputs
- Run `npm run security:audit` before submitting

---

## 🏆 Credits

### Created By

**Colin Nebula** - [Nebula 3D Development](https://www.nebula3ddev.com)
- Full-stack game development
- UI/UX design
- Systems architecture

### Technologies

React • Node.js • Express • CSS3 Animations • PWA APIs • LocalStorage

### Open Source Libraries

React 19.2.0 • Express 4.21.2 • Helmet 7.1.0 • Express Rate Limit 7.1.5

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

| Resource | Link |
|----------|------|
| 🎮 **Play Game** | [colinnebula.github.io/nebula-elemental-battle](https://colinnebula.github.io/nebula-elemental-battle/) |
| 📂 **GitHub** | [github.com/ColinNebula/nebula-elemental-battle](https://github.com/ColinNebula/nebula-elemental-battle) |
| 🌐 **Website** | [nebula3ddev.com](https://www.nebula3ddev.com) |
| 🐛 **Report Issues** | [GitHub Issues](https://github.com/ColinNebula/nebula-elemental-battle/issues) |

---

<div align="center">

## 💖 Support Development

**If you enjoy this game, please consider supporting its continued development!**

[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/colinnebula)
[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-GitHub-ea4aaa?style=for-the-badge&logo=github-sponsors&logoColor=white)](https://github.com/sponsors/ColinNebula)

**Your support helps keep this game free and enables new features! ⭐**

---

**Developed with ❤️ by Colin Nebula for Nebula 3D Development**

*Thank you for playing! 🎮*

</div>

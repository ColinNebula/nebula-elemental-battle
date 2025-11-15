# 🎮 Nebula Elemental Battle

> **A sophisticated multiplayer card battle game with AI opponents, story mode, and elemental strategy**

*Created by **Developer Colin Nebula** for **Nebula 3D Dev***

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Security](https://img.shields.io/badge/Security-Hardened-brightgreen.svg)](#security)

## Features

### C++ Backend
- Game room management (create/join rooms)
- Standard 52-card deck with shuffle
- Turn-based multiplayer (2-4 players)
- TCP server with multi-threading
- Game state validation

### React Frontend
- Lobby system for room management
- Real-time game board
- Visual card components
- Player status display
- Responsive UI

## Getting Started

### Quick Start (No C++ Required)

```bash
npm install
npm run dev
```

This runs in **mock mode** - test the game immediately without building C++!
- React app: http://localhost:3000
- Proxy server: http://localhost:3001

To use the actual C++ game server:

#### Windows
```powershell
cd server
mkdir build
cd build
cmake ..
cmake --build .
.\Debug\card_game_server.exe
```

#### Linux/Mac
```bash
cd server
mkdir build
cd build
cmake ..
make
./card_game_server
```

Then run:
```bash
npm run dev
```

The proxy server will automatically detect and use the C++ server on port 8080.

1. Start the C++ server
2. Launch React app in browser
3. Enter your name and create/join a room
4. Wait for 2-4 players
5. Host starts the game
6. Play cards when it's your turn

## Game Protocol

Commands the C++ server accepts:
- `CREATE_ROOM` - Create new game room
- `JOIN_ROOM <roomId> <playerId> <playerName>` - Join room
- `START_GAME <roomId>` - Start game (deals 5 cards)
- `PLAY_CARD <roomId> <playerId> <cardIndex>` - Play a card
- `GET_STATE <roomId>` - Get game state (JSON)

## Project Structure

```
nebula/
├── server/              # C++ backend
│   ├── card_game.h      # Game logic header
│   ├── card_game.cpp    # Game implementation
## Troubleshooting

**Server won't start:**
- Check if port 8080 is in use
- Verify firewall settings (Windows)

**React can't connect:**
- Ensure C++ server is running
- Check connection address in App.js

**Build errors:**
- Verify CMake and C++ compiler installation
- Ensure C++17 support enabled

## Learn More

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)
- [CMake documentation](https://cmake.org/documentation/)
```bash
cd server
mkdir build
cd build
cmake ..
make
./card_game_server
```

Server runs on port **8080**.

### Run React Frontend

```bash
npm install
npm start
```

App opens at [http://localhost:3000](http://localhost:3000)

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

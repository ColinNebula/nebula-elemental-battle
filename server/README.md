# Card Game Server (C++)

## Building the Server

### Windows
```bash
mkdir build
cd build
cmake ..
cmake --build .
```

### Linux/Mac
```bash
mkdir build
cd build
cmake ..
make
```

## Running the Server
```bash
# From the build directory
./card_game_server  # Linux/Mac
card_game_server.exe  # Windows
```

Server will run on port 8080.

## Protocol

Commands sent to the server:
- `CREATE_ROOM` - Creates a new game room
- `JOIN_ROOM <roomId> <playerId> <playerName>` - Join a room
- `START_GAME <roomId>` - Start the game
- `PLAY_CARD <roomId> <playerId> <cardIndex>` - Play a card
- `GET_STATE <roomId>` - Get current game state

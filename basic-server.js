const express = require('express');

const app = express();
const PORT = 3011; // Use a completely different port

// Game state
const gameState = {
  rooms: {},
  nextRoomId: 1
};

// Simple CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Generate basic cards
function makeCards(count) {
  const elements = ['FIRE', 'WATER', 'EARTH', 'POWER'];
  const cards = [];
  for (let i = 0; i < count; i++) {
    cards.push({
      element: elements[Math.floor(Math.random() * elements.length)],
      strength: Math.floor(Math.random() * 6) + 2, // 2-7 strength
      id: Date.now() + '_' + i
    });
  }
  return cards;
}

// Basic command processing
function processCommand(cmd) {
  const parts = cmd.split(' ');
  const action = parts[0];

  switch (action) {
    case 'CREATE_ROOM':
      const id = `room_${gameState.nextRoomId++}`;
      gameState.rooms[id] = {
        roomId: id,
        players: [],
        gameStarted: false,
        gameOver: false,
        winner: null
      };
      return { type: 'ROOM_CREATED', roomId: id };

    case 'JOIN_ROOM':
      const [, roomId, playerId, playerName] = parts;
      const room = gameState.rooms[roomId];
      if (room && !room.gameStarted) {
        // Add human player
        if (room.players.length === 0) {
          room.players.push({
            id: playerId,
            name: playerName,
            score: 0,
            hand: [],
            active: true,
            isAI: false,
            chosenCard: null
          });
        }
        
        // Add AI
        if (room.players.length === 1) {
          room.players.push({
            id: 'ai',
            name: 'Computer',
            score: 0,
            hand: [],
            active: false,
            isAI: true,
            chosenCard: null
          });
        }
        
        return { type: 'JOIN_RESULT', success: true };
      }
      return { type: 'JOIN_RESULT', success: false };

    case 'START_GAME':
      const [, startId] = parts;
      const startRoom = gameState.rooms[startId];
      if (startRoom && startRoom.players.length >= 2) {
        startRoom.gameStarted = true;
        startRoom.players.forEach(p => {
          p.hand = makeCards(5);
          p.cardCount = 5;
        });
        return { type: 'GAME_STARTED', success: true, ...startRoom };
      }
      return { type: 'GAME_STARTED', success: false };

    case 'CHOOSE_CARD':
      const [, chooseId, , cardIdx] = parts;
      const chooseRoom = gameState.rooms[chooseId];
      if (chooseRoom && chooseRoom.gameStarted) {
        const player = chooseRoom.players[0];
        const ai = chooseRoom.players[1];
        
        if (player && player.active && player.hand.length > cardIdx) {
          // Player plays
          player.chosenCard = player.hand[cardIdx];
          player.hand.splice(cardIdx, 1);
          player.active = false;
          
          // AI plays
          setTimeout(() => {
            ai.active = true;
            setTimeout(() => {
              if (ai.hand.length > 0) {
                const aiIdx = Math.floor(Math.random() * ai.hand.length);
                ai.chosenCard = ai.hand[aiIdx];
                ai.hand.splice(aiIdx, 1);
                ai.active = false;
                
                // Battle
                setTimeout(() => {
                  if (player.chosenCard.strength > ai.chosenCard.strength) {
                    player.score++;
                  } else if (ai.chosenCard.strength > player.chosenCard.strength) {
                    ai.score++;
                  }
                  
                  // Check end
                  if (player.hand.length === 0 && ai.hand.length === 0) {
                    chooseRoom.gameOver = true;
                    chooseRoom.winner = player.score > ai.score ? player.name : 'Computer';
                  } else {
                    // Next round
                    setTimeout(() => {
                      player.chosenCard = null;
                      ai.chosenCard = null;
                      player.active = true;
                    }, 2000);
                  }
                }, 500);
              }
            }, 2000);
          }, 500);
          
          return { type: 'CARD_CHOSEN', success: true };
        }
      }
      return { type: 'CARD_CHOSEN', success: false };

    case 'GET_STATE':
      const [, getId] = parts;
      return gameState.rooms[getId] || { error: 'Not found' };

    default:
      return { type: 'OK' };
  }
}

// Routes
app.post('/api/command', (req, res) => {
  console.log('API:', req.body.command);
  const result = processCommand(req.body.command);
  res.json(result);
});

app.get('/api/health', (req, res) => {
  console.log('Health check');
  res.json({ status: 'ok', port: PORT });
});

// Start
try {
  app.listen(PORT, () => {
    console.log(`🎮 Game API ready on :${PORT}`);
  });
} catch (err) {
  console.error('Start error:', err);
}
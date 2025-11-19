const express = require('express');

const app = express();
const PORT = 3010;

// Game state
let gameState = {
  rooms: {},
  nextRoomId: 1
};

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

// Enhanced card generation
function generateRandomCards(count) {
  const elements = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'POWER', 'LIGHT', 'DARK'];
  const cards = [];
  
  for (let i = 0; i < count; i++) {
    cards.push({
      element: elements[Math.floor(Math.random() * elements.length)],
      strength: Math.floor(Math.random() * 8) + 3, // 3-10 strength
      id: `card_${Date.now()}_${i}`
    });
  }
  
  return cards;
}

// Simple AI card selection
function selectAICard(hand) {
  if (!hand || hand.length === 0) return 0;
  
  // AI prefers higher strength cards with some randomness
  const scores = hand.map((card, index) => ({
    index,
    score: card.strength + Math.random() * 3
  }));
  
  scores.sort((a, b) => b.score - a.score);
  return scores[0].index;
}

// Enhanced command handler
function handleCommand(command) {
  console.log('Processing command:', command);
  
  const parts = command.split(' ');
  const action = parts[0];

  try {
    switch (action) {
      case 'CREATE_ROOM':
        const roomId = `room_${gameState.nextRoomId++}`;
        gameState.rooms[roomId] = {
          roomId,
          players: [],
          gameStarted: false,
          gameOver: false,
          roundsPlayed: 0,
          currentTurn: 0,
          lastWinner: null
        };
        return { type: 'ROOM_CREATED', roomId };

      case 'JOIN_ROOM':
        const [, joinRoomId, playerId, playerName] = parts;
        const room = gameState.rooms[joinRoomId];
        if (room && room.players.length < 2 && !room.gameStarted) {
          // Add human player
          room.players.push({
            id: playerId,
            name: playerName,
            score: 0,
            cardCount: 5,
            active: room.players.length === 0,
            isAI: false,
            hand: [],
            chosenCard: null
          });
          
          // Add AI player
          if (room.players.length === 1) {
            room.players.push({
              id: 'ai_player',
              name: 'AI Opponent',
              score: 0,
              cardCount: 5,
              active: false,
              isAI: true,
              hand: [],
              chosenCard: null
            });
          }
          
          return { type: 'JOIN_RESULT', success: true };
        }
        return { type: 'JOIN_RESULT', success: false };

      case 'START_GAME':
        const [, startRoomId] = parts;
        const startRoom = gameState.rooms[startRoomId];
        if (startRoom && startRoom.players.length >= 2) {
          startRoom.gameStarted = true;
          
          // Give each player cards
          startRoom.players.forEach(player => {
            player.hand = generateRandomCards(5);
            player.cardCount = 5;
          });
          
          return { type: 'GAME_STARTED', success: true, ...startRoom };
        }
        return { type: 'GAME_STARTED', success: false };

      case 'CHOOSE_CARD':
        const [, chooseRoomId, choosePlayerId, cardIndex] = parts;
        const chooseRoom = gameState.rooms[chooseRoomId];
        if (chooseRoom && chooseRoom.gameStarted && !chooseRoom.gameOver) {
          const player = chooseRoom.players.find(p => p.id === choosePlayerId);
          
          if (player && player.active && player.hand.length > parseInt(cardIndex)) {
            // Player chooses card
            player.chosenCard = player.hand[parseInt(cardIndex)];
            player.hand.splice(parseInt(cardIndex), 1);
            player.cardCount--;
            player.active = false;
            
            // AI turn
            const aiPlayer = chooseRoom.players.find(p => p.isAI);
            if (aiPlayer && aiPlayer.hand.length > 0) {
              setTimeout(() => {
                aiPlayer.active = true;
                
                setTimeout(() => {
                  const aiChoice = selectAICard(aiPlayer.hand);
                  aiPlayer.chosenCard = aiPlayer.hand[aiChoice];
                  aiPlayer.hand.splice(aiChoice, 1);
                  aiPlayer.cardCount--;
                  aiPlayer.active = false;
                  
                  // Resolve round
                  setTimeout(() => {
                    const playerCard = chooseRoom.players[0].chosenCard;
                    const aiCard = chooseRoom.players[1].chosenCard;
                    
                    if (playerCard && aiCard) {
                      // Simple combat: higher strength wins
                      let playerStrength = playerCard.strength;
                      let aiStrength = aiCard.strength;
                      
                      // Element bonus: FIRE > ICE, WATER > FIRE, ICE > WATER
                      if (playerCard.element === 'FIRE' && aiCard.element === 'ICE') playerStrength += 2;
                      if (playerCard.element === 'WATER' && aiCard.element === 'FIRE') playerStrength += 2;
                      if (playerCard.element === 'ICE' && aiCard.element === 'WATER') playerStrength += 2;
                      if (aiCard.element === 'FIRE' && playerCard.element === 'ICE') aiStrength += 2;
                      if (aiCard.element === 'WATER' && playerCard.element === 'FIRE') aiStrength += 2;
                      if (aiCard.element === 'ICE' && playerCard.element === 'WATER') aiStrength += 2;
                      
                      if (playerStrength > aiStrength) {
                        chooseRoom.players[0].score++;
                        chooseRoom.lastWinner = chooseRoom.players[0].name;
                      } else if (aiStrength > playerStrength) {
                        chooseRoom.players[1].score++;
                        chooseRoom.lastWinner = chooseRoom.players[1].name;
                      } else {
                        chooseRoom.lastWinner = 'Tie';
                      }
                      
                      chooseRoom.roundsPlayed++;
                      
                      // Check if game is over
                      const bothOutOfCards = chooseRoom.players.every(p => p.hand.length === 0);
                      if (bothOutOfCards) {
                        chooseRoom.gameOver = true;
                        if (chooseRoom.players[0].score > chooseRoom.players[1].score) {
                          chooseRoom.winner = chooseRoom.players[0].name;
                        } else if (chooseRoom.players[1].score > chooseRoom.players[0].score) {
                          chooseRoom.winner = chooseRoom.players[1].name;
                        } else {
                          chooseRoom.winner = 'Tie Game';
                        }
                      } else {
                        // Next round
                        setTimeout(() => {
                          // Clear chosen cards for next round
                          chooseRoom.players.forEach(p => p.chosenCard = null);
                          chooseRoom.players[0].active = true;
                        }, 3000);
                      }
                    }
                  }, 500);
                }, 3000);
              }, 1000);
            }
            
            return { type: 'CARD_CHOSEN', success: true };
          }
        }
        return { type: 'CARD_CHOSEN', success: false };

      case 'FORFEIT_TURN':
        const [, forfeitRoomId, forfeitPlayerId] = parts;
        const forfeitRoom = gameState.rooms[forfeitRoomId];
        if (forfeitRoom && forfeitRoom.gameStarted && !forfeitRoom.gameOver) {
          const forfeitPlayer = forfeitRoom.players.find(p => p.id === forfeitPlayerId);
          
          if (forfeitPlayer && forfeitPlayer.active) {
            forfeitPlayer.active = false;
            
            // AI wins the round
            const aiPlayer = forfeitRoom.players.find(p => p.isAI);
            if (aiPlayer) {
              aiPlayer.score++;
              forfeitRoom.roundsPlayed++;
              forfeitRoom.lastWinner = aiPlayer.name;
              
              setTimeout(() => {
                forfeitRoom.players[0].active = true;
              }, 2000);
            }
            
            return { type: 'TURN_FORFEITED', success: true };
          }
        }
        return { type: 'TURN_FORFEITED', success: false };

      case 'GET_STATE':
        const [, stateRoomId] = parts;
        const stateRoom = gameState.rooms[stateRoomId];
        if (stateRoom) {
          return { ...stateRoom };
        }
        return { error: 'Room not found' };

      default:
        return { type: 'SUCCESS', message: 'Command processed' };
    }
  } catch (error) {
    console.error('Command processing error:', error);
    return { type: 'ERROR', message: error.message };
  }
}

// API endpoints
app.post('/api/command', (req, res) => {
  console.log('✅ API command received:', req.body);
  
  try {
    const result = handleCommand(req.body.command);
    res.json(result);
  } catch (error) {
    console.error('❌ Command error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  console.log('🩺 Health check requested');
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    rooms: Object.keys(gameState.rooms).length
  });
});

app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.send('Stable API server working!');
});

// Start server with error handling
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Failed to start API server:', err);
    process.exit(1);
  }
  console.log(`🎮 Stable API Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints: /api/command, /api/health, /test`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
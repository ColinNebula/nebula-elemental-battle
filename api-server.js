const express = require('express');

const app = express();
const PORT = 3010; // Backend server port for proxy

// AI Personalities
const AI_PERSONALITIES = {
  CHAOS: {
    name: 'Chaos',
    avatar: '🌪️',
    difficulty: 'Hard',
    aggressiveness: 0.9,
    conservativeness: 0.1,
    counterPriority: 0.8,
    preferredElements: ['FIRE', 'METEOR', 'ELECTRICITY']
  },
  EMBER: {
    name: 'Ember',
    avatar: '🔥',
    difficulty: 'Easy',
    aggressiveness: 0.8,
    conservativeness: 0.2,
    counterPriority: 0.4,
    preferredElements: ['FIRE', 'EARTH', 'POWER']
  }
};

// AI card selection logic
function selectAICard(hand, personalityKey) {
  if (!hand || hand.length === 0) return 0;
  
  const personality = AI_PERSONALITIES[personalityKey] || AI_PERSONALITIES.CHAOS;
  
  // Score each card based on AI personality
  const scores = hand.map((card, index) => {
    let score = card.strength;
    
    // Prefer certain elements
    if (personality.preferredElements.includes(card.element)) {
      score += 2;
    }
    
    // Aggressiveness: prefer higher strength cards
    if (personality.aggressiveness > 0.5) {
      score += card.strength * 0.3;
    }
    
    return { index, score, card };
  });
  
  // Sort by score (highest first)
  scores.sort((a, b) => b.score - a.score);
  
  // Pick from top choices with some randomness
  const topChoices = scores.slice(0, Math.max(1, Math.ceil(scores.length * 0.6)));
  const selected = topChoices[Math.floor(Math.random() * topChoices.length)];
  
  return selected.index;
}

// Game state
let gameState = {
  rooms: {},
  nextRoomId: 1
};

// Card generation system
function generateElementalCards(count) {
  const elements = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'POWER', 'LIGHT', 'DARK', 'NEUTRAL', 'TECHNOLOGY', 'METEOR'];
  const cards = [];
  
  // Card tiers with strength ranges
  const tiers = {
    'COMMON': { min: 1, max: 5, chance: 0.50 },
    'UNCOMMON': { min: 4, max: 8, chance: 0.30 },
    'RARE': { min: 7, max: 11, chance: 0.15 },
    'LEGENDARY': { min: 10, max: 15, chance: 0.05 }
  };
  
  let legendaryCount = 0;
  const maxLegendary = 1; // Max 1 legendary per deck
  
  for (let i = 0; i < count; i++) {
    // Determine tier based on weighted chance
    const roll = Math.random();
    let tier = 'COMMON';
    let cumulativeChance = 0;
    
    for (const [tierName, tierData] of Object.entries(tiers)) {
      cumulativeChance += tierData.chance;
      if (roll <= cumulativeChance) {
        tier = tierName;
        break;
      }
    }
    
    // Limit legendary cards to 1 per deck
    if (tier === 'LEGENDARY' && legendaryCount >= maxLegendary) {
      tier = 'RARE';
    }
    
    if (tier === 'LEGENDARY') {
      legendaryCount++;
    }
    
    const tierData = tiers[tier];
    const element = elements[Math.floor(Math.random() * elements.length)];
    const strength = Math.floor(Math.random() * (tierData.max - tierData.min + 1)) + tierData.min;
    
    const card = {
      element: element,
      strength: strength,
      tier: tier,
      isLegendary: tier === 'LEGENDARY',
      id: `card_${Date.now()}_${i}`
    };
    
    // Add special ability for NEUTRAL cards
    if (element === 'NEUTRAL') {
      card.neutralAbility = Math.random() > 0.5 ? 'COPY' : 'BOOST';
    }
    
    // Add special abilities for TECHNOLOGY cards
    if (element === 'TECHNOLOGY') {
      card.techAbility = Math.random() > 0.5 ? 'SHIELD' : 'CREATE';
      card.shield = 0;
    }
    
    cards.push(card);
  }
  
  return cards;
}

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

// Comprehensive command handler
function handleCommand(command) {
  console.log('Processing command:', command);
  
  const parts = command.split(' ');
  const action = parts[0];

  switch (action) {
    case 'CREATE_ROOM':
      const aiPersonalityKey = parts[1] || 'CHAOS';
      const roomId = `room_${gameState.nextRoomId++}`;
      
      gameState.rooms[roomId] = {
        roomId,
        aiPersonality: aiPersonalityKey,
        players: [],
        gameStarted: false,
        gameOver: false,
        roundsPlayed: 0,
        currentPlayer: 0,
        playedCards: [],
        cardSelectionPhase: false,
        lastMatchBonus: null,
        pendingAbility: null,
        modifiers: [],
        graveyard: { player: [], ai: [] },
        elementCounters: {
          FIRE: ['ICE', 'EARTH'],
          ICE: ['WATER', 'ELECTRICITY'],
          WATER: ['FIRE', 'LIGHT'],
          ELECTRICITY: ['EARTH', 'WATER'],
          EARTH: ['ELECTRICITY', 'DARK'],
          POWER: ['LIGHT'],
          LIGHT: ['DARK'],
          DARK: ['POWER'],
          TECHNOLOGY: ['FIRE', 'ICE', 'WATER'],
          METEOR: ['EARTH'],
          NEUTRAL: []
        }
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
          totalStrength: 0,
          cardCount: 0,
          active: room.players.length === 0,
          isAI: false,
          hand: [],
          chosenCard: null,
          playedCards: [],
          deck: [],
          selectedHand: false,
          fatigueDamage: 0,
          lastPlayedElement: null
        });
        
        // Auto-add AI player
        if (room.players.length === 1) {
          const aiPersonality = AI_PERSONALITIES[room.aiPersonality] || AI_PERSONALITIES.CHAOS;
          
          room.players.push({
            id: 'ai_player',
            name: aiPersonality.name,
            avatar: aiPersonality.avatar,
            personalityKey: room.aiPersonality,
            score: 0,
            totalStrength: 0,
            cardCount: 0,
            active: false,
            isAI: true,
            hand: [],
            chosenCard: null,
            playedCards: [],
            deck: [],
            selectedHand: false,
            fatigueDamage: 0,
            lastPlayedElement: null
          });
        }
        
        return { type: 'JOIN_RESULT', success: true };
      }
      return { type: 'JOIN_RESULT', success: false };

    case 'START_GAME':
      const [, startRoomId] = parts;
      const startRoom = gameState.rooms[startRoomId];
      if (startRoom && startRoom.players.length >= 2) {
        startRoom.cardSelectionPhase = true;
        startRoom.gameStarted = false;
        
        // Deal 10 cards to each player for selection
        startRoom.players.forEach(player => {
          player.cardCount = 10;
          player.hand = generateElementalCards(10);
          
          // AI auto-selects first 5 cards
          if (player.isAI) {
            player.deck = player.hand.splice(5);
            player.cardCount = 5;
            player.selectedHand = true;
          }
        });
        
        // Check if all players have selected
        if (startRoom.players.every(p => p.selectedHand)) {
          startRoom.cardSelectionPhase = false;
          startRoom.gameStarted = true;
          startRoom.roundsPlayed = 0;
          startRoom.players.forEach((p, idx) => {
            p.active = idx === 0;
          });
        }
        
        return { type: 'GAME_STARTED', success: true, ...startRoom };
      }
      return { type: 'GAME_STARTED', success: false };

    case 'SELECT_CARDS':
      const [, selectRoomId, selectPlayerId, ...selectedIndices] = parts;
      const selectRoom = gameState.rooms[selectRoomId];
      if (selectRoom && selectRoom.cardSelectionPhase) {
        const player = selectRoom.players.find(p => p.id === selectPlayerId);
        if (player && !player.selectedHand && selectedIndices.length === 5) {
          // Get selected cards
          const indices = selectedIndices.map(i => parseInt(i)).sort((a, b) => b - a);
          const selectedCards = [];
          indices.forEach(idx => {
            if (idx >= 0 && idx < player.hand.length) {
              selectedCards.unshift(player.hand.splice(idx, 1)[0]);
            }
          });
          
          player.deck = player.hand;
          player.hand = selectedCards;
          player.cardCount = 5;
          player.selectedHand = true;
          
          // Check if all players have selected
          if (selectRoom.players.every(p => p.selectedHand)) {
            selectRoom.cardSelectionPhase = false;
            selectRoom.gameStarted = true;
            selectRoom.roundsPlayed = 0;
            selectRoom.players.forEach((p, idx) => {
              p.active = idx === 0;
            });
          }
          
          return { type: 'CARDS_SELECTED', success: true, ...selectRoom };
        }
      }
      return { type: 'CARDS_SELECTED', success: false };

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
          
          player.playedCards.push(player.chosenCard);
          player.totalStrength += player.chosenCard.strength;
          
          // Activate AI turn
          const aiPlayer = chooseRoom.players.find(p => p.isAI);
          if (aiPlayer && aiPlayer.hand.length > 0) {
            setTimeout(() => {
              aiPlayer.active = true;
              
              setTimeout(() => {
                const aiChoice = selectAICard(aiPlayer.hand, aiPlayer.personalityKey);
                aiPlayer.chosenCard = aiPlayer.hand[aiChoice];
                aiPlayer.hand.splice(aiChoice, 1);
                aiPlayer.cardCount--;
                aiPlayer.active = false;
                
                aiPlayer.playedCards.push(aiPlayer.chosenCard);
                aiPlayer.totalStrength += aiPlayer.chosenCard.strength;
                
                // Resolve round
                setTimeout(() => {
                  if (chooseRoom.players[0].chosenCard && chooseRoom.players[1].chosenCard) {
                    let card1 = chooseRoom.players[0].chosenCard;
                    let card2 = chooseRoom.players[1].chosenCard;
                    
                    let card1Strength = card1.strength;
                    let card2Strength = card2.strength;
                    
                    // Element counter system
                    const counters = chooseRoom.elementCounters;
                    if (counters[card1.element]?.includes(card2.element)) {
                      card1Strength += 3;
                      card1.isCounter = true;
                    }
                    if (counters[card2.element]?.includes(card1.element)) {
                      card2Strength += 3;
                      card2.isCounter = true;
                    }
                    
                    // Score the round
                    if (card1Strength > card2Strength) {
                      chooseRoom.players[0].score++;
                    } else if (card2Strength > card1Strength) {
                      chooseRoom.players[1].score++;
                    }
                    
                    // Move cards to graveyard
                    chooseRoom.graveyard.player.push(card1);
                    chooseRoom.graveyard.ai.push(card2);
                    
                    chooseRoom.roundsPlayed++;
                    
                    // Check if game is over
                    const bothOutOfCards = chooseRoom.players.every(p => p.hand.length === 0);
                    if (bothOutOfCards) {
                      chooseRoom.gameOver = true;
                      if (chooseRoom.players[0].score > chooseRoom.players[1].score) {
                        chooseRoom.winner = chooseRoom.players[0].name;
                      } else {
                        chooseRoom.winner = chooseRoom.players[1].name;
                      }
                    } else {
                      setTimeout(() => {
                        chooseRoom.players[0].active = true;
                      }, 5000);
                    }
                  }
                }, 500);
              }, 4000);
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
          
          // AI wins by default
          const aiPlayer = forfeitRoom.players.find(p => p.isAI);
          if (aiPlayer) {
            forfeitRoom.players[1].score++;
            forfeitRoom.roundsPlayed++;
            
            setTimeout(() => {
              if (forfeitRoom.players[0]) forfeitRoom.players[0].active = true;
            }, 2000);
          }
          
          return { type: 'TURN_FORFEITED', success: true };
        }
      }
      return { type: 'TURN_FORFEITED', success: false };

    case 'GET_STATE':
      const [, stateRoomId] = parts;
      const stateRoom = gameState.rooms[stateRoomId] || { error: 'Room not found' };
      return stateRoom;

    default:
      return { type: 'SUCCESS', message: 'Command processed' };
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
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Start server
app.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Failed to start API server:', err);
    process.exit(1);
  }
  console.log(`🔗 API Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at /api/command and /api/health`);
  console.log(`🎮 Make sure React app uses this port for API calls`);
});
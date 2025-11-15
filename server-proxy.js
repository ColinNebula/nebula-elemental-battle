const express = require('express');
const cors = require('cors');
const net = require('net');

// Try to require AI personalities with error handling
let AI_PERSONALITIES, selectAICard;
try {
  const aiModule = require('./server/aiPersonalities');
  AI_PERSONALITIES = aiModule.AI_PERSONALITIES;
  selectAICard = aiModule.selectAICard;
  console.log('✅ AI personalities loaded successfully');
} catch (error) {
  console.warn('⚠️ Could not load AI personalities:', error.message);
  // Fallback simple AI
  AI_PERSONALITIES = {
    CHAOS: { name: 'Chaos', avatar: '🌪️', difficulty: 'Hard' }
  };
  selectAICard = (hand) => Math.floor(Math.random() * hand.length);
}

const app = express();
const PORT = 3002; // Back to original port
const CPP_SERVER_HOST = 'localhost';
const CPP_SERVER_PORT = 8080;

app.use(cors());
app.use(express.json());

// Mock game state for testing without C++ server
let mockGameState = {
  rooms: {},
  nextRoomId: 1
};

function sendToCppServer(command) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    let responseData = '';

    client.connect(CPP_SERVER_PORT, CPP_SERVER_HOST, () => {
      client.write(command);
    });

    client.on('data', (data) => {
      responseData += data.toString();
    });

    client.on('end', () => {
      try {
        const jsonResponse = JSON.parse(responseData);
        resolve(jsonResponse);
      } catch (error) {
        resolve({ type: 'RESPONSE', data: responseData });
      }
    });

    client.on('error', (error) => {
      reject(error);
    });

    // Set timeout
    setTimeout(() => {
      client.destroy();
      reject(new Error('Timeout'));
    }, 5000);
  });
}

// Mock implementation for testing without C++ server
function handleCommandMock(command) {
  const parts = command.split(' ');
  const action = parts[0];

  switch (action) {
    case 'CREATE_ROOM':
      // parts[1] is optional AI personality key (e.g., CREATE_ROOM EMBER)
      const aiPersonalityKey = parts[1] || 'CHAOS';
      const roomId = `room_${mockGameState.nextRoomId++}`;
      
      // Generate random game modifiers (30% chance each)
      const possibleModifiers = [
        { name: 'DOUBLE_STRENGTH', description: 'All cards have double strength', active: Math.random() < 0.3 },
        { name: 'ELEMENTAL_CHAOS', description: 'Random element bonuses each round', active: Math.random() < 0.3 },
        { name: 'LEGENDARY_RAIN', description: 'Higher legendary card drop rate', active: Math.random() < 0.3 },
        { name: 'SPEED_BATTLE', description: 'Reduced turn timer (15s)', active: Math.random() < 0.3 },
        { name: 'WILD_MAGIC', description: 'Neutral cards are more powerful', active: Math.random() < 0.3 }
      ];
      
      const activeModifiers = possibleModifiers.filter(m => m.active);
      
      mockGameState.rooms[roomId] = {
        roomId,
        aiPersonality: aiPersonalityKey, // Store AI personality for this room
        players: [],
        gameStarted: false,
        gameOver: false,
        roundsPlayed: 0,
        currentPlayer: 0,
        playedCards: [], // Track all played cards by round
        cardSelectionPhase: false, // New phase for selecting starting cards
        lastMatchBonus: null, // Track if last round had matching elements
        pendingAbility: null, // Track pending special abilities
        modifiers: activeModifiers, // Game modifiers for this match
        boostedElement: null, // For ELEMENTAL_CHAOS modifier
        graveyard: { player: [], ai: [] }, // Cards that have been played (for revival)
        meteorAttacks: { player1: 0, player2: 0 }, // Track meteor attacks per player
        elementCounters: {
          FIRE: ['ICE', 'EARTH'],
          ICE: ['WATER', 'ELECTRICITY'],
          WATER: ['FIRE', 'LIGHT'],
          ELECTRICITY: ['EARTH', 'WATER'],
          EARTH: ['ELECTRICITY', 'DARK'],
          POWER: ['LIGHT'],
          LIGHT: ['DARK'],
          DARK: ['POWER'],
          TECHNOLOGY: ['FIRE', 'ICE', 'WATER'], // Technology counters natural elements
          METEOR: ['EARTH'], // Meteor specifically targets Earth
          NEUTRAL: []
        }
      };
      return { type: 'ROOM_CREATED', roomId, modifiers: activeModifiers };

    case 'JOIN_ROOM':
      const [, joinRoomId, playerId, playerName] = parts;
      const room = mockGameState.rooms[joinRoomId];
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
          playedCards: [], // All cards played by this player
          deck: [], // Unused cards in reserve
          selectedHand: false, // Track if player has selected their starting 5 cards
          fatigueDamage: 0, // Track cumulative fatigue damage
          lastPlayedElement: null // Track last element for card evolution
        });
        
        // Auto-add AI player
        if (room.players.length === 1) {
          // Default AI personality (can be customized later)
          const aiPersonalityKey = room.aiPersonality || 'CHAOS';
          const aiPersonality = AI_PERSONALITIES[aiPersonalityKey] || AI_PERSONALITIES.CHAOS;
          
          room.players.push({
            id: 'ai_player',
            name: aiPersonality.name,
            avatar: aiPersonality.avatar,
            personalityKey: aiPersonalityKey,
            score: 0,
            totalStrength: 0,
            cardCount: 0,
            active: false,
            isAI: true,
            hand: [],
            chosenCard: null,
            playedCards: [], // All cards played by this player
            deck: [], // Unused cards in reserve
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
      const startRoom = mockGameState.rooms[startRoomId];
      if (startRoom && startRoom.players.length >= 2) {
        startRoom.cardSelectionPhase = true;
        startRoom.gameStarted = false; // Don't start game until cards are selected
        // Deal 10 elemental cards to each player for selection
        startRoom.players.forEach(player => {
          player.cardCount = 10;
          player.hand = generateElementalCards(10);
          // AI auto-selects first 5 cards, rest go to deck
          if (player.isAI) {
            player.deck = player.hand.splice(5);
            player.cardCount = 5;
            player.selectedHand = true;
          }
        });
        
        // Check if all players have selected (in case only AI players)
        if (startRoom.players.every(p => p.selectedHand)) {
          startRoom.cardSelectionPhase = false;
          startRoom.gameStarted = true;
          startRoom.roundsPlayed = 0;
          // Activate the first player and deactivate others
          startRoom.players.forEach((p, idx) => {
            p.active = idx === 0; // Only first player is active
          });
        }
        
        // Return the full game state immediately
        return { type: 'GAME_STARTED', success: true, ...startRoom };
      }
      return { type: 'GAME_STARTED', success: false };

    case 'SELECT_CARDS':
      const [, selectRoomId, selectPlayerId, ...selectedIndices] = parts;
      const selectRoom = mockGameState.rooms[selectRoomId];
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
          
          // Remaining cards go to deck
          player.deck = player.hand;
          player.hand = selectedCards;
          player.cardCount = 5;
          player.selectedHand = true;
          
          // Check if all players have selected
          if (selectRoom.players.every(p => p.selectedHand)) {
            selectRoom.cardSelectionPhase = false;
            selectRoom.gameStarted = true;
            selectRoom.roundsPlayed = 0;
            // Activate the first player (human player) and deactivate others
            selectRoom.players.forEach((p, idx) => {
              p.active = idx === 0; // Only first player is active
            });
          }
          
          // Return the updated game state
          return { type: 'CARDS_SELECTED', success: true, ...selectRoom };
        }
      }
      return { type: 'CARDS_SELECTED', success: false };

    case 'CHOOSE_CARD':
      const [, chooseRoomId, choosePlayerId, cardIndex] = parts;
      const chooseRoom = mockGameState.rooms[chooseRoomId];
      if (chooseRoom && chooseRoom.gameStarted && !chooseRoom.gameOver) {
        const player = chooseRoom.players.find(p => p.id === choosePlayerId);
        
        // Check if player has no cards - skip their turn
        if (player && player.active && player.hand.length === 0) {
          player.active = false;
          
          // Activate AI immediately
          const aiPlayer = chooseRoom.players.find(p => p.isAI);
          if (aiPlayer && aiPlayer.hand.length > 0) {
            setTimeout(() => {
              aiPlayer.active = true;
            }, 1000);
            
            setTimeout(() => {
              const aiChoice = selectAICard(aiPlayer.hand, aiPlayer.personalityKey, chooseRoom);
              aiPlayer.chosenCard = aiPlayer.hand[aiChoice];
              aiPlayer.hand.splice(aiChoice, 1);
              aiPlayer.cardCount--;
              aiPlayer.active = false;
              
              aiPlayer.playedCards.push(aiPlayer.chosenCard);
              aiPlayer.totalStrength += aiPlayer.chosenCard.strength;
              
              if (aiPlayer.chosenCard.element === 'POWER') {
                const aiPowerCardIndices = aiPlayer.hand
                  .map((card, idx) => card.element === 'POWER' ? idx : -1)
                  .filter(idx => idx !== -1);
                
                if (aiPowerCardIndices.length > 0) {
                  const randomAIPowerIdx = aiPowerCardIndices[Math.floor(Math.random() * aiPowerCardIndices.length)];
                  const additionalAIPowerCard = aiPlayer.hand[randomAIPowerIdx];
                  aiPlayer.playedCards.push(additionalAIPowerCard);
                  aiPlayer.totalStrength += additionalAIPowerCard.strength;
                  aiPlayer.hand.splice(randomAIPowerIdx, 1);
                  aiPlayer.cardCount--;
                }
              }
              
              // AI wins by default
              setTimeout(() => {
                chooseRoom.players[1].score++;
                chooseRoom.roundsPlayed++;
                
                // Check if both players are out of cards
                const bothOutOfCards = chooseRoom.players.every(p => p.hand.length === 0);
                if (bothOutOfCards) {
                  chooseRoom.gameOver = true;
                  // Calculate total strength from all played cards
                  const player1TotalStrength = (chooseRoom.players[0].playedCards || []).reduce((sum, card) => 
                    sum + (card.modifiedStrength || card.strength || 0), 0);
                  const player2TotalStrength = (chooseRoom.players[1].playedCards || []).reduce((sum, card) => 
                    sum + (card.modifiedStrength || card.strength || 0), 0);
                  
                  if (player1TotalStrength > player2TotalStrength) {
                    chooseRoom.winner = chooseRoom.players[0].name;
                  } else if (player2TotalStrength > player1TotalStrength) {
                    chooseRoom.winner = chooseRoom.players[1].name;
                  } else {
                    chooseRoom.winner = 'Tie';
                  }
                } else {
                  setTimeout(() => {
                    // Just activate next turn, keep cards visible in playedCards
                    if (chooseRoom.players[0]) chooseRoom.players[0].active = true;
                  }, 5000);
                }
              }, 500);
            }, 5000);
          } else if (!aiPlayer || aiPlayer.hand.length === 0) {
            // Both players out of cards, end game
            chooseRoom.roundsPlayed++;
            const bothOutOfCards = player.hand.length === 0 && (!aiPlayer || aiPlayer.hand.length === 0);
            if (bothOutOfCards) {
              chooseRoom.gameOver = true;
              // Calculate total strength from all played cards
              const player1TotalStrength = (chooseRoom.players[0].playedCards || []).reduce((sum, card) => 
                sum + (card.modifiedStrength || card.strength || 0), 0);
              const player2TotalStrength = (chooseRoom.players[1].playedCards || []).reduce((sum, card) => 
                sum + (card.modifiedStrength || card.strength || 0), 0);
              
              if (player1TotalStrength > player2TotalStrength) {
                chooseRoom.winner = chooseRoom.players[0].name;
              } else if (player2TotalStrength > player1TotalStrength) {
                chooseRoom.winner = chooseRoom.players[1].name;
              } else {
                chooseRoom.winner = 'Tie';
              }
            }
          }
          
          return { type: 'CARD_CHOSEN', success: true };
        }
        
        if (player && player.active && player.hand.length > parseInt(cardIndex)) {
          // Check if player is frozen (ICE ability)
          if (player.frozen) {
            player.frozen = false; // Unfreeze for next turn
            player.active = false;
            
            // Skip turn, activate AI immediately
            const aiPlayer = chooseRoom.players.find(p => p.isAI);
            if (aiPlayer) {
              setTimeout(() => {
                aiPlayer.active = true;
              }, 1000);
            }
            
            return { type: 'CARD_CHOSEN', success: false, message: 'You are frozen! Turn skipped.' };
          }
          
          // Player chooses card
          player.chosenCard = player.hand[parseInt(cardIndex)];
          player.hand.splice(parseInt(cardIndex), 1);
          player.cardCount--;
          player.active = false;
          
          // Immediately add player's card to played cards history
          player.playedCards.push(player.chosenCard);
          // Add card strength to running total
          player.totalStrength += player.chosenCard.strength;
          
          // Check if a POWER (star) card was played - copy opponent's last played card
          if (player.chosenCard.element === 'POWER') {
            const opponent = chooseRoom.players.find(p => p.id !== choosePlayerId);
            if (opponent && opponent.playedCards && opponent.playedCards.length > 0) {
              // Copy the opponent's last played card
              const lastOpponentCard = opponent.playedCards[opponent.playedCards.length - 1];
              const copiedCard = { ...lastOpponentCard, isCopy: true };
              
              // Add the copied card to played cards
              player.playedCards.push(copiedCard);
              player.totalStrength += copiedCard.strength;
            }
          }
          
          // Check for EARTH card special ability
          if (player.chosenCard.element === 'EARTH' && player.deck && player.deck.length > 0) {
            chooseRoom.pendingAbility = {
              type: 'DRAW_FROM_RESERVE',
              playerId: choosePlayerId,
              playerName: player.name,
              timestamp: Date.now()
            };
          }
          
          // Activate AI turn after 1 second
          const aiPlayer = chooseRoom.players.find(p => p.isAI);
          console.log('Player played card. AI player found:', !!aiPlayer, 'AI hand length:', aiPlayer?.hand?.length);
          
          if (aiPlayer) {
            console.log('Setting timeout for AI activation...');
            setTimeout(() => {
              console.log('AI timeout triggered. Checking conditions...');
              
              // Check if AI is frozen (ICE ability)
              if (aiPlayer.frozen) {
                console.log('AI is frozen, skipping turn');
                aiPlayer.frozen = false; // Unfreeze for next turn
                aiPlayer.active = false;
                // Skip AI turn, resolve round immediately
                setTimeout(() => {
                  if (chooseRoom.players[0].chosenCard) {
                    // AI skipped, player wins by default
                    chooseRoom.players[0].score++;
                    
                    // Move player's card to graveyard
                    const playerCard = chooseRoom.players[0].chosenCard;
                    chooseRoom.graveyard.player.push(playerCard);
                    
                    // Clear chosen cards
                    chooseRoom.players[0].chosenCard = null;
                    chooseRoom.roundsPlayed++;
                    
                    // Check if game is over
                    const bothOutOfCards = chooseRoom.players.every(p => p.hand.length === 0);
                    if (bothOutOfCards) {
                      chooseRoom.gameOver = true;
                      if (chooseRoom.players[0].score > chooseRoom.players[1].score) {
                        chooseRoom.winner = chooseRoom.players[0].name;
                      } else {
                        chooseRoom.winner = chooseRoom.players[1].name; // AI wins on tie or AI lead
                      }
                    } else {
                      // Activate next turn
                      setTimeout(() => {
                        if (chooseRoom.players[0]) chooseRoom.players[0].active = true;
                      }, 3000);
                    }
                  }
                }, 500);
                return;
              }
              
              // Check if AI has no cards - skip turn and resolve round
              if (aiPlayer.hand.length === 0) {
                console.log('AI has no cards, skipping turn');
                aiPlayer.active = false;
                setTimeout(() => {
                  if (chooseRoom.players[0].chosenCard) {
                    // AI has no card, player wins by default
                    chooseRoom.players[0].score++;
                    chooseRoom.roundsPlayed++;
                    
                    // Check if both players are out of cards
                    const bothOutOfCards = chooseRoom.players.every(p => p.hand.length === 0);
                    if (bothOutOfCards) {
                      chooseRoom.gameOver = true;
                      // Calculate total strength from all played cards
                      const player1TotalStrength = (chooseRoom.players[0].playedCards || []).reduce((sum, card) => 
                        sum + (card.modifiedStrength || card.strength || 0), 0);
                      const player2TotalStrength = (chooseRoom.players[1].playedCards || []).reduce((sum, card) => 
                        sum + (card.modifiedStrength || card.strength || 0), 0);
                      
                      if (player1TotalStrength > player2TotalStrength) {
                        chooseRoom.winner = chooseRoom.players[0].name;
                      } else if (player2TotalStrength > player1TotalStrength) {
                        chooseRoom.winner = chooseRoom.players[1].name;
                      } else {
                        chooseRoom.winner = 'Tie';
                      }
                    } else {
                      setTimeout(() => {
                        // Just activate next turn, keep cards visible in playedCards
                        if (chooseRoom.players[0]) chooseRoom.players[0].active = true;
                      }, 5000);
                    }
                  }
                }, 500);
                return;
              }
              
              // Set AI as active and wait for "PLAYER 2 TURN" display
              console.log('AI has cards, activating AI turn. Cards in hand:', aiPlayer.hand.length);
              aiPlayer.active = true;
              
              // AI plays after 4 more seconds (showing "PLAYER 2 TURN")
              setTimeout(() => {
                console.log('AI attempting to play card. Hand length:', aiPlayer.hand.length, 'Personality:', aiPlayer.personalityKey);
                try {
                  const aiChoice = selectAICard(aiPlayer.hand, aiPlayer.personalityKey, chooseRoom);
                  console.log('AI selected card index:', aiChoice, 'from hand of', aiPlayer.hand.length);
                  
                  // Ensure aiChoice is valid
                  if (aiChoice < 0 || aiChoice >= aiPlayer.hand.length) {
                    console.error('Invalid AI card choice:', aiChoice, 'Hand length:', aiPlayer.hand.length);
                    // Fall back to first card
                    aiPlayer.chosenCard = aiPlayer.hand[0];
                    aiPlayer.hand.splice(0, 1);
                  } else {
                    aiPlayer.chosenCard = aiPlayer.hand[aiChoice];
                    aiPlayer.hand.splice(aiChoice, 1);
                  }
                  
                  aiPlayer.cardCount--;
                  aiPlayer.active = false;
                  console.log('AI played card:', aiPlayer.chosenCard.element, aiPlayer.chosenCard.strength);
                
                // Add AI's card to played cards history
                aiPlayer.playedCards.push(aiPlayer.chosenCard);
                // Add card strength to running total
                aiPlayer.totalStrength += aiPlayer.chosenCard.strength;
                
                // Check if AI played a POWER (star) card - copy opponent's last played card
                if (aiPlayer.chosenCard.element === 'POWER') {
                  const humanPlayer = chooseRoom.players.find(p => !p.isAI);
                  if (humanPlayer && humanPlayer.playedCards && humanPlayer.playedCards.length > 0) {
                    // Copy the human player's last played card
                    const lastHumanCard = humanPlayer.playedCards[humanPlayer.playedCards.length - 1];
                    const copiedCard = { ...lastHumanCard, isCopy: true };
                    
                    // Add the copied card to played cards
                    aiPlayer.playedCards.push(copiedCard);
                    aiPlayer.totalStrength += copiedCard.strength;
                  }
                }
                
                // Resolve round after both cards are played - add delay to show match bonus
                setTimeout(() => {
                  if (chooseRoom.players[0].chosenCard && chooseRoom.players[1].chosenCard) {
                    let card1 = chooseRoom.players[0].chosenCard;
                    let card2 = chooseRoom.players[1].chosenCard;
                    
                    let card1Strength = card1.strength;
                    let card2Strength = card2.strength;
                    
                    // Apply game modifiers
                    const hasDoubleStrength = chooseRoom.modifiers?.some(m => m.name === 'DOUBLE_STRENGTH');
                    const hasElementalChaos = chooseRoom.modifiers?.some(m => m.name === 'ELEMENTAL_CHAOS');
                    const hasWildMagic = chooseRoom.modifiers?.some(m => m.name === 'WILD_MAGIC');
                    
                    if (hasDoubleStrength) {
                      card1Strength *= 2;
                      card2Strength *= 2;
                    }
                    
                    // Elemental Chaos: Pick random element each round for +3 bonus
                    if (hasElementalChaos && chooseRoom.roundsPlayed % 3 === 0) {
                      const elements = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'LIGHT', 'DARK', 'METEOR'];
                      chooseRoom.boostedElement = elements[Math.floor(Math.random() * elements.length)];
                    }
                    
                    if (hasElementalChaos && chooseRoom.boostedElement) {
                      if (card1.element === chooseRoom.boostedElement) card1Strength += 3;
                      if (card2.element === chooseRoom.boostedElement) card2Strength += 3;
                    }
                    
                    // Wild Magic: Neutral cards get +2 strength
                    if (hasWildMagic) {
                      if (card1.element === 'NEUTRAL') card1Strength += 2;
                      if (card2.element === 'NEUTRAL') card2Strength += 2;
                    }
                    
                    // Element counter system (rock-paper-scissors style)
                    const counters = chooseRoom.elementCounters;
                    if (counters[card1.element]?.includes(card2.element)) {
                      card1Strength += 3; // Counter bonus
                      card1.isCounter = true;
                    }
                    if (counters[card2.element]?.includes(card1.element)) {
                      card2Strength += 3; // Counter bonus
                      card2.isCounter = true;
                    }
                    
                    // Card evolution: +1 strength if same element as last played
                    const player1 = chooseRoom.players[0];
                    const player2 = chooseRoom.players[1];
                    
                    if (player1.lastPlayedElement === card1.element) {
                      card1Strength += 1;
                      card1.evolved = true;
                    }
                    if (player2.lastPlayedElement === card2.element) {
                      card2Strength += 1;
                      card2.evolved = true;
                    }
                    
                    // NEUTRAL card abilities
                    if (card1.element === 'NEUTRAL' && card1.neutralAbility === 'COPY') {
                      // Copy opponent's element for this round
                      card1.element = card2.element;
                    } else if (card1.element === 'NEUTRAL' && card1.neutralAbility === 'BOOST') {
                      // Boost own strength by 3
                      card1Strength += 3;
                    }
                    
                    if (card2.element === 'NEUTRAL' && card2.neutralAbility === 'COPY') {
                      card2.element = card1.element;
                    } else if (card2.element === 'NEUTRAL' && card2.neutralAbility === 'BOOST') {
                      card2Strength += 3;
                    }
                    
                    // Track meteor attacks for this round
                    if (!chooseRoom.meteorAttacks) {
                      chooseRoom.meteorAttacks = { player1: 0, player2: 0 };
                    }
                    
                    if (card1.element === 'METEOR') {
                      chooseRoom.meteorAttacks.player1++;
                    }
                    if (card2.element === 'METEOR') {
                      chooseRoom.meteorAttacks.player2++;
                    }
                    
                    // Apply special abilities after strength calculation
                    // (player1 and player2 already declared above)
                    
                    // FIRE: Burn opponent's weakest card in reserve deck
                    if (card1.element === 'FIRE' && player2.deck && player2.deck.length > 0) {
                      const weakestIdx = player2.deck.reduce((minIdx, card, idx, arr) => 
                        card.strength < arr[minIdx].strength ? idx : minIdx, 0);
                      player2.deck.splice(weakestIdx, 1);
                    }
                    if (card2.element === 'FIRE' && player1.deck && player1.deck.length > 0) {
                      const weakestIdx = player1.deck.reduce((minIdx, card, idx, arr) => 
                        card.strength < arr[minIdx].strength ? idx : minIdx, 0);
                      player1.deck.splice(weakestIdx, 1);
                    }
                    
                    // ICE: Freeze opponent's next turn (flag to skip)
                    if (card1.element === 'ICE') {
                      player2.frozen = true;
                    }
                    if (card2.element === 'ICE') {
                      player1.frozen = true;
                    }
                    
                    // WATER: Heal - reduce opponent's score by 1 (minimum 0)
                    if (card1.element === 'WATER' && player2.score > 0) {
                      player2.score--;
                    }
                    if (card2.element === 'WATER' && player1.score > 0) {
                      player1.score--;
                    }
                    
                    // ELECTRICITY: Chain attack - deal 1 damage to opponent's highest strength card in hand
                    if (card1.element === 'ELECTRICITY' && player2.hand.length > 0) {
                      const strongestIdx = player2.hand.reduce((maxIdx, card, idx, arr) => 
                        card.strength > arr[maxIdx].strength ? idx : maxIdx, 0);
                      if (player2.hand[strongestIdx].strength > 1) {
                        player2.hand[strongestIdx].strength--;
                      } else {
                        player2.hand.splice(strongestIdx, 1);
                        player2.cardCount--;
                      }
                    }
                    if (card2.element === 'ELECTRICITY' && player1.hand.length > 0) {
                      const strongestIdx = player1.hand.reduce((maxIdx, card, idx, arr) => 
                        card.strength > arr[maxIdx].strength ? idx : maxIdx, 0);
                      if (player1.hand[strongestIdx].strength > 1) {
                        player1.hand[strongestIdx].strength--;
                      } else {
                        player1.hand.splice(strongestIdx, 1);
                        player1.cardCount--;
                      }
                    }
                    
                    // TECHNOLOGY: Shield and Create abilities + passive damage
                    if (card1.element === 'TECHNOLOGY') {
                      // Shield ability: absorbs damage
                      if (card1.techAbility === 'SHIELD') {
                        card1.shield = Math.ceil(card1.strength / 2); // Shield = half of card strength
                        card1Strength += card1.shield; // Add shield to total strength
                      }
                      // Create ability: add a random card to hand
                      else if (card1.techAbility === 'CREATE' && player1.hand.length < 10) {
                        const newCard = generateElementalCards(1)[0];
                        player1.hand.push(newCard);
                        player1.cardCount++;
                      }
                      
                      // Passive: Deal damage to all opponent's cards in hand based on strength
                      if (player2.hand.length > 0) {
                        player2.hand.forEach(card => {
                          const damage = Math.ceil(card.strength / 10); // 1 damage per 10 strength (1 for 1-10, 2 for 11-20, etc)
                          card.strength = Math.max(1, card.strength - damage);
                        });
                      }
                    }
                    
                    if (card2.element === 'TECHNOLOGY') {
                      // Shield ability
                      if (card2.techAbility === 'SHIELD') {
                        card2.shield = Math.ceil(card2.strength / 2);
                        card2Strength += card2.shield;
                      }
                      // Create ability
                      else if (card2.techAbility === 'CREATE' && player2.hand.length < 10) {
                        const newCard = generateElementalCards(1)[0];
                        player2.hand.push(newCard);
                        player2.cardCount++;
                      }
                      
                      // Passive damage
                      if (player1.hand.length > 0) {
                        player1.hand.forEach(card => {
                          const damage = Math.ceil(card.strength / 10);
                          card.strength = Math.max(1, card.strength - damage);
                        });
                      }
                    }
                    
                    // METEOR: Attack all EARTH cards in opponent's hand, reduced by TECHNOLOGY shield
                    if (card1.element === 'METEOR' && player2.hand.length > 0) {
                      const totalMeteorAttacks = chooseRoom.meteorAttacks.player1;
                      const hasShield = card2.element === 'TECHNOLOGY'; // Check if opponent played TECHNOLOGY for shield
                      
                      player2.hand.forEach(card => {
                        if (card.element === 'EARTH') {
                          let damage = totalMeteorAttacks;
                          if (hasShield) {
                            damage = Math.max(0, damage - 1); // TECHNOLOGY shields reduce meteor damage by 1
                          }
                          card.strength = Math.max(1, card.strength - damage);
                          card.meteorDamage = damage; // Track damage for UI feedback
                        }
                      });
                    }
                    
                    if (card2.element === 'METEOR' && player1.hand.length > 0) {
                      const totalMeteorAttacks = chooseRoom.meteorAttacks.player2;
                      const hasShield = card1.element === 'TECHNOLOGY'; // Check if opponent played TECHNOLOGY for shield
                      
                      player1.hand.forEach(card => {
                        if (card.element === 'EARTH') {
                          let damage = totalMeteorAttacks;
                          if (hasShield) {
                            damage = Math.max(0, damage - 1); // TECHNOLOGY shields reduce meteor damage by 1
                          }
                          card.strength = Math.max(1, card.strength - damage);
                          card.meteorDamage = damage; // Track damage for UI feedback
                        }
                      });
                    }

                    // Check if either player has 2 consecutive cards with same element (ELEMENT MATCH BONUS!)
                    chooseRoom.lastMatchBonus = null;
                    let matchBonuses = [];
                    let comboBonuses = [];
                    
                    // Check Player 1's combos and chains
                    const player1Cards = chooseRoom.players[0].playedCards;
                    
                    // Element chain: 3+ same element in a row = triple strength
                    if (player1Cards.length >= 3) {
                      const lastThree = player1Cards.slice(-3);
                      if (lastThree[0].element === lastThree[1].element && lastThree[1].element === lastThree[2].element) {
                        card1Strength *= 3;
                        comboBonuses.push({
                          type: 'ELEMENT_CHAIN',
                          element: lastThree[0].element,
                          player: chooseRoom.players[0].name,
                          multiplier: 3
                        });
                      }
                    }
                    
                    // Sequential elements combo (Fire→Water→Earth) = 1.5x
                    if (player1Cards.length >= 3) {
                      const lastThree = player1Cards.slice(-3);
                      const sequence1 = ['FIRE', 'WATER', 'EARTH'];
                      const sequence2 = ['ICE', 'ELECTRICITY', 'POWER'];
                      const actualSeq = [lastThree[0].element, lastThree[1].element, lastThree[2].element];
                      
                      if (JSON.stringify(actualSeq) === JSON.stringify(sequence1) || 
                          JSON.stringify(actualSeq) === JSON.stringify(sequence2)) {
                        card1Strength = Math.floor(card1Strength * 1.5);
                        comboBonuses.push({
                          type: 'SEQUENTIAL',
                          player: chooseRoom.players[0].name,
                          multiplier: 1.5
                        });
                      }
                    }
                    
                    // Opposition bonus: Fire vs Ice, Water vs Electricity = +2 strength
                    if ((card1.element === 'FIRE' && card2.element === 'ICE') ||
                        (card1.element === 'ICE' && card2.element === 'FIRE') ||
                        (card1.element === 'WATER' && card2.element === 'ELECTRICITY') ||
                        (card1.element === 'ELECTRICITY' && card2.element === 'WATER')) {
                      card1Strength += 2;
                      comboBonuses.push({
                        type: 'OPPOSITION',
                        player: chooseRoom.players[0].name,
                        bonus: 2
                      });
                    }
                    
                    // Rainbow bonus: Check if all 6 core elements played = instant win
                    const p1Elements = new Set(player1Cards.map(c => c.element));
                    const coreElements = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'POWER'];
                    if (coreElements.every(el => p1Elements.has(el))) {
                      chooseRoom.players[0].score = 100; // Auto-win
                      comboBonuses.push({
                        type: 'RAINBOW',
                        player: chooseRoom.players[0].name
                      });
                    }
                    
                    // 2 consecutive same element (original match bonus)
                    if (player1Cards.length >= 2) {
                      const lastTwo1 = player1Cards.slice(-2);
                      if (lastTwo1[0].element === lastTwo1[1].element) {
                        matchBonuses.push({
                          element: lastTwo1[0].element,
                          player: chooseRoom.players[0].name
                        });
                        // Double the strength for this player
                        card1Strength += card1.strength;
                        chooseRoom.players[0].totalStrength += card1.strength;
                      }
                    }
                    
                    // Check Player 2's combos and chains
                    const player2Cards = chooseRoom.players[1].playedCards;
                    
                    // Element chain: 3+ same element in a row = triple strength
                    if (player2Cards.length >= 3) {
                      const lastThree = player2Cards.slice(-3);
                      if (lastThree[0].element === lastThree[1].element && lastThree[1].element === lastThree[2].element) {
                        card2Strength *= 3;
                        comboBonuses.push({
                          type: 'ELEMENT_CHAIN',
                          element: lastThree[0].element,
                          player: chooseRoom.players[1].name,
                          multiplier: 3
                        });
                      }
                    }
                    
                    // Sequential elements combo = 1.5x
                    if (player2Cards.length >= 3) {
                      const lastThree = player2Cards.slice(-3);
                      const sequence1 = ['FIRE', 'WATER', 'EARTH'];
                      const sequence2 = ['ICE', 'ELECTRICITY', 'POWER'];
                      const actualSeq = [lastThree[0].element, lastThree[1].element, lastThree[2].element];
                      
                      if (JSON.stringify(actualSeq) === JSON.stringify(sequence1) || 
                          JSON.stringify(actualSeq) === JSON.stringify(sequence2)) {
                        card2Strength = Math.floor(card2Strength * 1.5);
                        comboBonuses.push({
                          type: 'SEQUENTIAL',
                          player: chooseRoom.players[1].name,
                          multiplier: 1.5
                        });
                      }
                    }
                    
                    // Opposition bonus
                    if ((card2.element === 'FIRE' && card1.element === 'ICE') ||
                        (card2.element === 'ICE' && card1.element === 'FIRE') ||
                        (card2.element === 'WATER' && card1.element === 'ELECTRICITY') ||
                        (card2.element === 'ELECTRICITY' && card1.element === 'WATER')) {
                      card2Strength += 2;
                      comboBonuses.push({
                        type: 'OPPOSITION',
                        player: chooseRoom.players[1].name,
                        bonus: 2
                      });
                    }
                    
                    // Rainbow bonus
                    const p2Elements = new Set(player2Cards.map(c => c.element));
                    if (coreElements.every(el => p2Elements.has(el))) {
                      chooseRoom.players[1].score = 100; // Auto-win
                      comboBonuses.push({
                        type: 'RAINBOW',
                        player: chooseRoom.players[1].name
                      });
                    }
                    
                    // 2 consecutive same element
                    if (player2Cards.length >= 2) {
                      const lastTwo2 = player2Cards.slice(-2);
                      if (lastTwo2[0].element === lastTwo2[1].element) {
                        matchBonuses.push({
                          element: lastTwo2[0].element,
                          player: chooseRoom.players[1].name
                        });
                        // Double the strength for this player
                        card2Strength += card2.strength;
                        chooseRoom.players[1].totalStrength += card2.strength;
                      }
                    }
                    
                    // Store combo bonuses
                    if (comboBonuses.length > 0) {
                      chooseRoom.lastComboBonus = {
                        ...comboBonuses[comboBonuses.length - 1],
                        timestamp: Date.now()
                      };
                    }
                    
                    // Set match bonus if any player matched (use first one for display)
                    if (matchBonuses.length > 0) {
                      chooseRoom.lastMatchBonus = {
                        ...matchBonuses[0],
                        timestamp: Date.now()
                      };
                    }
                    
                    // Score the round using modified strengths
                    if (card1Strength > card2Strength) {
                      chooseRoom.players[0].score++;
                    } else if (card2Strength > card1Strength) {
                      chooseRoom.players[1].score++;
                    }
                    
                    // Move played cards to graveyard
                    chooseRoom.graveyard.player.push(card1);
                    chooseRoom.graveyard.ai.push(card2);
                    
                    // Update last played element for evolution tracking
                    player1.lastPlayedElement = card1.element;
                    player2.lastPlayedElement = card2.element;
                    
                    // Keep chosen cards visible, don't clear them
                    chooseRoom.roundsPlayed++;
                    
                    // Check if both players are out of cards (hand AND deck)
                    const player1HasNoCards = chooseRoom.players[0].hand.length === 0 && (!chooseRoom.players[0].deck || chooseRoom.players[0].deck.length === 0);
                    const player2HasNoCards = chooseRoom.players[1].hand.length === 0 && (!chooseRoom.players[1].deck || chooseRoom.players[1].deck.length === 0);
                    const bothOutOfCards = player1HasNoCards && player2HasNoCards;
                    
                    if (bothOutOfCards) {
                      chooseRoom.gameOver = true;
                      // Determine winner based on score - AI wins on ties
                      if (chooseRoom.players[0].score > chooseRoom.players[1].score) {
                        chooseRoom.winner = chooseRoom.players[0].name;
                      } else {
                        chooseRoom.winner = chooseRoom.players[1].name; // AI wins on tie or AI lead
                      }
                      console.log('🏁 Game over! All cards played from hand and deck. Winner:', chooseRoom.winner);
                    } else {
                      // Start next round after 5 seconds (time to see results and match bonus)
                      // Don't clear chosenCard - keep it visible, it's already in playedCards
                      setTimeout(() => {
                        // Just activate next turn, keep cards visible in playedCards
                        if (chooseRoom.players[0]) chooseRoom.players[0].active = true;
                      }, 5000);
                    }
                  }
                }, 500);
                
                } catch (error) {
                  console.error('Error in AI card selection:', error);
                  // Emergency fallback - play first card
                  if (aiPlayer.hand.length > 0) {
                    aiPlayer.chosenCard = aiPlayer.hand[0];
                    aiPlayer.hand.splice(0, 1);
                    aiPlayer.cardCount--;
                    aiPlayer.active = false;
                    
                    // Still need to resolve the round
                    setTimeout(() => {
                      if (chooseRoom.players[0].chosenCard) {
                        // Player wins by default due to AI error
                        chooseRoom.players[0].score++;
                        chooseRoom.roundsPlayed++;
                        
                        setTimeout(() => {
                          if (chooseRoom.players[0]) chooseRoom.players[0].active = true;
                        }, 2000);
                      }
                    }, 500);
                  }
                }
              }, 4000); // 4 seconds after setting aiPlayer.active = true
            }, 1000); // 1 second after player plays card
          }
          
          return { type: 'CARD_CHOSEN', success: true };
        }
      }
      return { type: 'CARD_CHOSEN', success: false };

    case 'DRAW_FROM_RESERVE':
      const [, drawRoomId, drawPlayerId, drawCardIndex] = parts;
      const drawRoom = mockGameState.rooms[drawRoomId];
      if (drawRoom && drawRoom.pendingAbility && drawRoom.pendingAbility.playerId === drawPlayerId) {
        const drawPlayer = drawRoom.players.find(p => p.id === drawPlayerId);
        if (drawPlayer) {
          // Check if deck is empty - apply fatigue damage
          if (!drawPlayer.deck || drawPlayer.deck.length === 0) {
            drawPlayer.fatigueDamage++;
            drawPlayer.score = Math.max(0, drawPlayer.score - drawPlayer.fatigueDamage);
            drawRoom.pendingAbility = null;
            return { type: 'FATIGUE_DAMAGE', damage: drawPlayer.fatigueDamage, success: true };
          }
          
          // Get the specific card index or default to 0
          const index = parseInt(drawCardIndex) || 0;
          if (index >= 0 && index < drawPlayer.deck.length) {
            // Move specific card from deck to hand
            const drawnCard = drawPlayer.deck.splice(index, 1)[0];
            // Double the strength of the drawn card
            drawnCard.strength = Math.min(10, drawnCard.strength * 2);
            drawPlayer.hand.push(drawnCard);
            drawPlayer.cardCount++;
            drawRoom.pendingAbility = null;
            return { type: 'CARD_DRAWN', success: true };
          }
        }
      }
      return { type: 'CARD_DRAWN', success: false };

    case 'SKIP_ABILITY':
      const [, skipRoomId, skipPlayerId] = parts;
      const skipRoom = mockGameState.rooms[skipRoomId];
      if (skipRoom && skipRoom.pendingAbility && skipRoom.pendingAbility.playerId === skipPlayerId) {
        skipRoom.pendingAbility = null;
        return { type: 'ABILITY_SKIPPED', success: true };
      }
      return { type: 'ABILITY_SKIPPED', success: false };

    case 'FORFEIT_TURN':
      const [, forfeitRoomId, forfeitPlayerId] = parts;
      const forfeitRoom = mockGameState.rooms[forfeitRoomId];
      if (forfeitRoom && forfeitRoom.gameStarted && !forfeitRoom.gameOver) {
        const forfeitPlayer = forfeitRoom.players.find(p => p.id === forfeitPlayerId);
        
        if (forfeitPlayer && forfeitPlayer.active) {
          console.log(`Player ${forfeitPlayer.name} forfeited their turn`);
          
          // Player forfeits - deactivate them
          forfeitPlayer.active = false;
          
          // No card is played - just move to next turn
          // Activate AI turn
          const aiPlayer = forfeitRoom.players.find(p => p.isAI);
          if (aiPlayer && aiPlayer.hand.length > 0) {
            setTimeout(() => {
              aiPlayer.active = true;
            }, 1000);
            
            // AI plays after 5 seconds
            setTimeout(() => {
              const aiChoice = selectAICard(aiPlayer.hand, aiPlayer.personalityKey, forfeitRoom);
              aiPlayer.chosenCard = aiPlayer.hand[aiChoice];
              aiPlayer.hand.splice(aiChoice, 1);
              aiPlayer.cardCount--;
              aiPlayer.active = false;
              
              // Add AI's card to played cards history
              aiPlayer.playedCards.push(aiPlayer.chosenCard);
              aiPlayer.totalStrength += aiPlayer.chosenCard.strength;
              
              // Check if AI played a POWER card
              if (aiPlayer.chosenCard.element === 'POWER') {
                const humanPlayer = forfeitRoom.players.find(p => !p.isAI);
                if (humanPlayer && humanPlayer.playedCards && humanPlayer.playedCards.length > 0) {
                  const lastHumanCard = humanPlayer.playedCards[humanPlayer.playedCards.length - 1];
                  const copiedCard = { ...lastHumanCard, isCopy: true };
                  aiPlayer.playedCards.push(copiedCard);
                  aiPlayer.totalStrength += copiedCard.strength;
                }
              }
              
              // AI wins the round by default (player forfeited)
              setTimeout(() => {
                forfeitRoom.players[1].score++;
                forfeitRoom.roundsPlayed++;
                
                // Check if both players are out of cards (hand AND deck)
                const player1HasNoCards = forfeitRoom.players[0].hand.length === 0 && (!forfeitRoom.players[0].deck || forfeitRoom.players[0].deck.length === 0);
                const player2HasNoCards = forfeitRoom.players[1].hand.length === 0 && (!forfeitRoom.players[1].deck || forfeitRoom.players[1].deck.length === 0);
                const bothOutOfCards = player1HasNoCards && player2HasNoCards;
                
                if (bothOutOfCards) {
                  forfeitRoom.gameOver = true;
                  if (forfeitRoom.players[0].score > forfeitRoom.players[1].score) {
                    forfeitRoom.winner = forfeitRoom.players[0].name;
                  } else {
                    forfeitRoom.winner = forfeitRoom.players[1].name; // AI wins on tie or AI lead
                  }
                  console.log('🏁 Game over after forfeit! All cards played. Winner:', forfeitRoom.winner);
                } else {
                  setTimeout(() => {
                    // Activate next turn
                    if (forfeitRoom.players[0]) forfeitRoom.players[0].active = true;
                  }, 5000);
                }
              }, 500);
            }, 5000);
          } else if (!aiPlayer || (aiPlayer.hand.length === 0 && (!aiPlayer.deck || aiPlayer.deck.length === 0))) {
            // Both players out of cards (hand AND deck), end game
            forfeitRoom.roundsPlayed++;
            
            const player1HasNoCards = forfeitRoom.players[0].hand.length === 0 && (!forfeitRoom.players[0].deck || forfeitRoom.players[0].deck.length === 0);
            const player2HasNoCards = forfeitRoom.players[1].hand.length === 0 && (!forfeitRoom.players[1].deck || forfeitRoom.players[1].deck.length === 0);
            
            if (player1HasNoCards && player2HasNoCards) {
              forfeitRoom.gameOver = true;
              if (forfeitRoom.players[0].score > forfeitRoom.players[1].score) {
                forfeitRoom.winner = forfeitRoom.players[0].name;
              } else {
                forfeitRoom.winner = forfeitRoom.players[1].name; // AI wins on tie or AI lead
              }
              console.log('🏁 Game over! All cards exhausted. Winner:', forfeitRoom.winner);
            }
          }
          
          return { type: 'TURN_FORFEITED', success: true };
        }
      }
      return { type: 'TURN_FORFEITED', success: false };

    case 'REVIVE_FROM_GRAVEYARD':
      const [, reviveRoomId, revivePlayerId, graveyardIndex] = parts;
      const reviveRoom = mockGameState.rooms[reviveRoomId];
      if (reviveRoom && reviveRoom.gameStarted && !reviveRoom.gameOver) {
        const revivePlayer = reviveRoom.players.find(p => p.id === revivePlayerId);
        const graveyardKey = revivePlayer?.isAI ? 'ai' : 'player';
        
        if (revivePlayer && reviveRoom.graveyard[graveyardKey].length > 0) {
          const index = parseInt(graveyardIndex) || 0;
          if (index >= 0 && index < reviveRoom.graveyard[graveyardKey].length) {
            // Revive card from graveyard to hand (costs 1 score point)
            if (revivePlayer.score > 0) {
              const revivedCard = reviveRoom.graveyard[graveyardKey].splice(index, 1)[0];
              // Reset any modifiers from previous play
              delete revivedCard.modifiedStrength;
              delete revivedCard.isCounter;
              delete revivedCard.evolved;
              revivePlayer.hand.push(revivedCard);
              revivePlayer.cardCount++;
              revivePlayer.score--; // Cost 1 point to revive
              return { type: 'CARD_REVIVED', success: true, card: revivedCard };
            }
            return { type: 'CARD_REVIVED', success: false, reason: 'Insufficient score' };
          }
        }
      }
      return { type: 'CARD_REVIVED', success: false };

    case 'GET_STATE':
      const [, stateRoomId] = parts;
      const stateRoom = mockGameState.rooms[stateRoomId];
      if (stateRoom) {
        return { ...stateRoom };
      }
      return { error: 'Room not found' };

    default:
      return { type: 'ERROR', message: 'Unknown command' };
  }
}

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
      isLegendary: tier === 'LEGENDARY'
    };
    
    // Add special ability for NEUTRAL cards
    if (element === 'NEUTRAL') {
      card.neutralAbility = Math.random() > 0.5 ? 'COPY' : 'BOOST';
    }
    
    // Add special abilities for TECHNOLOGY cards
    if (element === 'TECHNOLOGY') {
      card.techAbility = Math.random() > 0.5 ? 'SHIELD' : 'CREATE';
      card.shield = 0; // Shield points that absorb damage
    }
    
    cards.push(card);
  }
  
  return cards;
}

app.post('/api/command', async (req, res) => {
  const { command } = req.body;
  
  console.log('Received command:', command);

  try {
    // Try to connect to C++ server first
    const response = await sendToCppServer(command);
    res.json(response);
  } catch (error) {
    // If C++ server is not available, use mock implementation
    console.log('C++ server not available, using mock:', error.message);
    const mockResponse = handleCommandMock(command);
    res.json(mockResponse);
  }
});

app.get('/api/health', (req, res) => {
  console.log('🩺 Health check requested');
  res.json({ status: 'ok', timestamp: Date.now(), port: PORT });
});

app.get('/test', (req, res) => {
  console.log('🧪 Test endpoint hit');
  res.send('Server is working!');
});

app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No content
});

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Card Game Server</title></head>
      <body style="font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px;">
        <h1>🎮 Card Game Proxy Server</h1>
        <p><strong>Status:</strong> Running</p>
        <p><strong>Port:</strong> ${PORT}</p>
        <hr>
        <h2>⚠️ This is the API server</h2>
        <p>To play the game, open the React app:</p>
        <h3><a href="http://localhost:3000" style="color: #4caf50;">👉 http://localhost:3000</a></h3>
        <hr>
        <h3>API Endpoints:</h3>
        <ul>
          <li>POST /api/command - Send game commands</li>
          <li>GET /api/health - Server health check</li>
        </ul>
        <p><em>C++ Server: ${CPP_SERVER_HOST}:${CPP_SERVER_PORT} (fallback to mock if unavailable)</em></p>
      </body>
    </html>
  `);
});

const server = app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log(`🎮 Game proxy server running on http://localhost:${PORT}`);
  console.log(`🎮 Also accessible via http://127.0.0.1:${PORT}`);
  console.log(`📡 Forwarding to C++ server at ${CPP_SERVER_HOST}:${CPP_SERVER_PORT}`);
  console.log(`⚠️  If C++ server is not running, mock mode will be used`);
});

server.on('error', (err) => {
  console.error('❌ Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try a different port.`);
  }
});

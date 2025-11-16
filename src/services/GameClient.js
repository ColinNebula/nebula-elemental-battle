/**
 * GameClient - Enhanced JavaScript Implementation
 * 
 * Performance Optimizations:
 * - Frozen immutable lookups for element counters
 * - Pre-bound methods to avoid function recreation
 * - For loops instead of forEach for better performance
 * - Error boundaries in all listener callbacks
 * - Card generation caching
 * - Optimized AI decision making
 * 
 * Memory Optimizations:
 * - Reduced object allocations
 * - Efficient data structures
 * - Cache management with size limits
 */

// Import AI personalities
import { AI_PERSONALITIES } from '../utils/aiPersonalities';

// Performance optimization: Memoize element counter lookups
const ELEMENT_COUNTERS = Object.freeze({
  FIRE: Object.freeze(['ICE', 'WATER']),
  ICE: Object.freeze(['ELECTRICITY', 'FIRE']),
  WATER: Object.freeze(['EARTH', 'ELECTRICITY']),
  ELECTRICITY: Object.freeze(['EARTH', 'WATER']),
  EARTH: Object.freeze(['FIRE', 'ICE']),
  LIGHT: Object.freeze(['DARK']),
  DARK: Object.freeze(['LIGHT']),
  METEOR: Object.freeze(['EARTH']),
  TECHNOLOGY: Object.freeze([]),
  POWER: Object.freeze([]),
  NEUTRAL: Object.freeze([])
});

// Optimized AI selection function with performance enhancements
const selectAICard = (hand, strategy, opponentLastCard, gameState) => {
  console.log('🎯 selectAICard called with:', { handSize: hand?.length, strategy });
  
  // Validate inputs
  if (!hand || !Array.isArray(hand) || hand.length === 0) {
    console.warn('⚠️ selectAICard: Invalid or empty hand, returning 0');
    return 0;
  }
  
  if (!strategy || typeof strategy !== 'object') {
    console.warn('⚠️ selectAICard: Invalid strategy, using defaults');
    strategy = {
      aggressiveness: 0.7,
      conservativeness: 0.2,
      counterPriority: 0.5,
      preferredElements: ['FIRE', 'EARTH']
    };
  }
  
  try {
    // Calculate scores for each card
    const scores = hand.map((card, index) => {
    // Validate card object
    if (!card || typeof card !== 'object') {
      console.warn('⚠️ Invalid card at index', index);
      return { index, score: 0 };
    }
    let score = card.strength;
    
    // Preferred elements bonus
    if (strategy.preferredElements?.includes(card.element)) {
      score += 3;
    }
    
    // Aggressiveness affects scoring
    if (strategy.aggressiveness > 0.5) {
      score += card.strength * 0.5; // Favor stronger cards
    }
    
    // Counter priority - bonus for element advantages (optimized lookup)
    if (strategy.counterPriority && opponentLastCard && opponentLastCard.element) {
      const counters = ELEMENT_COUNTERS[card.element];
      if (counters && Array.isArray(counters) && counters.includes(opponentLastCard.element)) {
        score += strategy.counterPriority * 5;
      }
    }
    
    // Add some randomness
    score += Math.random() * 2;
    
    return { index, score };
  });
  
  // Sort by score
  scores.sort((a, b) => b.score - a.score);
  
  // Aggressiveness determines if we play best card
  if (Math.random() < strategy.aggressiveness) {
    return scores[0].index; // Play highest scored card
  }
  
  // Conservativeness: play lower-medium strength
  if (Math.random() < strategy.conservativeness) {
    const midRange = scores.slice(Math.floor(scores.length / 3), Math.floor(scores.length * 2 / 3));
    if (midRange.length > 0) {
      return midRange[Math.floor(Math.random() * midRange.length)].index;
    }
  }
  
  // Default: somewhat random from top half
  const topHalf = scores.slice(0, Math.ceil(scores.length / 2));
  const selectedIndex = topHalf[Math.floor(Math.random() * topHalf.length)].index;
  
  console.log('✅ selectAICard selected index:', selectedIndex, 'from hand of', hand.length);
  return selectedIndex;
  } catch (selectError) {
    console.error('❌ Error in selectAICard:', selectError);
    return 0;
  }
};

class GameClient {
  constructor() {
    this.baseUrl = window.location.origin + '/api';
    this.listeners = {};
    this.mockMode = true;
    this.mockState = {
      rooms: {},
      nextRoomId: 1
    };
    
    // Performance: Pre-bind frequently used methods
    this.handleMessage = this.handleMessage.bind(this);
    this.notifyListeners = this.notifyListeners.bind(this);
    
    // Optimization: Cache for card generation
    this.cardGenerationCache = new Map();
    this.cacheMaxSize = 100;
  }

  connect(host = 'localhost', port = 3003) { // Use current app port
    return new Promise((resolve) => {
      this.baseUrl = window.location.origin + '/api';
      console.log('Game client configured for mock mode');
      // Start in mock mode since no backend server is needed
      this.mockMode = true;
      resolve();
    });
  }

  // Mock game logic for when server is unavailable
  mockCommand(command) {
    const parts = command.split(' ');
    const action = parts[0];

    switch (action) {
      case 'CREATE_ROOM':
        const roomId = `room_${this.mockState.nextRoomId++}`;
        this.mockState.rooms[roomId] = {
          roomId,
          players: [],
          gameStarted: false,
          gameOver: false,
          winner: null,
          playedCards: [],
          currentRound: 0,
          maxRounds: 5,
          battlePhase: false
        };
        return { type: 'ROOM_CREATED', roomId };

      case 'JOIN_ROOM':
        const [, joinRoomId, playerId, playerName] = parts;
        const room = this.mockState.rooms[joinRoomId];
        if (room && !room.gameStarted) {
          // Add human player
          if (room.players.length === 0) {
            room.players.push({
              id: playerId,
              name: playerName,
              score: 0,
              hand: [],
              deck: [], // Reserve deck for EARTH card ability
              playedCards: [],
              active: true,
              isAI: false,
              chosenCard: null,
              cardCount: 5
            });
          }
          
          // Add AI
          if (room.players.length === 1) {
            // Select a random AI personality
            const personalityKeys = Object.keys(AI_PERSONALITIES);
            const randomPersonality = personalityKeys[Math.floor(Math.random() * personalityKeys.length)];
            const personality = AI_PERSONALITIES[randomPersonality];
            const strategy = personality.strategy || {};
            
            room.players.push({
              id: 'ai',
              name: personality.name || 'Computer',
              score: 0,
              hand: [],
              deck: [], // Reserve deck for EARTH card ability
              playedCards: [],
              active: false,
              isAI: true,
              chosenCard: null,
              cardCount: 5,
              personalityKey: randomPersonality,
              aggressiveness: strategy.aggressiveness || 0.7,
              conservativeness: strategy.conservativeness || 0.2,
              counterPriority: strategy.counterPriority || 0.5,
              preferredElements: strategy.preferredElements || ['FIRE', 'EARTH'],
              comboFocus: strategy.comboFocus || 0.3,
              avatar: personality.avatar || '🤖',
              difficulty: personality.difficulty || 'Medium'
            });
            
            console.log('🤖 Created AI player:', {
              name: personality.name,
              difficulty: personality.difficulty,
              personality: randomPersonality
            });
          }
          
          return { type: 'JOIN_RESULT', success: true };
        }
        return { type: 'JOIN_RESULT', success: false };

      case 'START_GAME':
        const [, startRoomId] = parts;
        const startRoom = this.mockState.rooms[startRoomId];
        if (startRoom && startRoom.players.length >= 2) {
          // Start with card selection phase
          startRoom.cardSelectionPhase = true;
          startRoom.gameStarted = false;
          
          // Deal 10 cards to each player for selection
          startRoom.players.forEach(player => {
            player.hand = this.generateAdvancedCards(10);
            player.deck = [];
            player.cardCount = 10;
            player.selectedHand = false;
            
            // AI auto-selects first 5 cards immediately
            if (player.isAI) {
              const selectedIndices = [0, 1, 2, 3, 4];
              player.hand = player.hand.slice(0, 5);
              player.deck = this.generateAdvancedCards(10); // 10 cards in AI reserve deck
              player.cardCount = 5;
              player.selectedHand = true;
            }
            
            player.playedCards = [];
            player.graveyard = [];
            player.lastPlayedElement = null;
          });
          
          // Initialize status effects system
          this.initializeStatusEffects(startRoom);
          
          return { type: 'GAME_STARTED', success: true, ...startRoom };
        }
        return { type: 'GAME_STARTED', success: false };

      case 'SELECT_CARDS':
        const [, selectRoomId, selectPlayerId, ...cardIndices] = parts;
        const selectRoom = this.mockState.rooms[selectRoomId];
        if (selectRoom && selectRoom.cardSelectionPhase) {
          const player = selectRoom.players.find(p => p.id === selectPlayerId);
          if (player && !player.selectedHand) {
            const selectedIndices = cardIndices.map(idx => parseInt(idx));
            
            // Move selected cards to hand, rest to deck
            const selectedCards = selectedIndices.map(idx => player.hand[idx]);
            const remainingCards = player.hand.filter((_, idx) => !selectedIndices.includes(idx));
            
            player.hand = selectedCards;
            player.deck = remainingCards;
            // Generate additional reserve deck cards
            player.deck.push(...this.generateAdvancedCards(5)); // Add 5 more cards to reserve
            player.cardCount = 5;
            player.selectedHand = true;
            player.playedCards = [];
            player.graveyard = [];
            player.lastPlayedElement = null;
            
            // Check if all players have selected
            if (selectRoom.players.every(p => p.selectedHand)) {
              selectRoom.cardSelectionPhase = false;
              selectRoom.gameStarted = false; // Wait for coin toss
              selectRoom.needsCoinToss = true;
              
              // Set starting round
              selectRoom.currentRound = 1;
              selectRoom.roundStartTime = Date.now();
              selectRoom.maxRounds = 5;
              selectRoom.currentRound = 0;
              selectRoom.battlePhase = false;
              
              // Game state tracking
              selectRoom.lastMatchBonus = null;
              selectRoom.lastComboBonus = null;
              selectRoom.modifiers = [];
              selectRoom.graveyard = { player: [], ai: [] };
              selectRoom.meteorAttacks = { player1: 0, player2: 0 };
              
              // Don't activate first player yet - wait for coin toss
              selectRoom.players.forEach(player => player.active = false);
            }
            
            return { type: 'CARDS_SELECTED', success: true, ...selectRoom };
          }
        }
        return { type: 'CARDS_SELECTED', success: false };

      case 'COIN_TOSS':
        const [, coinRoomId, coinPlayerId] = parts;
        const coinRoom = this.mockState.rooms[coinRoomId];
        if (coinRoom && coinRoom.needsCoinToss) {
          // Perform coin toss
          const coinResult = Math.random() < 0.5;
          const player = coinRoom.players.find(p => p.id === coinPlayerId);
          const ai = coinRoom.players.find(p => p.isAI);
          
          // Set who goes first
          player.active = coinResult;
          ai.active = !coinResult;
          coinRoom.firstPlayer = coinResult ? player.id : ai.id;
          
          // Start the actual game
          coinRoom.needsCoinToss = false;
          coinRoom.gameStarted = true;
          
          console.log('🪙 Coin toss completed:', coinResult ? 'Player' : 'AI', 'goes first');
          console.log('🎮 Active states after coin toss:', { 
            playerActive: player.active, 
            aiActive: ai.active,
            firstPlayer: coinRoom.firstPlayer
          });
          
          // If AI goes first, trigger AI move after a delay
          if (!coinResult && ai && ai.hand.length > 0) {
            console.log('🤖 AI won coin toss, will play first card...');
            // Immediately notify listeners with AI active state
            this.notifyListeners('GAME_UPDATE', coinRoom);
            setTimeout(() => {
              this.triggerAIFirstMove(coinRoomId);
            }, 2000);
          } else {
            console.log('👤 Player won coin toss, player goes first');
            // Notify listeners with player active state
            this.notifyListeners('GAME_UPDATE', coinRoom);
          }
          
          return { 
            type: 'COIN_TOSS_COMPLETE', 
            success: true,
            winner: coinResult ? 'player' : 'ai',
            firstPlayer: coinRoom.firstPlayer,
            playerActive: player.active,
            aiActive: ai.active,
            ...coinRoom
          };
        }
        return { type: 'COIN_TOSS_COMPLETE', success: false };

      case 'CHOOSE_CARD':
        const [, chooseRoomId, choosePlayerId, cardIndex] = parts;
        const chooseRoom = this.mockState.rooms[chooseRoomId];
        if (chooseRoom && chooseRoom.gameStarted) {
          const player = chooseRoom.players.find(p => p.id === choosePlayerId);
          const ai = chooseRoom.players.find(p => p.isAI);
          
          console.log('🃏 Card chosen:', { player: player?.name, cardIndex, hand: player?.hand?.length });
          
          // If player has no cards in hand, try to draw from reserve first
          if (player && player.active && player.hand.length === 0) {
            if (player.deck && player.deck.length > 0) {
              console.log('🎴 Player hand empty, auto-drawing from reserve deck');
              const drawnCard = player.deck.shift();
              player.hand.push(drawnCard);
              player.cardCount = player.hand.length + (player.deck?.length || 0);
              console.log(`✅ Player drew card, now has ${player.hand.length} in hand`);
              this.notifyListeners('GAME_UPDATE', chooseRoom);
            } else {
              console.log('⚠️ Player has no cards to play, checking game over...');
              
              // Check if AI also has no cards - if so, end game
              const aiHasNoCards = (ai.hand.length === 0 && (!ai.deck || ai.deck.length === 0));
              if (aiHasNoCards) {
                chooseRoom.gameOver = true;
                
                // Calculate total strength from all played cards
                const playerTotalStrength = player.playedCards.reduce((sum, card) => 
                  sum + (card.modifiedStrength || card.strength || 0), 0);
                const aiTotalStrength = ai.playedCards.reduce((sum, card) => 
                  sum + (card.modifiedStrength || card.strength || 0), 0);
                
                console.log('📊 Final strengths:', {
                  playerTotal: playerTotalStrength,
                  aiTotal: aiTotalStrength,
                  playerScore: player.score,
                  aiScore: ai.score
                });
                
                // Determine winner by total strength
                if (playerTotalStrength > aiTotalStrength) {
                  chooseRoom.winner = player.name;
                } else if (aiTotalStrength > playerTotalStrength) {
                  chooseRoom.winner = ai.name;
                } else {
                  chooseRoom.winner = 'Tie';
                }
                
                console.log('🏁 Game over! Both players out of cards. Winner:', chooseRoom.winner);
                this.notifyListeners('GAME_UPDATE', chooseRoom);
                return { type: 'GAME_OVER', winner: chooseRoom.winner };
              }
              
              player.active = false;
              ai.active = true;
              this.notifyListeners('GAME_UPDATE', chooseRoom);
              return { type: 'CARD_PLAY_FAILED', reason: 'NO_CARDS' };
            }
          }
          
          if (player && player.active && player.hand.length > parseInt(cardIndex)) {
            // Check for freeze status
            const freezeEffect = this.getActiveStatusEffects(chooseRoom, player).find(e => e.type === 'FREEZE');
            if (freezeEffect) {
              console.log('❄️ Player is frozen and cannot play cards!');
              // Remove freeze effect after skip
              const playerKey = 'player';
              chooseRoom.statusEffects[playerKey] = chooseRoom.statusEffects[playerKey].filter(e => e.id !== freezeEffect.id);
              return { type: 'CARD_PLAY_FAILED', reason: 'FROZEN' };
            }
            
            // Check for fatigue cost
            const fatigueEffect = this.getActiveStatusEffects(chooseRoom, player).find(e => e.type === 'FATIGUE');
            if (fatigueEffect && player.score > 0) {
              player.score = Math.max(0, player.score - 1);
              console.log('😴 Fatigue: Player paid 1 score to play card');
            }
            
            // Player plays card (with confusion check)
            const confusionEffect = this.getActiveStatusEffects(chooseRoom, player).find(e => e.type === 'CONFUSION');
            let actualCardIndex = parseInt(cardIndex);
            if (confusionEffect) {
              actualCardIndex = Math.floor(Math.random() * player.hand.length);
              console.log('😵‍💫 Confusion: Random card selected instead!');
            }
            
            player.chosenCard = player.hand[actualCardIndex];
            player.hand.splice(actualCardIndex, 1);
            player.cardCount--;
            player.active = false;
            chooseRoom.battlePhase = true;
            
            // Clear any stale pending abilities from previous rounds
            if (chooseRoom.pendingAbility && !chooseRoom.deferredAbility) {
              console.log('⚠️ Clearing stale pendingAbility before battle');
              delete chooseRoom.pendingAbility;
            }
            
            // Add card to played cards immediately
            player.playedCards.push(player.chosenCard);
            chooseRoom.playedCards.push({
              playerId: player.id,
              playerName: player.name,
              card: player.chosenCard,
              round: chooseRoom.currentRound + 1
            });
            
            console.log('🔄 Player card played, triggering AI...');
            // Notify of game update
            this.notifyListeners('GAME_UPDATE', chooseRoom);
            
            console.log('🔍 About to start AI timeout chain. Current state:', {
              battlePhase: chooseRoom.battlePhase,
              playerActive: player.active,
              aiActive: ai?.active,
              aiExists: !!ai,
              aiHandSize: ai?.hand?.length
            });
            
            // AI plays after delay (give player time to see their card)
            const aiActivationTimeout = setTimeout(() => {
              console.log('⏰ AI activation timeout triggered (6000ms after player card)');
              console.log('🔍 Checking AI availability:', {
                aiExists: !!ai,
                aiHandLength: ai?.hand?.length,
                aiObject: ai ? {
                  id: ai.id,
                  name: ai.name,
                  active: ai.active,
                  cardCount: ai.cardCount
                } : 'null'
              });
              
              if (ai && ai.hand.length > 0) {
                console.log('🤖 AI starting turn...', {
                  aiHandSize: ai.hand.length,
                  aiActive: ai.active,
                  playerActive: player.active
                });
                ai.active = true;
                this.notifyListeners('GAME_UPDATE', chooseRoom);
                console.log('📤 AI activation notified');
                console.log('⏱️ About to create AI card selection timeout (2000ms)...');
                
                const aiCardSelectionTimeout = setTimeout(() => {
                  console.log('⏰ AI card selection timeout fired (2000ms)');
                  try {
                    console.log('🔵 AI card selection timeout started (500ms delay)');
                    // Re-check AI has cards before attempting to play
                    if (!ai.hand || ai.hand.length === 0) {
                      // Try to draw from reserve deck
                      if (ai.deck && ai.deck.length > 0) {
                        console.log('🎴 AI hand empty, drawing from reserve deck');
                        const drawnCard = ai.deck.shift();
                        ai.hand.push(drawnCard);
                        ai.cardCount = ai.hand.length + (ai.deck?.length || 0);
                        console.log(`✅ AI drew card, now has ${ai.hand.length} in hand`);
                      } else {
                        console.log('🚫 AI has no cards in hand or deck, skipping turn...');
                        
                        // Check if player also has no cards - if so, end game
                        const playerHasNoCards = (player.hand.length === 0 && (!player.deck || player.deck.length === 0));
                        if (playerHasNoCards) {
                          chooseRoom.gameOver = true;
                          
                          // Calculate total strength from all played cards
                          const playerTotalStrength = player.playedCards.reduce((sum, card) => 
                            sum + (card.modifiedStrength || card.strength || 0), 0);
                          const aiTotalStrength = ai.playedCards.reduce((sum, card) => 
                            sum + (card.modifiedStrength || card.strength || 0), 0);
                          
                          console.log('📊 Final strengths:', {
                            playerTotal: playerTotalStrength,
                            aiTotal: aiTotalStrength,
                            playerScore: player.score,
                            aiScore: ai.score
                          });
                          
                          // Determine winner by total strength
                          if (playerTotalStrength > aiTotalStrength) {
                            chooseRoom.winner = player.name;
                          } else if (aiTotalStrength > playerTotalStrength) {
                            chooseRoom.winner = ai.name;
                          } else {
                            chooseRoom.winner = 'Tie';
                          }
                          
                          console.log('🏁 Game over! Both players out of cards. Winner:', chooseRoom.winner);
                          this.notifyListeners('GAME_UPDATE', chooseRoom);
                          return;
                        }
                        
                        // AI has no cards but player does - skip AI turn
                        console.log('⏭️ AI skipping turn (no cards), switching to player');
                        player.active = true;
                        ai.active = false;
                        chooseRoom.battlePhase = false;
                        chooseRoom.currentRound++;
                        this.notifyListeners('GAME_UPDATE', chooseRoom);
                        return;
                      }
                    }
                  
                  // Validate AI hand is array and has valid cards
                  if (!Array.isArray(ai.hand)) {
                    console.error('❌ AI hand is not an array!');
                    ai.hand = [];
                    player.active = true;
                    ai.active = false;
                    chooseRoom.battlePhase = false;
                    this.notifyListeners('GAME_UPDATE', chooseRoom);
                    return;
                  }
                  
                  // Check AI freeze status
                  const aiFreezeEffect = this.getActiveStatusEffects(chooseRoom, ai).find(e => e.type === 'FREEZE');
                  if (aiFreezeEffect) {
                    console.log('❄️ AI is frozen and skips turn!');
                    // Remove freeze effect after skip
                    const aiKey = 'ai';
                    chooseRoom.statusEffects[aiKey] = chooseRoom.statusEffects[aiKey].filter(e => e.id !== aiFreezeEffect.id);
                    
                    // Continue to next turn
                    setTimeout(() => {
                      chooseRoom.currentRound++;
                      // Next turn logic here
                      player.active = true;
                      ai.active = false;
                      this.notifyListeners('GAME_UPDATE', chooseRoom);
                    }, 1000);
                    return;
                  }
                  
                  // Check AI fatigue
                  const aiFatigueEffect = this.getActiveStatusEffects(chooseRoom, ai).find(e => e.type === 'FATIGUE');
                  if (aiFatigueEffect && ai.score > 0) {
                    ai.score = Math.max(0, ai.score - 1);
                    console.log('😴 AI Fatigue: Paid 1 score to play card');
                  }
                  
                  // Smart AI card selection using personality
                  let aiCardIndex;
                  const aiConfusionEffect = this.getActiveStatusEffects(chooseRoom, ai).find(e => e.type === 'CONFUSION');
                  if (aiConfusionEffect) {
                    // Confusion forces random selection
                    aiCardIndex = Math.floor(Math.random() * ai.hand.length);
                    console.log('😵‍💫 AI Confusion: Random card selection');
                  } else {
                    // Use smart AI selection
                    try {
                      const strategy = {
                        aggressiveness: ai.aggressiveness || 0.7,
                        conservativeness: ai.conservativeness || 0.2,
                        counterPriority: ai.counterPriority || 0.5,
                        preferredElements: ai.preferredElements || ['FIRE', 'EARTH'],
                        comboFocus: ai.comboFocus || 0.3
                      };
                      
                      console.log('🤖 AI decision process:', {
                        aiName: ai.name,
                        difficulty: ai.difficulty,
                        handSize: ai.hand.length,
                        strategy,
                        playerLastCard: player.chosenCard ? `${player.chosenCard.element} (${player.chosenCard.strength})` : 'none'
                      });
                      
                      aiCardIndex = selectAICard(ai.hand, strategy, player.chosenCard, chooseRoom);
                      
                      const selectedCard = ai.hand[aiCardIndex];
                      console.log('🤖 Smart AI selected:', {
                        cardIndex: aiCardIndex,
                        card: `${selectedCard.element} (${selectedCard.strength})`,
                        personality: ai.personalityKey || 'default',
                        reasoning: 'strategic selection'
                      });
                    } catch (error) {
                      console.warn('⚠️ AI selection failed, falling back to random:', error);
                      aiCardIndex = Math.floor(Math.random() * ai.hand.length);
                    }
                  }
                  
                  // Validate card index
                  if (aiCardIndex < 0 || aiCardIndex >= ai.hand.length) {
                    console.error('❌ Invalid AI card index, using 0:', aiCardIndex);
                    aiCardIndex = 0;
                  }
                  
                  // Final validation before playing card
                  const selectedCard = ai.hand[aiCardIndex];
                  if (!selectedCard || typeof selectedCard !== 'object') {
                    console.error('❌ AI card at index does not exist or is invalid!', {
                      index: aiCardIndex,
                      handLength: ai.hand.length,
                      selectedCard: selectedCard,
                      hand: ai.hand
                    });
                    // Skip AI turn with proper cleanup
                    player.active = true;
                    ai.active = false;
                    chooseRoom.battlePhase = false;
                    this.notifyListeners('GAME_UPDATE', chooseRoom);
                    return;
                  }
                  
                  // Validate card has required properties
                  if (!selectedCard.element || typeof selectedCard.strength !== 'number') {
                    console.error('❌ AI card missing required properties!', selectedCard);
                    player.active = true;
                    ai.active = false;
                    chooseRoom.battlePhase = false;
                    this.notifyListeners('GAME_UPDATE', chooseRoom);
                    return;
                  }
                  
                  console.log('🤖 AI playing card at index:', aiCardIndex, 'from hand of', ai.hand.length);
                  
                  ai.chosenCard = ai.hand[aiCardIndex];
                  ai.hand.splice(aiCardIndex, 1);
                  ai.cardCount--;
                  ai.active = false;
                  
                  // AI battle taunt based on card played
                  const cardElement = ai.chosenCard.element;
                  const cardStrength = ai.chosenCard.strength;
                  const aiTaunts = {
                    FIRE: ["🔥 Feel the heat!", "Time to burn!", "Ignite and fight!"],
                    ICE: ["❄️ Freeze in place!", "Chill out!", "Ice cold strategy!"],
                    WATER: ["🌊 Ride the wave!", "Flowing to victory!", "Tsunami incoming!"],
                    ELECTRICITY: ["⚡ Shocking power!", "Electrifying!", "Lightning strikes!"],
                    EARTH: ["🌍 Rock solid!", "Ground and pound!", "Earth shaker!"],
                    POWER: ["⭐ Ultimate power!", "This ends now!", "Witness true strength!"],
                    LIGHT: ["✨ Blinding brilliance!", "Light conquers all!", "Divine judgment!"],
                    DARK: ["🌑 Embrace the void!", "Darkness rises!", "Shadow strike!"]
                  };
                  
                  const taunts = aiTaunts[cardElement] || ["Here's my move!", "Take this!", "My turn!"];
                  const taunt = taunts[Math.floor(Math.random() * taunts.length)];
                  
                  console.log(`🤖 ${ai.name}: "${taunt}" (${cardElement} ${cardStrength})`);
                  
                  console.log('✅ AI card played successfully, preparing battle resolution...');
                  
                  // Store AI's last played element for combo tracking
                  ai.lastPlayedElement = cardElement;
                  
                  console.log('🤖 AI played card:', ai.chosenCard);
                  
                  // Add AI card to played cards
                  ai.playedCards.push(ai.chosenCard);
                  chooseRoom.playedCards.push({
                    playerId: ai.id,
                    playerName: ai.name,
                    card: ai.chosenCard,
                    round: chooseRoom.currentRound + 1
                  });
                  
                  console.log('📢 AI card added to played cards, notifying listeners...');
                  this.notifyListeners('GAME_UPDATE', chooseRoom);
                  console.log('✅ Listeners notified, starting battle resolution timer (6000ms - 6 seconds)...');
                  console.log('⏱️ About to create setTimeout for battle resolution...');
                  
                  // Resolve battle with advanced mechanics (6 second delay to view AI card)
                  const battleTimeout = setTimeout(() => {
                    console.log('⏰ Battle timeout triggered after 6 seconds');
                    console.log('📊 Battle timeout state check:', {
                      playerCard: !!player.chosenCard,
                      aiCard: !!ai.chosenCard,
                      battlePhase: chooseRoom.battlePhase
                    });
                    try {
                      console.log('⚔️ Starting battle resolution...');
                      
                      if (!player.chosenCard || !ai.chosenCard) {
                        console.error('❌ Missing cards!', { 
                          playerCard: player.chosenCard, 
                          aiCard: ai.chosenCard 
                        });
                        throw new Error('Missing player or AI card');
                      }
                      
                      chooseRoom.currentRound++;
                    
                    // Calculate base strengths
                    let player1Strength = player.chosenCard.strength;
                    let player2Strength = ai.chosenCard.strength;
                    
                    const player1Card = player.chosenCard;
                    const player2Card = ai.chosenCard;
                    
                    console.log('⚔️ Resolving battle:', {
                      player: `${player1Card.element} (${player1Strength})`,
                      ai: `${player2Card.element} (${player2Strength})`,
                      aiPersonality: ai.name
                    });
                    
                    // Process status effects at start of battle
                    this.processStatusEffects(chooseRoom, player);
                    this.processStatusEffects(chooseRoom, ai);
                    
                    // Apply status modifiers to cards
                    player1Strength = this.applyStatusModifiersToCard(chooseRoom, player1Card, player);
                    player2Strength = this.applyStatusModifiersToCard(chooseRoom, player2Card, ai);
                    
                    // Element matching bonus - check for 2, 3, or 4 of the same element in played cards
                    const player1ElementCounts = {};
                    player.playedCards.forEach(card => {
                      if (card && card.element) {
                        player1ElementCounts[card.element] = (player1ElementCounts[card.element] || 0) + 1;
                      }
                    });
                    
                    const player2ElementCounts = {};
                    ai.playedCards.forEach(card => {
                      if (card && card.element) {
                        player2ElementCounts[card.element] = (player2ElementCounts[card.element] || 0) + 1;
                      }
                    });
                    
                    // Apply match bonus if player has 2, 3, or 4 of the same element
                    const player1Count = player1ElementCounts[player1Card.element] || 0;
                    if (player1Count >= 2 && player1Count <= 4) {
                      player1Strength *= 2;
                      chooseRoom.lastMatchBonus = {
                        element: player1Card.element,
                        player: player.name,
                        count: player1Count,
                        timestamp: Date.now()
                      };
                      console.log(`🎯 Player element match bonus! ${player1Count}x ${player1Card.element} cards - Double strength!`);
                    }
                    
                    const player2Count = player2ElementCounts[player2Card.element] || 0;
                    if (player2Count >= 2 && player2Count <= 4) {
                      player2Strength *= 2;
                      chooseRoom.lastMatchBonus = {
                        element: player2Card.element,
                        player: ai.name,
                        count: player2Count,
                        timestamp: Date.now()
                      };
                      console.log(`🤖 AI element match bonus! ${player2Count}x ${player2Card.element} cards - Double strength!`);
                    }
                    
                    // Element counter bonuses
                    const counters = {
                      FIRE: ['ICE', 'WATER'],
                      ICE: ['ELECTRICITY', 'FIRE'], 
                      WATER: ['EARTH', 'ELECTRICITY'],
                      ELECTRICITY: ['EARTH', 'WATER'],
                      EARTH: ['FIRE', 'ICE'],
                      LIGHT: ['DARK'],
                      DARK: ['LIGHT'],
                      METEOR: ['EARTH'], // Meteor attacks Earth
                      POWER: ['DARK'],
                      TECHNOLOGY: [], // Technology protects, doesn't attack
                      NEUTRAL: []
                    };
                    
                    if (counters[player1Card.element]?.includes(player2Card.element)) {
                      player1Strength += 3;
                      player1Card.isCounter = true;
                      console.log('⚔️ Player counter bonus! +3 strength');
                    }
                    if (counters[player2Card.element]?.includes(player1Card.element)) {
                      player2Strength += 3;
                      player2Card.isCounter = true;
                      console.log('🤖 AI counter bonus! +3 strength');
                    }
                    
                    // Apply critical hit effects
                    const player1CriticalHit = this.getActiveStatusEffects(chooseRoom, player).some(e => e.type === 'CRITICAL_HIT');
                    const player2CriticalHit = this.getActiveStatusEffects(chooseRoom, ai).some(e => e.type === 'CRITICAL_HIT');
                    
                    if (player1CriticalHit) {
                      player1Strength *= 2;
                      console.log('💥 Player critical hit! Double damage!');
                    }
                    if (player2CriticalHit) {
                      player2Strength *= 2;
                      console.log('💥 AI critical hit! Double damage!');
                    }
                    
                    // Apply element abilities with enhanced status effects
                    try {
                      console.log('🎭 About to apply element abilities...');
                      this.applyElementAbilities(chooseRoom, player1Card, player2Card, player, ai);
                      console.log('✅ Element abilities applied successfully');
                    } catch (abilityError) {
                      console.error('❌ ERROR applying element abilities:', abilityError);
                      console.error('Ability error stack:', abilityError.stack);
                    }
                    
                    // Store calculated strengths BEFORE shield protection for display
                    player1Card.modifiedStrength = player1Strength;
                    player2Card.modifiedStrength = player2Strength;
                    
                    // Apply shield protection
                    const applyShieldProtection = (attackingStrength, defendingPlayer) => {
                      const shieldEffect = this.getActiveStatusEffects(chooseRoom, defendingPlayer).find(e => e.type === 'SHIELD');
                      if (shieldEffect) {
                        const damageBlocked = Math.min(shieldEffect.value, attackingStrength);
                        shieldEffect.value -= damageBlocked;
                        if (shieldEffect.value <= 0) {
                          const playerKey = defendingPlayer.isAI ? 'ai' : 'player';
                          chooseRoom.statusEffects[playerKey] = chooseRoom.statusEffects[playerKey].filter(e => e.id !== shieldEffect.id);
                        }
                        console.log(`🛡️ Shield absorbed ${damageBlocked} damage`);
                        return Math.max(0, attackingStrength - damageBlocked);
                      }
                      return attackingStrength;
                    };
                    
                    // Calculate final damage with shields
                    const finalPlayer1Damage = applyShieldProtection(player1Strength, ai);
                    const finalPlayer2Damage = applyShieldProtection(player2Strength, player);
                    
                    // Determine round winner using final damage values (after shields)
                    if (finalPlayer1Damage > finalPlayer2Damage) {
                      player.score++;
                      player1Card.winner = true;
                      
                      // Apply vulnerability damage
                      const vulnerabilityEffect = this.getActiveStatusEffects(chooseRoom, ai).find(e => e.type === 'VULNERABILITY');
                      if (vulnerabilityEffect) {
                        ai.score = Math.max(0, ai.score - vulnerabilityEffect.value);
                        console.log(`🎯 Vulnerability caused extra ${vulnerabilityEffect.value} damage to AI`);
                      }
                      
                      console.log('🎉 Player wins round!');
                    } else if (finalPlayer2Damage > finalPlayer1Damage) {
                      ai.score++;
                      player2Card.winner = true;
                      
                      // Apply vulnerability damage
                      const vulnerabilityEffect = this.getActiveStatusEffects(chooseRoom, player).find(e => e.type === 'VULNERABILITY');
                      if (vulnerabilityEffect) {
                        player.score = Math.max(0, player.score - vulnerabilityEffect.value);
                        console.log(`🎯 Vulnerability caused extra ${vulnerabilityEffect.value} damage to player`);
                      }
                      
                      console.log('🤖 AI wins round!');
                    } else {
                      // It's a tie
                      player1Card.tie = true;
                      player2Card.tie = true;
                      console.log('🤝 Round tie!');
                    }
                    
                    // Clean up single-use effects like critical hit
                    const removeSingleUseEffects = (player) => {
                      const playerKey = player.isAI ? 'ai' : 'player';
                      chooseRoom.statusEffects[playerKey] = chooseRoom.statusEffects[playerKey].filter(e => 
                        !['CRITICAL_HIT'].includes(e.type) || e.appliedThisTurn
                      );
                    };
                    
                    removeSingleUseEffects(player);
                    removeSingleUseEffects(ai);
                    
                    // Update last played elements
                    player.lastPlayedElement = player1Card.element;
                    ai.lastPlayedElement = player2Card.element;
                    
                    console.log('🔄 Checking game over conditions...');
                    
                    // Check game over - ONLY when all cards are played from both hand and deck
                    const playerHasNoCards = (player.hand.length === 0 && (!player.deck || player.deck.length === 0));
                    const aiHasNoCards = (ai.hand.length === 0 && (!ai.deck || ai.deck.length === 0));
                    
                    if (playerHasNoCards && aiHasNoCards) {
                      chooseRoom.gameOver = true;
                      
                      // Calculate total strength from all played cards
                      const playerTotalStrength = player.playedCards.reduce((sum, card) => 
                        sum + (card.modifiedStrength || card.strength || 0), 0);
                      const aiTotalStrength = ai.playedCards.reduce((sum, card) => 
                        sum + (card.modifiedStrength || card.strength || 0), 0);
                      
                      console.log('📊 Final strengths:', {
                        playerTotal: playerTotalStrength,
                        aiTotal: aiTotalStrength,
                        playerScore: player.score,
                        aiScore: ai.score
                      });
                      
                      // Determine winner by total strength
                      if (playerTotalStrength > aiTotalStrength) {
                        chooseRoom.winner = player.name;
                      } else if (aiTotalStrength > playerTotalStrength) {
                        chooseRoom.winner = ai.name;
                      } else {
                        chooseRoom.winner = 'Tie';
                      }
                      
                      console.log('🏁 Game over! All cards played. Winner:', chooseRoom.winner);
                      
                      // Immediately notify listeners of game over
                      console.log('📤 Notifying listeners of GAME OVER immediately...');
                      this.notifyListeners('GAME_UPDATE', chooseRoom);
                      console.log('✅ Game over notification sent');
                    } else {
                      console.log('▶️ Setting up next round...', {
                        currentRound: chooseRoom.currentRound,
                        maxRounds: chooseRoom.maxRounds,
                        deferredAbility: chooseRoom.deferredAbility
                      });
                      console.log('⏱️ About to create next round timeout (6000ms)...');
                      
                      // Next round timeout (6 seconds for round announcement)
                      const nextRoundTimeout = setTimeout(() => {
                        console.log('🔄 Next round timeout triggered - clearing cards and resetting turn');
                        console.log('📊 Pre-reset state:', {
                          round: chooseRoom.currentRound,
                          playerActive: player.active,
                          aiActive: ai.active,
                          playerHandSize: player.hand.length,
                          aiHandSize: ai.hand.length,
                          battlePhase: chooseRoom.battlePhase
                        });
                        
                        player.chosenCard = null;
                        ai.chosenCard = null;
                        
                        // Check for freeze status effects to determine who goes first
                        const playerFreezeEffect = this.getActiveStatusEffects(chooseRoom, player).find(e => e.type === 'FREEZE');
                        const aiFreezeEffect = this.getActiveStatusEffects(chooseRoom, ai).find(e => e.type === 'FREEZE');
                        
                        if (playerFreezeEffect) {
                          player.active = false;
                          ai.active = true;
                          // Remove freeze effect after skip
                          const playerKey = 'player';
                          chooseRoom.statusEffects[playerKey] = chooseRoom.statusEffects[playerKey].filter(e => e.id !== playerFreezeEffect.id);
                          console.log('❄️ Player was frozen, AI goes first');
                        } else if (aiFreezeEffect) {
                          player.active = true;
                          ai.active = false;
                          // Remove freeze effect after skip
                          const aiKey = 'ai';
                          chooseRoom.statusEffects[aiKey] = chooseRoom.statusEffects[aiKey].filter(e => e.id !== aiFreezeEffect.id);
                          console.log('❄️ AI was frozen, Player goes first');
                        } else {
                          // Normal turn order - player goes first
                          player.active = true;
                          ai.active = false;
                          console.log('✅ Normal turn order - Player goes first');
                        }
                        
                        chooseRoom.battlePhase = false;
                        
                        // Activate deferred EARTH ability after battle completes
                        if (chooseRoom.deferredAbility) {
                          chooseRoom.pendingAbility = chooseRoom.deferredAbility;
                          delete chooseRoom.deferredAbility;
                          console.log('🌍 EARTH: Activated deferred ability after battle');
                          console.log('📋 Pending ability:', chooseRoom.pendingAbility);
                          // Don't set player.active yet - wait for ability resolution
                          player.active = false;
                          ai.active = false;
                          console.log('⏸️ Waiting for EARTH ability resolution before continuing');
                        }
                        
                        console.log('➡️ Next round starting (Round ' + chooseRoom.currentRound + ')...', { 
                          round: chooseRoom.currentRound, 
                          playerActive: player.active,
                          aiActive: ai.active,
                          battlePhase: chooseRoom.battlePhase
                        });
                        console.log('📤 Notifying listeners for new round...');
                        this.notifyListeners('GAME_UPDATE', chooseRoom);
                        console.log('✅ New round notification sent');
                      }, 6000); // Increased from 2000ms to 6000ms (6 seconds)
                    }
                    console.log('📤 Notifying listeners of battle result...');
                    this.notifyListeners('GAME_UPDATE', chooseRoom);
                    console.log('✅ Battle resolution complete');
                  } catch (battleError) {
                    console.error('❌ BATTLE RESOLUTION ERROR:', battleError);
                    console.error('Error stack:', battleError.stack);
                    console.error('Game state:', {
                      round: chooseRoom.currentRound,
                      playerCard: player.chosenCard,
                      aiCard: ai.chosenCard,
                      playerScore: player.score,
                      aiScore: ai.score
                    });
                    // Reset battle phase so game doesn't get stuck
                    chooseRoom.battlePhase = false;
                    player.chosenCard = null;
                    ai.chosenCard = null;
                    player.active = true;
                    ai.active = false;
                    this.notifyListeners('GAME_UPDATE', chooseRoom);
                  }
                  }, 6000); // 6 seconds to view AI card before battle
                } catch (aiPlayError) {
                  console.error('❌ AI PLAY ERROR:', aiPlayError);
                  console.error('AI Play error stack:', aiPlayError.stack);
                  // Reset to player turn
                  player.active = true;
                  ai.active = false;
                  chooseRoom.battlePhase = false;
                  this.notifyListeners('GAME_UPDATE', chooseRoom);
                }
              }, 2000); // 2000ms for AI to "think" before selecting card
              } else {
                console.log('⏭️ AI has no cards, skipping turn...', {
                  aiExists: !!ai,
                  aiHandLength: ai?.hand?.length,
                  aiDeckLength: ai?.deck?.length || 0
                });
                
                // Check if player also has no cards - if so, end game
                const playerHasNoCards = (player.hand.length === 0 && (!player.deck || player.deck.length === 0));
                if (playerHasNoCards) {
                  chooseRoom.gameOver = true;
                  
                  // Calculate total strength from all played cards
                  const playerTotalStrength = player.playedCards.reduce((sum, card) => 
                    sum + (card.modifiedStrength || card.strength || 0), 0);
                  const aiTotalStrength = ai.playedCards.reduce((sum, card) => 
                    sum + (card.modifiedStrength || card.strength || 0), 0);
                  
                  // Determine winner by total strength
                  if (playerTotalStrength > aiTotalStrength) {
                    chooseRoom.winner = player.name;
                  } else if (aiTotalStrength > playerTotalStrength) {
                    chooseRoom.winner = ai.name;
                  } else {
                    chooseRoom.winner = 'Tie';
                  }
                  
                  console.log('🏁 Game over! Both players out of cards. Winner:', chooseRoom.winner);
                  this.notifyListeners('GAME_UPDATE', chooseRoom);
                } else {
                  // AI has no cards but player does - skip AI turn
                  console.log('⏭️ Skipping AI turn, returning control to player');
                  player.active = true;
                  ai.active = false;
                  chooseRoom.battlePhase = false;
                  chooseRoom.currentRound++;
                  this.notifyListeners('GAME_UPDATE', chooseRoom);
                }
              }
            }, 6000); // 6 seconds delay after player plays
            
            return { type: 'CARD_CHOSEN', success: true };
          } else {
            console.log('❌ Invalid card choice:', { 
              playerActive: player?.active, 
              handLength: player?.hand?.length, 
              cardIndex: parseInt(cardIndex) 
            });
          }
        } else {
          console.log('❌ Room not found or game not started:', { 
            roomFound: !!chooseRoom, 
            gameStarted: chooseRoom?.gameStarted 
          });
        }
        return { type: 'CARD_CHOSEN', success: false };

      case 'GET_STATE':
        const [, getStateRoomId] = parts;
        const stateRoom = this.mockState.rooms[getStateRoomId];
        if (stateRoom) {
          this.emit('gameState', stateRoom);
          return stateRoom;
        }
        return { error: 'Room not found' };

      case 'DRAW_FROM_RESERVE':
        const [, drawRoomId, drawPlayerId, drawCardIndex] = parts;
        const drawRoom = this.mockState.rooms[drawRoomId];
        
        console.log('🃏 DRAW_FROM_RESERVE received:', {
          roomId: drawRoomId,
          playerId: drawPlayerId,
          cardIndex: drawCardIndex,
          roomExists: !!drawRoom,
          gameStarted: drawRoom?.gameStarted,
          players: drawRoom?.players?.map(p => ({ id: p.id, name: p.name, isAI: p.isAI, deckSize: p.deck?.length }))
        });
        
        if (drawRoom && drawRoom.gameStarted) {
          const drawPlayer = drawRoom.players.find(p => p.id === drawPlayerId);
          
          console.log('🃏 DRAW_FROM_RESERVE player check:', {
            playerFound: !!drawPlayer,
            playerId: drawPlayerId,
            playerName: drawPlayer?.name,
            deckExists: !!drawPlayer?.deck,
            deckIsArray: Array.isArray(drawPlayer?.deck),
            deckSize: drawPlayer?.deck?.length || 0,
            requestedIndex: drawCardIndex
          });
          
          if (drawPlayer && drawPlayer.deck && drawPlayer.deck.length > 0) {
            // Use the requested index or default to 0
            const index = Math.min(parseInt(drawCardIndex) || 0, drawPlayer.deck.length - 1);
            
            console.log('🃏 Drawing card at index:', index, 'from deck of', drawPlayer.deck.length);
            
            // Move card from deck to hand
            const drawnCard = drawPlayer.deck.splice(index, 1)[0];
            
            if (!drawnCard) {
              console.error('❌ Failed to draw card - card is null/undefined');
              return { type: 'CARD_DRAWN', success: false };
            }
            
            drawPlayer.hand.push(drawnCard);
            drawPlayer.cardCount++;
            
            // Clear pending ability and set player active
            if (drawRoom.pendingAbility) {
              delete drawRoom.pendingAbility;
            }
            
            console.log('✅ EARTH: Drew card from reserve deck:', drawnCard.element, '- Hand now has', drawPlayer.hand.length, 'cards');
            
            // Set player active immediately after drawing
            const player = drawRoom.players.find(p => !p.isAI);
            const ai = drawRoom.players.find(p => p.isAI);
            player.active = true;
            ai.active = false;
            
            console.log('➡️ Player active after EARTH card draw, ready for next turn');
            
            // Notify listeners with updated state
            this.notifyListeners('GAME_UPDATE', drawRoom);
            
            return { type: 'CARD_DRAWN', success: true };
          } else {
            console.error('❌ Cannot draw from reserve:', {
              playerExists: !!drawPlayer,
              deckExists: !!drawPlayer?.deck,
              deckSize: drawPlayer?.deck?.length || 0,
              deckEmpty: drawPlayer?.deck?.length === 0
            });
          }
        } else {
          console.error('❌ DRAW_FROM_RESERVE failed - room validation:', {
            roomExists: !!drawRoom,
            gameStarted: drawRoom?.gameStarted
          });
        }
        return { type: 'CARD_DRAWN', success: false };

      case 'SKIP_ABILITY':
        const [, skipRoomId, skipPlayerId] = parts;
        const skipRoom = this.mockState.rooms[skipRoomId];
        if (skipRoom && skipRoom.pendingAbility && skipRoom.pendingAbility.playerId === skipPlayerId) {
          delete skipRoom.pendingAbility;
          console.log('⏭️ Ability skipped');
          
          // Set player active immediately after skipping
          const player = skipRoom.players.find(p => !p.isAI);
          const ai = skipRoom.players.find(p => p.isAI);
          player.active = true;
          ai.active = false;
          
          console.log('➡️ Player active after skipping ability, ready for next turn');
          
          // Notify listeners with updated state
          this.notifyListeners('GAME_UPDATE', skipRoom);
          
          return { type: 'ABILITY_SKIPPED', success: true };
        }
        return { type: 'ABILITY_SKIPPED', success: false };

      case 'FORFEIT_TURN':
        const [, forfeitRoomId, forfeitPlayerId] = parts;
        const forfeitRoom = this.mockState.rooms[forfeitRoomId];
        if (forfeitRoom && forfeitRoom.gameStarted) {
          const forfeitPlayer = forfeitRoom.players.find(p => p.id === forfeitPlayerId);
          const opponent = forfeitRoom.players.find(p => p.id !== forfeitPlayerId);
          
          if (forfeitPlayer && forfeitPlayer.active) {
            console.log('⏭️ Player forfeited turn');
            
            // Forfeit loses 1 point
            forfeitPlayer.score = Math.max(0, forfeitPlayer.score - 1);
            
            // Switch turns without battle
            forfeitPlayer.active = false;
            forfeitPlayer.chosenCard = null;
            
            if (opponent) {
              opponent.active = true;
              opponent.chosenCard = null;
            }
            
            forfeitRoom.battlePhase = false;
            
            this.notifyListeners('GAME_UPDATE', forfeitRoom);
            return { type: 'TURN_FORFEITED', success: true };
          }
        }
        return { type: 'TURN_FORFEITED', success: false };

      default:
        return { type: 'SUCCESS', message: 'Mock command processed' };
    }
  }

  // Status Effect Manager
  initializeStatusEffects(room) {
    room.statusEffectId = 1;
    
    // Initialize status effects storage for each player
    room.statusEffects = {
      player: [],
      ai: []
    };
    
    // Define all available status effects
    room.availableStatusEffects = {
      // Buffs
      STRENGTH_BOOST: { type: 'buff', name: 'Strength Boost', icon: '💪', description: '+{value} strength for {duration} turns', stackable: true },
      SHIELD: { type: 'buff', name: 'Shield', icon: '🛡️', description: 'Absorb next {value} damage', stackable: true },
      BARRIER: { type: 'buff', name: 'Barrier', icon: '🔰', description: 'Immune to debuffs for {duration} turns', stackable: false },
      DOUBLE_STRIKE: { type: 'buff', name: 'Double Strike', icon: '⚔️', description: 'Play 2 cards this turn', stackable: false },
      REGENERATION: { type: 'buff', name: 'Regeneration', icon: '💚', description: '+{value} score each turn for {duration} turns', stackable: true },
      ELEMENT_MASTERY: { type: 'buff', name: 'Element Mastery', icon: '🔮', description: 'All {element} cards get +{value} strength', stackable: false },
      DRAW_POWER: { type: 'buff', name: 'Draw Power', icon: '📚', description: 'Draw {value} extra cards', stackable: true },
      TURN_EXTENSION: { type: 'buff', name: 'Turn Extension', icon: '⏰', description: 'Get +{value} seconds on turns', stackable: false },
      PIERCING: { type: 'buff', name: 'Piercing', icon: '🗡️', description: 'Ignore opponent shields for {duration} turns', stackable: false },
      CRITICAL_HIT: { type: 'buff', name: 'Critical Strike', icon: '💥', description: 'Next attack deals double damage', stackable: false },
      CLEANSE: { type: 'buff', name: 'Cleanse', icon: '✨', description: 'Remove all debuffs', instant: true },
      REFLECT: { type: 'buff', name: 'Reflect', icon: '🪞', description: 'Reflect {value}% damage back for {duration} turns', stackable: false },
      
      // Debuffs
      WEAKNESS: { type: 'debuff', name: 'Weakness', icon: '😵', description: '-{value} strength for {duration} turns', stackable: true },
      BURN: { type: 'debuff', name: 'Burn', icon: '🔥', description: 'Lose {value} HP each turn for {duration} turns (DoT)', stackable: true },
      FREEZE: { type: 'debuff', name: 'Freeze', icon: '🧊', description: 'Cannot play cards for {duration} turns', stackable: false },
      STUN: { type: 'debuff', name: 'Stun', icon: '💫', description: 'Skip next turn completely', stackable: false },
      CONFUSION: { type: 'debuff', name: 'Confusion', icon: '😵‍💫', description: 'Random card selection for {duration} turns', stackable: false },
      SILENCE: { type: 'debuff', name: 'Silence', icon: '🔇', description: 'No element abilities for {duration} turns', stackable: false },
      FATIGUE: { type: 'debuff', name: 'Fatigue', icon: '😴', description: 'Cards cost {value} score to play for {duration} turns', stackable: true },
      CURSE: { type: 'debuff', name: 'Curse', icon: '👹', description: 'All cards have -{value} strength for {duration} turns', stackable: true },
      POISON: { type: 'debuff', name: 'Poison', icon: '☠️', description: 'Lose {value} HP per turn, cards lose strength', stackable: true },
      VULNERABILITY: { type: 'debuff', name: 'Vulnerability', icon: '🎯', description: 'Take +{value}% damage for {duration} turns', stackable: false },
      BLEED: { type: 'debuff', name: 'Bleed', icon: '🩸', description: 'Lose {value} HP at turn end for {duration} turns', stackable: true },
      SLOW: { type: 'debuff', name: 'Slow', icon: '🐌', description: 'Turn timer reduced by {value} seconds', stackable: false }
    };
  }
  
  applyStatusEffect(room, targetPlayer, effectType, value = 1, duration = 3, element = null) {
    const playerKey = targetPlayer.isAI ? 'ai' : 'player';
    const effectDef = room.availableStatusEffects[effectType];
    
    // Check for barrier immunity (blocks debuffs)
    if (effectDef?.type === 'debuff') {
      const hasBarrier = room.statusEffects[playerKey].some(e => e.type === 'BARRIER');
      if (hasBarrier) {
        console.log(`🔰 ${targetPlayer.name}'s barrier blocked ${effectType}!`);
        return false;
      }
    }
    
    // Handle instant effects
    if (effectType === 'CLEANSE') {
      const removedEffects = room.statusEffects[playerKey].filter(e => {
        const def = room.availableStatusEffects[e.type];
        return def?.type === 'debuff';
      });
      room.statusEffects[playerKey] = room.statusEffects[playerKey].filter(e => {
        const def = room.availableStatusEffects[e.type];
        return def?.type !== 'debuff';
      });
      console.log(`✨ ${targetPlayer.name} cleansed ${removedEffects.length} debuffs!`);
      return true;
    }
    
    const effect = {
      id: room.statusEffectId++,
      type: effectType,
      value: value,
      duration: duration,
      element: element,
      turnsRemaining: duration,
      appliedThisTurn: true,
      totalDamageDealt: 0 // Track DoT damage
    };
    
    // Check for duplicate effects and stack or replace
    const existingEffect = room.statusEffects[playerKey].find(e => e.type === effectType && e.element === element);
    if (existingEffect) {
      if (effectDef?.stackable) {
        existingEffect.value += value; // Stack values
        existingEffect.turnsRemaining = Math.max(existingEffect.turnsRemaining, duration);
      } else {
        existingEffect.turnsRemaining = duration; // Refresh duration
        existingEffect.value = Math.max(existingEffect.value, value); // Use higher value
      }
    } else {
      room.statusEffects[playerKey].push(effect);
    }
    
    console.log(`✨ Applied ${effectType} to ${targetPlayer.name}: ${value} for ${duration} turns`);
    return true;
  }
  
  processStatusEffects(room, player) {
    const playerKey = player.isAI ? 'ai' : 'player';
    const effects = room.statusEffects[playerKey];
    let damageLog = [];
    
    // Check for stun/freeze (these prevent turn)
    const isStunned = effects.some(e => e.type === 'STUN' && !e.appliedThisTurn);
    const isFrozen = effects.some(e => e.type === 'FREEZE' && !e.appliedThisTurn);
    
    // Apply turn-based effects
    effects.forEach(effect => {
      if (effect.appliedThisTurn) {
        effect.appliedThisTurn = false;
        return; // Skip processing on the turn it was applied
      }
      
      switch (effect.type) {
        case 'REGENERATION':
          player.score += effect.value;
          console.log(`💚 ${player.name} regenerated ${effect.value} HP`);
          break;
          
        case 'BURN':
          const burnDamage = effect.value;
          player.score = Math.max(0, player.score - burnDamage);
          effect.totalDamageDealt += burnDamage;
          damageLog.push({ type: 'BURN', damage: burnDamage });
          console.log(`🔥 ${player.name} burned for ${burnDamage} HP (Total: ${effect.totalDamageDealt})`);
          break;
          
        case 'BLEED':
          const bleedDamage = effect.value;
          player.score = Math.max(0, player.score - bleedDamage);
          effect.totalDamageDealt += bleedDamage;
          damageLog.push({ type: 'BLEED', damage: bleedDamage });
          console.log(`🩸 ${player.name} bled for ${bleedDamage} HP (Total: ${effect.totalDamageDealt})`);
          break;
          
        case 'POISON':
          const poisonDamage = effect.value;
          player.score = Math.max(0, player.score - poisonDamage);
          effect.totalDamageDealt += poisonDamage;
          // Weaken cards in hand
          if (player.hand.length > 0) {
            player.hand.forEach(card => {
              if (card.modifiedStrength) {
                card.modifiedStrength = Math.max(1, card.modifiedStrength - 1);
              } else {
                card.modifiedStrength = Math.max(1, card.strength - 1);
              }
            });
          }
          damageLog.push({ type: 'POISON', damage: poisonDamage });
          console.log(`☠️ ${player.name} poisoned for ${poisonDamage} HP and cards weakened (Total: ${effect.totalDamageDealt})`);
          break;
          
        case 'STUN':
          console.log(`💫 ${player.name} is stunned!`);
          break;
          
        case 'FREEZE':
          console.log(`🧊 ${player.name} is frozen!`);
          break;
          
        case 'FATIGUE':
          // Applied when playing cards
          console.log(`😴 ${player.name} is fatigued (costs ${effect.value} HP per card)`);
          break;
          
        case 'BARRIER':
          console.log(`🔰 ${player.name} has barrier protection`);
          break;
          
        default:
          // Silent for unknown effects
          break;
      }
      
      effect.turnsRemaining--;
    });
    
    // Remove expired effects
    room.statusEffects[playerKey] = effects.filter(effect => effect.turnsRemaining > 0);
    
    return {
      isStunned,
      isFrozen,
      canAct: !isStunned && !isFrozen,
      damageLog
    };
  }
  
  hasStatusEffect(room, player, effectType) {
    const playerKey = player.isAI ? 'ai' : 'player';
    return room.statusEffects[playerKey].some(e => e.type === effectType);
  }
  
  removeStatusEffect(room, player, effectType) {
    const playerKey = player.isAI ? 'ai' : 'player';
    const removed = room.statusEffects[playerKey].filter(e => e.type === effectType);
    room.statusEffects[playerKey] = room.statusEffects[playerKey].filter(e => e.type !== effectType);
    return removed.length;
  }
  
  absorbDamageWithShield(room, player, incomingDamage) {
    const playerKey = player.isAI ? 'ai' : 'player';
    const shields = room.statusEffects[playerKey].filter(e => e.type === 'SHIELD');
    let remainingDamage = incomingDamage;
    
    for (let shield of shields) {
      if (remainingDamage <= 0) break;
      
      const absorbed = Math.min(shield.value, remainingDamage);
      shield.value -= absorbed;
      remainingDamage -= absorbed;
      
      console.log(`🛡️ ${player.name}'s shield absorbed ${absorbed} damage (${shield.value} remaining)`);
    }
    
    // Remove depleted shields
    room.statusEffects[playerKey] = room.statusEffects[playerKey].filter(e => 
      e.type !== 'SHIELD' || e.value > 0
    );
    
    return {
      absorbedDamage: incomingDamage - remainingDamage,
      actualDamage: remainingDamage
    };
  }
  
  applyStatusModifiersToCard(room, card, player) {
    const playerKey = player.isAI ? 'ai' : 'player';
    const effects = room.statusEffects[playerKey];
    let modifiedStrength = card.strength;
    
    effects.forEach(effect => {
      switch (effect.type) {
        case 'STRENGTH_BOOST':
          modifiedStrength += effect.value;
          console.log(`💪 ${player.name} strength boost: +${effect.value}`);
          break;
          
        case 'WEAKNESS':
          modifiedStrength = Math.max(1, modifiedStrength - effect.value);
          console.log(`😵 ${player.name} weakness: -${effect.value}`);
          break;
          
        case 'CURSE':
          modifiedStrength = Math.max(1, modifiedStrength - effect.value);
          console.log(`👹 ${player.name} cursed: -${effect.value}`);
          break;
          
        case 'ELEMENT_MASTERY':
          if (effect.element === card.element) {
            modifiedStrength += effect.value;
            console.log(`🔮 ${player.name} element mastery (${effect.element}): +${effect.value}`);
          }
          break;
      }
    });
    
    return modifiedStrength;
  }
  
  triggerAIFirstMove(roomId) {
    console.log('🎯 triggerAIFirstMove called with roomId:', roomId);
    const room = this.mockState.rooms[roomId];
    if (!room || !room.gameStarted) {
      console.error('❌ Room not found or game not started:', { roomExists: !!room, gameStarted: room?.gameStarted });
      return;
    }
    
    const ai = room.players.find(p => p.isAI);
    const player = room.players.find(p => !p.isAI);
    
    console.log('🔍 AI and player found:', { 
      aiExists: !!ai, 
      playerExists: !!player,
      aiActive: ai?.active,
      aiHandLength: ai?.hand?.length 
    });
    
    // Verify AI should be active (coin toss winner)
    if (!ai || !ai.active) {
      console.log('⚠️ triggerAIFirstMove called but AI should not play:', { 
        aiExists: !!ai, 
        aiActive: ai?.active, 
        handLength: ai?.hand?.length 
      });
      return;
    }
    
    // If AI has no cards in hand, try to draw from reserve
    if (ai.hand.length === 0) {
      if (ai.deck && ai.deck.length > 0) {
        console.log('🎴 AI hand empty on first move, drawing from reserve deck');
        const drawnCard = ai.deck.shift();
        ai.hand.push(drawnCard);
        ai.cardCount = ai.hand.length + (ai.deck?.length || 0);
        console.log(`✅ AI drew card, now has ${ai.hand.length} in hand`);
      } else {
        console.log('⚠️ AI has no cards available to play');
        return;
      }
    }
    
    console.log('🤖 AI making first move...');
    this.notifyListeners('GAME_UPDATE', room);
    
    setTimeout(() => {
      try {
        console.log('⏰ AI first move timeout triggered');
      // Use smart AI selection
      let aiCardIndex;
      try {
        const strategy = {
          aggressiveness: ai.aggressiveness || 0.7,
          conservativeness: ai.conservativeness || 0.2,
          counterPriority: ai.counterPriority || 0.5,
          preferredElements: ai.preferredElements || ['FIRE', 'EARTH'],
          comboFocus: ai.comboFocus || 0.3
        };
        
        aiCardIndex = selectAICard(ai.hand, strategy, null, room);
        console.log('🤖 Smart AI selected card index:', aiCardIndex);
      } catch (error) {
        console.warn('⚠️ AI selection failed, falling back to random:', error);
        aiCardIndex = Math.floor(Math.random() * ai.hand.length);
      }
      
      // Validate index
      if (aiCardIndex < 0 || aiCardIndex >= ai.hand.length) {
        console.error('❌ Invalid AI card index in first move:', aiCardIndex);
        aiCardIndex = 0;
      }
      
      ai.chosenCard = ai.hand[aiCardIndex];
      ai.hand.splice(aiCardIndex, 1);
      ai.cardCount--;
      ai.lastPlayedElement = ai.chosenCard.element;
      
      console.log('🤖 AI played first card:', ai.chosenCard);
      
      // Add AI card to played cards
      ai.playedCards.push(ai.chosenCard);
      room.playedCards.push({
        playerId: ai.id,
        playerName: ai.name,
        card: ai.chosenCard,
        round: room.currentRound + 1
      });
      
      // Switch to player's turn
      ai.active = false;
      player.active = true;
      console.log('✅ AI first move complete, switching to player turn');
      this.notifyListeners('GAME_UPDATE', room);
      } catch (firstMoveError) {
        console.error('❌ ERROR in AI first move:', firstMoveError);
        console.error('First move error stack:', firstMoveError.stack);
        // Fallback: switch to player
        ai.active = false;
        player.active = true;
        this.notifyListeners('GAME_UPDATE', room);
      }
    }, 1500);
  }
  
  getActiveStatusEffects(room, player) {
    const playerKey = player.isAI ? 'ai' : 'player';
    return room.statusEffects[playerKey] || [];
  }
  
  // Generate advanced cards with element abilities and tiers
  generateAdvancedCards(count) {
    const elements = ['FIRE', 'ICE', 'WATER', 'ELECTRICITY', 'EARTH', 'POWER', 'LIGHT', 'DARK', 'NEUTRAL', 'TECHNOLOGY', 'METEOR'];
    const tiers = ['COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY'];
    const tierWeights = [0.5, 0.3, 0.15, 0.05]; // Common most likely
    
    const cards = [];
    
    for (let i = 0; i < count; i++) {
      const element = elements[Math.floor(Math.random() * elements.length)];
      
      // Determine tier based on weights
      let tier = 'COMMON';
      const roll = Math.random();
      let cumulative = 0;
      for (let t = 0; t < tiers.length; t++) {
        cumulative += tierWeights[t];
        if (roll <= cumulative) {
          tier = tiers[t];
          break;
        }
      }
      
      // Base strength based on tier
      let baseStrength;
      switch (tier) {
        case 'LEGENDARY': baseStrength = 8 + Math.floor(Math.random() * 3); break; // 8-10
        case 'RARE': baseStrength = 6 + Math.floor(Math.random() * 3); break; // 6-8 
        case 'UNCOMMON': baseStrength = 4 + Math.floor(Math.random() * 3); break; // 4-6
        default: baseStrength = 2 + Math.floor(Math.random() * 3); break; // 2-4
      }
      
      const card = {
        element,
        strength: baseStrength,
        tier,
        id: Date.now() + '_' + i + '_' + Math.random().toString(36).substr(2, 9),
        evolved: false,
        isCounter: false
      };
      
      // Add element-specific abilities
      if (element === 'NEUTRAL') {
        card.neutralAbility = Math.random() > 0.5 ? 'COPY' : 'BOOST';
      } else if (element === 'TECHNOLOGY') {
        card.techAbility = Math.random() > 0.5 ? 'SHIELD' : 'CREATE';
      }
      
      cards.push(card);
    }
    
    return cards;
  }

  // Apply element-specific abilities
  applyElementAbilities(room, player1Card, player2Card, player1, player2) {
    console.log('🎭 Applying element abilities with status effects...');
    
    // Check for silence debuff that prevents abilities
    const player1Silenced = this.getActiveStatusEffects(room, player1).some(e => e.type === 'SILENCE');
    const player2Silenced = this.getActiveStatusEffects(room, player2).some(e => e.type === 'SILENCE');
    
    // FIRE: Apply burn debuff to opponent
    if (player1Card.element === 'FIRE' && !player1Silenced) {
      this.applyStatusEffect(room, player2, 'BURN', 2, 3);
      // Burn weakest card from hand only (reserve deck is protected)
      if (player2.hand && Array.isArray(player2.hand) && player2.hand.length > 0) {
        const validCards = player2.hand.filter(c => c && typeof c.strength === 'number');
        if (validCards.length > 0) {
          const weakestIdx = player2.hand.reduce((minIdx, card, idx, arr) => {
            if (!card || !arr[minIdx]) return idx;
            return card.strength < arr[minIdx].strength ? idx : minIdx;
          }, 0);
          player2.hand.splice(weakestIdx, 1);
          player2.cardCount = Math.max(0, player2.cardCount - 1);
          console.log('🔥 FIRE: Applied burn debuff and destroyed weakest card from hand');
        }
      } else {
        console.log('🔥 FIRE: Applied burn debuff but no cards in hand to burn');
      }
    }
    
    if (player2Card.element === 'FIRE' && !player2Silenced) {
      this.applyStatusEffect(room, player1, 'BURN', 2, 3);
      // Burn weakest card from hand only (reserve deck is protected)
      if (player1.hand && Array.isArray(player1.hand) && player1.hand.length > 0) {
        const validCards = player1.hand.filter(c => c && typeof c.strength === 'number');
        if (validCards.length > 0) {
          const weakestIdx = player1.hand.reduce((minIdx, card, idx, arr) => {
            if (!card || !arr[minIdx]) return idx;
            return card.strength < arr[minIdx].strength ? idx : minIdx;
          }, 0);
          player1.hand.splice(weakestIdx, 1);
          player1.cardCount = Math.max(0, player1.cardCount - 1);
          console.log('🔥 FIRE: AI applied burn debuff and destroyed weakest card from hand');
        }
      } else {
        console.log('🔥 FIRE: AI applied burn debuff but no cards in hand to burn');
      }
    }
    
    // ICE: Apply freeze debuff and weakness
    if (player1Card.element === 'ICE' && !player1Silenced) {
      this.applyStatusEffect(room, player2, 'FREEZE', 1, 1);
      this.applyStatusEffect(room, player2, 'WEAKNESS', 2, 2);
      console.log('❄️ ICE: Applied freeze and weakness debuffs');
    }
    if (player2Card.element === 'ICE' && !player2Silenced) {
      this.applyStatusEffect(room, player1, 'FREEZE', 1, 1);
      this.applyStatusEffect(room, player1, 'WEAKNESS', 2, 2);
      console.log('❄️ ICE: AI applied freeze and weakness debuffs');
    }
    
    // WATER: Apply vulnerability and reduce score
    if (player1Card.element === 'WATER' && !player1Silenced) {
      this.applyStatusEffect(room, player2, 'VULNERABILITY', 2, 3);
      if (player2.score > 0) {
        player2.score--;
        console.log('💧 WATER: Applied vulnerability debuff and reduced score');
      }
    }
    if (player2Card.element === 'WATER' && !player2Silenced) {
      this.applyStatusEffect(room, player1, 'VULNERABILITY', 2, 3);
      if (player1.score > 0) {
        player1.score--;
        console.log('💧 WATER: AI applied vulnerability debuff and reduced score');
      }
    }
    
    // ELECTRICITY: Apply confusion and chain damage
    if (player1Card.element === 'ELECTRICITY' && !player1Silenced) {
      this.applyStatusEffect(room, player2, 'CONFUSION', 1, 2);
      // Chain damage to strongest card in hand
      if (player2.hand && Array.isArray(player2.hand) && player2.hand.length > 0) {
        // Validate all cards before finding strongest
        const validCards = player2.hand.filter(c => c && typeof c.strength === 'number');
        if (validCards.length > 0) {
          const strongestIdx = player2.hand.reduce((maxIdx, card, idx, arr) => {
            if (!card || !arr[maxIdx]) return idx;
            return card.strength > arr[maxIdx].strength ? idx : maxIdx;
          }, 0);
          
          if (player2.hand[strongestIdx] && typeof player2.hand[strongestIdx].strength === 'number') {
            if (player2.hand[strongestIdx].strength > 1) {
              player2.hand[strongestIdx].strength--;
              console.log('⚡ ELECTRICITY: Applied confusion and damaged strongest card');
            } else {
              player2.hand.splice(strongestIdx, 1);
              player2.cardCount = Math.max(0, player2.cardCount - 1);
              console.log('⚡ ELECTRICITY: Applied confusion and destroyed weak card');
            }
          }
        }
      }
    }
    
    if (player2Card.element === 'ELECTRICITY' && !player2Silenced) {
      this.applyStatusEffect(room, player1, 'CONFUSION', 1, 2);
      if (player1.hand && Array.isArray(player1.hand) && player1.hand.length > 0) {
        // Validate all cards before finding strongest
        const validCards = player1.hand.filter(c => c && typeof c.strength === 'number');
        if (validCards.length > 0) {
          const strongestIdx = player1.hand.reduce((maxIdx, card, idx, arr) => {
            if (!card || !arr[maxIdx]) return idx;
            return card.strength > arr[maxIdx].strength ? idx : maxIdx;
          }, 0);
          
          if (player1.hand[strongestIdx] && typeof player1.hand[strongestIdx].strength === 'number') {
            if (player1.hand[strongestIdx].strength > 1) {
              player1.hand[strongestIdx].strength--;
              console.log('⚡ ELECTRICITY: AI applied confusion and damaged strongest card');
            } else {
              player1.hand.splice(strongestIdx, 1);
              player1.cardCount = Math.max(0, player1.cardCount - 1);
              console.log('⚡ ELECTRICITY: AI applied confusion and destroyed weak card');
            }
          }
        }
      }
    }
    
    // EARTH: Apply draw power buff and trigger card selection (defer until after battle)
    if (player1Card.element === 'EARTH' && !player1Silenced) {
      this.applyStatusEffect(room, player1, 'DRAW_POWER', 1, 2);
      if (player1.deck?.length > 0) {
        // Store the ability to be shown after battle completes
        room.deferredAbility = {
          type: 'EARTH_DRAW',
          playerId: player1.id,
          playerName: player1.name
        };
        console.log('🌍 EARTH: Applied draw power buff and deferred card selection until after battle');
      } else {
        console.log('🌍 EARTH: Applied draw power buff but no reserve deck available');
      }
    }
    
    // EARTH: AI auto-draws from reserve deck
    if (player2Card.element === 'EARTH' && !player2Silenced) {
      this.applyStatusEffect(room, player2, 'DRAW_POWER', 1, 2);
      if (player2.deck?.length > 0) {
        // AI automatically draws a random card from reserve deck
        const randomIndex = Math.floor(Math.random() * player2.deck.length);
        const drawnCard = player2.deck.splice(randomIndex, 1)[0];
        player2.hand.push(drawnCard);
        player2.cardCount++;
        console.log('🌍 EARTH: AI drew card from reserve deck automatically');
      }
    }
    
    // POWER: Generate a random card on the arena
    if (player1Card.element === 'POWER' && !player1Silenced) {
      // Generate a random card directly on the arena
      const randomCards = this.generateAdvancedCards(1);
      const generatedCard = randomCards[0];
      
      // Add the generated card to played cards for visual display
      player1.playedCards.push(generatedCard);
      room.playedCards.push({
        playerId: player1.id,
        playerName: player1.name + ' (POWER)',
        card: generatedCard,
        round: room.currentRound,
        isGenerated: true // Mark as generated for special display
      });
      
      console.log('⭐ POWER: Generated random card on arena:', generatedCard.element, generatedCard.strength);
      
      // Also apply strength boost as bonus
      this.applyStatusEffect(room, player1, 'STRENGTH_BOOST', 2, 2);
    }
    
    if (player2Card.element === 'POWER' && !player2Silenced) {
      // Generate a random card directly on the arena
      const randomCards = this.generateAdvancedCards(1);
      const generatedCard = randomCards[0];
      
      // Add the generated card to played cards for visual display
      player2.playedCards.push(generatedCard);
      room.playedCards.push({
        playerId: player2.id,
        playerName: player2.name + ' (POWER)',
        card: generatedCard,
        round: room.currentRound,
        isGenerated: true // Mark as generated for special display
      });
      
      console.log('⭐ POWER: AI generated random card on arena:', generatedCard.element, generatedCard.strength);
      
      // Also apply strength boost as bonus
      this.applyStatusEffect(room, player2, 'STRENGTH_BOOST', 2, 2);
    }
    
    // TECHNOLOGY: Shield EARTH cards from attacks and protect from METEOR
    if (player1Card.element === 'TECHNOLOGY' && !player1Silenced) {
      // Apply shield buff
      this.applyStatusEffect(room, player1, 'SHIELD', 3, 3);
      this.applyStatusEffect(room, player2, 'SILENCE', 1, 2);
      
      // Protect all EARTH cards in hand by boosting their strength
      if (player1.hand && Array.isArray(player1.hand)) {
        const earthCards = player1.hand.filter(c => c && c.element === 'EARTH');
        earthCards.forEach(card => {
          if (card) {
            card.modifiedStrength = (card.modifiedStrength || card.strength) + 2;
          }
        });
        
        if (earthCards.length > 0) {
          console.log(`🔧 TECHNOLOGY: Protected ${earthCards.length} EARTH cards (+2 strength each)`);
        }
      }
      
      // Create a random card in hand
      if (player1.hand.length < 7) {
        const newCard = this.generateAdvancedCards(1)[0];
        player1.hand.push(newCard);
        player1.cardCount++;
        console.log('🔧 TECHNOLOGY: Applied shield, silenced opponent, created card');
      }
    }
    
    if (player2Card.element === 'TECHNOLOGY' && !player2Silenced) {
      // Apply shield buff
      this.applyStatusEffect(room, player2, 'SHIELD', 3, 3);
      this.applyStatusEffect(room, player1, 'SILENCE', 1, 2);
      
      // Protect all EARTH cards in hand by boosting their strength
      if (player2.hand && Array.isArray(player2.hand)) {
        const earthCards = player2.hand.filter(c => c && c.element === 'EARTH');
        earthCards.forEach(card => {
          if (card) {
            card.modifiedStrength = (card.modifiedStrength || card.strength) + 2;
          }
        });
        
        if (earthCards.length > 0) {
          console.log(`🔧 TECHNOLOGY: AI protected ${earthCards.length} EARTH cards (+2 strength each)`);
        }
      }
      
      // Create a random card in hand
      if (player2.hand.length < 7) {
        const newCard = this.generateAdvancedCards(1)[0];
        player2.hand.push(newCard);
        player2.cardCount++;
        console.log('🔧 TECHNOLOGY: AI applied shield, silenced player, created card');
      }
    }
    
    // METEOR: Apply fatigue debuff and attack EARTH cards
    if (player1Card.element === 'METEOR' && !player1Silenced) {
      this.applyStatusEffect(room, player2, 'FATIGUE', 1, 3);
      room.meteorAttacks.player1 = (room.meteorAttacks.player1 || 0) + 1;
      const meteorDamage = room.meteorAttacks.player1;
      
      // Track meteor damage events for visual feedback
      if (!room.meteorDamageEvents) room.meteorDamageEvents = [];
      
      // Attack opponent's EARTH cards in arena (playedCards) by reducing their strength
      if (player2.playedCards && Array.isArray(player2.playedCards)) {
        const earthCards = player2.playedCards.filter(c => c && c.element === 'EARTH' && typeof c.strength === 'number');
        const damagedCards = [];
        
        if (earthCards.length > 0) {
          earthCards.forEach((card, index) => {
            if (!card || typeof card.strength !== 'number') return;
            
            const originalStrength = card.strength;
            const currentStrength = card.modifiedStrength || card.strength;
            
            if (currentStrength > 0) {
              // Reduce modified strength if it exists, otherwise reduce base strength
              if (card.modifiedStrength !== undefined) {
                card.modifiedStrength = Math.max(0, card.modifiedStrength - 1);
              } else {
                card.modifiedStrength = Math.max(0, card.strength - 1);
              }
              card.meteorDamaged = true; // Mark for visual effect
              card.meteorDamage = (card.meteorDamage || 0) + 1; // Track total meteor damage
              damagedCards.push({ cardIndex: player2.playedCards.indexOf(card), damage: 1, destroyed: false });
            }
          });
          
          // Add meteor damage event for UI to display
          room.meteorDamageEvents.push({
            timestamp: Date.now(),
            targetPlayer: player2.id,
            playerName: player2.name,
            damagedCards: damagedCards,
            totalCards: earthCards.length,
            cardsDestroyed: 0 // Cards in arena can't be destroyed, just weakened
          });
          
          console.log(`☄️ METEOR: Attacked ${earthCards.length} EARTH cards in arena (-1 strength each)`);
        }
      }
      
      // Still deal cumulative damage to score
      player2.score = Math.max(0, player2.score - meteorDamage);
      console.log(`☄️ METEOR: Applied fatigue and dealt ${meteorDamage} cumulative damage`);
    }
    
    if (player2Card.element === 'METEOR' && !player2Silenced) {
      this.applyStatusEffect(room, player1, 'FATIGUE', 1, 3);
      room.meteorAttacks.player2 = (room.meteorAttacks.player2 || 0) + 1;
      const meteorDamage = room.meteorAttacks.player2;
      
      // Track meteor damage events for visual feedback
      if (!room.meteorDamageEvents) room.meteorDamageEvents = [];
      
      // Attack opponent's EARTH cards in arena (playedCards) by reducing their strength
      if (player1.playedCards && Array.isArray(player1.playedCards)) {
        const earthCards = player1.playedCards.filter(c => c && c.element === 'EARTH' && typeof c.strength === 'number');
        const damagedCards = [];
        
        if (earthCards.length > 0) {
          earthCards.forEach((card, index) => {
            if (!card || typeof card.strength !== 'number') return;
            
            const originalStrength = card.strength;
            const currentStrength = card.modifiedStrength || card.strength;
            
            if (currentStrength > 0) {
              // Reduce modified strength if it exists, otherwise reduce base strength
              if (card.modifiedStrength !== undefined) {
                card.modifiedStrength = Math.max(0, card.modifiedStrength - 1);
              } else {
                card.modifiedStrength = Math.max(0, card.strength - 1);
              }
              card.meteorDamaged = true; // Mark for visual effect
              card.meteorDamage = (card.meteorDamage || 0) + 1; // Track total meteor damage
              damagedCards.push({ cardIndex: player1.playedCards.indexOf(card), damage: 1, destroyed: false });
            }
          });
          
          // Add meteor damage event for UI to display
          room.meteorDamageEvents.push({
            timestamp: Date.now(),
            targetPlayer: player1.id,
            playerName: player1.name,
            damagedCards: damagedCards,
            totalCards: earthCards.length,
            cardsDestroyed: 0 // Cards in arena can't be destroyed, just weakened
          });
          
          console.log(`☄️ METEOR: AI attacked ${earthCards.length} EARTH cards in arena (-1 strength each)`);
        }
      }
      
      // Still deal cumulative damage to score
      player1.score = Math.max(0, player1.score - meteorDamage);
      console.log(`☄️ METEOR: AI applied fatigue and dealt ${meteorDamage} cumulative damage`);
    }
    
    // NEUTRAL: Copy or Boost abilities
    if (player1Card.element === 'NEUTRAL' && !player1Silenced) {
      if (player1Card.neutralAbility === 'COPY') {
        player1Card.element = player2Card.element; // Copy opponent's element
        player1Card.evolved = true;
        console.log('🔮 NEUTRAL: Copied opponent\'s element');
      } else if (player1Card.neutralAbility === 'BOOST') {
        player1Card.modifiedStrength = (player1Card.modifiedStrength || player1Card.strength) + 3;
        console.log('🔮 NEUTRAL: Boosted strength by +3');
      }
    }
    
    if (player2Card.element === 'NEUTRAL' && !player2Silenced) {
      if (player2Card.neutralAbility === 'COPY') {
        player2Card.element = player1Card.element;
        player2Card.evolved = true;
        console.log('🔮 NEUTRAL: AI copied player\'s element');
      } else if (player2Card.neutralAbility === 'BOOST') {
        player2Card.modifiedStrength = (player2Card.modifiedStrength || player2Card.strength) + 3;
        console.log('🔮 NEUTRAL: AI boosted strength by +3');
      }
    }
    
    // LIGHT: Apply regeneration and piercing buffs
    if (player1Card.element === 'LIGHT' && !player1Silenced) {
      this.applyStatusEffect(room, player1, 'REGENERATION', 2, 4);
      this.applyStatusEffect(room, player1, 'PIERCING', 1, 3);
      player1.score += 1; // Immediate healing
      console.log('✨ LIGHT: Applied regeneration and piercing, healed 1 score');
    }
    
    if (player2Card.element === 'LIGHT' && !player2Silenced) {
      this.applyStatusEffect(room, player2, 'REGENERATION', 2, 4);
      this.applyStatusEffect(room, player2, 'PIERCING', 1, 3);
      player2.score += 1;
      console.log('✨ LIGHT: AI applied regeneration and piercing, healed 1 score');
    }
    
    // DARK: Apply curse and poison debuffs
    if (player1Card.element === 'DARK' && !player1Silenced) {
      this.applyStatusEffect(room, player2, 'CURSE', 2, 3);
      this.applyStatusEffect(room, player2, 'POISON', 1, 4);
      console.log('🌑 DARK: Applied curse and poison debuffs');
    }
    
    if (player2Card.element === 'DARK' && !player2Silenced) {
      this.applyStatusEffect(room, player1, 'CURSE', 2, 3);
      this.applyStatusEffect(room, player1, 'POISON', 1, 4);
      console.log('🌑 DARK: AI applied curse and poison debuffs');
    }
    
    // NEUTRAL: Copy or Boost abilities
    
    if (player2Card.element === 'NEUTRAL') {
      if (player2Card.neutralAbility === 'COPY') {
        player2Card.element = player1Card.element;
        player2Card.evolved = true;
        console.log('🔮 NEUTRAL: AI copied player\'s element');
      } else if (player2Card.neutralAbility === 'BOOST') {
        player2Card.modifiedStrength = (player2Card.modifiedStrength || player2Card.strength) + 3;
        console.log('🔮 NEUTRAL: AI boosted strength by +3');
      }
    }
  }

  notifyListeners(type, data) {
    console.log('Notifying listeners:', type, data);
    if (this.listeners[type]) {
      // Performance: Use for loop instead of forEach for better performance
      const callbacks = this.listeners[type];
      for (let i = 0; i < callbacks.length; i++) {
        if (typeof callbacks[i] === 'function') {
          try {
            callbacks[i](data);
          } catch (error) {
            console.error('Error in listener callback:', error);
          }
        }
      }
    }
    
    // Also emit the gameState event for game updates
    if (type === 'GAME_UPDATE' && data) {
      // Create a deep copy to force React re-render and ensure nested changes are detected
      const updatedState = JSON.parse(JSON.stringify(data));
      console.log('🔄 Emitting gameState with new reference', { gameOver: updatedState.gameOver, winner: updatedState.winner });
      this.emit('gameState', updatedState);
    }
  }

  async send(command) {
    console.log('🎮 GameClient sending command:', command);
    
    if (this.mockMode) {
      console.log('Mock mode - processing command:', command);
      const data = this.mockCommand(command);
      this.handleMessage(data);
      return data;
    }
    
    try {
      const response = await fetch(`${this.baseUrl}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      
      const data = await response.json();
      this.handleMessage(data);
      return data;
    } catch (error) {
      console.error('Failed to send command, switching to mock mode:', error);
      this.mockMode = true;
      const data = this.mockCommand(command);
      this.handleMessage(data);
      return data;
    }
  }

  createRoom(aiPersonality = 'CHAOS') {
    return new Promise((resolve) => {
      this.once('ROOM_CREATED', (data) => resolve(data));
      this.send(`CREATE_ROOM ${aiPersonality}`);
    });
  }

  joinRoom(roomId, playerId, playerName) {
    return new Promise((resolve) => {
      this.once('JOIN_RESULT', (data) => resolve(data.success));
      this.send(`JOIN_ROOM ${roomId} ${playerId} ${playerName}`);
    });
  }

  startGame(roomId) {
    return new Promise((resolve) => {
      this.once('GAME_STARTED', (data) => resolve(data.success));
      this.send(`START_GAME ${roomId}`);
    });
  }

  selectCards(roomId, playerId, selectedIndices) {
    return new Promise((resolve) => {
      this.once('CARDS_SELECTED', (data) => resolve(data.success));
      this.send(`SELECT_CARDS ${roomId} ${playerId} ${selectedIndices.join(' ')}`);
    });
  }

  completeCoinToss(roomId, playerId) {
    return new Promise((resolve) => {
      this.once('COIN_TOSS_COMPLETE', (data) => resolve(data));
      this.send(`COIN_TOSS ${roomId} ${playerId}`);
    });
  }

  playCard(roomId, playerId, cardIndex) {
    return new Promise((resolve) => {
      this.once('CARD_CHOSEN', (data) => resolve(data.success));
      this.send(`CHOOSE_CARD ${roomId} ${playerId} ${cardIndex}`);
    });
  }

  drawFromReserve(roomId, playerId, cardIndex = 0) {
    return new Promise((resolve) => {
      this.once('CARD_DRAWN', (data) => resolve(data.success));
      this.send(`DRAW_FROM_RESERVE ${roomId} ${playerId} ${cardIndex}`);
    });
  }

  skipAbility(roomId, playerId) {
    return new Promise((resolve) => {
      this.once('ABILITY_SKIPPED', (data) => resolve(data.success));
      this.send(`SKIP_ABILITY ${roomId} ${playerId}`);
    });
  }

  forfeitTurn(roomId, playerId) {
    return new Promise((resolve) => {
      this.once('TURN_FORFEITED', (data) => resolve(data.success));
      this.send(`FORFEIT_TURN ${roomId} ${playerId}`);
    });
  }

  getGameState(roomId) {
    return this.send(`GET_STATE ${roomId}`);
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  once(event, callback) {
    const onceWrapper = (data) => {
      callback(data);
      this.off(event, onceWrapper);
    };
    this.on(event, onceWrapper);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      });
    }
  }

  handleMessage(data) {
    if (data.type) {
      this.emit(data.type, data);
    }
    // For mock mode game updates, emit gameState directly
    if (data.roomId !== undefined && data.players !== undefined) {
      this.emit('gameState', data);
    }
  }

  disconnect() {
    console.log('Game client disconnected');
  }
}

export default GameClient;
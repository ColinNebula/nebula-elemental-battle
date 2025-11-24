/**
 * WebAssembly Game Engine Wrapper
 * 
 * Provides a JavaScript interface to the C++ game logic compiled to WebAssembly.
 * This offers significant performance improvements for game calculations.
 */

class WasmGameEngine {
  constructor() {
    this.module = null;
    this.initialized = false;
    this.initPromise = null;
  }

  /**
   * Initialize the WASM module
   * @returns {Promise<WasmGameEngine>}
   */
  async initialize() {
    // Return existing promise if already initializing
    if (this.initPromise) {
      return this.initPromise;
    }

    // Return immediately if already initialized
    if (this.initialized) {
      return this;
    }

    this.initPromise = (async () => {
      try {
        console.log('Loading WebAssembly game engine...');
        
        // Dynamically import the WASM module
        const GameEngine = await import('../../public/wasm/game-engine.js');
        this.module = await GameEngine.default();
        
        console.log('✓ WASM module loaded');
        
        // Wrap C++ functions for easier use
        this.wrapFunctions();
        
        this.initialized = true;
        return this;
      } catch (error) {
        console.error('Failed to load WASM module:', error);
        console.warn('Falling back to JavaScript game logic');
        // Don't throw - allow fallback to JS implementation
        return null;
      }
    })();

    return this.initPromise;
  }

  /**
   * Wrap C++ functions with JavaScript-friendly interfaces
   */
  wrapFunctions() {
    if (!this.module) return;

    // Note: These will be implemented once we export the C++ functions properly
    // For now, we'll create placeholder wrappers
    
    this._createRoom = this.module.cwrap('createRoom', 'string', ['number']);
    this._joinRoom = this.module.cwrap('joinRoom', 'number', ['string', 'string', 'string']);
    this._startGame = this.module.cwrap('startGame', 'number', ['string']);
    this._playCard = this.module.cwrap('playCard', 'number', ['string', 'string', 'number']);
    this._getGameState = this.module.cwrap('getGameState', 'string', ['string']);
  }

  /**
   * Check if WASM is available and initialized
   * @returns {boolean}
   */
  isAvailable() {
    return this.initialized && this.module !== null;
  }

  /**
   * Create a new game room
   * @param {number} maxPlayers - Maximum number of players (default: 2)
   * @returns {string} Room ID
   */
  createRoom(maxPlayers = 2) {
    if (!this.isAvailable()) {
      throw new Error('WASM module not initialized');
    }
    return this._createRoom(maxPlayers);
  }

  /**
   * Join an existing game room
   * @param {string} roomId - Room ID to join
   * @param {string} playerId - Player ID
   * @param {string} playerName - Player name
   * @returns {boolean} Success status
   */
  joinRoom(roomId, playerId, playerName) {
    if (!this.isAvailable()) {
      throw new Error('WASM module not initialized');
    }
    return this._joinRoom(roomId, playerId, playerName) === 1;
  }

  /**
   * Start the game in a room
   * @param {string} roomId - Room ID
   * @returns {boolean} Success status
   */
  startGame(roomId) {
    if (!this.isAvailable()) {
      throw new Error('WASM module not initialized');
    }
    return this._startGame(roomId) === 1;
  }

  /**
   * Play a card
   * @param {string} roomId - Room ID
   * @param {string} playerId - Player ID
   * @param {number} cardIndex - Index of card in hand
   * @returns {boolean} Success status
   */
  playCard(roomId, playerId, cardIndex) {
    if (!this.isAvailable()) {
      throw new Error('WASM module not initialized');
    }
    return this._playCard(roomId, playerId, cardIndex) === 1;
  }

  /**
   * Get current game state
   * @param {string} roomId - Room ID
   * @returns {Object} Game state object
   */
  getGameState(roomId) {
    if (!this.isAvailable()) {
      throw new Error('WASM module not initialized');
    }
    const stateJson = this._getGameState(roomId);
    return JSON.parse(stateJson);
  }

  /**
   * Calculate battle result between two cards
   * This is a pure calculation function that doesn't modify game state
   * @param {Object} card1 - First card
   * @param {Object} card2 - Second card
   * @returns {Object} Battle result
   */
  calculateBattleResult(card1, card2) {
    // For now, implement in JS
    // TODO: Move this to WASM for better performance
    const result = {
      winner: null,
      card1Strength: card1.strength,
      card2Strength: card2.strength,
      fusion: null
    };

    // Check for elemental advantages
    const advantages = {
      'fire': ['ice'],
      'ice': ['water'],
      'water': ['fire'],
      'electricity': ['water'],
      'earth': ['electricity']
    };

    let card1Total = card1.strength;
    let card2Total = card2.strength;

    // Apply elemental bonuses
    if (advantages[card1.element]?.includes(card2.element)) {
      card1Total += 2;
    }
    if (advantages[card2.element]?.includes(card1.element)) {
      card2Total += 2;
    }

    result.card1Strength = card1Total;
    result.card2Strength = card2Total;

    if (card1Total > card2Total) {
      result.winner = 1;
    } else if (card2Total > card1Total) {
      result.winner = 2;
    } else {
      result.winner = 0; // Tie
    }

    return result;
  }
}

// Export singleton instance
export default new WasmGameEngine();

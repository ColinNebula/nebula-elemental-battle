// Tournament system with brackets and increasing difficulty

export const TOURNAMENT_TIERS = {
  BRONZE: {
    name: 'Bronze Tournament',
    rounds: 3,
    reward: { coins: 300, exp: 100 },
    difficulty: 'easy',
    color: '#cd7f32'
  },
  SILVER: {
    name: 'Silver Tournament',
    rounds: 4,
    reward: { coins: 600, exp: 250 },
    difficulty: 'medium',
    color: '#c0c0c0'
  },
  GOLD: {
    name: 'Gold Tournament',
    rounds: 5,
    reward: { coins: 1200, exp: 500 },
    difficulty: 'hard',
    color: '#ffd700'
  },
  PLATINUM: {
    name: 'Platinum Tournament',
    rounds: 6,
    reward: { coins: 2500, exp: 1000 },
    difficulty: 'expert',
    color: '#e5e4e2'
  }
};

export class TournamentSystem {
  constructor() {
    this.currentTournament = this.loadCurrentTournament();
  }

  // Load current tournament from localStorage
  loadCurrentTournament() {
    const saved = localStorage.getItem('currentTournament');
    return saved ? JSON.parse(saved) : null;
  }

  // Save tournament progress
  saveTournament() {
    localStorage.setItem('currentTournament', JSON.stringify(this.currentTournament));
  }

  // Start a new tournament
  startTournament(tier = 'BRONZE') {
    const tournamentConfig = TOURNAMENT_TIERS[tier];
    
    this.currentTournament = {
      tier,
      name: tournamentConfig.name,
      totalRounds: tournamentConfig.rounds,
      currentRound: 1,
      wins: 0,
      losses: 0,
      active: true,
      startedAt: Date.now(),
      bracket: this.generateBracket(tournamentConfig.rounds, tournamentConfig.difficulty)
    };

    this.saveTournament();
    return this.currentTournament;
  }

  // Generate tournament bracket with opponents
  generateBracket(rounds, difficulty) {
    const bracket = [];
    const totalOpponents = Math.pow(2, rounds) - 1;

    for (let i = 0; i < totalOpponents; i++) {
      const round = Math.floor(Math.log2(i + 2));
      const opponentStrength = this.getOpponentStrength(round, difficulty);
      
      bracket.push({
        round,
        opponent: this.generateOpponent(opponentStrength),
        completed: false,
        won: false
      });
    }

    return bracket;
  }

  // Get opponent strength based on round and difficulty
  getOpponentStrength(round, difficulty) {
    const baseStrength = {
      easy: 0.7,
      medium: 0.85,
      hard: 1.0,
      expert: 1.2
    }[difficulty];

    return baseStrength + (round * 0.15);
  }

  // Generate opponent with AI personality
  generateOpponent(strengthMultiplier) {
    const personalities = [
      'The Challenger',
      'The Strategist',
      'The Berserker',
      'The Tactician',
      'The Champion',
      'The Mastermind',
      'The Warrior',
      'The Legend'
    ];

    return {
      name: personalities[Math.floor(Math.random() * personalities.length)],
      strengthMultiplier,
      deckBonus: Math.floor(strengthMultiplier * 2),
      personality: strengthMultiplier > 1.0 ? 'aggressive' : 'balanced'
    };
  }

  // Complete a match in the tournament
  completeMatch(won) {
    if (!this.currentTournament || !this.currentTournament.active) {
      return { error: 'No active tournament' };
    }

    const currentMatch = this.currentTournament.bracket[this.currentTournament.currentRound - 1];
    
    if (currentMatch) {
      currentMatch.completed = true;
      currentMatch.won = won;
    }

    if (won) {
      this.currentTournament.wins++;
      this.currentTournament.currentRound++;

      // Check if tournament is complete
      if (this.currentTournament.currentRound > this.currentTournament.totalRounds) {
        return this.completeTournament(true);
      }
    } else {
      this.currentTournament.losses++;
      this.currentTournament.active = false;
      return this.completeTournament(false);
    }

    this.saveTournament();
    return {
      continue: true,
      tournament: this.currentTournament
    };
  }

  // Complete the tournament
  completeTournament(won) {
    const tier = TOURNAMENT_TIERS[this.currentTournament.tier];
    this.currentTournament.active = false;
    this.currentTournament.completedAt = Date.now();
    this.currentTournament.champion = won;

    const result = {
      won,
      tournament: this.currentTournament,
      reward: won ? tier.reward : { coins: Math.floor(tier.reward.coins * 0.3), exp: Math.floor(tier.reward.exp * 0.3) },
      nextTier: won ? this.getNextTier() : null
    };

    // Save completion to history
    this.saveTournamentToHistory();
    
    // Clear current tournament
    localStorage.removeItem('currentTournament');
    this.currentTournament = null;

    return result;
  }

  // Save tournament to history
  saveTournamentToHistory() {
    const history = this.getTournamentHistory();
    history.push(this.currentTournament);
    
    // Keep only last 20 tournaments
    if (history.length > 20) {
      history.shift();
    }
    
    localStorage.setItem('tournamentHistory', JSON.stringify(history));
  }

  // Get tournament history
  getTournamentHistory() {
    const saved = localStorage.getItem('tournamentHistory');
    return saved ? JSON.parse(saved) : [];
  }

  // Get next available tier
  getNextTier() {
    const tiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
    const currentIndex = tiers.indexOf(this.currentTournament.tier);
    return currentIndex < tiers.length - 1 ? tiers[currentIndex + 1] : null;
  }

  // Get current match opponent
  getCurrentOpponent() {
    if (!this.currentTournament || !this.currentTournament.active) {
      return null;
    }

    const matchIndex = this.currentTournament.currentRound - 1;
    return this.currentTournament.bracket[matchIndex]?.opponent;
  }

  // Get tournament progress
  getProgress() {
    if (!this.currentTournament) {
      return null;
    }

    return {
      currentRound: this.currentTournament.currentRound,
      totalRounds: this.currentTournament.totalRounds,
      wins: this.currentTournament.wins,
      losses: this.currentTournament.losses,
      bracket: this.currentTournament.bracket
    };
  }

  // Abandon current tournament
  abandonTournament() {
    if (this.currentTournament) {
      this.currentTournament.active = false;
      this.currentTournament.abandoned = true;
      this.saveTournamentToHistory();
      localStorage.removeItem('currentTournament');
      this.currentTournament = null;
    }
  }
}

export const tournamentSystem = new TournamentSystem();

export default tournamentSystem;

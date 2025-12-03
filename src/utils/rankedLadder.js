/**
 * Ranked Ladder System
 * Provides competitive progression with ranks, leagues, and seasonal rewards
 */

// Rank Definitions
export const RANKS = {
  // Bronze League
  BRONZE_III: { id: 'bronze_3', name: 'Bronze III', tier: 'BRONZE', division: 3, minPoints: 0, icon: '🥉', color: '#CD7F32' },
  BRONZE_II: { id: 'bronze_2', name: 'Bronze II', tier: 'BRONZE', division: 2, minPoints: 100, icon: '🥉', color: '#CD7F32' },
  BRONZE_I: { id: 'bronze_1', name: 'Bronze I', tier: 'BRONZE', division: 1, minPoints: 200, icon: '🥉', color: '#CD7F32' },
  
  // Silver League
  SILVER_III: { id: 'silver_3', name: 'Silver III', tier: 'SILVER', division: 3, minPoints: 300, icon: '🥈', color: '#C0C0C0' },
  SILVER_II: { id: 'silver_2', name: 'Silver II', tier: 'SILVER', division: 2, minPoints: 400, icon: '🥈', color: '#C0C0C0' },
  SILVER_I: { id: 'silver_1', name: 'Silver I', tier: 'SILVER', division: 1, minPoints: 500, icon: '🥈', color: '#C0C0C0' },
  
  // Gold League
  GOLD_III: { id: 'gold_3', name: 'Gold III', tier: 'GOLD', division: 3, minPoints: 650, icon: '🥇', color: '#FFD700' },
  GOLD_II: { id: 'gold_2', name: 'Gold II', tier: 'GOLD', division: 2, minPoints: 800, icon: '🥇', color: '#FFD700' },
  GOLD_I: { id: 'gold_1', name: 'Gold I', tier: 'GOLD', division: 1, minPoints: 950, icon: '🥇', color: '#FFD700' },
  
  // Platinum League
  PLATINUM_III: { id: 'platinum_3', name: 'Platinum III', tier: 'PLATINUM', division: 3, minPoints: 1150, icon: '💎', color: '#E5E4E2' },
  PLATINUM_II: { id: 'platinum_2', name: 'Platinum II', tier: 'PLATINUM', division: 2, minPoints: 1350, icon: '💎', color: '#E5E4E2' },
  PLATINUM_I: { id: 'platinum_1', name: 'Platinum I', tier: 'PLATINUM', division: 1, minPoints: 1550, icon: '💎', color: '#E5E4E2' },
  
  // Diamond League
  DIAMOND_III: { id: 'diamond_3', name: 'Diamond III', tier: 'DIAMOND', division: 3, minPoints: 1800, icon: '💠', color: '#B9F2FF' },
  DIAMOND_II: { id: 'diamond_2', name: 'Diamond II', tier: 'DIAMOND', division: 2, minPoints: 2050, icon: '💠', color: '#B9F2FF' },
  DIAMOND_I: { id: 'diamond_1', name: 'Diamond I', tier: 'DIAMOND', division: 1, minPoints: 2300, icon: '💠', color: '#B9F2FF' },
  
  // Master League
  MASTER_III: { id: 'master_3', name: 'Master III', tier: 'MASTER', division: 3, minPoints: 2600, icon: '👑', color: '#9C27B0' },
  MASTER_II: { id: 'master_2', name: 'Master II', tier: 'MASTER', division: 2, minPoints: 2900, icon: '👑', color: '#9C27B0' },
  MASTER_I: { id: 'master_1', name: 'Master I', tier: 'MASTER', division: 1, minPoints: 3200, icon: '👑', color: '#9C27B0' },
  
  // Grandmaster League
  GRANDMASTER: { id: 'grandmaster', name: 'Grandmaster', tier: 'GRANDMASTER', division: 1, minPoints: 3600, icon: '🏆', color: '#FF4500' },
  
  // Champion (Top 100)
  CHAMPION: { id: 'champion', name: 'Champion', tier: 'CHAMPION', division: 1, minPoints: 4500, icon: '⭐', color: '#FFD700' },
  
  // Legend (Top 10)
  LEGEND: { id: 'legend', name: 'Legend', tier: 'LEGEND', division: 1, minPoints: 6000, icon: '🌟', color: '#FF1493' }
};

// League info for tier rewards
export const LEAGUES = {
  BRONZE: { name: 'Bronze', color: '#CD7F32', seasonReward: { currency: 100, cardPacks: 1 } },
  SILVER: { name: 'Silver', color: '#C0C0C0', seasonReward: { currency: 250, cardPacks: 2 } },
  GOLD: { name: 'Gold', color: '#FFD700', seasonReward: { currency: 500, cardPacks: 3, rareCard: true } },
  PLATINUM: { name: 'Platinum', color: '#E5E4E2', seasonReward: { currency: 800, cardPacks: 4, rareCard: true, cosmetic: 'platinum_border' } },
  DIAMOND: { name: 'Diamond', color: '#B9F2FF', seasonReward: { currency: 1200, cardPacks: 5, epicCard: true, cosmetic: 'diamond_border' } },
  MASTER: { name: 'Master', color: '#9C27B0', seasonReward: { currency: 2000, cardPacks: 7, epicCard: true, cosmetic: 'master_avatar' } },
  GRANDMASTER: { name: 'Grandmaster', color: '#FF4500', seasonReward: { currency: 3000, cardPacks: 10, legendaryCard: true, cosmetic: 'grandmaster_title' } },
  CHAMPION: { name: 'Champion', color: '#FFD700', seasonReward: { currency: 5000, cardPacks: 15, legendaryCard: true, cosmetic: 'champion_crown' } },
  LEGEND: { name: 'Legend', color: '#FF1493', seasonReward: { currency: 10000, cardPacks: 20, legendaryCard: true, cosmetic: 'legend_aura', exclusive: true } }
};

// Win/Loss point calculations
const POINT_CONFIG = {
  baseWinPoints: 25,
  baseLossPoints: -15,
  winStreakBonus: 5,      // Per win in streak
  maxWinStreakBonus: 25,  // Cap at 5 win streak
  underdogBonus: 10,      // Beat higher rank
  dominationBonus: 5,     // Win by large margin
  perfectGameBonus: 15,   // Win without losing a round
  newPlayerBonus: 10,     // First 10 games
  promotionShield: true,  // Can't demote from new tier for 3 games
};

/**
 * Ranked Ladder Manager
 */
export class RankedLadder {
  constructor() {
    this.data = this.loadData();
  }

  /**
   * Load ranked data from localStorage
   */
  loadData() {
    const saved = localStorage.getItem('rankedLadderData');
    if (saved) {
      return JSON.parse(saved);
    }
    
    return {
      rankPoints: 0,
      currentRank: 'BRONZE_III',
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      winStreak: 0,
      maxWinStreak: 0,
      currentSeason: this.getCurrentSeason(),
      seasonHistory: [],
      matchHistory: [],
      promotionShield: 0,
      achievements: [],
      peakRank: 'BRONZE_III',
      peakPoints: 0
    };
  }

  /**
   * Save ranked data to localStorage
   */
  saveData() {
    localStorage.setItem('rankedLadderData', JSON.stringify(this.data));
  }

  /**
   * Get current season identifier
   */
  getCurrentSeason() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    // Seasons: Spring (Mar-May), Summer (Jun-Aug), Fall (Sep-Nov), Winter (Dec-Feb)
    let season;
    if (month >= 3 && month <= 5) season = 'Spring';
    else if (month >= 6 && month <= 8) season = 'Summer';
    else if (month >= 9 && month <= 11) season = 'Fall';
    else season = 'Winter';
    
    return `${season} ${year}`;
  }

  /**
   * Get rank object from rank ID
   */
  getRank(rankId) {
    return RANKS[rankId] || RANKS.BRONZE_III;
  }

  /**
   * Get current rank info
   */
  getCurrentRankInfo() {
    const rank = this.getRank(this.data.currentRank);
    const nextRank = this.getNextRank();
    const prevRank = this.getPreviousRank();
    
    return {
      ...rank,
      points: this.data.rankPoints,
      pointsToNext: nextRank ? nextRank.minPoints - this.data.rankPoints : 0,
      pointsFromPrev: prevRank ? this.data.rankPoints - prevRank.minPoints : this.data.rankPoints,
      progress: this.getRankProgress(),
      isPromotion: this.data.promotionShield > 0,
      winRate: this.data.gamesPlayed > 0 ? ((this.data.wins / this.data.gamesPlayed) * 100).toFixed(1) : 0
    };
  }

  /**
   * Get next rank
   */
  getNextRank() {
    const rankKeys = Object.keys(RANKS);
    const currentIndex = rankKeys.indexOf(this.data.currentRank);
    if (currentIndex < rankKeys.length - 1) {
      return RANKS[rankKeys[currentIndex + 1]];
    }
    return null;
  }

  /**
   * Get previous rank
   */
  getPreviousRank() {
    const rankKeys = Object.keys(RANKS);
    const currentIndex = rankKeys.indexOf(this.data.currentRank);
    if (currentIndex > 0) {
      return RANKS[rankKeys[currentIndex - 1]];
    }
    return null;
  }

  /**
   * Get rank progress percentage
   */
  getRankProgress() {
    const currentRank = this.getRank(this.data.currentRank);
    const nextRank = this.getNextRank();
    
    if (!nextRank) return 100;
    
    const rangeMin = currentRank.minPoints;
    const rangeMax = nextRank.minPoints;
    const range = rangeMax - rangeMin;
    const progress = this.data.rankPoints - rangeMin;
    
    return Math.min(100, Math.max(0, (progress / range) * 100));
  }

  /**
   * Record a match result
   */
  recordMatch(result) {
    const { won, opponentRank, roundsWon, roundsLost, comboBonus = 0, gameTime } = result;
    
    this.data.gamesPlayed++;
    let pointsChange = 0;
    let events = [];
    
    if (won) {
      this.data.wins++;
      this.data.winStreak++;
      this.data.maxWinStreak = Math.max(this.data.maxWinStreak, this.data.winStreak);
      
      // Base win points
      pointsChange = POINT_CONFIG.baseWinPoints;
      events.push({ type: 'win', points: POINT_CONFIG.baseWinPoints });
      
      // Win streak bonus
      if (this.data.winStreak > 1) {
        const streakBonus = Math.min(
          this.data.winStreak * POINT_CONFIG.winStreakBonus,
          POINT_CONFIG.maxWinStreakBonus
        );
        pointsChange += streakBonus;
        events.push({ type: 'streak', points: streakBonus, streak: this.data.winStreak });
      }
      
      // Underdog bonus (beat higher rank)
      if (opponentRank) {
        const myRank = this.getRank(this.data.currentRank);
        const theirRank = this.getRank(opponentRank);
        if (theirRank.minPoints > myRank.minPoints) {
          pointsChange += POINT_CONFIG.underdogBonus;
          events.push({ type: 'underdog', points: POINT_CONFIG.underdogBonus });
        }
      }
      
      // Domination bonus (won by 3+ rounds)
      if (roundsWon - roundsLost >= 3) {
        pointsChange += POINT_CONFIG.dominationBonus;
        events.push({ type: 'domination', points: POINT_CONFIG.dominationBonus });
      }
      
      // Perfect game bonus
      if (roundsLost === 0 && roundsWon >= 3) {
        pointsChange += POINT_CONFIG.perfectGameBonus;
        events.push({ type: 'perfect', points: POINT_CONFIG.perfectGameBonus });
      }
      
      // Combo bonus
      if (comboBonus > 0) {
        const comboPts = Math.floor(comboBonus / 2);
        pointsChange += comboPts;
        events.push({ type: 'combo', points: comboPts });
      }
      
    } else {
      this.data.losses++;
      this.data.winStreak = 0;
      
      // Loss points (less harsh with promotion shield)
      if (this.data.promotionShield > 0) {
        pointsChange = Math.floor(POINT_CONFIG.baseLossPoints / 2);
        this.data.promotionShield--;
        events.push({ type: 'loss_shielded', points: pointsChange });
      } else {
        pointsChange = POINT_CONFIG.baseLossPoints;
        events.push({ type: 'loss', points: pointsChange });
      }
    }
    
    // New player bonus (first 10 games)
    if (this.data.gamesPlayed <= 10 && won) {
      pointsChange += POINT_CONFIG.newPlayerBonus;
      events.push({ type: 'new_player', points: POINT_CONFIG.newPlayerBonus });
    }
    
    // Apply points
    const oldRank = this.data.currentRank;
    const oldPoints = this.data.rankPoints;
    this.data.rankPoints = Math.max(0, this.data.rankPoints + pointsChange);
    
    // Update peak
    if (this.data.rankPoints > this.data.peakPoints) {
      this.data.peakPoints = this.data.rankPoints;
      this.data.peakRank = this.data.currentRank;
    }
    
    // Check for rank changes
    const rankChange = this.updateRank();
    if (rankChange.promoted) {
      events.push({ type: 'promoted', newRank: rankChange.newRank });
      this.data.promotionShield = 3; // Shield for 3 games
    } else if (rankChange.demoted) {
      events.push({ type: 'demoted', newRank: rankChange.newRank });
    }
    
    // Record match history
    this.data.matchHistory.unshift({
      timestamp: Date.now(),
      won,
      pointsChange,
      oldPoints,
      newPoints: this.data.rankPoints,
      oldRank,
      newRank: this.data.currentRank,
      roundsWon,
      roundsLost,
      gameTime,
      events
    });
    
    // Keep only last 50 matches
    if (this.data.matchHistory.length > 50) {
      this.data.matchHistory = this.data.matchHistory.slice(0, 50);
    }
    
    this.saveData();
    
    return {
      pointsChange,
      newPoints: this.data.rankPoints,
      newRank: this.getRank(this.data.currentRank),
      events,
      promoted: rankChange.promoted,
      demoted: rankChange.demoted,
      winStreak: this.data.winStreak
    };
  }

  /**
   * Update rank based on points
   */
  updateRank() {
    const rankKeys = Object.keys(RANKS);
    let newRankKey = 'BRONZE_III';
    
    // Find highest rank we qualify for
    for (const key of rankKeys) {
      if (this.data.rankPoints >= RANKS[key].minPoints) {
        newRankKey = key;
      } else {
        break;
      }
    }
    
    const oldRank = this.data.currentRank;
    const promoted = rankKeys.indexOf(newRankKey) > rankKeys.indexOf(oldRank);
    const demoted = rankKeys.indexOf(newRankKey) < rankKeys.indexOf(oldRank);
    
    // Check promotion shield (can't demote tier)
    if (demoted && this.data.promotionShield > 0) {
      const oldTier = RANKS[oldRank].tier;
      const newTier = RANKS[newRankKey].tier;
      
      if (oldTier !== newTier) {
        // Prevent tier demotion, stay at lowest division of current tier
        for (const key of rankKeys) {
          if (RANKS[key].tier === oldTier) {
            newRankKey = key;
            break;
          }
        }
        this.data.rankPoints = Math.max(this.data.rankPoints, RANKS[newRankKey].minPoints);
      }
    }
    
    this.data.currentRank = newRankKey;
    
    return {
      promoted: rankKeys.indexOf(newRankKey) > rankKeys.indexOf(oldRank),
      demoted: rankKeys.indexOf(newRankKey) < rankKeys.indexOf(oldRank),
      oldRank,
      newRank: newRankKey
    };
  }

  /**
   * Get season rewards based on peak rank
   */
  getSeasonRewards() {
    const peakRank = this.getRank(this.data.peakRank);
    const league = LEAGUES[peakRank.tier];
    
    return {
      rank: peakRank,
      league,
      rewards: league.seasonReward,
      gamesPlayed: this.data.gamesPlayed,
      wins: this.data.wins,
      losses: this.data.losses,
      winRate: this.data.gamesPlayed > 0 ? ((this.data.wins / this.data.gamesPlayed) * 100).toFixed(1) : 0,
      peakPoints: this.data.peakPoints,
      maxWinStreak: this.data.maxWinStreak
    };
  }

  /**
   * End season and claim rewards
   */
  endSeason() {
    const rewards = this.getSeasonRewards();
    
    // Store season in history
    this.data.seasonHistory.push({
      season: this.data.currentSeason,
      peakRank: this.data.peakRank,
      peakPoints: this.data.peakPoints,
      finalRank: this.data.currentRank,
      finalPoints: this.data.rankPoints,
      gamesPlayed: this.data.gamesPlayed,
      wins: this.data.wins,
      losses: this.data.losses,
      maxWinStreak: this.data.maxWinStreak,
      rewards: rewards.rewards
    });
    
    // Soft reset for new season (keep 50% of points above bronze)
    const resetPoints = Math.floor(this.data.rankPoints * 0.5);
    this.data.rankPoints = Math.max(0, resetPoints);
    this.data.gamesPlayed = 0;
    this.data.wins = 0;
    this.data.losses = 0;
    this.data.winStreak = 0;
    this.data.maxWinStreak = 0;
    this.data.peakPoints = this.data.rankPoints;
    this.data.matchHistory = [];
    this.data.currentSeason = this.getCurrentSeason();
    this.updateRank();
    this.data.peakRank = this.data.currentRank;
    
    this.saveData();
    
    return rewards;
  }

  /**
   * Get leaderboard data (simulated for single player)
   */
  getLeaderboard() {
    // Generate some simulated players for leaderboard
    const simulatedPlayers = [
      { name: 'DragonMaster', points: 5500, rank: 'CHAMPION' },
      { name: 'ElementLord', points: 4200, rank: 'GRANDMASTER' },
      { name: 'PyroKing', points: 3800, rank: 'GRANDMASTER' },
      { name: 'IceQueen', points: 3400, rank: 'MASTER_I' },
      { name: 'ThunderBolt', points: 3100, rank: 'MASTER_II' },
      { name: 'NatureSage', points: 2800, rank: 'MASTER_III' },
      { name: 'ShadowBlade', points: 2500, rank: 'DIAMOND_I' },
      { name: 'LightBringer', points: 2200, rank: 'DIAMOND_II' },
      { name: 'EarthShaker', points: 1900, rank: 'DIAMOND_III' },
      { name: 'WaterWizard', points: 1600, rank: 'PLATINUM_I' }
    ];
    
    // Insert player in correct position
    const playerEntry = {
      name: 'You',
      points: this.data.rankPoints,
      rank: this.data.currentRank,
      isPlayer: true
    };
    
    const allPlayers = [...simulatedPlayers, playerEntry]
      .sort((a, b) => b.points - a.points)
      .map((p, i) => ({ ...p, position: i + 1 }));
    
    return allPlayers;
  }

  /**
   * Get player statistics
   */
  getStats() {
    return {
      currentRank: this.getCurrentRankInfo(),
      gamesPlayed: this.data.gamesPlayed,
      wins: this.data.wins,
      losses: this.data.losses,
      winRate: this.data.gamesPlayed > 0 ? ((this.data.wins / this.data.gamesPlayed) * 100).toFixed(1) + '%' : '0%',
      winStreak: this.data.winStreak,
      maxWinStreak: this.data.maxWinStreak,
      peakRank: this.getRank(this.data.peakRank),
      peakPoints: this.data.peakPoints,
      currentSeason: this.data.currentSeason,
      recentMatches: this.data.matchHistory.slice(0, 10),
      seasonHistory: this.data.seasonHistory
    };
  }

  /**
   * Reset all ranked data
   */
  resetData() {
    localStorage.removeItem('rankedLadderData');
    this.data = this.loadData();
  }
}

// Singleton instance
export const rankedLadder = new RankedLadder();

export default {
  RANKS,
  LEAGUES,
  RankedLadder,
  rankedLadder
};

// Statistics tracking utility
const STATS_KEY = 'elementalBattleStats';
const PROFILE_KEY = 'playerProfile';

export const getProfile = () => {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) {
    return {
      avatar: '👤',
      name: 'Player',
      totalGames: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      winStreak: 0,
      firstWin: false,
      perfectGame: false,
      legendaryPlayed: false,
      coins: 0
    };
  }
  const profile = JSON.parse(stored);
  // Ensure coins property exists
  if (profile.coins === undefined) {
    profile.coins = 0;
  }
  return profile;
};

export const saveProfile = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// Recovery function to restore from backup if main save is corrupted
export const recoverStoryProgress = () => {
  try {
    const mainProgress = localStorage.getItem('storyModeProgress');
    if (mainProgress) {
      return JSON.parse(mainProgress);
    }
    
    // Try backup if main is corrupted
    const backup = localStorage.getItem('storyModeBackup');
    if (backup) {
      const backupData = JSON.parse(backup);
      console.log('⚠️ Recovered story progress from backup:', backupData);
      localStorage.setItem('storyModeProgress', JSON.stringify(backupData.progress));
      return backupData.progress;
    }
  } catch (error) {
    console.error('Error recovering story progress:', error);
  }
  return [];
};

// Recovery function for player profile
export const recoverProfile = () => {
  try {
    const mainProfile = getProfile();
    if (mainProfile && mainProfile.totalGames !== undefined) {
      return mainProfile;
    }
    
    // Try backup if main is corrupted
    const backup = localStorage.getItem('profileBackup');
    if (backup) {
      const backupProfile = JSON.parse(backup);
      console.log('⚠️ Recovered player profile from backup');
      saveProfile(backupProfile);
      return backupProfile;
    }
  } catch (error) {
    console.error('Error recovering profile:', error);
  }
  return getProfile(); // Return default profile if recovery fails
};

export const updateProfile = (gameResult) => {
  const profile = getProfile();
  profile.totalGames++;
  
  if (gameResult.won) {
    profile.wins++;
    profile.winStreak++;
    if (!profile.firstWin) {
      profile.firstWin = true;
    }
    if (gameResult.playerScore > 0 && gameResult.aiScore === 0) {
      profile.perfectGame = true;
    }
  } else if (gameResult.lost) {
    profile.losses++;
    profile.winStreak = 0;
  } else {
    profile.ties++;
  }
  
  // Update timestamp
  profile.lastPlayed = Date.now();
  
  // Primary save
  saveProfile(profile);
  
  // Backup save with game result details
  const backupProfile = {
    ...profile,
    lastGameResult: gameResult,
    backupTimestamp: Date.now()
  };
  localStorage.setItem('profileBackup', JSON.stringify(backupProfile));
  
  console.log('✅ Player Profile Autosaved:', profile.totalGames, 'games played');
  
  return profile;
};

export const getStats = () => {
  const stored = localStorage.getItem(STATS_KEY);
  if (!stored) {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      gamesTied: 0,
      totalRoundsPlayed: 0,
      totalCardsPlayed: 0,
      elementStats: {
        FIRE: { played: 0, won: 0 },
        ICE: { played: 0, won: 0 },
        WATER: { played: 0, won: 0 },
        ELECTRICITY: { played: 0, won: 0 },
        EARTH: { played: 0, won: 0 },
        POWER: { played: 0, won: 0 },
        LIGHT: { played: 0, won: 0 },
        DARK: { played: 0, won: 0 },
        NEUTRAL: { played: 0, won: 0 }
      },
      highestScore: 0,
      longestWinStreak: 0,
      currentWinStreak: 0,
      matchBonusCount: 0,
      specialAbilitiesUsed: 0,
      fastestWin: null, // in seconds
      lastPlayed: null
    };
  }
  return JSON.parse(stored);
};

export const saveStats = (stats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const recordGameEnd = (playerWon, playerScore, aiScore, roundsPlayed, startTime) => {
  const stats = getStats();
  const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : null;
  
  stats.gamesPlayed++;
  stats.totalRoundsPlayed += roundsPlayed;
  
  if (playerWon === true) {
    stats.gamesWon++;
    stats.currentWinStreak++;
    stats.longestWinStreak = Math.max(stats.longestWinStreak, stats.currentWinStreak);
    
    if (duration && (!stats.fastestWin || duration < stats.fastestWin)) {
      stats.fastestWin = duration;
    }
  } else if (playerWon === false) {
    stats.gamesLost++;
    stats.currentWinStreak = 0;
  } else {
    stats.gamesTied++;
  }
  
  stats.highestScore = Math.max(stats.highestScore, playerScore);
  stats.lastPlayed = Date.now();
  
  saveStats(stats);
  return stats;
};

export const recordCardPlayed = (element, wonRound) => {
  const stats = getStats();
  stats.totalCardsPlayed++;
  
  if (stats.elementStats[element]) {
    stats.elementStats[element].played++;
    if (wonRound) {
      stats.elementStats[element].won++;
    }
  }
  
  saveStats(stats);
};

export const recordMatchBonus = () => {
  const stats = getStats();
  stats.matchBonusCount++;
  saveStats(stats);
};

export const recordAbilityUsed = () => {
  const stats = getStats();
  stats.specialAbilitiesUsed++;
  saveStats(stats);
};

export const resetStats = () => {
  localStorage.removeItem(STATS_KEY);
  return getStats();
};

export const getWinRate = () => {
  const stats = getStats();
  if (stats.gamesPlayed === 0) return 0;
  return ((stats.gamesWon / stats.gamesPlayed) * 100).toFixed(1);
};

export const getFavoriteElement = () => {
  const stats = getStats();
  let maxPlayed = 0;
  let favorite = 'None';
  
  Object.entries(stats.elementStats).forEach(([element, data]) => {
    if (data.played > maxPlayed) {
      maxPlayed = data.played;
      favorite = element;
    }
  });
  
  return favorite;
};

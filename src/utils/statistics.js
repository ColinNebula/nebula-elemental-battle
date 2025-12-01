// Statistics tracking utility
import secureStorage from './secureStorage';

const STATS_KEY = 'elementalBattleStats';
const PROFILE_KEY = 'playerProfile';

export const getProfile = () => {
  const stored = secureStorage.getItem(PROFILE_KEY);
  const stats = getStats(); // Get detailed stats
  
  // Always try to load saved avatar from localStorage first (most reliable)
  let savedAvatar = null;
  try {
    const avatarStr = localStorage.getItem('savedAvatar');
    if (avatarStr) {
      savedAvatar = JSON.parse(avatarStr);
    }
  } catch (e) {
    // Ignore parse errors
  }
  
  if (!stored) {
    return {
      avatar: savedAvatar?.icon || '👤',
      name: localStorage.getItem('playerName') || 'Player',
      selectedAvatar: savedAvatar,
      totalGames: stats.gamesPlayed || 0,
      wins: stats.gamesWon || 0,
      losses: stats.gamesLost || 0,
      ties: stats.gamesTied || 0,
      winStreak: stats.currentWinStreak || 0,
      longestWinStreak: stats.longestWinStreak || 0,
      firstWin: stats.gamesWon > 0,
      perfectGame: false,
      legendaryPlayed: false,
      coins: 0,
      cardsPlayed: stats.totalCardsPlayed || 0,
      highScore: stats.highestScore || 0,
      favoriteElement: getFavoriteElement(),
      elementStats: stats.elementStats,
      recentMatches: stats.recentMatches || [],
      fastestWin: stats.fastestWin
    };
  }
  // secureStorage already returns parsed object
  const profile = stored;
  // Ensure all properties exist and merge with stats
  // IMPORTANT: Never overwrite a saved avatar with null
  const finalAvatar = savedAvatar || profile.selectedAvatar || null;
  return {
    ...profile,
    selectedAvatar: finalAvatar,
    avatar: finalAvatar?.icon || profile.avatar || '👤',
    coins: profile.coins !== undefined ? profile.coins : 0,
    totalGames: stats.gamesPlayed || profile.totalGames || 0,
    wins: stats.gamesWon || profile.wins || 0,
    losses: stats.gamesLost || profile.losses || 0,
    ties: stats.gamesTied || profile.ties || 0,
    winStreak: stats.currentWinStreak || profile.winStreak || 0,
    longestWinStreak: stats.longestWinStreak || profile.longestWinStreak || 0,
    cardsPlayed: stats.totalCardsPlayed || profile.cardsPlayed || 0,
    highScore: stats.highestScore || profile.highScore || 0,
    favoriteElement: getFavoriteElement(),
    elementStats: stats.elementStats,
    recentMatches: stats.recentMatches || [],
    fastestWin: stats.fastestWin
  };
};

export const saveProfile = (profile) => {
  secureStorage.setItem(PROFILE_KEY, profile);
  
  // Also save avatar to localStorage for redundancy (survives storage clearing)
  if (profile.selectedAvatar) {
    localStorage.setItem('savedAvatar', JSON.stringify(profile.selectedAvatar));
  }
  if (profile.name && profile.name !== 'Player') {
    localStorage.setItem('playerName', profile.name);
  }
};

// Recovery function to restore from backup if main save is corrupted
export const recoverStoryProgress = () => {
  try {
    const mainProgress = secureStorage.getItem('storyModeProgress');
    if (mainProgress) {
      return mainProgress;
    }
    
    // Try backup if main is corrupted
    const backup = localStorage.getItem('storyModeBackup');
    if (backup) {
      const backupData = JSON.parse(backup);
      console.log('⚠️ Recovered story progress from backup:', backupData);
      secureStorage.setItem('storyModeProgress', backupData.progress);
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
      lastPlayed: null,
      recentMatches: [] // New field for match history
    };
  }
  const stats = JSON.parse(stored);
  // Ensure recentMatches exists
  if (!stats.recentMatches) {
    stats.recentMatches = [];
  }
  return stats;
};

export const saveStats = (stats) => {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
};

export const recordGameEnd = (playerWon, playerScore, aiScore, roundsPlayed, startTime, opponentName = 'AI') => {
  const stats = getStats();
  const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : null;
  
  stats.gamesPlayed++;
  stats.totalRoundsPlayed += roundsPlayed;
  
  // Record match in history (keep last 20 matches)
  const matchResult = {
    result: playerWon === true ? 'win' : playerWon === false ? 'loss' : 'tie',
    opponent: opponentName,
    score: `${playerScore}-${aiScore}`,
    timestamp: Date.now(),
    duration: duration || 0
  };
  
  if (!stats.recentMatches) {
    stats.recentMatches = [];
  }
  stats.recentMatches.unshift(matchResult);
  if (stats.recentMatches.length > 20) {
    stats.recentMatches = stats.recentMatches.slice(0, 20);
  }
  
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

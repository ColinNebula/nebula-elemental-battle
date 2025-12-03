import React, { useState, useEffect } from 'react';
import { generateDailyQuests, QUEST_TYPES } from '../utils/gameEnhancements';
import './DailyQuests.css';

const DailyQuests = ({ isVisible, onClose, playerLevel = 1, onClaimReward }) => {
  const [dailyQuests, setDailyQuests] = useState([]);
  const [weeklyQuests, setWeeklyQuests] = useState([]);
  const [activeTab, setActiveTab] = useState('daily');
  const [claimingId, setClaimingId] = useState(null);

  useEffect(() => {
    if (isVisible) {
      loadQuests();
    }
  }, [isVisible, playerLevel]);

  const loadQuests = () => {
    try {
      // Load daily quests from localStorage or generate new ones
      const savedDaily = JSON.parse(localStorage.getItem('dailyQuests') || 'null');
      const now = Date.now();
      
      // Check if quests are expired or don't exist
      if (!savedDaily || savedDaily.length === 0 || (savedDaily[0]?.expiresAt && savedDaily[0].expiresAt < now)) {
        // Generate new quests
        const newQuests = generateDailyQuests(playerLevel);
        localStorage.setItem('dailyQuests', JSON.stringify(newQuests));
        setDailyQuests(newQuests);
      } else {
        setDailyQuests(savedDaily);
      }

      // Load weekly quests (simplified for now)
      const savedWeekly = JSON.parse(localStorage.getItem('weeklyQuests') || '[]');
      setWeeklyQuests(savedWeekly);
    } catch (error) {
      console.error('Error loading quests:', error);
      const newQuests = generateDailyQuests(playerLevel);
      setDailyQuests(newQuests);
    }
  };

  const handleClaimReward = async (quest) => {
    if (quest.claimed || !quest.completed) return;
    
    setClaimingId(quest.id);
    
    // Simulate claiming animation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update quest as claimed
    const updatedQuests = dailyQuests.map(q => 
      q.id === quest.id ? { ...q, claimed: true } : q
    );
    setDailyQuests(updatedQuests);
    localStorage.setItem('dailyQuests', JSON.stringify(updatedQuests));
    
    // Notify parent to add rewards
    if (onClaimReward) {
      onClaimReward(quest.rewards);
    }
    
    setClaimingId(null);
  };

  const getTimeRemaining = (expiresAt) => {
    const remaining = expiresAt - Date.now();
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getQuestIcon = (questType) => {
    const icons = {
      WIN_GAMES: '🏆',
      PLAY_ELEMENT: '✨',
      DEAL_DAMAGE: '⚔️',
      USE_ABILITIES: '🔮',
      PLAY_LEGENDARY: '👑',
      FUSION_CARDS: '🧬',
      WIN_STREAK: '🔥',
      STORY_PROGRESS: '📖',
      PERFECT_GAMES: '💯',
      ELEMENT_MASTER: '🌈',
      UNDERDOG: '💪'
    };
    return icons[questType] || '📜';
  };

  if (!isVisible) return null;

  const activeQuests = activeTab === 'daily' ? dailyQuests : weeklyQuests;

  return (
    <div className="daily-quests-overlay">
      <div className="daily-quests-modal">
        <div className="daily-quests-header">
          <h2>Quests & Challenges</h2>
          <div className="quests-timer">
            <span className="timer-icon">⏰</span>
            <span className="timer-text">
              {dailyQuests[0]?.expiresAt ? 
                `Resets in ${getTimeRemaining(dailyQuests[0].expiresAt)}` : 
                'Loading...'}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="quests-tabs">
          <button 
            className={`quest-tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            📅 Daily
          </button>
          <button 
            className={`quest-tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            📆 Weekly
          </button>
        </div>

        <div className="quests-content">
          {activeQuests.length === 0 ? (
            <div className="no-quests">
              <span className="no-quests-icon">📜</span>
              <p>No {activeTab} quests available!</p>
              <p className="no-quests-hint">
                {activeTab === 'daily' 
                  ? 'Check back tomorrow for new challenges!'
                  : 'Weekly quests coming soon!'}
              </p>
            </div>
          ) : (
            <div className="quests-list">
              {activeQuests.map((quest, index) => (
                <div 
                  key={quest.id || index} 
                  className={`quest-card ${quest.completed ? 'completed' : ''} ${quest.claimed ? 'claimed' : ''}`}
                >
                  <div className="quest-icon">
                    {getQuestIcon(quest.type)}
                  </div>
                  
                  <div className="quest-details">
                    <div className="quest-description">
                      {quest.description}
                    </div>
                    
                    <div className="quest-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${Math.min(100, (quest.currentCount / quest.targetCount) * 100)}%` 
                          }}
                        />
                      </div>
                      <span className="progress-text">
                        {quest.currentCount}/{quest.targetCount}
                      </span>
                    </div>
                  </div>
                  
                  <div className="quest-rewards">
                    {quest.rewards.gold && (
                      <span className="reward-item gold">
                        💰 {quest.rewards.gold}
                      </span>
                    )}
                    {quest.rewards.xp && (
                      <span className="reward-item xp">
                        ⭐ {quest.rewards.xp} XP
                      </span>
                    )}
                  </div>
                  
                  <button 
                    className={`claim-btn ${quest.completed && !quest.claimed ? 'ready' : ''} ${claimingId === quest.id ? 'claiming' : ''}`}
                    onClick={() => handleClaimReward(quest)}
                    disabled={!quest.completed || quest.claimed || claimingId === quest.id}
                  >
                    {quest.claimed ? '✓' : claimingId === quest.id ? '...' : quest.completed ? 'Claim' : 'In Progress'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bonus Section */}
        <div className="quests-bonus">
          <div className="bonus-label">Complete all daily quests for bonus rewards!</div>
          <div className="bonus-progress">
            <div className="bonus-stars">
              {[0, 1, 2].map(i => (
                <span 
                  key={i} 
                  className={`bonus-star ${dailyQuests.filter(q => q.claimed).length > i ? 'earned' : ''}`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="bonus-reward">
              💎 Bonus: 100 Gold + Rare Card Pack
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuests;

import React, { useState, useEffect } from 'react';
import './NewsModal.css';
import newsData from '../data/news.json';

const NewsModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('updates');
  const [readNews, setReadNews] = useState(() => {
    const stored = localStorage.getItem('readNews');
    return stored ? JSON.parse(stored) : [];
  });

  const markAsRead = (newsId) => {
    if (!readNews.includes(newsId)) {
      const updated = [...readNews, newsId];
      setReadNews(updated);
      localStorage.setItem('readNews', JSON.stringify(updated));
    }
  };

  const markAllAsRead = () => {
    const allIds = newsData.news.map(n => n.id);
    setReadNews(allIds);
    localStorage.setItem('readNews', JSON.stringify(allIds));
  };

  const isUnread = (newsId) => !readNews.includes(newsId);

  const getUnreadCount = () => {
    return newsData.news.filter(n => isUnread(n.id)).length;
  };

  const getTypeColor = (type) => {
    const colors = {
      update: '#4caf50',
      feature: '#2196f3',
      improvement: '#ff9800',
      event: '#9c27b0',
      maintenance: '#f44336'
    };
    return colors[type] || '#4caf50';
  };

  const getPriorityBadge = (priority) => {
    if (priority === 'high') {
      return <span className="priority-badge high">NEW</span>;
    }
    return null;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const isEventActive = (event) => {
    const now = new Date();
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return now >= start && now <= end;
  };

  const isEventUpcoming = (event) => {
    const now = new Date();
    const start = new Date(event.startDate);
    return now < start;
  };

  return (
    <div className="news-modal-overlay" onClick={onClose}>
      <div className="news-modal" onClick={(e) => e.stopPropagation()}>
        <div className="news-header">
          <h2>📰 What's New</h2>
          <button className="news-close" onClick={onClose}>✕</button>
        </div>

        <div className="news-tabs">
          <button 
            className={`news-tab ${activeTab === 'updates' ? 'active' : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            <span className="tab-icon">🔔</span>
            <span className="tab-text">Updates</span>
            {getUnreadCount() > 0 && (
              <span className="unread-badge">{getUnreadCount()}</span>
            )}
          </button>
          <button 
            className={`news-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <span className="tab-icon">🎉</span>
            <span className="tab-text">Events</span>
          </button>
        </div>

        <div className="news-content">
          {activeTab === 'updates' && (
            <div className="updates-list">
              <div className="updates-header">
                <span className="updates-count">{newsData.news.length} updates</span>
                {getUnreadCount() > 0 && (
                  <button className="mark-all-read" onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                )}
              </div>
              
              {newsData.news.map((item) => (
                <div 
                  key={item.id} 
                  className={`news-item ${isUnread(item.id) ? 'unread' : 'read'}`}
                  onClick={() => markAsRead(item.id)}
                >
                  <div className="news-item-header">
                    <div className="news-item-left">
                      <span className="news-icon" style={{ backgroundColor: getTypeColor(item.type) }}>
                        {item.icon}
                      </span>
                      <div className="news-item-title">
                        <h3>
                          {item.title}
                          {getPriorityBadge(item.priority)}
                        </h3>
                        <div className="news-meta">
                          <span className="news-date">{formatDate(item.date)}</span>
                          {item.version && (
                            <>
                              <span className="news-separator">•</span>
                              <span className="news-version">{item.version}</span>
                            </>
                          )}
                          <span className="news-separator">•</span>
                          <span className="news-type" style={{ color: getTypeColor(item.type) }}>
                            {item.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isUnread(item.id) && <div className="unread-dot"></div>}
                  </div>
                  <p className="news-description">{item.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-list">
              {newsData.events.length > 0 ? (
                newsData.events.map((event) => (
                  <div 
                    key={event.id} 
                    className={`event-card ${
                      isEventActive(event) ? 'active' : 
                      isEventUpcoming(event) ? 'upcoming' : 'past'
                    }`}
                  >
                    <div className="event-icon">{event.icon}</div>
                    <div className="event-content">
                      <div className="event-header">
                        <h3>{event.title}</h3>
                        <span className={`event-status ${
                          isEventActive(event) ? 'active' : 
                          isEventUpcoming(event) ? 'upcoming' : 'past'
                        }`}>
                          {isEventActive(event) ? 'LIVE NOW' : 
                           isEventUpcoming(event) ? 'UPCOMING' : 'ENDED'}
                        </span>
                      </div>
                      <div className="event-dates">
                        📅 {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                      </div>
                      <p className="event-description">{event.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-events">
                  <span className="no-events-icon">📅</span>
                  <p>No events scheduled</p>
                  <p className="no-events-subtitle">Check back soon for exciting tournaments and challenges!</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="news-footer">
          <p className="version-info">Nebula Elemental Battle v1.5.0</p>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;

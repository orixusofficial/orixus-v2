import { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import { fetchAllFeedback, fetchFeedbackStats } from '../services/feedback';
import '../styles/admin-dashboard.css';

const ICONS = {
  rating: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  feedback: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  bug: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <path d="M16 6h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1" />
      <path d="M8 6H7a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1" />
      <path d="M12 6v14" />
      <path d="M12 18h-2" />
      <path d="M12 18h2" />
      <path d="M12 10h-2" />
      <path d="M12 10h2" />
    </svg>
  ),
  feature: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
};

const CATEGORY_COLORS = {
  'Bug Report': '#B95B5B',
  'Feature Request': '#5B8FB9',
  'UI / UX': '#8B5FB9',
  'General Feedback': '#5FB977',
};

export default function AdminFeedback() {
  const [stats, setStats] = useState({
    averageRating: 0,
    totalFeedback: 0,
    bugReports: 0,
    featureRequests: 0,
  });
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, feedbackData] = await Promise.all([
          fetchFeedbackStats(),
          fetchAllFeedback(),
        ]);
        setStats(statsData);
        setFeedback(feedbackData);
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const renderStars = (rating) => {
    return (
      <div className="admin-feedback__stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`admin-feedback__star ${star <= rating ? 'admin-feedback__star--filled' : ''}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="admin-page">
      <h1 className="admin-page__title">Feedback</h1>

      {/* Stats Cards */}
      <div className="admin-dashboard__stats">
        <StatCard label="Average Rating" value={loading ? '...' : stats.averageRating} icon={ICONS.rating} />
        <StatCard label="Total Feedback" value={loading ? '...' : stats.totalFeedback} icon={ICONS.feedback} />
        <StatCard label="Bug Reports" value={loading ? '...' : stats.bugReports} icon={ICONS.bug} />
        <StatCard label="Feature Requests" value={loading ? '...' : stats.featureRequests} icon={ICONS.feature} />
      </div>

      {/* Feedback List */}
      <div className="admin-dashboard__section">
        <h2 className="admin-dashboard__section-title">All Feedback</h2>
        <div className="admin-dashboard__section-content">
          {loading ? (
            <div>Loading…</div>
          ) : feedback.length > 0 ? (
            <div className="admin-feedback__list">
              {feedback.map((item) => (
                <div key={item.id} className="admin-feedback__item">
                  <div className="admin-feedback__header">
                    <div className="admin-feedback__rating">
                      {renderStars(item.rating)}
                      <span className="admin-feedback__rating-number">{item.rating}/5</span>
                    </div>
                    <span
                      className="admin-feedback__category"
                      style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#A79277' }}
                    >
                      {item.category}
                    </span>
                  </div>
                  <p className="admin-feedback__message">{item.message}</p>
                  <div className="admin-feedback__meta">
                    <span className="admin-feedback__user-id">User ID: {item.user_id}</span>
                    <span className="admin-feedback__date">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  {item.allow_contact && (
                    <div className="admin-feedback__contact">
                      ✓ Contact allowed
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-dashboard__no-data">No feedback received yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

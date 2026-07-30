import { useMemo, useState, useEffect } from 'react';
import '../styles/dashboard.css';
import { getRankInfo, RANKS } from '../utils/analyticsHelpers';
import { getAvatarSignedUrl } from '../services/avatar';

const ACHIEVEMENTS_CONFIG = [
  { name: 'First Spark', description: 'Complete your first habit check-in', icon: 'flame', check: (data) => data.totalHabits >= 1 },
  { name: '7-Day Streak', description: 'Maintain a 7-day streak', icon: 'calendar', check: (data) => data.streak >= 7 },
  { name: 'First Log', description: 'Write your first journal entry', icon: 'notebook', check: (data) => data.journalCount >= 1 },
  { name: 'Century', description: 'Complete 100 habits', icon: 'trophy', check: (data) => data.totalHabits >= 100 },
];

const ICONS = {
  diamond: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12l4 6-10 12L2 9z" />
    </svg>
  ),
  shield: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  flame: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  notebook: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  trophy: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  ),
  target: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  activity: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

export default function ProfilePage({ habits = [], completionData = {}, journalEntries = [], profile = null }) {
  const [loading, setLoading] = useState(true);
  const [signedAvatarUrl, setSignedAvatarUrl] = useState(null);

  useEffect(() => {
    // Simulate loading state for smooth transition
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Generate signed URL for avatar when profile changes
  useEffect(() => {
    if (profile?.avatar_url) {
      getAvatarSignedUrl(profile.avatar_url).then(setSignedAvatarUrl);
    } else {
      setSignedAvatarUrl(null);
    }
  }, [profile]);

  // Calculate all metrics from real data
  const metrics = useMemo(() => {
    const totalHabits = Object.values(completionData).filter(v => v).length;
    const journalCount = journalEntries.length;

    // Calculate day streak
    const dateKeyStr = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const isBefore = (dateA, dateB) => {
      const a = new Date(dateA);
      const b = new Date(dateB);
      a.setHours(0, 0, 0, 0);
      b.setHours(0, 0, 0, 0);
      return a < b;
    };

    // Get unique dates with completions
    const completionDates = new Set();
    Object.keys(completionData).forEach(key => {
      if (completionData[key]) {
        const dateStr = key.split(':')[1];
        completionDates.add(dateStr);
      }
    });

    // Calculate streak - go backwards from today/yesterday counting consecutive days with completions
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = (date) => {
      const dateStr = dateKeyStr(date);
      return Array.from(completionDates).some(d => d === dateStr);
    };

    // If no habits have ever been completed, streak = 0
    if (completionDates.size === 0) {
      streak = 0;
    } else {
      // Start checking from today
      let checkDateObj = new Date(today);

      // If today has no completions, start from yesterday
      if (!checkDate(checkDateObj)) {
        checkDateObj.setDate(today.getDate() - 1);
      }

      // Count consecutive days backwards until a day with no completions is found
      while (checkDate(checkDateObj)) {
        streak++;
        checkDateObj.setDate(checkDateObj.getDate() - 1);
      }
    }

    // Calculate consistency - use first habit completion date, not account creation date
    let consistency = 0;
    if (completionDates.size > 0) {
      // Find the first habit completion date
      const sortedDates = Array.from(completionDates).sort();
      const firstCompletionDate = new Date(sortedDates[0]);
      firstCompletionDate.setHours(0, 0, 0, 0);

      // Calculate total days since first habit completion
      const daysSinceFirstCompletion = Math.ceil((today - firstCompletionDate) / (1000 * 60 * 60 * 24));

      // Calculate consistency percentage
      if (daysSinceFirstCompletion > 0) {
        consistency = Math.min(100, Math.round((completionDates.size / daysSinceFirstCompletion) * 100));
      }
    }

    // Use shared rank calculation
    const rankInfo = getRankInfo(streak, totalHabits);

    return {
      totalHabits,
      streak,
      checkIns: totalHabits,
      consistency,
      journalCount,
      rankInfo,
    };
  }, [completionData, journalEntries, profile]);

  // Calculate achievements
  const achievements = useMemo(() => {
    return ACHIEVEMENTS_CONFIG.map(achievement => ({
      ...achievement,
      unlocked: achievement.check(metrics),
    }));
  }, [metrics]);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="profile-page">
      {/* Profile Hero Card */}
      <div className={`profile-hero-card ${loading ? 'profile-hero-card--loading' : ''}`}>
        <div className="profile-hero-card__avatar">
          <div className="profile-avatar">
            {signedAvatarUrl ? (
              <img src={signedAvatarUrl} alt="Profile Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            ) : (
              <span className="profile-avatar-letters">
                {profile?.display_name ? profile.display_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'DO'}
              </span>
            )}
          </div>
        </div>
        <div className="profile-hero-card__identity">
          <h3 className="profile-hero-card__name">{profile?.display_name || 'Dev Operator'}</h3>
          <span className="profile-hero-card__joined">
            Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2026'}
          </span>
          <span className="profile-hero-card__rank-pill">
            {ICONS.shield}
            <span>{metrics.rankInfo.name}</span>
          </span>
        </div>
        <div className="profile-hero-card__progress">
          <div className="profile-hero-card__progress-label">
            {metrics.rankInfo.name} {metrics.rankInfo.nextRankName ? `→ ${metrics.rankInfo.nextRankName}` : ''}
          </div>
          <div className="profile-hero-card__progress-track">
            <div className="profile-hero-card__progress-bar" style={{ width: `${metrics.rankInfo.progressPercent}%` }} />
          </div>
          <span className="profile-hero-card__progress-value">{metrics.rankInfo.nextRankRequirement}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="profile-stats-grid profile-stats-grid--four">
        <div className={`dashboard-overview__card ${loading ? 'dashboard-overview__card--loading' : ''}`}>
          <div className="dashboard-overview__card-icon">{ICONS.flame}</div>
          <span className="dashboard-overview__card-value">{metrics.streak}</span>
          <span className="dashboard-overview__card-label">Day Streak</span>
        </div>
        <div className={`dashboard-overview__card ${loading ? 'dashboard-overview__card--loading' : ''}`}>
          <div className="dashboard-overview__card-icon">{ICONS.check}</div>
          <span className="dashboard-overview__card-value">{metrics.totalHabits}</span>
          <span className="dashboard-overview__card-label">Habits Done</span>
        </div>
        <div className={`dashboard-overview__card ${loading ? 'dashboard-overview__card--loading' : ''}`}>
          <div className="dashboard-overview__card-icon">{ICONS.target}</div>
          <span className="dashboard-overview__card-value">{metrics.consistency}%</span>
          <span className="dashboard-overview__card-label">Consistency</span>
        </div>
        <div className={`dashboard-overview__card ${loading ? 'dashboard-overview__card--loading' : ''}`}>
          <div className="dashboard-overview__card-icon">{ICONS.activity}</div>
          <span className="dashboard-overview__card-value">{metrics.checkIns}</span>
          <span className="dashboard-overview__card-label">Check-ins</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="profile-two-column">
        {/* Rank Progression */}
        <div className={`profile-section-card ${loading ? 'profile-section-card--loading' : ''}`}>
          <h3 className="profile-section-card__title">RANK PROGRESSION</h3>
          <div className="profile-rank-list">
            {RANKS.map((rank, index) => (
              <div key={rank.name} className={`profile-rank-item ${index === metrics.rankInfo.level - 1 ? 'profile-rank-item--current' : index < metrics.rankInfo.level - 1 ? 'profile-rank-item--completed' : 'profile-rank-item--locked'}`}>
                <div className="profile-rank-item__dot" />
                <span className="profile-rank-item__name">{rank.name}</span>
                <span className="profile-rank-item__requirement">
                  {index === metrics.rankInfo.level - 1 ? 'Current rank' : `${rank.minStreak} day streak + ${rank.minHabits} habits`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className={`profile-section-card ${loading ? 'profile-section-card--loading' : ''}`}>
          <h3 className="profile-section-card__title">ACHIEVEMENTS</h3>
          <div className="profile-achievement-list">
            {achievements.map((achievement) => (
              <div key={achievement.name} className={`profile-achievement-item ${achievement.unlocked ? 'profile-achievement-item--unlocked' : 'profile-achievement-item--locked'}`}>
                <div className="profile-achievement-item__icon">
                  {ICONS[achievement.icon]}
                </div>
                <div className="profile-achievement-item__content">
                  <span className="profile-achievement-item__name">{achievement.name}</span>
                  <span className="profile-achievement-item__description">{achievement.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState, useEffect } from 'react';
import JsonLd from '../components/JsonLd';
import '../styles/dashboard.css';
import { getRankInfo, RANKS } from '../utils/analyticsHelpers';
import { getAvatarSignedUrl } from '../services/avatar';
import { useAuth } from '../contexts/AuthContext';
import { ACHIEVEMENTS_CONFIG, calculateAchievementData } from '../utils/achievements';

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
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
};

const ACHIEVEMENT_GROUPS = [
  { id: 'STREAK', label: 'Consistency' },
  { id: 'EXECUTION', label: 'Habits' },
  { id: 'JOURNAL', label: 'Journaling' },
  { id: 'SECRET', label: 'Cycles' },
];

export default function ProfilePage({ habits = [], completionData = {}, journalEntries = [], profile = null }) {
  const { user } = useAuth();
  const isEmailVerified = Boolean(user?.email_confirmed_at);
  const [loading, setLoading] = useState(true);
  const [signedAvatarUrl, setSignedAvatarUrl] = useState(null);
  const [openAchievementGroup, setOpenAchievementGroup] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (profile?.avatar_url) {
      getAvatarSignedUrl(profile.avatar_url).then(setSignedAvatarUrl);
    } else {
      setSignedAvatarUrl(null);
    }
  }, [profile]);

  const metrics = useMemo(() => {
    const achievementData = calculateAchievementData(habits, completionData, journalEntries, profile, user);

    let consistency = 0;
    const completionDates = new Set();
    Object.keys(completionData).forEach(key => {
      if (completionData[key]) {
        const dateStr = key.split(':')[1];
        completionDates.add(dateStr);
      }
    });

    if (completionDates.size > 0) {
      const sortedDates = Array.from(completionDates).sort();
      const firstCompletionDate = new Date(sortedDates[0]);
      firstCompletionDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const daysSinceFirstCompletion = Math.ceil((today - firstCompletionDate) / (1000 * 60 * 60 * 24));

      if (daysSinceFirstCompletion > 0) {
        consistency = Math.min(100, Math.round((completionDates.size / daysSinceFirstCompletion) * 100));
      }
    }

    const rankInfo = getRankInfo(achievementData.streak, achievementData.totalHabits);

    return {
      ...achievementData,
      checkIns: achievementData.totalHabits,
      consistency,
      rankInfo,
    };
  }, [completionData, journalEntries, profile, user, habits]);

  const achievements = useMemo(() => {
    if (!metrics || !ACHIEVEMENTS_CONFIG || ACHIEVEMENTS_CONFIG.length === 0) {
      return [];
    }

    return ACHIEVEMENTS_CONFIG.map(achievement => {
      try {
        return {
          ...achievement,
          unlocked: achievement.check(metrics),
        };
      } catch (error) {
        console.error(`Error checking achievement ${achievement.id}:`, error);
        return {
          ...achievement,
          unlocked: false,
        };
      }
    });
  }, [metrics]);

  const achievementGroups = useMemo(() => {
    return ACHIEVEMENT_GROUPS.map(group => {
      const items = achievements.filter(achievement => achievement.category === group.id);
      const completed = items.filter(achievement => achievement.unlocked).length;

      return {
        ...group,
        items,
        completed,
        total: items.length,
      };
    }).filter(group => group.total > 0);
  }, [achievements]);

  const joinedDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'January 2026';
  const nextRank = RANKS[metrics.rankInfo.level] ?? null;

  return (
    <div className="profile-page">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orixus.vercel.app/' },
          { '@type': 'ListItem', position: 2, name: 'Profile', item: 'https://orixus.vercel.app/profile' }
        ]
      }} />

      <section className={`profile-hero-card ${loading ? 'profile-hero-card--loading' : ''}`}>
        <div className="profile-hero-card__avatar-wrap">
          <div className="profile-avatar">
            {signedAvatarUrl ? (
              <img src={signedAvatarUrl} alt="Profile Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
            ) : (
              <span className="profile-avatar-letters">
                {profile?.display_name ? profile.display_name.split(' ').map(name => name[0]).join('').toUpperCase().slice(0, 2) : 'DO'}
              </span>
            )}
          </div>
          {!isEmailVerified && (
            <span className="profile-verify-badge">
              Verify Email
            </span>
          )}
        </div>

        <div className="profile-hero-card__identity">
          <h3 className="profile-hero-card__name">{profile?.display_name || 'Dev Operator'}</h3>
          <span className="profile-hero-card__joined">Joined {joinedDate}</span>
          <strong className="profile-hero-card__rank">{metrics.rankInfo.name}</strong>
          <span className="profile-hero-card__streak">{metrics.streak} day streak</span>
        </div>

        <div className="profile-hero-card__progress">
          <div className="profile-hero-card__progress-label">
            <span>{metrics.rankInfo.name}</span>
            {nextRank && <span>{nextRank.name}</span>}
          </div>
          <div className="profile-hero-card__progress-track">
            <div className="profile-hero-card__progress-bar" style={{ width: `${metrics.rankInfo.progressPercent}%` }} />
          </div>
          <span className="profile-hero-card__progress-value">{metrics.rankInfo.nextRankRequirement}</span>
        </div>
      </section>

      <section className="profile-stats-grid profile-stats-grid--four" aria-label="Current Statistics">
        <div className={`profile-stat ${loading ? 'profile-stat--loading' : ''}`}>
          <span className="profile-stat__value">{metrics.streak}</span>
          <span className="profile-stat__label">Day Streak</span>
        </div>
        <div className={`profile-stat ${loading ? 'profile-stat--loading' : ''}`}>
          <span className="profile-stat__value">{metrics.totalHabits}</span>
          <span className="profile-stat__label">Habits Done</span>
        </div>
        <div className={`profile-stat ${loading ? 'profile-stat--loading' : ''}`}>
          <span className="profile-stat__value">{metrics.consistency}%</span>
          <span className="profile-stat__label">Consistency</span>
        </div>
        <div className={`profile-stat ${loading ? 'profile-stat--loading' : ''}`}>
          <span className="profile-stat__value">{metrics.checkIns}</span>
          <span className="profile-stat__label">Check-ins</span>
        </div>
      </section>

      <div className="profile-two-column">
        <section className={`profile-section-card ${loading ? 'profile-section-card--loading' : ''}`}>
          <h3 className="profile-section-card__title">RANK PROGRESSION</h3>
          <div className="profile-rank-list">
            {RANKS.map((rank, index) => (
              <div key={rank.name} className={`profile-rank-item ${index === metrics.rankInfo.level - 1 ? 'profile-rank-item--current' : index < metrics.rankInfo.level - 1 ? 'profile-rank-item--completed' : 'profile-rank-item--locked'}`}>
                <div className="profile-rank-item__rail">
                  <span className="profile-rank-item__dot" />
                </div>
                <div className="profile-rank-item__main">
                  <span className="profile-rank-item__name">{rank.name}</span>
                  <span className="profile-rank-item__requirement">{rank.minStreak} day streak + {rank.minHabits} habits</span>
                </div>
                {index === metrics.rankInfo.level - 1 && (
                  <span className="profile-rank-item__status">Current</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={`profile-section-card ${loading ? 'profile-section-card--loading' : ''}`}>
          <h3 className="profile-section-card__title">ACHIEVEMENTS</h3>
          <div className="profile-achievement-groups">
            {achievementGroups.map(group => {
              const isOpen = openAchievementGroup === group.id;

              return (
                <div key={group.id} className={`profile-achievement-group ${isOpen ? 'profile-achievement-group--open' : ''}`}>
                  <button
                    className="profile-achievement-group__trigger"
                    type="button"
                    onClick={() => setOpenAchievementGroup(isOpen ? null : group.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="profile-achievement-group__name">{group.label}</span>
                    <span className="profile-achievement-group__count">{group.completed} / {group.total}</span>
                    <span className="profile-achievement-group__chevron" aria-hidden="true">{isOpen ? '⌄' : '›'}</span>
                  </button>

                  {isOpen && (
                    <div className="profile-achievement-list">
                      {group.items.map(achievement => {
                        const isSecretLocked = achievement.secret && !achievement.unlocked;
                        const progress = achievement.progress && !achievement.unlocked
                          ? achievement.progress(metrics)
                          : null;

                        return (
                          <div key={achievement.id} className={`profile-achievement-item ${achievement.unlocked ? 'profile-achievement-item--unlocked' : 'profile-achievement-item--locked'}`}>
                            <div className="profile-achievement-item__icon">
                              {isSecretLocked ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                              ) : (
                                ICONS[achievement.icon] || ICONS.diamond
                              )}
                            </div>
                            <div className="profile-achievement-item__content">
                              <span className="profile-achievement-item__name">
                                {isSecretLocked ? '???' : achievement.name}
                              </span>
                              <span className="profile-achievement-item__description">
                                {isSecretLocked ? 'Complete the requirement to reveal' : achievement.description}
                              </span>
                              {progress && (
                                <span className="profile-achievement-item__progress">
                                  {progress.current} / {progress.target}
                                </span>
                              )}
                            </div>
                            <span className="profile-achievement-item__status">
                              {achievement.unlocked ? 'Complete' : 'Locked'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

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

function RankAscentGraph({ ranks = [], rankInfo }) {
  const currentLevel = rankInfo?.level ?? 1;
  const [activeRank, setActiveRank] = useState(null);

  // Desktop coordinate mapping (5 ranks along smooth curve)
  // X: 8%, 28%, 50%, 72%, 92%
  // Y: 85%, 68%, 48%, 28%, 10% (Sovereign sits at highest point)
  const desktopPoints = [
    { x: 8, y: 85 },
    { x: 28, y: 68 },
    { x: 50, y: 48 },
    { x: 72, y: 28 },
    { x: 92, y: 10 },
  ];

  // Mobile coordinate mapping (Bottom to Top ascent curve)
  // X: 15%, 32%, 52%, 70%, 85%
  // Y: 88%, 70%, 50%, 30%, 12%
  const mobilePoints = [
    { x: 15, y: 88 },
    { x: 32, y: 70 },
    { x: 52, y: 50 },
    { x: 70, y: 30 },
    { x: 85, y: 12 },
  ];

  // Generate SVG path curves
  const createPathD = (pts) => {
    return pts.reduce((acc, pt, idx) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      const prev = pts[idx - 1];
      const cx1 = prev.x + (pt.x - prev.x) * 0.5;
      const cy1 = prev.y;
      const cx2 = prev.x + (pt.x - prev.x) * 0.5;
      const cy2 = pt.y;
      return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${pt.x} ${pt.y}`;
    }, '');
  };

  const desktopPathD = createPathD(desktopPoints);
  const mobilePathD = createPathD(mobilePoints);

  const completedPointsDesktop = desktopPoints.slice(0, currentLevel);
  const completedPathDesktopD = completedPointsDesktop.length > 1 ? createPathD(completedPointsDesktop) : '';

  const completedPointsMobile = mobilePoints.slice(0, currentLevel);
  const completedPathMobileD = completedPointsMobile.length > 1 ? createPathD(completedPointsMobile) : '';

  // Selected or current rank information for mobile tap display / active selection
  const activeRankData = activeRank || ranks[currentLevel - 1] || ranks[0];

  return (
    <div className="ascent-graph-container">
      {/* ── Desktop Ascent Graph (bottom-left → top-right curve) ── */}
      <div className="ascent-graph-desktop" aria-label="Ascending rank progression map">
        <svg className="ascent-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Muted full background curve */}
          <path d={desktopPathD} className="ascent-path-bg" />
          {/* Active completed curve */}
          {completedPathDesktopD && <path d={completedPathDesktopD} className="ascent-path-completed" />}
        </svg>

        {ranks.map((rank, index) => {
          const isCurrent = index === currentLevel - 1;
          const isCompleted = index < currentLevel - 1;
          const pt = desktopPoints[index];
          const isSovereign = index === ranks.length - 1;

          return (
            <div
              key={rank.name}
              className={`ascent-node-wrap ${isCurrent ? 'ascent-node-wrap--current' : isCompleted ? 'ascent-node-wrap--completed' : 'ascent-node-wrap--future'} ${isSovereign ? 'ascent-node-wrap--sovereign' : ''}`}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              <div className="ascent-node-interactive">
                {/* Node marker */}
                <div className="ascent-node-marker">
                  {isCurrent && <span className="ascent-node-ring" />}
                </div>

                {/* Always visible rank label */}
                <div className="ascent-node-label-box">
                  <span className="ascent-node-title">{rank.name}</span>
                  {isCurrent && <span className="ascent-node-status-tag">CURRENT</span>}
                </div>

                {/* Hover Tooltip / Popover */}
                <div className="ascent-tooltip">
                  <span className="ascent-tooltip__name">{rank.name}</span>
                  <div className="ascent-tooltip__reqs">
                    <span>{rank.minStreak} DAY STREAK</span>
                    <span>{rank.minHabits} HABITS</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile Ascent Graph (Bottom → Top ascending curve) ── */}
      <div className="ascent-graph-mobile" aria-label="Ascending rank progression mobile map">
        <svg className="ascent-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={mobilePathD} className="ascent-path-bg" />
          {completedPathMobileD && <path d={completedPathMobileD} className="ascent-path-completed" />}
        </svg>

        {ranks.map((rank, index) => {
          const isCurrent = index === currentLevel - 1;
          const isCompleted = index < currentLevel - 1;
          const isSelected = activeRankData.name === rank.name;
          const pt = mobilePoints[index];
          const isSovereign = index === ranks.length - 1;

          return (
            <button
              key={rank.name}
              type="button"
              className={`ascent-mobile-node ${isCurrent ? 'ascent-mobile-node--current' : isCompleted ? 'ascent-mobile-node--completed' : 'ascent-mobile-node--future'} ${isSelected ? 'ascent-mobile-node--selected' : ''} ${isSovereign ? 'ascent-mobile-node--sovereign' : ''}`}
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
              onClick={() => setActiveRank(rank)}
              aria-label={`Select rank ${rank.name}`}
            >
              <div className="ascent-node-marker">
                {isCurrent && <span className="ascent-node-ring" />}
              </div>
              <span className="ascent-mobile-node-name">{rank.name}</span>
            </button>
          );
        })}

        {/* Compact Mobile Requirement Panel on Tap */}
        {activeRankData && (
          <div className="ascent-mobile-info">
            <div className="ascent-mobile-info__header">
              <span className="ascent-mobile-info__title">{activeRankData.name}</span>
              {activeRankData.name === (ranks[currentLevel - 1]?.name) && (
                <span className="ascent-mobile-info__badge">CURRENT RANK</span>
              )}
            </div>
            <div className="ascent-mobile-info__stats">
              <span>{activeRankData.minStreak} DAY STREAK</span>
              <span>•</span>
              <span>{activeRankData.minHabits} HABITS</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
        <section className={`profile-section-card profile-section-card--rank ${loading ? 'profile-section-card--loading' : ''}`}>
          <div className="profile-rank-header">
            <h3 className="profile-section-card__title">RANK PROGRESSION</h3>
            <span className="profile-rank-header__sub">YOUR ASCENSION</span>
          </div>

          {/* ── Ascending Graph (Desktop & Mobile Unified Concept) ── */}
          <RankAscentGraph ranks={RANKS} rankInfo={metrics.rankInfo} />
        </section>

        <section className={`profile-section-card profile-section-card--achievements ${loading ? 'profile-section-card--loading' : ''}`}>
          <div className="profile-achievements-header">
            <h3 className="profile-section-card__title">ACHIEVEMENTS</h3>
            <span className="profile-achievements-header__count">
              {achievements.filter(a => a.unlocked).length} / {achievements.length}
            </span>
          </div>

          <div className="profile-achievement-groups">
            {achievementGroups.map(group => {
              const isOpen = openAchievementGroup === group.id;
              const percent = group.total > 0 ? Math.round((group.completed / group.total) * 100) : 0;

              return (
                <div key={group.id} className={`profile-achievement-group ${isOpen ? 'profile-achievement-group--open' : ''}`}>
                  <button
                    className="profile-achievement-group__trigger"
                    type="button"
                    onClick={() => setOpenAchievementGroup(isOpen ? null : group.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="profile-achievement-group__left">
                      <span className="profile-achievement-group__indicator" />
                      <span className="profile-achievement-group__name">{group.label}</span>
                    </div>

                    <div className="profile-achievement-group__right">
                      <span className="profile-achievement-group__count">{group.completed} / {group.total}</span>
                      <span className="profile-achievement-group__chevron" aria-hidden="true">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </span>
                    </div>
                  </button>

                  <div className="profile-achievement-group__progress-track">
                    <div className="profile-achievement-group__progress-bar" style={{ width: `${percent}%` }} />
                  </div>

                  {isOpen && (
                    <div className="profile-achievement-list">
                      {group.items.map(achievement => {
                        const isSecretLocked = achievement.secret && !achievement.unlocked;
                        const progress = achievement.progress && !achievement.unlocked
                          ? achievement.progress(metrics)
                          : null;

                        return (
                          <div key={achievement.id} className={`profile-achievement-item ${achievement.unlocked ? 'profile-achievement-item--unlocked' : 'profile-achievement-item--locked'}`}>
                            <div className="profile-achievement-item__marker">
                              <span className="profile-achievement-item__dot" />
                            </div>

                            <div className="profile-achievement-item__content">
                              <div className="profile-achievement-item__name">
                                {isSecretLocked ? '???' : achievement.name}
                              </div>
                              <div className="profile-achievement-item__description">
                                {isSecretLocked ? 'Complete requirement to reveal secret' : achievement.description}
                              </div>
                              {progress && (
                                <div className="profile-achievement-item__progress">
                                  {progress.current} / {progress.target}
                                </div>
                              )}
                            </div>

                            <div className="profile-achievement-item__status">
                              {achievement.unlocked ? '✓' : '—'}
                            </div>
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

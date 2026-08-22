import { useMemo, useState, useEffect } from 'react';
import JsonLd from '../components/JsonLd';
import '../styles/dashboard.css';
import { getRankInfo, RANKS } from '../utils/analyticsHelpers';
import { getAvatarSignedUrl } from '../services/avatar';
import { useAuth } from '../contexts/AuthContext';
import { ACHIEVEMENTS_CONFIG, ACHIEVEMENT_CATEGORIES, calculateAchievementData } from '../utils/achievements';

const ICONS = {
  diamond: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12l4 6-10 12L2 9z" /></svg>,
  shield: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  flame: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" /></svg>,
  calendar: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>,
  notebook: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
  trophy: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>,
  target: <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
  activity: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 12-4 0-3 9L9 3l-3 9H2" /></svg>,
  check: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>,
  lock: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
};

function ProfileHeader({ profile, avatarUrl, isEmailVerified, rankInfo }) {
  const initials = profile?.display_name?.split(' ').map((name) => name[0]).join('').toUpperCase().slice(0, 2) || 'DO';
  const joined = profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2026';
  return <section className="profile-hero-card">
    <div className="profile-hero-card__avatar">
      <div className="profile-avatar">{avatarUrl ? <img src={avatarUrl} alt="Profile avatar" /> : <span className="profile-avatar-letters">{initials}</span>}</div>
      {!isEmailVerified && <span className="profile-verify-badge">Verify email</span>}
    </div>
    <div className="profile-hero-card__identity">
      <span className="profile-eyebrow">Personal operating record</span>
      <h1 className="profile-hero-card__name">{profile?.display_name || 'Dev Operator'}</h1>
      <span className="profile-hero-card__joined">Joined {joined}</span>
      <span className="profile-hero-card__rank-pill">{ICONS.shield}<span>{rankInfo.name}</span></span>
    </div>
    <div className="profile-hero-card__progress">
      <div className="profile-hero-card__progress-heading"><span>Progression</span><strong>{rankInfo.progressPercent}%</strong></div>
      <div className="profile-hero-card__progress-label">{rankInfo.name} {rankInfo.nextRankName ? `→ ${rankInfo.nextRankName}` : ''}</div>
      <div className="profile-hero-card__progress-track"><div className="profile-hero-card__progress-bar" style={{ width: `${rankInfo.progressPercent}%` }} /></div>
      <span className="profile-hero-card__progress-value">{rankInfo.nextRankRequirement}</span>
    </div>
  </section>;
}

function ProfileStats({ metrics, loading }) {
  const stats = [[ICONS.flame, metrics.streak, 'Day streak'], [ICONS.check, metrics.totalHabits, 'Habits done'], [ICONS.target, `${metrics.consistency}%`, 'Consistency'], [ICONS.activity, metrics.checkIns, 'Check-ins']];
  return <section className="profile-stats-grid profile-stats-grid--four" aria-label="Profile statistics">{stats.map(([icon, value, label]) => <article className={`dashboard-overview__card ${loading ? 'dashboard-overview__card--loading' : ''}`} key={label}><div className="dashboard-overview__card-icon">{icon}</div><strong className="dashboard-overview__card-value">{value}</strong><span className="dashboard-overview__card-label">{label}</span></article>)}</section>;
}

function RankProgression({ rankInfo, loading }) {
  return <section className={`profile-section-card ${loading ? 'profile-section-card--loading' : ''}`}><div className="profile-section-heading"><div><span className="profile-eyebrow">The climb</span><h2 className="profile-section-card__title">Rank progression</h2></div><span className="profile-section-count">{rankInfo.level} / {RANKS.length}</span></div><div className="profile-rank-list">{RANKS.map((rank, index) => { const state = index === rankInfo.level - 1 ? 'current' : index < rankInfo.level - 1 ? 'completed' : 'locked'; return <div key={rank.name} className={`profile-rank-item profile-rank-item--${state}`}><div className="profile-rank-item__dot">{state === 'completed' && ICONS.check}</div><div><span className="profile-rank-item__name">{rank.name}</span><span className="profile-rank-item__requirement">{state === 'current' ? 'Current rank' : `${rank.minStreak} day streak + ${rank.minHabits} habits`}</span></div>{state === 'current' && <span className="profile-current-label">Current</span>}</div>; })}</div></section>;
}

function AchievementRow({ achievement, metrics }) {
  const lockedSecret = achievement.secret && !achievement.unlocked;
  const progress = achievement.progress && !achievement.unlocked ? achievement.progress(metrics) : null;
  return <article className={`profile-achievement-item ${achievement.unlocked ? 'profile-achievement-item--unlocked' : 'profile-achievement-item--locked'}`}><div className="profile-achievement-item__icon">{lockedSecret ? ICONS.lock : ICONS[achievement.icon] || ICONS.diamond}</div><div className="profile-achievement-item__content"><div className="profile-achievement-item__topline"><span className="profile-achievement-item__name">{lockedSecret ? '???' : achievement.name}</span>{achievement.unlocked && <span className="profile-unlocked-label">Unlocked</span>}</div><span className="profile-achievement-item__description">{lockedSecret ? 'Complete the requirement to reveal' : achievement.description}</span>{progress && <span className="profile-achievement-item__progress">{progress.current} / {progress.target}</span>}</div></article>;
}

function AchievementGroup({ category, achievements, metrics, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const unlocked = achievements.filter((achievement) => achievement.unlocked).length;
  return <section className={`profile-achievement-group ${open ? 'profile-achievement-group--open' : ''}`}><button type="button" className="profile-achievement-group__trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}><span className="profile-achievement-group__title"><span className="profile-achievement-group__icon">{category.icon}</span>{category.name}</span><span className="profile-achievement-group__meta">{unlocked}/{achievements.length}<span className="profile-chevron" aria-hidden="true">⌄</span></span></button>{open && <div className="profile-achievement-list">{achievements.map((achievement) => <AchievementRow key={achievement.id} achievement={achievement} metrics={metrics} />)}</div>}</section>;
}

function AchievementGroups({ achievements, metrics, loading }) {
  const groups = Object.values(ACHIEVEMENT_CATEGORIES).map((category) => ({ category, achievements: achievements.filter((achievement) => achievement.category === category.id) })).filter((group) => group.achievements.length);
  return <section className={`profile-section-card profile-achievements-card ${loading ? 'profile-section-card--loading' : ''}`}><div className="profile-section-heading"><div><span className="profile-eyebrow">Milestones</span><h2 className="profile-section-card__title">Achievements</h2></div><span className="profile-section-count">{achievements.filter((achievement) => achievement.unlocked).length} / {achievements.length}</span></div><div className="profile-achievement-groups">{groups.map((group, index) => <AchievementGroup key={group.category.id} {...group} metrics={metrics} defaultOpen={index === 0} />)}</div></section>;
}

export default function ProfilePage({ habits = [], completionData = {}, journalEntries = [], profile = null }) {
  const { user } = useAuth();
  const isEmailVerified = Boolean(user?.email_confirmed_at);
  const [loading, setLoading] = useState(true);
  const [signedAvatarUrl, setSignedAvatarUrl] = useState(null);
  useEffect(() => { const timer = setTimeout(() => setLoading(false), 500); return () => clearTimeout(timer); }, []);
  useEffect(() => {
    let active = true;
    if (profile?.avatar_url) {
      getAvatarSignedUrl(profile.avatar_url).then((url) => { if (active) setSignedAvatarUrl(url); });
    } else {
      const clearTimer = setTimeout(() => { if (active) setSignedAvatarUrl(null); }, 0);
      return () => { active = false; clearTimeout(clearTimer); };
    }
    return () => { active = false; };
  }, [profile]);
  const metrics = useMemo(() => {
    const achievementData = calculateAchievementData(habits, completionData, journalEntries, profile, user);
    let consistency = 0; const completionDates = new Set();
    Object.keys(completionData).forEach((key) => { if (completionData[key]) completionDates.add(key.split(':')[1]); });
    if (completionDates.size > 0) { const firstCompletionDate = new Date(Array.from(completionDates).sort()[0]); firstCompletionDate.setHours(0, 0, 0, 0); const today = new Date(); today.setHours(0, 0, 0, 0); const daysSinceFirstCompletion = Math.ceil((today - firstCompletionDate) / (1000 * 60 * 60 * 24)); if (daysSinceFirstCompletion > 0) consistency = Math.min(100, Math.round((completionDates.size / daysSinceFirstCompletion) * 100)); }
    return { ...achievementData, checkIns: achievementData.totalHabits, consistency, rankInfo: getRankInfo(achievementData.streak, achievementData.totalHabits) };
  }, [completionData, journalEntries, profile, user, habits]);
  const achievements = useMemo(() => ACHIEVEMENTS_CONFIG.map((achievement) => { try { return { ...achievement, unlocked: achievement.check(metrics) }; } catch (error) { console.error(`Error checking achievement ${achievement.id}:`, error); return { ...achievement, unlocked: false }; } }), [metrics]);
  return <div className="profile-page"><JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orixus.vercel.app/' }, { '@type': 'ListItem', position: 2, name: 'Profile', item: 'https://orixus.vercel.app/profile' }] }} /><ProfileHeader profile={profile} avatarUrl={signedAvatarUrl} isEmailVerified={isEmailVerified} rankInfo={metrics.rankInfo} /><ProfileStats metrics={metrics} loading={loading} /><div className="profile-two-column"><RankProgression rankInfo={metrics.rankInfo} loading={loading} /><AchievementGroups achievements={achievements} metrics={metrics} loading={loading} /></div></div>;
}

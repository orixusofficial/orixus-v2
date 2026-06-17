import '../styles/dashboard.css';

const RANKS = [
  { name: 'Initiate', requirement: 'Current rank' },
  { name: 'Ascendant', requirement: '30 day streak' },
  { name: 'Vanguard', requirement: '60 day streak' },
  { name: 'Apex', requirement: '90 day streak' },
  { name: 'Sovereign', requirement: '180 day streak' },
];

const ACHIEVEMENTS = [
  { name: 'First Spark', description: 'Complete your first habit check-in', icon: 'flame', unlocked: true },
  { name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'calendar', unlocked: false },
  { name: 'Deep Thinker', description: 'Write 10 journal entries', icon: 'notebook', unlocked: false },
  { name: 'Elite Status', description: 'Reach Vanguard rank', icon: 'trophy', unlocked: false },
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
};

export default function ProfilePage() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="profile-page">
      {/* Profile Hero Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-card__avatar">
          <div className="profile-avatar">
            <span className="profile-avatar-letters">DO</span>
          </div>
        </div>
        <div className="profile-hero-card__identity">
          <h3 className="profile-hero-card__name">Dev Operator</h3>
          <span className="profile-hero-card__joined">Joined January 2026</span>
          <span className="profile-hero-card__rank-pill">
            {ICONS.shield}
            <span>Initiate</span>
          </span>
        </div>
        <div className="profile-hero-card__progress">
          <div className="profile-hero-card__progress-label">Initiate → Ascendant</div>
          <div className="profile-hero-card__progress-track">
            <div className="profile-hero-card__progress-bar" style={{ width: '35%' }} />
          </div>
          <span className="profile-hero-card__progress-value">35% to next rank</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="profile-stats-grid profile-stats-grid--four">
        <div className="dashboard-overview__card">
          <span className="dashboard-overview__card-value">0</span>
          <span className="dashboard-overview__card-label">Day Streak</span>
        </div>
        <div className="dashboard-overview__card">
          <span className="dashboard-overview__card-value">0</span>
          <span className="dashboard-overview__card-label">Habits Done</span>
        </div>
        <div className="dashboard-overview__card">
          <span className="dashboard-overview__card-value">0%</span>
          <span className="dashboard-overview__card-label">Consistency</span>
        </div>
        <div className="dashboard-overview__card">
          <span className="dashboard-overview__card-value">0</span>
          <span className="dashboard-overview__card-label">Check-ins</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="profile-two-column">
        {/* Rank Progression */}
        <div className="profile-section-card">
          <h3 className="profile-section-card__title">RANK PROGRESSION</h3>
          <div className="profile-rank-list">
            {RANKS.map((rank, index) => (
              <div key={rank.name} className={`profile-rank-item ${index === 0 ? 'profile-rank-item--current' : ''}`}>
                <div className="profile-rank-item__dot" />
                <span className="profile-rank-item__name">{rank.name}</span>
                <span className="profile-rank-item__requirement">{rank.requirement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="profile-section-card">
          <h3 className="profile-section-card__title">ACHIEVEMENTS</h3>
          <div className="profile-achievement-list">
            {ACHIEVEMENTS.map((achievement) => (
              <div key={achievement.name} className={`profile-achievement-item ${achievement.unlocked ? 'profile-achievement-item--unlocked' : ''}`}>
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

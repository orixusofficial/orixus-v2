import '../styles/dashboard.css';

function initialsFromUser(user, profile) {
  const name = profile?.display_name?.trim();
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  const email = user?.email ?? '';
  if (email) return email.slice(0, 2).toUpperCase();
  return 'OX';
}

function operatorLabel(user, profile) {
  const name = profile?.display_name?.trim();
  if (name) return name;
  if (user?.email) return user.email.split('@')[0];
  return 'Operator';
}

export default function ProfilePage({ habits, completionData, user, profile }) {
  // Let's compute rank details
  const totalCompletions = Object.values(completionData).filter(Boolean).length;
  
  let rank = "Centurion (Tier 1)";
  let level = 1;
  let levelProgress = 20;

  if (totalCompletions >= 40) {
    rank = "Imperator (Tier 3)";
    level = 5;
    levelProgress = Math.min(100, Math.round(((totalCompletions - 40) / 100) * 100));
  } else if (totalCompletions >= 15) {
    rank = "Decurion (Tier 2)";
    level = 3;
    levelProgress = Math.round(((totalCompletions - 15) / 25) * 100);
  } else {
    levelProgress = Math.round((totalCompletions / 15) * 100);
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1 className="page-title">Operator Profile</h1>
        <p className="page-quote">“Identity is built by proof. Who are you when nobody is looking?”</p>
      </div>

      <div className="profile-layout">
        <div className="profile-main-card">
          <div className="profile-avatar-row">
            <div className="profile-avatar">
              <span className="profile-avatar-letters">{initialsFromUser(user, profile)}</span>
            </div>
            <div className="profile-identity">
              <h3 className="profile-name">{operatorLabel(user, profile)}</h3>
              <span className="profile-rank">{rank}</span>
              {user?.email && <span className="profile-email">{user.email}</span>}
            </div>
          </div>

          <div className="profile-level-section">
            <div className="profile-level-info">
              <span className="profile-level-label">Discipline Level {level}</span>
              <span className="profile-level-val">{levelProgress}% to next tier</span>
            </div>
            <div className="profile-level-track">
              <div className="profile-level-bar" style={{ width: `${levelProgress}%` }} />
            </div>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="dashboard-overview__card">
            <span className="dashboard-overview__card-value">{habits.length}</span>
            <span className="dashboard-overview__card-label">Active Protocols</span>
            <span className="dashboard-overview__card-desc">Active habits being monitored</span>
          </div>

          <div className="dashboard-overview__card">
            <span className="dashboard-overview__card-value">{totalCompletions}</span>
            <span className="dashboard-overview__card-label">Identities Earned</span>
            <span className="dashboard-overview__card-desc">Successful checks recorded</span>
          </div>
        </div>
      </div>
    </div>
  );
}

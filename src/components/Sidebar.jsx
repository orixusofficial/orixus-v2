import '../styles/sidebar.css';

/**
 * Premium SVG Icons — minimalist & sharp
 */
const ICONS = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  habits: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  journal: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  login: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
    </svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { id: 'habits',    label: 'Habits',    icon: ICONS.habits },
  { id: 'analytics', label: 'Analytics', icon: ICONS.analytics },
  { id: 'journal',   label: 'Journal',   icon: ICONS.journal },
];

const ACCOUNT_ITEMS_AUTHENTICATED = [
  { id: 'profile', label: 'Profile', icon: ICONS.profile },
  { id: 'settings', label: 'Settings', icon: ICONS.settings },
  { id: 'logout', label: 'Logout', icon: ICONS.logout },
];

export default function Sidebar({
  activeItem = 'dashboard',
  onNavigate,
  isOpen,
  collapsed,
  onCollapse,
  isAuthenticated = false,
}) {
  const accountItems = isAuthenticated ? ACCOUNT_ITEMS_AUTHENTICATED : [];
  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}${collapsed ? ' sidebar--collapsed' : ''}`}>

      {/* Brand + Hamburger */}
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-label="Orixus">
          <span className="sidebar__logo-full">
            Orixus.
          </span>
          <span className="sidebar__logo-collapsed">
            O.
          </span>
        </div>

        <button
          className="sidebar__hamburger"
          onClick={onCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span className="sidebar__hamburger-bar" />
          <span className="sidebar__hamburger-bar" />
          <span className="sidebar__hamburger-bar" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__section-label">Menu</div>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar__link${activeItem === item.id ? ' sidebar__link--active' : ''}`}
            onClick={() => onNavigate?.(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__link-text">{item.label}</span>
          </button>
        ))}

        <div className="sidebar__divider" />

        <div className="sidebar__section-label">Account</div>
        {accountItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar__link${activeItem === item.id ? ' sidebar__link--active' : ''}`}
            onClick={() => onNavigate?.(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="sidebar__icon">{item.icon}</span>
            <span className="sidebar__link-text">{item.label}</span>
          </button>
        ))}

      </nav>
    </aside>
  );
}

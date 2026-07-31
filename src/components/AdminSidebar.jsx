import '../styles/admin-sidebar.css';

const ICONS = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  feedback: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: ICONS.dashboard },
  { id: 'users', label: 'Users', icon: ICONS.users },
  { id: 'feedback', label: 'Feedback', icon: ICONS.feedback },
];

export default function AdminSidebar({
  activeItem = 'dashboard',
  onNavigate,
  isOpen,
  collapsed,
  onCollapse,
}) {
  return (
    <aside className={`admin-sidebar${isOpen ? ' admin-sidebar--open' : ''}${collapsed ? ' admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo" aria-label="Orixus Admin">
          <img src="/RB%20logo.svg" alt="Orixus" className="admin-sidebar__logo-full" />
          <span className="admin-sidebar__logo-text">orixus admin</span>
          <img src="/RB%20logo.svg" alt="Orixus" className="admin-sidebar__logo-collapsed" />
        </div>

        <button
          className="admin-sidebar__hamburger"
          onClick={onCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <span className="admin-sidebar__hamburger-bar" />
          <span className="admin-sidebar__hamburger-bar" />
          <span className="admin-sidebar__hamburger-bar" />
        </button>
      </div>

      <nav className="admin-sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`admin-sidebar__link${activeItem === item.id ? ' admin-sidebar__link--active' : ''}`}
            onClick={() => onNavigate?.(item.id)}
            title={collapsed ? item.label : undefined}
          >
            <span className="admin-sidebar__icon">{item.icon}</span>
            <span className="admin-sidebar__link-text">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

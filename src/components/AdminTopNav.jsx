import '../styles/admin-topnav.css';

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function HamburgerIcon() {
  return (
    <svg
      width="18"
      height="14"
      viewBox="0 0 18 14"
      fill="none"
      aria-hidden="true"
    >
      <rect x="0" y="0"  width="18" height="1.5" rx="1" fill="currentColor" />
      <rect x="0" y="6"  width="12" height="1.5" rx="1" fill="currentColor" />
      <rect x="0" y="12" width="18" height="1.5" rx="1" fill="currentColor" />
    </svg>
  );
}

export default function AdminTopNav({ onMenuToggle, sidebarCollapsed = false }) {
  const today = new Date();

  return (
    <header className="admin-topnav">
      <div className="admin-topnav__left">
        <button
          className="admin-topnav__menu-btn"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>

        <div className="admin-topnav__greeting">
          <span className="admin-topnav__welcome">Admin Panel</span>
          <span className="admin-topnav__date">{formatDate(today)}</span>
        </div>
      </div>

      <div className="admin-topnav__right">
        <div className="admin-topnav__badge">
          <span className="admin-topnav__badge-icon">⚙</span>
          <span>Administrator</span>
        </div>
      </div>
    </header>
  );
}

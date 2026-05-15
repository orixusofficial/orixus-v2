import '../styles/topnav.css';

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Hamburger icon — three clean SVG bars.
 * Only shown on mobile to trigger the sidebar drawer.
 */
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

export default function TopNav({ onMenuToggle }) {
  const today = new Date();

  return (
    <header className="topnav">
      <div className="topnav__left">
        {/* Mobile-only menu button */}
        <button
          className="topnav__menu-btn"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <HamburgerIcon />
        </button>

        <div className="topnav__greeting">
          <span className="topnav__welcome">Welcome back</span>
          <span className="topnav__date">{formatDate(today)}</span>
        </div>
      </div>

      <div className="topnav__right">
        <div className="topnav__streak">
          <span className="topnav__streak-icon">◆</span>
          <span>0 day streak</span>
        </div>
        
        {/* Removed avatar/circular button as per cleanup request */}
      </div>
    </header>
  );
}

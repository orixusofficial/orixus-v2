import { PanelLeft } from 'lucide-react';
import '../styles/topnav.css';

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TopNav({ onMenuToggle, streak = 0 }) {
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
          <PanelLeft size={18} />
        </button>

        <div className="topnav__greeting">
          <span className="topnav__welcome">Welcome back</span>
          <span className="topnav__date">{formatDate(today)}</span>
        </div>
      </div>

      <div className="topnav__right">
        <div className="topnav__streak">
          <span className="topnav__streak-icon">◆</span>
          <span>{streak} day streak</span>
        </div>
        
        {/* Removed avatar/circular button as per cleanup request */}
      </div>
    </header>
  );
}

import { useState } from 'react';
import '../styles/landing.css';

export default function LandingPage({ onEnterApp }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLinkClick = (e, action) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (action) {
      action();
    }
  };

  return (
    <div className="landing-container">
      {/* Background Architectural Elements */}
      <div className="landing-grid-overlay" />
      <div className="landing-subtle-circle" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo" onClick={() => onEnterApp?.()} aria-label="Orixus">
          Ori<span className="landing-logo-accent">x</span>us<span className="landing-logo-accent">.</span>
        </div>

        <button
          className={`landing-mobile-toggle${mobileMenuOpen ? ' open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="landing-mobile-toggle-icon" />
        </button>

        <div className={`landing-nav-links${mobileMenuOpen ? ' open' : ''}`}>
          <a
            href="#features"
            className="landing-nav-link"
            onClick={(e) => handleLinkClick(e)}
          >
            Features
          </a>
          <a
            href="#philosophy"
            className="landing-nav-link"
            onClick={(e) => handleLinkClick(e)}
          >
            Philosophy
          </a>
          <button
            className="landing-nav-link"
            onClick={(e) => handleLinkClick(e, onEnterApp)}
          >
            Login
          </button>
          <button
            className="landing-btn-start"
            onClick={(e) => handleLinkClick(e, onEnterApp)}
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <span className="landing-hero-eyebrow">Personal Evolution System</span>
        
        <h1 className="landing-hero-title">
          <span>Build Discipline.</span>
          <span>Track Growth.</span>
          <span>Become Stronger.</span>
        </h1>

        <p className="landing-hero-subtitle">
          A structured system designed to help ambitious people build consistency, 
          develop discipline, and experience measurable personal growth over time.
        </p>

        <div className="landing-hero-actions">
          <button 
            className="landing-btn-primary" 
            onClick={onEnterApp}
          >
            Start Free
          </button>
          <button 
            className="landing-btn-secondary" 
            onClick={onEnterApp}
          >
            See How It Works
          </button>
        </div>
      </header>
    </div>
  );
}

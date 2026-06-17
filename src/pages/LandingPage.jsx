import { useState } from 'react';
import '../styles/landing.css';

const NAV_LINKS = [
  { label: 'Features', target: 'features' },
  { label: 'Philosophy', target: 'philosophy' },
  { label: 'Journal', target: 'journal' },
  { label: 'Analytics', target: 'analytics' },
];

const PRODUCT_AREAS = [
  {
    id: 'tracker',
    title: 'Habit Tracker',
    eyebrow: 'Daily execution',
    description:
      'A strict visual matrix for the actions that define who you are becoming.',
  },
  {
    id: 'analytics',
    title: 'Analytics',
    eyebrow: 'Measured growth',
    description:
      'Streaks, consistency, rank, and progression brought into one disciplined view.',
  },
  {
    id: 'journal',
    title: 'Journal',
    eyebrow: 'Reflection loop',
    description:
      'Capture friction, decisions, and proof so progress becomes conscious.',
  },
];

const RANKS = ['Initiate', 'Ascendant', 'Vanguard', 'Apex', 'Sovereign'];

function OrixusLogo({ className = 'landing-logo', onClick }) {
  return (
    <button className={className} onClick={onClick} aria-label="Orixus home">
      Orixus.
    </button>
  );
}

function SectionHeader({ eyebrow, title, children, align = 'center' }) {
  return (
    <div className={`landing-section-header landing-section-header--${align}`}>
      <span className="landing-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

function MiniMatrix() {
  const rows = [
    { label: 'Training', pattern: [1, 1, 1, 0, 1, 1, 1] },
    { label: 'Reading', pattern: [1, 1, 0, 1, 1, 1, 0] },
    { label: 'Deep Work', pattern: [1, 0, 1, 1, 1, 0, 1] },
  ];

  return (
    <div className="landing-mini-matrix" aria-hidden="true">
      {rows.map((row) => (
        <div className="landing-mini-matrix__row" key={row.label}>
          <span>{row.label}</span>
          <div>
            {row.pattern.map((done, index) => (
              <i className={done ? 'is-done' : ''} key={`${row.label}-${index}`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="landing-hero-preview" aria-label="Orixus product preview">
      <div className="landing-preview-shell">
        <div className="landing-preview-shell__top">
          <span>Discipline Matrix</span>
          <span>Today</span>
        </div>
        <div className="landing-preview-shell__body">
          <div className="landing-preview-metric">
            <span>Current Streak</span>
            <strong>14 Days</strong>
          </div>
          <div className="landing-preview-metric">
            <span>Execution Rate</span>
            <strong>87%</strong>
          </div>
          <MiniMatrix />
        </div>
      </div>
    </div>
  );
}

function ProductMockup({ area }) {
  if (area.id === 'tracker') {
    return (
      <div className="landing-product-mockup landing-product-mockup--tracker">
        <MiniMatrix />
      </div>
    );
  }

  if (area.id === 'analytics') {
    return (
      <div className="landing-product-mockup landing-product-mockup--analytics">
        <div className="landing-rank-line">
          <span>Vanguard</span>
          <strong>Level 3</strong>
        </div>
        <div className="landing-chart" aria-hidden="true">
          <i style={{ height: '34%' }} />
          <i style={{ height: '52%' }} />
          <i style={{ height: '46%' }} />
          <i style={{ height: '72%' }} />
          <i style={{ height: '64%' }} />
          <i style={{ height: '88%' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="landing-product-mockup landing-product-mockup--journal">
      <span>Jun 15</span>
      <strong>Friction Point Solved</strong>
      <p>Removed the easy exit. Kept the standard. Logged the lesson.</p>
    </div>
  );
}

function ProductArea({ area }) {
  return (
    <article className="landing-product-area" id={area.id}>
      <ProductMockup area={area} />
      <div>
        <span>{area.eyebrow}</span>
        <h3>{area.title}</h3>
        <p>{area.description}</p>
      </div>
    </article>
  );
}

export default function LandingPage({ onEnterApp }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSectionClick = (event, target) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEnterApp = () => {
    setMobileMenuOpen(false);
    onEnterApp?.();
  };

  return (
    <div className="landing-container">
      <div className="landing-grid-overlay" />
      <div className="landing-depth-line" />

      <nav className="landing-nav">
        <OrixusLogo onClick={handleEnterApp} />

        <button
          className={`landing-mobile-toggle${mobileMenuOpen ? ' open' : ''}`}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="landing-mobile-toggle-icon" />
        </button>

        <div className={`landing-nav-links${mobileMenuOpen ? ' open' : ''}`}>
          {NAV_LINKS.map((link) => (
            <a
              href={`#${link.target}`}
              className="landing-nav-link"
              onClick={(event) => handleSectionClick(event, link.target)}
              key={link.target}
            >
              {link.label}
            </a>
          ))}
          <button className="landing-btn-start" onClick={handleEnterApp}>
            Start Free
          </button>
        </div>
      </nav>

      <main>
        <header className="landing-hero">
          <div className="landing-hero__copy">
            <span className="landing-eyebrow">Personal Evolution System</span>
            <h1>
              <span>Build Discipline.</span>
              <span>Track Growth.</span>
              <span>Become Stronger.</span>
            </h1>
            <p>
              A structured system for ambitious people who want to build consistency,
              sharpen discipline, and create measurable personal growth over time.
            </p>
            <div className="landing-hero-actions">
              <button className="landing-btn-primary" onClick={handleEnterApp}>
                Start Your Journey
              </button>
              <a
                className="landing-btn-secondary"
                href="#features"
                onClick={(event) => handleSectionClick(event, 'features')}
              >
                See the System
              </a>
            </div>
          </div>
          <HeroPreview />
        </header>

        <section className="landing-section landing-why" id="features">
          <div className="landing-why__statement">
            <span className="landing-eyebrow">Why Orixus</span>
            <h2>Most apps track tasks. Orixus tracks personal evolution.</h2>
          </div>
          <div className="landing-why__body">
            <p>
              Tasks end when they are checked off. Evolution compounds when a repeated
              action becomes part of your identity.
            </p>
            <p>
              Orixus turns habits, reflection, and progress into a single operating
              system for discipline. It is not built to keep you busy. It is built to
              keep you honest.
            </p>
          </div>
        </section>

        <section className="landing-section landing-product-section" aria-labelledby="product-title">
          <SectionHeader
            eyebrow="Product Preview"
            title="A system for execution, reflection, and proof."
          >
            The public promise is simple: record the work, understand the pattern, and
            reinforce the identity behind it.
          </SectionHeader>

          <div className="landing-product-grid">
            {PRODUCT_AREAS.map((area) => (
              <ProductArea area={area} key={area.id} />
            ))}
          </div>
        </section>

        <section className="landing-section landing-identity" id="analytics">
          <SectionHeader
            eyebrow="Identity Progression"
            title="Consistency becomes rank."
          >
            Orixus turns repeated execution into visible identity progression. Every
            completed standard is proof that the next version of you is being built.
          </SectionHeader>

          <div className="landing-rank-path" aria-label="Orixus identity ranks">
            {RANKS.map((rank, index) => (
              <div className="landing-rank-step" key={rank}>
                <div className="landing-rank-step__node">{index + 1}</div>
                <span>{rank}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="landing-section landing-journal-section" id="journal">
          <div className="landing-journal-panel">
            <div>
              <span className="landing-eyebrow">Journal</span>
              <h2>Reflection turns effort into intelligence.</h2>
            </div>
            <p>
              Discipline is not only repetition. It is noticing what breaks the pattern,
              documenting the lesson, and returning with a stronger standard.
            </p>
          </div>
        </section>

        <section className="landing-section landing-philosophy" id="philosophy">
          <span className="landing-eyebrow">Philosophy</span>
          <h2>
            Motivation fades.
            <br />
            Systems remain.
          </h2>
          <p>
            Discipline creates freedom because it removes negotiation. Orixus exists for
            the quiet work: the repeated standard, the honest record, the identity built
            one deliberate action at a time.
          </p>
        </section>

        <section className="landing-final-cta">
          <h2>Build the person you want to become.</h2>
          <button className="landing-btn-primary" onClick={handleEnterApp}>
            Start Your Journey
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer__main">
          <div>
            <OrixusLogo className="landing-footer-logo" onClick={handleEnterApp} />
            <p>A personal evolution system for discipline, consistency, and growth.</p>
          </div>
          <div className="landing-footer__links">
            {NAV_LINKS.map((link) => (
              <a
                href={`#${link.target}`}
                onClick={(event) => handleSectionClick(event, link.target)}
                key={link.target}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="landing-footer__bottom">
          <span>Copyright 2026 Orixus. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

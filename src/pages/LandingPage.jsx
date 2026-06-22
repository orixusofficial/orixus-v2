import { useState, useEffect } from 'react';
import '../styles/landing.css';
import ScrollReveal from '../components/ScrollReveal';
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

/**
 * LandingPage
 *
 * Props:
 *   onOpenAuth(tab) — opens the auth modal with 'signup' or 'login' tab
 */
export default function LandingPage({ onOpenAuth }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 1. Hero word stagger setup
    const headline = document.querySelector('.landing-hero h1');
    if (headline) {
      const text = headline.innerText;
      const words = text.split(/\s+/);
      headline.innerHTML = words
        .map((word, i) => `<span class="hero-word" style="animation-delay: ${i * 80}ms">${word}</span>`)
        .join(' ');
    }

    // 2. Navigation scroll listener
    const handleScroll = () => {
      const nav = document.querySelector('.landing-nav');
      if (nav) {
        if (window.scrollY > 60) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 3. Spotlight effect in hero
    const hero = document.querySelector('.landing-hero');
    const handleMouseMove = (e) => {
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      hero.style.setProperty('--mouse-x', `${x}px`);
      hero.style.setProperty('--mouse-y', `${y}px`);
    };
    if (hero) {
      hero.addEventListener('mousemove', handleMouseMove);
    }

    // 4. Scroll Reveal Intersection Observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    // Register elements for scroll reveal
    const reveals = document.querySelectorAll(
      '.landing-section-header, .landing-why__statement, .landing-why__body p, .landing-journal-panel, .landing-philosophy h2, .landing-philosophy p, .landing-final-cta h2, .landing-product-area, .landing-preview-metric, .landing-hero-preview, .landing-product-mockup, .landing-rank-step'
    );
    reveals.forEach((el) => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });

    // Stagger delays
    const productAreas = document.querySelectorAll('.landing-product-area');
    productAreas.forEach((el, index) => {
      el.style.transitionDelay = `${index * 120}ms`;
    });

    const metrics = document.querySelectorAll('.landing-preview-metric');
    metrics.forEach((el, index) => {
      el.style.transitionDelay = `${index * 120}ms`;
    });

    const rankSteps = document.querySelectorAll('.landing-rank-step');
    rankSteps.forEach((el, index) => {
      el.style.transitionDelay = `${index * 80}ms`;
    });

    // 5. Stats count up animation
    const animateValue = (obj, start, end, duration, suffix) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * (end - start) + start);
        obj.innerHTML = currentVal + suffix;
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          obj.innerHTML = end + suffix;
        }
      };
      window.requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const strongEl = entry.target.querySelector('strong');
            if (strongEl && !strongEl.dataset.animated) {
              strongEl.dataset.animated = 'true';
              const originalText = strongEl.innerText;
              const numMatch = originalText.match(/\d+/);
              if (numMatch) {
                const endVal = parseInt(numMatch[0], 10);
                const suffix = originalText.replace(numMatch[0], '');
                animateValue(strongEl, 0, endVal, 1500, suffix);
              }
            }
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const metricsToCount = document.querySelectorAll('.landing-preview-metric');
    metricsToCount.forEach((el) => statsObserver.observe(el));

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hero) {
        hero.removeEventListener('mousemove', handleMouseMove);
      }
      revealObserver.disconnect();
      statsObserver.disconnect();
    };
  }, []);

  const handleSectionClick = (event, target) => {
    event.preventDefault();
    setMobileMenuOpen(false);
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSignUp = () => {
    setMobileMenuOpen(false);
    onOpenAuth?.('signup');
  };

  const handleLogIn = () => {
    setMobileMenuOpen(false);
    onOpenAuth?.('login');
  };

  return (
    <div className="landing-container">
      <style>{`
        /* Animation & Motion System CSS */
        
        /* 1. Hero Load Animations */
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .landing-hero .landing-eyebrow {
          animation: heroFadeUp 0.7s ease-out 0.1s both;
        }
        .landing-hero h1 {
          animation: heroFadeUp 0.7s ease-out 0.3s both;
        }
        .landing-hero p {
          animation: heroFadeUp 0.7s ease-out 0.5s both;
        }
        .landing-hero-actions {
          animation: heroFadeUp 0.7s ease-out 0.7s both;
        }

        /* 2. Spotlight cursor effect in hero */
        .landing-hero {
          position: relative;
          overflow: hidden;
        }
        .landing-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(201, 168, 76, 0.05),
            transparent 80%
          );
          pointer-events: none;
          z-index: 1;
          transition: opacity 0.3s ease;
        }

        /* 3. Navigation page load entry & scroll state */
        @keyframes navSlideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .landing-nav {
          animation: navSlideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          background: transparent !important;
          backdrop-filter: blur(0px) !important;
          transition: background-color 0.4s ease, backdrop-filter 0.4s ease;
        }
        .landing-nav.nav-scrolled {
          background: rgba(8, 8, 8, 0.95) !important;
          backdrop-filter: blur(18px) !important;
        }

        /* 4. Scroll Reveal System */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        /* 5. Rank step slide-in overrides (from left instead of bottom) */
        .landing-rank-step.reveal {
          transform: translateX(-30px);
        }
        .landing-rank-step.reveal.reveal-active {
          transform: translateX(0);
        }
        .landing-rank-step {
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease !important;
        }
        .landing-rank-step:hover .landing-rank-step__node {
          color: var(--color-accent, #C9A84C) !important;
          border-color: var(--color-accent, #C9A84C) !important;
          transition: color 0.3s ease, border-color 0.3s ease;
        }

        /* 6. Feature cards hover interaction */
        .landing-product-area {
          position: relative;
          transition: transform 0.3s ease, border-left-color 0.3s ease, border-left-width 0.3s ease !important;
          border-left: 1px solid var(--color-border) !important;
        }
        .landing-product-area:hover {
          transform: translateY(-4px);
          border-left: 4px solid var(--color-accent, #C9A84C) !important;
        }

        /* 7. CTA button pulsing */
        @keyframes ctaPulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }
        .landing-btn-primary {
          animation: ctaPulse 3s ease-in-out infinite;
          display: inline-flex;
        }
      `}</style>
      <div className="landing-grid-overlay" />
      <div className="landing-depth-line" />

      <nav className="landing-nav">
        <OrixusLogo onClick={handleSignUp} />

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
          {/* "Start Free" in nav → Log In tab */}
          <button className="landing-btn-start" onClick={handleLogIn} id="landing-nav-start-free">
            Start Free
          </button>
        </div>
      </nav>

      <main>
        <header className="landing-hero">
          <div className="landing-hero__copy">
            <span className="landing-eyebrow">Personal Evolution System</span>
            <h1>
              Build Discipline.<br />
              Track Growth.<br />
              Become Stronger.
            </h1>
            <p>
              A structured system for ambitious people who want to build consistency,
              sharpen discipline, and create measurable personal growth over time.
            </p>
            <div className="landing-hero-actions">
              {/* "Start Your Journey" → Sign Up tab */}
              <button
                className="landing-btn-primary"
                onClick={handleSignUp}
                id="landing-hero-start-journey"
              >
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
            <ScrollReveal baseOpacity={0} enableBlur={true} baseRotation={5} blurStrength={10}>Most apps track tasks. Orixus tracks personal evolution.</ScrollReveal>
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
          {/* Final CTA → Sign Up tab */}
          <button
            className="landing-btn-primary"
            onClick={handleSignUp}
            id="landing-final-start-journey"
          >
            Start Your Journey
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-footer__main">
          <div>
            <OrixusLogo className="landing-footer-logo" onClick={handleSignUp} />
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

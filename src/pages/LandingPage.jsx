import { useState, useEffect, useRef } from 'react';
import { FaInstagram, FaYoutube, FaDiscord, FaTwitter } from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';

import '../styles/landing.css';
import ScrollReveal from '../components/ScrollReveal';
import FaqAccordion from '../components/FaqAccordion';
const NAV_LINKS = [
  { label: 'Why Orixus', target: 'why-orixus' },
  { label: 'How It Works', target: 'how-it-works' },
  { label: 'FAQ', target: 'faq' },
];

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
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

const FEATURES = [
  {
    id: 'habit-tracker',
    number: '01',
    title: 'Habit Tracker',
    description:
      'Build lasting habits through a structured daily execution matrix. Every action logged is a brick in the foundation of who you are becoming.',
    tag: 'Daily Execution',
  },
  {
    id: 'discipline-tracker',
    number: '02',
    title: 'Discipline Tracker',
    description:
      'Move beyond task lists. Orixus tracks behavioral consistency over time, giving you an honest, unfiltered view of your discipline in practice.',
    tag: 'Consistency System',
  },
  {
    id: 'personal-growth-journal',
    number: '03',
    title: 'Personal Growth Journal',
    description:
      'Capture friction points, decisions, and reflections after each cycle. Structured journaling turns raw effort into compounding intelligence.',
    tag: 'Reflection Loop',
  },
  {
    id: 'progress-analytics',
    number: '04',
    title: 'Progress Analytics',
    description:
      'Track streaks, execution rates, rank progression, and behavioral trends. Data-driven insight into your long-term personal development.',
    tag: 'Growth Metrics',
  },
  {
    id: 'identity-progression-system',
    number: '05',
    title: 'Identity Progression System',
    description:
      'Consistent action earns rank. From Initiate to Sovereign — your identity evolves as your habits compound, creating a visible, earned record of growth.',
    tag: 'Rank Progression',
  },
];

const RANKS = ['Initiate', 'Ascendant', 'Vanguard', 'Apex', 'Sovereign'];

function OrixusLogo({ className = 'landing-logo', onClick }) {
  return (
    <button className={className} onClick={onClick} aria-label="Orixus home">
      <img src="/RB logo.svg" alt="Orixus" />
      <span style={{
        marginLeft: '10px',
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: '0.05em',
        fontFamily: 'var(--font-heading, "Barlow Condensed", sans-serif)',
        textTransform: 'uppercase'
      }}>
        Orixus
      </span>
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
  const scrollRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollCarousel = (amount) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  useEffect(() => {
    // Close mobile menu on Escape key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    // 1. Navigation scroll listener
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

    // 2. Scroll Reveal Intersection Observer
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

    // 3. Stats count up animation
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
    window.location.href = '/signup';
  };

  const handleLogIn = () => {
    setMobileMenuOpen(false);
    window.location.href = '/login';
  };

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/orixusofficial/',
      icon: FaInstagram,
    },
    {
      name: 'Threads',
      url: 'https://www.threads.com/@orixusofficial',
      icon: FaThreads,
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/Maniii_ideas',
      icon: FaTwitter,
    },
    {
      name: 'Discord',
      url: 'https://discord.com/channels/1522181299572310078/1522181300369231995',
      icon: FaDiscord,
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/@Orixus.Official',
      icon: FaYoutube,
    },
  ];

  return (
    <>
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

        /* 2. Navigation page load entry & scroll state */
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

        /* 3. Scroll Reveal System */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.reveal-active {
          opacity: 1;
          transform: translateY(0);
        }

        /* 4. Rank step slide-in overrides (from left instead of bottom) */
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

        /* 5. Feature cards hover interaction */
        .landing-product-area {
          position: relative;
          transition: transform 0.3s ease, border-left-color 0.3s ease, border-left-width 0.3s ease !important;
          border-left: 1px solid var(--color-border) !important;
        }
        .landing-product-area:hover {
          transform: translateY(-4px);
          border-left: 4px solid var(--color-accent, #C9A84C) !important;
        }

        /* 6. Carousel Arrow Controls */
        .landing-feature-scroll-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .landing-feature-arrow {
          display: none;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          color: var(--color-text-primary);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .landing-feature-arrow:hover {
          border-color: #A79277;
          color: #A79277;
          background: rgba(167,146,119,0.08);
        }
        @media (min-width: 1024px) {
          .landing-feature-arrow {
            display: flex;
          }
        }
      `}</style>
      <div className="landing-grid-overlay" />
      <div className="landing-depth-line" />

      <nav className="landing-nav">
        <OrixusLogo onClick={handleSignUp} />

        <button
          className={`landing-mobile-toggle${mobileMenuOpen ? ' open' : ''}`}
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className="landing-mobile-toggle-icon" />
        </button>

        {/* Desktop nav links — hidden on mobile via CSS */}
        <div className="landing-nav-links">
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
          <button className="landing-btn-login" onClick={handleLogIn}>Login</button>
          <button className="landing-btn-start" onClick={handleSignUp}>Start Free</button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <>
          {/* Invisible backdrop — click outside to close */}
          <div className="lp-mob-backdrop" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />

          <div className="lp-mob-menu" role="dialog" aria-modal="true" aria-label="Navigation menu">
            <div className="lp-mob-menu__top">
              <OrixusLogo className="landing-logo" onClick={() => setMobileMenuOpen(false)} />
              <button
                className="lp-mob-menu__close"
                aria-label="Close navigation menu"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <nav className="lp-mob-menu__nav" aria-label="Mobile navigation">
              <a href="#why-orixus"   className="lp-mob-menu__link" onClick={(e) => handleSectionClick(e, 'why-orixus')}>Why Orixus</a>
              <a href="#how-it-works" className="lp-mob-menu__link" onClick={(e) => handleSectionClick(e, 'how-it-works')}>How It Works</a>
              <a href="#faq"          className="lp-mob-menu__link" onClick={(e) => handleSectionClick(e, 'faq')}>FAQ</a>
              <div className="lp-mob-menu__divider" />
              <button className="lp-mob-menu__link lp-mob-menu__link--secondary" onClick={handleLogIn}>Login</button>
              <button className="lp-mob-menu__link lp-mob-menu__link--primary" onClick={handleSignUp}>Start Free</button>
            </nav>
          </div>
        </>
      )}

      <main>
        <header className="landing-hero">
          <div className="landing-hero__copy">
            <span className="landing-eyebrow">Personal Evolution System</span>
            <h1 className="hero-headline">
              BUILD DISCIPLINE.<br />
              TRACK GROWTH.<br />
              BECOME STRONGER.
            </h1>
            <p>
              A structured system for ambitious people who want to build consistency,
              sharpen discipline, and create measurable personal growth over time.
            </p>
            <div className="landing-hero-actions">
              <button
                className="landing-btn-primary"
                onClick={handleSignUp}
                id="landing-hero-start-journey"
              >
                Start Your Journey
              </button>
              <a
                className="landing-btn-secondary"
                href="#how-it-works"
                onClick={(event) => handleSectionClick(event, 'how-it-works')}
              >
                See the System
              </a>
            </div>
          </div>
          <HeroPreview />
        </header>

        <section className="landing-section landing-why" id="why-orixus">
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

        <section className="landing-section landing-features" id="how-it-works" aria-labelledby="features-title">
          <SectionHeader
            eyebrow="What Orixus Does"
            title="A complete system for personal growth"
            align="center"
          >
            Everything you need to build habits, track progress, stay consistent, and become a stronger version of yourself.
          </SectionHeader>
          <div className="landing-feature-scroll-wrapper">
            <button
              className="landing-feature-arrow landing-feature-arrow--left"
              onClick={() => scrollCarousel(-300)}
              aria-label="Scroll left"
            >
              {'<'}
            </button>
            <div className="landing-feature-grid" ref={scrollRef} role="list">
              {FEATURES.map((feature) => (
                <article
                  className="landing-feature-card"
                  key={feature.id}
                  id={feature.id}
                  role="listitem"
                >
                  <div className="landing-feature-card__header">
                    <span className="landing-feature-card__number" aria-hidden="true">{feature.number}</span>
                    <span className="landing-feature-card__tag">{feature.tag}</span>
                  </div>
                  <h3 className="landing-feature-card__title">{feature.title}</h3>
                  <p className="landing-feature-card__desc">{feature.description}</p>
                  <div className="landing-feature-card__rule" aria-hidden="true" />
                </article>
              ))}
            </div>
            <button
              className="landing-feature-arrow landing-feature-arrow--right"
              onClick={() => scrollCarousel(300)}
              aria-label="Scroll right"
            >
              {'>'}
            </button>
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

        <section className="landing-section landing-comparison">
          <SectionHeader
            eyebrow="Why Orixus"
            title="Traditional apps vs. Orixus"
          />
          <div className="landing-comparison-grid">
            <div className="landing-comparison-side">
              <h3>Traditional Habit Apps</h3>
              <ul>
                <li>Track tasks and to-dos</li>
                <li>Focus on completion streaks</li>
                <li>Simple checkbox interfaces</li>
                <li>No identity progression</li>
                <li>Task-oriented motivation</li>
              </ul>
            </div>
            <div className="landing-comparison-side landing-comparison-side--orixus">
              <h3>Orixus</h3>
              <ul>
                <li>Track identity and discipline</li>
                <li>Focus on consistency and growth</li>
                <li>Visual discipline matrix</li>
                <li>Identity rank progression</li>
                <li>System-based discipline</li>
              </ul>
            </div>
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

        <section className="landing-section landing-faq" id="faq">
          <SectionHeader eyebrow="FAQ" title="Common questions about Orixus" />
          <FaqAccordion />
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
            {FOOTER_LINKS.map((link) => (
              <a
                href={link.href}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="landing-footer__social">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="landing-footer__social-link"
              aria-label={`Connect with Orixus on ${social.name}`}
            >
              <social.icon size={21} />
            </a>
          ))}
        </div>
        <div className="landing-footer__bottom">
          <span>Copyright 2026 Orixus. All rights reserved.</span>
        </div>
      </footer>
    </div>
    </>
  );
}

import { useEffect } from 'react';
import '../styles/static-pages.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About | Orixus';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Orixus is a personal evolution system for building discipline, consistency, and long-term growth through identity-driven habit tracking.');
    }
  }, []);

  const handleBack = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = '/';
  };

  return (
    <div className="static-page">
      <div className="static-page__container">
        <button className="static-page__back" onClick={handleBack}>
          {backArrow}
          Back
        </button>

        <header className="static-page__header">
          <h1 className="static-page__title">About Orixus</h1>
          <p className="static-page__subtitle">More than a habit tracker. A system for personal evolution.</p>
        </header>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Our Mission</h2>
          <p>
            Orixus exists to help ambitious people become disciplined through consistent daily action instead of relying on motivation. We believe that true personal growth comes from building systems that work regardless of how you feel.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Why Orixus Exists</h2>
          <p>
            Most productivity apps become cluttered. Most habit trackers become games. Most people quit because they lose momentum.
          </p>
          <p>
            Orixus was built to create structure, consistency, honesty and long-term personal growth. We strip away the gamification and focus on what actually matters: showing up every day and building the identity you want.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Our Philosophy</h2>
          <div className="static-page__philosophy-grid">
            <div className="static-page__philosophy-item">
              <h3>Build systems.</h3>
              <p>Motivation is temporary. Systems are permanent.</p>
            </div>
            <div className="static-page__philosophy-item">
              <h3>Build discipline.</h3>
              <p>Discipline creates freedom from negotiation.</p>
            </div>
            <div className="static-page__philosophy-item">
              <h3>Build yourself.</h3>
              <p>Every action is a brick in your identity.</p>
            </div>
            <div className="static-page__philosophy-item">
              <h3>Consistency creates identity.</h3>
              <p>Who you are is what you do repeatedly.</p>
            </div>
            <div className="static-page__philosophy-item">
              <h3>Progress compounds.</h3>
              <p>Small daily actions create massive long-term results.</p>
            </div>
          </div>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Built for People Who Want More</h2>
          <p>
            Orixus is for students, creators, entrepreneurs, athletes, and builders who understand that success is not about inspiration—it's about the quiet work of showing up every single day.
          </p>
          <p>
            People who want discipline, not motivation. People who want to build systems, not just complete tasks. People who are committed to becoming stronger versions of themselves.
          </p>
        </section>
      </div>
    </div>
  );
}

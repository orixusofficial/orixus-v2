import { useEffect } from 'react';
import JsonLd from '../components/JsonLd';
import '../styles/static-pages.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Orixus — Personal Evolution & Discipline System';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Learn what Orixus is, why it exists, and how it helps people build discipline, consistency, and personal growth through daily action.');
    }
  }, []);

  const handleBack = () => {
    window.history.length > 1 ? window.history.back() : window.location.href = '/';
  };

  return (
    <div className="static-page">
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orixus.vercel.app/' },
          { '@type': 'ListItem', position: 2, name: 'About', item: 'https://orixus.vercel.app/about' }
        ]
      }} />
      <div className="static-page__container">
        <button className="static-page__back" onClick={handleBack}>
          {backArrow}
          Back
        </button>

        <header className="static-page__header">
          <h1 className="static-page__title">About Orixus</h1>
          <p className="static-page__subtitle">Orixus is a personal evolution system designed to help people build discipline, maintain consistency, and track their progress through daily action.</p>
          <p className="static-page__subtitle">More than a habit tracker. A system for personal evolution.</p>
        </header>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Our Mission</h2>
          <p>
            Orixus exists to help people build discipline through consistent daily action. We believe that personal growth comes from building systems that work regardless of how you feel.
          </p>
          <p>
            We focus on discipline, consistency, daily action, habit building, personal reflection, and long-term progress.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">What Orixus Is</h2>
          <p>Orixus is a self-improvement and personal evolution web application that helps you track and build your daily habits.</p>
          
          <h3 className="static-page__subsection-title">Habit Tracking</h3>
          <p>Create habits and track daily completion to maintain accountability and build consistency.</p>
          
          <h3 className="static-page__subsection-title">Daily Check-ins</h3>
          <p>Use daily check-ins to maintain accountability and stay consistent with your commitments.</p>
          
          <h3 className="static-page__subsection-title">Journal</h3>
          <p>Record reflections, thoughts, lessons, and personal observations to deepen your self-awareness.</p>
          
          <h3 className="static-page__subsection-title">Progress Tracking</h3>
          <p>View streaks, adherence rates, achievements, ranks, and other progress indicators based on your activity.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Why Orixus Exists</h2>
          <p>
            Orixus was built to create structure, consistency, and long-term personal growth. We focus on what matters: showing up every day and building the identity you want.
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
            Orixus is designed for students, creators, entrepreneurs, athletes, and builders who understand that progress comes from the quiet work of showing up every single day.
          </p>
          <p>
            People who want discipline, not motivation. People who want to build systems, not just complete tasks. People who are committed to becoming stronger versions of themselves.
          </p>
        </section>

        <section className="static-page__section">
          <p>Learn more in our <a href="/faq" className="static-page__email">FAQ</a>, or review our <a href="/privacy" className="static-page__email">Privacy Policy</a> and <a href="/terms" className="static-page__email">Terms of Service</a>. For questions, <a href="/contact" className="static-page__email">contact us</a>.</p>
        </section>
      </div>
    </div>
  );
}

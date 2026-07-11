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
      metaDescription.setAttribute('content', 'Learn about Orixus — a discipline system built for ambitious people who want to build consistency, sharpen discipline, and create measurable personal growth.');
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
            Orixus exists to help ambitious people become disciplined through consistent daily action. We believe that motivation is unreliable, but systems are not. When you build the right structure around your goals, discipline becomes the natural outcome.
          </p>
          <p>
            Every feature in Orixus is designed to reinforce one principle: show up consistently, even when you do not feel like it. Over time, that consistency rewires your identity. You stop being someone who tries to be disciplined and start being someone who simply is.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Why Orixus Exists</h2>
          <p>
            Most productivity apps become cluttered with features that distract from what actually matters. Most habit trackers become games where the goal is to maintain a streak rather than to grow. Most people quit because they lose momentum when motivation fades.
          </p>
          <p>
            Orixus was built to solve this. We created a tool focused on structure, consistency, honesty, and long-term personal growth. No gamification. No unnecessary complexity. Just a clear system that shows the truth about your daily actions and helps you build the identity you want.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Our Philosophy</h2>
          <div className="static-page__philosophy">
            <p>Build systems. Build discipline. Build yourself.</p>
          </div>
          <p>
            Consistency creates identity. Every time you follow through on a commitment, you are not just checking a box — you are casting a vote for the person you are becoming. Progress compounds. Small, deliberate actions repeated daily create transformations that feel impossible in the moment but inevitable in hindsight.
          </p>
          <p>
            Orixus is built around this belief. We do not sell motivation. We provide the structure that makes discipline sustainable.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Built for People Who Want More</h2>
          <p>
            Orixus is designed for students, creators, entrepreneurs, athletes, and builders — anyone who understands that discipline is the foundation of exceptional results. If you are tired of relying on motivation, tired of starting and stopping, tired of knowing you are capable of more but not seeing it in your results, Orixus is for you.
          </p>
          <p>
            This is not an app for people who want to feel productive. It is for people who want to be disciplined. The difference is everything.
          </p>
        </section>
      </div>
    </div>
  );
}
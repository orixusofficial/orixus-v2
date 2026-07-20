import { useEffect } from 'react';
import '../styles/static-pages.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact | Orixus';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Contact Orixus support for bug reports, feature requests, or general questions.');
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
          <h1 className="static-page__title">Contact</h1>
          <p className="static-page__subtitle">Need help, found a bug, or have an idea? We'd love to hear from you.</p>
        </header>

        <section className="static-page__section">
          <div className="static-page__contact-card">
            <h2 className="static-page__section-title">Support Email</h2>
            <a href="mailto:orixusofficial@gmail.com" className="static-page__email-link">
              orixusofficial@gmail.com
            </a>
          </div>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">How We Can Help</h2>
          <div className="static-page__help-grid">
            <div className="static-page__help-item">
              <h3>Bug Reports</h3>
              <p>Found something not working correctly? Let us know the details and we'll investigate.</p>
            </div>
            <div className="static-page__help-item">
              <h3>Feature Requests</h3>
              <p>Have an idea for improving Orixus? We're always listening to thoughtful suggestions.</p>
            </div>
            <div className="static-page__help-item">
              <h3>General Questions</h3>
              <p>Need help understanding how to use Orixus effectively? We're here to assist.</p>
            </div>
          </div>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Response Time</h2>
          <p>
            We typically respond to all inquiries within 48 hours. For urgent matters, please include detailed information in your email to help us address your issue faster.
          </p>
        </section>
      </div>
    </div>
  );
}

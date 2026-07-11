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
      metaDescription.setAttribute('content', 'Get in touch with the Orixus team. We are here to help with support, bug reports, feature requests, and general questions.');
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
          <p className="static-page__subtitle">Need help, found a bug, or have an idea? We would love to hear from you.</p>
        </header>

        <section className="static-page__section">
          <div className="static-page__card">
            <h3 className="static-page__card-title">Support Email</h3>
            <p>
              The fastest way to reach us is by email. We read every message and typically respond within 48 hours.
            </p>
            <p>
              <a href="mailto:support@orixus.app" className="static-page__email">support@orixus.app</a>
            </p>
          </div>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">How We Can Help</h2>
          <p>
            Whether you are experiencing an issue, have a suggestion for improvement, or just want to ask a question, we are here. Below are the most common reasons people reach out:
          </p>

          <div className="static-page__card">
            <h3 className="static-page__card-title">Bug Reports</h3>
            <p>
              Found something that is not working as expected? Let us know. Include details about what you were doing, what happened, and what you expected to happen. Screenshots or screen recordings are always helpful.
            </p>
          </div>

          <div className="static-page__card">
            <h3 className="static-page__card-title">Feature Requests</h3>
            <p>
              Have an idea for how we can make Orixus better? We are always listening. Tell us what you need and why it matters to you. The best feature ideas come from real users who use the product daily.
            </p>
          </div>

          <div className="static-page__card">
            <h3 className="static-page__card-title">General Questions</h3>
            <p>
              Not sure how something works? Need clarification on a feature? Want to share feedback on your experience? Reach out and we will get back to you with a clear, honest answer.
            </p>
          </div>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Response Time</h2>
          <p>
            We aim to respond to all inquiries within 48 hours during business days. For urgent issues, please mention that in your subject line so we can prioritize accordingly.
          </p>
          <p>
            Thank you for being part of the Orixus community. Your feedback directly shapes how the product evolves.
          </p>
        </section>
      </div>
    </div>
  );
}
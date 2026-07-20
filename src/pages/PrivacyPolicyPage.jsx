import { useEffect } from 'react';
import '../styles/static-pages.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy | Orixus';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Orixus Privacy Policy — how we collect, use, and protect your personal information.');
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
          <h1 className="static-page__title">Privacy Policy</h1>
          <p className="static-page__subtitle">Your data is yours. Here is how we handle it.</p>
        </header>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Information We Collect</h2>
          <p>
            To provide Orixus as a service, we collect and store the following information:
          </p>
          <ul className="static-page__list">
            <li><strong>Account information</strong> — your email address and username</li>
            <li><strong>Habits</strong> — the commitments you create and track</li>
            <li><strong>Journal entries</strong> — the reflections you write</li>
            <li><strong>Check-ins</strong> — your completion history and streak data</li>
          </ul>
          <p>
            We do not collect unnecessary personal information. What we store is directly tied to the core functionality of the product.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">How We Use Information</h2>
          <p>
            Your data is used exclusively for the following purposes:
          </p>
          <ul className="static-page__list">
            <li>To provide and maintain the Orixus service</li>
            <li>To improve the product based on real usage patterns</li>
            <li>To secure your account and protect against unauthorized access</li>
          </ul>
          <p>
            We do not use your data for advertising. We do not share your data with third parties for their marketing purposes. Your discipline data stays within the Orixus ecosystem.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Data Protection</h2>
          <p>
            User data is never sold. Information is stored securely using industry-standard practices. Access to user data is restricted to the minimum number of people necessary to operate and improve the service.
          </p>
          <p>
            We take reasonable measures to protect your information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Your Rights</h2>
          <p>
            You own your data. At any point, you may request deletion of your account and all associated data. This includes your habits, journal entries, check-ins, and any other information tied to your account.
          </p>
          <p>
            To request account deletion, contact us at <a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a>. We will process your request promptly and confirm once your data has been removed.
          </p>
          <p>
            You may also export your data at any time through your account settings.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. If we make material changes, we will notify you through the app or via email. Continued use of Orixus after changes are posted constitutes acceptance of the updated policy.
          </p>
        </section>
      </div>
    </div>
  );
}
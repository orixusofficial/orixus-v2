import { useEffect } from 'react';
import '../styles/static-pages.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = 'Terms of Service | Orixus';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Orixus Terms of Service — simple, readable terms for using the platform.');
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
          <h1 className="static-page__title">Terms of Service</h1>
          <p className="static-page__subtitle">Simple, readable terms for using Orixus.</p>
        </header>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Using Orixus</h2>
          <p>
            By using Orixus, you agree to use the platform responsibly and in accordance with these terms. Specifically, you agree not to:
          </p>
          <ul className="static-page__list">
            <li>Abuse the platform or interfere with its normal operation</li>
            <li>Exploit vulnerabilities or attempt to gain unauthorized access to any part of the service</li>
            <li>Upload malicious content, spam, or material that violates applicable laws</li>
            <li>Use the service for any unlawful purpose or in violation of these terms</li>
          </ul>
          <p>
            We reserve the right to suspend or terminate access for users who violate these terms. We also reserve the right to update these terms as the product evolves.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Ownership</h2>
          <p>
            You own your data. All habits, journal entries, check-ins, and other content you create within Orixus remain your property. We do not claim ownership over your personal data or the content you generate.
          </p>
          <p>
            Orixus, including its name, branding, design, and underlying technology, is the intellectual property of Orixus. You may not copy, modify, or distribute the platform or its components without explicit permission.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Availability</h2>
          <p>
            Orixus is a living product. Features may change, improve, or be removed over time as we refine the system based on user feedback and our vision for the platform. We will communicate significant changes whenever possible.
          </p>
          <p>
            We strive to maintain reliable access to the service, but we do not guarantee uninterrupted availability. Maintenance, updates, and unforeseen technical issues may occasionally affect access.
          </p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">Liability</h2>
          <p>
            Orixus is provided as-is, without warranties of any kind. We do not guarantee that the service will be error-free, secure, or available at all times. Your use of the platform is at your own risk.
          </p>
          <p>
            To the fullest extent permitted by law, Orixus shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. This includes, but is not limited to, loss of data, loss of profits, or personal harm.
          </p>
          <p>
            If you have questions about these terms, reach out to us at <a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
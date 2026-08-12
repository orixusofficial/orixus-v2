import { useEffect } from 'react';
import JsonLd from '../components/JsonLd';
import '../styles/static-pages.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function TermsOfServicePage() {
  useEffect(() => {
    document.title = 'Orixus Terms of Service';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Terms governing your access to and use of Orixus, including account responsibilities, acceptable use, disclaimers, and contact information.');
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
          { '@type': 'ListItem', position: 2, name: 'Terms', item: 'https://orixus.vercel.app/terms' }
        ]
      }} />
      <div className="static-page__container">
        <button className="static-page__back" onClick={handleBack}>
          {backArrow}
          Back
        </button>

        <header className="static-page__header">
          <h1 className="static-page__title">Terms of Service</h1>
          <p className="static-page__subtitle">These Terms of Service govern your access to and use of Orixus. By creating an account or using Orixus, you agree to these Terms.</p>
        </header>

        <section className="static-page__section">
          <h2 className="static-page__section-title">1. Acceptance of Terms</h2>
          <p>By accessing or using Orixus, you agree to these Terms of Service and the <a href="/privacy" className="static-page__email">Privacy Policy</a>. If you do not agree with these Terms, you should not use Orixus.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">2. Eligibility</h2>
          <p>You may use Orixus only if you are legally permitted to enter into these Terms under the laws applicable to you.</p>
          <p>If you are below the age required to enter into a binding agreement in your jurisdiction, you may use Orixus only with the involvement and permission of a parent or legal guardian where required by applicable law.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">3. Your Account</h2>
          <p>You are responsible for information associated with your account, including the accuracy of information you provide and maintaining the security of your login credentials.</p>
          <p>You must not share your account credentials in ways that compromise security or misuse your account. You should notify Orixus if you believe your account has been accessed without authorization.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">4. Your Content</h2>
          <p>You retain ownership of content you submit to Orixus, including habits, journal entries, check-ins, feedback, profile information, and other content you create.</p>
          <p>By submitting content, you grant Orixus a limited, non-exclusive right to host, store, process, reproduce, and display your content only as reasonably necessary to provide, maintain, secure, and improve the service. This license ends when it is no longer necessary, subject to legitimate retention requirements described in the Privacy Policy.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">5. Orixus Intellectual Property</h2>
          <p>Orixus owns or has rights to the Orixus name, branding, logos, interface design, software, visual assets, original content, and underlying technology.</p>
          <p>You may not copy, reproduce, modify, distribute, sell, reverse engineer, or commercially exploit Orixus or its protected components except where permitted by law or with written permission.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">6. Acceptable Use</h2>
          <p>You agree not to use Orixus to:</p>
          <ul className="static-page__list">
            <li>Violate applicable laws</li>
            <li>Abuse or disrupt the service</li>
            <li>Interfere with service operation</li>
            <li>Attempt unauthorized access</li>
            <li>Compromise accounts</li>
            <li>Upload malware or distribute malicious code</li>
            <li>Spam or abuse other users</li>
            <li>Impersonate another person</li>
            <li>Scrape or automatically extract data without authorization</li>
            <li>Exploit vulnerabilities</li>
            <li>Bypass technical restrictions</li>
            <li>Interfere with security controls</li>
            <li>Use Orixus for fraudulent purposes</li>
          </ul>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">7. Security and Vulnerabilities</h2>
          <p>You must not attempt to exploit vulnerabilities, access systems or accounts you are not authorized to access, or interfere with Orixus infrastructure.</p>
          <p>If you discover a security vulnerability, please disclose it responsibly by contacting <a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a>.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">8. Third-Party Services</h2>
          <p>Parts of Orixus rely on third-party services and infrastructure, including Supabase, PostHog, and Microsoft Clarity. These providers are not owned by Orixus.</p>
          <p>Third-party services may have their own terms and privacy policies. See the <a href="/privacy" className="static-page__email">Privacy Policy</a> for additional information about third-party data processing.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">9. Service Availability</h2>
          <p>Orixus is provided on an evolving basis. Features may change, be improved, be temporarily unavailable, be discontinued, or be replaced.</p>
          <p>Orixus does not guarantee uninterrupted availability. Maintenance, infrastructure failures, bugs, security incidents, network failures, or circumstances outside Orixus's reasonable control may affect availability.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">10. No Guaranteed Results</h2>
          <p>Orixus is a self-improvement and habit-tracking tool. It does not guarantee increased discipline, improved productivity, achievement of personal goals, specific behavioral outcomes, or specific life outcomes.</p>
          <p>Ranks, streaks, adherence rates, achievements, analytics, and other progress indicators are product features intended to help you track your activity. They are not guarantees of real-world results.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">11. Not Professional Advice</h2>
          <p>Orixus is not a substitute for medical advice, mental-health treatment, psychological diagnosis, financial advice, legal advice, or other professional advice.</p>
          <p>You should seek an appropriately qualified professional when professional advice is necessary.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">12. User Responsibility</h2>
          <p>You are responsible for how you use Orixus, the content you submit, decisions you make based on information displayed by Orixus, and maintaining appropriate backups of information you consider important.</p>
          <p>See the <a href="/privacy" className="static-page__email">Privacy Policy</a> for information about data retention and deletion.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">13. Suspension and Termination</h2>
          <p>Orixus may suspend or terminate access where reasonably necessary, including for serious violations of these Terms, unlawful activity, abuse, security threats, fraud, attempts to compromise the service, or circumstances requiring termination for operational or legal reasons.</p>
          <p>Where appropriate, Orixus may provide notice before termination, but immediate action may be necessary for security, legal, or abuse-related situations. Termination does not remove obligations that are intended to survive termination.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">14. Account Closure by User</h2>
          <p>You may stop using Orixus and may contact <a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a> regarding account/data deletion.</p>
          <p>See the <a href="/privacy" className="static-page__email">Privacy Policy</a> for the actual data-deletion process and retention limitations.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">15. Disclaimers</h2>
          <p>Orixus is provided on an "as is" and "as available" basis to the fullest extent permitted by applicable law.</p>
          <p>We do not guarantee that Orixus will always be uninterrupted, error-free, completely secure, or free from defects. We make no guarantee regarding the accuracy, completeness, or suitability of every piece of information or calculation presented by the service.</p>
          <p>Nothing in these Terms excludes or limits any right, remedy, warranty, or liability that cannot lawfully be excluded or limited under applicable law.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">16. Limitation of Liability</h2>
          <p>To the fullest extent permitted by applicable law, Orixus will not be responsible for indirect, incidental, special, consequential, exemplary, or similar damages arising from use of the service.</p>
          <p>Examples may include loss of profits, loss of business opportunities, loss of data, or interruption of service. This preserves liabilities that cannot legally be excluded or limited.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">17. Indemnification</h2>
          <p>To the extent permitted by applicable law, you may be responsible for claims arising from your unlawful use of Orixus, violation of these Terms, infringement of another person's rights, or content you submit.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">18. Changes to Orixus</h2>
          <p>Orixus may change or discontinue features as the product evolves. The service does not guarantee that a particular feature will remain permanently available.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">19. Changes to These Terms</h2>
          <p>Terms may be updated. Updated Terms will include a new effective date. Material changes may be communicated through the service or email where appropriate.</p>
          <p>Continued use after the effective date may constitute acceptance where legally permitted, without overriding mandatory legal rights.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">20. Governing Law</h2>
          <p>[Orixus should specify the applicable governing law and jurisdiction here after legal review.]</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">21. Contact</h2>
          <p><strong>Orixus</strong></p>
          <p><strong>Email:</strong> <a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a></p>
        </section>
      </div>
    </div>
  );
}
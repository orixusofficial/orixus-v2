import { useEffect } from 'react';
import JsonLd from '../components/JsonLd';
import '../styles/static-pages.css';

const backArrow = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

export default function PrivacyPolicyPage() {
  useEffect(() => {
    document.title = 'Privacy Policy — Orixus';
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
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orixus.vercel.app/' },
          { '@type': 'ListItem', position: 2, name: 'Privacy', item: 'https://orixus.vercel.app/privacy' }
        ]
      }} />
      <div className="static-page__container">
        <button className="static-page__back" onClick={handleBack}>
          {backArrow}
          Back
        </button>

        <header className="static-page__header">
          <h1 className="static-page__title">Privacy Policy</h1>
          <p className="static-page__subtitle">Your privacy matters to us. This Privacy Policy explains what information Orixus collects, how we use it, the service providers that help us operate Orixus, and the choices available to you.</p>
          <p className="static-page__effective-date"><strong>Effective Date:</strong> January 1, 2026</p>
        </header>

        <section className="static-page__section">
          <h2 className="static-page__section-title">1. Information We Collect</h2>
          <p>We collect information that is necessary to provide, secure, maintain, and improve Orixus.</p>
          
          <h3 className="static-page__subsection-title">Account and Authentication Information</h3>
          <p>When you create or use an Orixus account, we may collect:</p>
          <ul className="static-page__list">
            <li>Email address</li>
            <li>User ID</li>
            <li>Username or display name</li>
            <li>Profile information provided through supported authentication methods</li>
            <li>Authentication and account-management information</li>
          </ul>
          <p>If you sign in using a third-party authentication provider, such as Google, we may receive information made available to us through that authentication provider, such as your email address, name, and profile information.</p>
          
          <h3 className="static-page__subsection-title">Profile Information</h3>
          <p>You may provide information such as:</p>
          <ul className="static-page__list">
            <li>Display name</li>
            <li>Profile image or avatar</li>
            <li>Account preferences</li>
            <li>Application settings</li>
          </ul>
          
          <h3 className="static-page__subsection-title">Habit and Discipline Information</h3>
          <p>When you use Orixus, we store information you provide about your habits and progress, including:</p>
          <ul className="static-page__list">
            <li>Habit names</li>
            <li>Habit creation dates</li>
            <li>Habit durations</li>
            <li>Habit completion records</li>
            <li>Streak and consistency information</li>
            <li>Achievement and progression information</li>
            <li>Daily check-in information</li>
          </ul>
          <p>This information is necessary for core Orixus functionality.</p>
          
          <h3 className="static-page__subsection-title">Journal Information</h3>
          <p>If you use the Journal feature, we may store:</p>
          <ul className="static-page__list">
            <li>Journal entry titles</li>
            <li>Journal entry content</li>
            <li>Mood information where provided</li>
            <li>Entry creation and update timestamps</li>
          </ul>
          <p>Journal entries may contain information that you choose to write about yourself. You should therefore avoid entering highly sensitive information that you do not want stored by the service.</p>
          
          <h3 className="static-page__subsection-title">Feedback</h3>
          <p>If you submit feedback through Orixus, we may collect:</p>
          <ul className="static-page__list">
            <li>Feedback rating</li>
            <li>Feedback category</li>
            <li>Feedback message</li>
            <li>Associated account identifier</li>
            <li>Submission timestamp</li>
          </ul>
          
          <h3 className="static-page__subsection-title">Profile Images</h3>
          <p>If you upload a profile image, Orixus may store the image in order to display it as part of your account.</p>
          
          <h3 className="static-page__subsection-title">Technical and Analytics Information</h3>
          <p>Orixus uses analytics and application-monitoring technologies that may collect information about how the service is used. Depending on your interaction with Orixus, this may include information such as:</p>
          <ul className="static-page__list">
            <li>Device and browser information</li>
            <li>Application usage information</li>
            <li>Pages or features interacted with</li>
            <li>Interaction events</li>
            <li>Performance and technical information</li>
            <li>Approximate usage or session information</li>
            <li>Information associated with an Orixus account where necessary for product analytics</li>
          </ul>
          <p>Orixus currently uses third-party analytics and related services, including <strong>PostHog</strong> and <strong>Microsoft Clarity</strong>. These services may process information in accordance with their own privacy policies and terms.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">2. How We Use Information</h2>
          <p>We use information for purposes including:</p>
          
          <h3 className="static-page__subsection-title">Providing Orixus</h3>
          <p>We use your information to:</p>
          <ul className="static-page__list">
            <li>Create and maintain your account</li>
            <li>Authenticate users</li>
            <li>Store and display your habits</li>
            <li>Record habit completions</li>
            <li>Calculate streaks and progress</li>
            <li>Provide achievements and progression</li>
            <li>Store and display journal entries</li>
            <li>Provide analytics and other application features</li>
          </ul>
          
          <h3 className="static-page__subsection-title">Maintaining and Improving Orixus</h3>
          <p>We may use information to:</p>
          <ul className="static-page__list">
            <li>Understand how users interact with Orixus</li>
            <li>Identify bugs and technical problems</li>
            <li>Improve usability and reliability</li>
            <li>Develop and evaluate features</li>
            <li>Monitor application performance</li>
            <li>Understand general product usage patterns</li>
          </ul>
          <p>Where practical, we may use aggregated or de-identified information for product analysis.</p>
          
          <h3 className="static-page__subsection-title">Security and Abuse Prevention</h3>
          <p>We may use information to:</p>
          <ul className="static-page__list">
            <li>Protect accounts</li>
            <li>Detect unauthorized activity</li>
            <li>Investigate abuse or misuse</li>
            <li>Maintain the security and integrity of Orixus</li>
            <li>Troubleshoot technical problems</li>
          </ul>
          
          <h3 className="static-page__subsection-title">Legal and Administrative Purposes</h3>
          <p>We may process information when reasonably necessary to:</p>
          <ul className="static-page__list">
            <li>Comply with applicable legal obligations</li>
            <li>Respond to lawful requests</li>
            <li>Establish, exercise, or defend legal claims</li>
            <li>Enforce our terms and policies</li>
            <li>Protect the rights, safety, and security of Orixus, its users, or others</li>
          </ul>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">3. Advertising and Sale of Personal Information</h2>
          <p>Orixus does not sell users' personal information.</p>
          <p>Orixus does not use users' personal information for third-party advertising purposes.</p>
          <p>The use of analytics services described in this policy is intended to help us understand and improve the service, not to sell your personal information.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">4. Third-Party Service Providers</h2>
          <p>Orixus relies on third-party providers to operate parts of the service. These providers may process information on our behalf and may include:</p>
          
          <h3 className="static-page__subsection-title">Supabase</h3>
          <p>Supabase provides infrastructure used by Orixus for services such as authentication, database storage, and related application infrastructure. Information stored through Supabase may include account information, profile information, habits, habit activity, journal information, achievements, feedback, and other application data described in this policy.</p>
          
          <h3 className="static-page__subsection-title">PostHog</h3>
          <p>Orixus uses PostHog for product analytics and usage analysis. PostHog may process technical and interaction information relating to your use of Orixus. Certain analytics information may be associated with your Orixus account where necessary to understand authenticated product usage.</p>
          
          <h3 className="static-page__subsection-title">Microsoft Clarity</h3>
          <p>Orixus uses Microsoft Clarity to understand user interaction with the application and improve usability. Clarity may collect information about interactions with the website and related technical/session information.</p>
          
          <p>These third-party providers process information according to their own policies and applicable contractual or legal requirements. We recommend reviewing the privacy policies of these providers for additional information about their processing practices.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">5. Data Access</h2>
          <p>Access to personal information is limited to authorized individuals and service providers who require access to operate, maintain, secure, troubleshoot, support, or improve Orixus.</p>
          <p>Authorized Orixus administrators may access certain user information when reasonably necessary for legitimate operational, security, support, or administrative purposes.</p>
          <p>We do not authorize access to personal information for unrelated purposes.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">6. Data Security</h2>
          <p>We take reasonable technical and organizational measures designed to protect personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          <p>These measures may include access controls, authentication mechanisms, database security controls, and other security practices appropriate to the nature of the information we process.</p>
          <p>However, no method of transmitting information over the internet or storing information electronically can be guaranteed to be completely secure. Therefore, while we work to protect your information, we cannot guarantee absolute security.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">7. Data Retention</h2>
          <p>We retain personal information for as long as reasonably necessary to:</p>
          <ul className="static-page__list">
            <li>Provide Orixus</li>
            <li>Maintain your account</li>
            <li>Provide requested functionality</li>
            <li>Maintain security</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
            <li>Comply with applicable legal obligations</li>
            <li>Maintain necessary business and technical records</li>
          </ul>
          <p>When information is no longer reasonably required, we may delete, anonymize, or otherwise dispose of it in accordance with our operational and legal requirements.</p>
          <p>Information contained in backups or security records may remain for a limited additional period before being overwritten or securely deleted.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">8. Account Deletion and Data Requests</h2>
          <p>If you want to request deletion of your Orixus account or personal information, contact:</p>
          <p><a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a></p>
          <p>We will review and process your request in accordance with applicable requirements and our ability to verify the request.</p>
          <p>Depending on the request and applicable requirements, we may need to retain certain information where necessary for legal, security, fraud-prevention, dispute-resolution, or other legitimate purposes.</p>
          <p>Because account deletion capabilities may depend on the specific account and infrastructure involved, we will communicate any applicable limitations when processing a request.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">9. Your Privacy Choices and Rights</h2>
          <p>Depending on where you live and the laws that apply to you, you may have rights relating to your personal information. These may include rights to:</p>
          <ul className="static-page__list">
            <li>Request access to personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of personal information</li>
            <li>Request information about how your data is processed</li>
            <li>Object to or restrict certain processing where applicable</li>
            <li>Exercise other rights provided by applicable law</li>
          </ul>
          <p>To make a privacy request, contact:</p>
          <p><a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a></p>
          <p>We may need to verify your identity before completing certain requests in order to protect your account and information.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">10. Children's Privacy</h2>
          <p>Orixus is not intended for children who are below the minimum age permitted under applicable law.</p>
          <p>We do not knowingly request or intentionally collect personal information from children in circumstances where such collection is prohibited by applicable law.</p>
          <p>If you believe a child has provided personal information to Orixus in circumstances where it should not have been collected, please contact us at:</p>
          <p><a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a></p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">11. International Processing</h2>
          <p>Orixus and the third-party providers that support the service may process or store information in countries other than the country in which you live.</p>
          <p>Where required, we will take appropriate measures relating to such transfers and processing in accordance with applicable law.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">12. Cookies, Local Storage, and Similar Technologies</h2>
          <p>Orixus and its service providers may use cookies, local storage, session technologies, or similar technologies for purposes such as:</p>
          <ul className="static-page__list">
            <li>Authentication</li>
            <li>Maintaining application state</li>
            <li>Remembering preferences</li>
            <li>Security</li>
            <li>Analytics</li>
            <li>Understanding how the service is used</li>
          </ul>
          <p>The technologies used may vary depending on the features and services active on Orixus.</p>
          <p>You can control certain browser storage and cookie settings through your browser or device, although disabling required technologies may affect some Orixus functionality.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">13. Third-Party Links and Services</h2>
          <p>Orixus may contain links to websites or services operated by third parties.</p>
          <p>We are not responsible for the privacy practices of third-party websites or services that we do not control.</p>
          <p>We recommend reviewing their privacy policies before providing them with personal information.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">14. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time to reflect changes to Orixus, our practices, technology, or applicable requirements.</p>
          <p>When we make material changes, we may provide notice through Orixus, by email, or through another reasonable method where appropriate.</p>
          <p>The updated Personal Policy will include a revised effective date.</p>
        </section>

        <section className="static-page__section">
          <h2 className="static-page__section-title">15. Contact Us</h2>
          <p>If you have questions, concerns, privacy requests, or complaints regarding this Privacy Policy or Orixus's handling of personal information, contact:</p>
          <p><strong>Orixus</strong></p>
          <p><strong>Email:</strong> <a href="mailto:orixusofficial@gmail.com" className="static-page__email">orixusofficial@gmail.com</a></p>
          <p>We will make reasonable efforts to review and respond to privacy-related inquiries.</p>
        </section>

        <section className="static-page__section">
          <p className="static-page__disclaimer"><strong>Important:</strong> This Privacy Policy describes Orixus's current practices based on the application's implementation. If Orixus's data practices, third-party providers, analytics tools, account functionality, or legal obligations change, this policy should be reviewed and updated accordingly.</p>
        </section>
      </div>
    </div>
  );
}
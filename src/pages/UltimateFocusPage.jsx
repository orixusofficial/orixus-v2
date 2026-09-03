import { Download, Lock, Monitor, ShieldCheck } from 'lucide-react';
import JsonLd from '../components/JsonLd';
import NativeFocusPanel from '../components/NativeFocusPanel';
import { isTauriRuntime } from '../lib/desktop';
import '../styles/ultimate-focus.css';

/* ------------------------------------------------------------------
 * Ultimate Focus — App-Exclusive Feature
 * ------------------------------------------------------------------
 * Ultimate Focus is a premium device-level protection feature that
 * ships with the Orixus desktop/mobile applications. It is NOT
 * available through the Orixus website, and this page must never
 * present browser-extension installation UI.
 *
 * ── App download configuration ───────────────────────────────────
 * Same mechanism as the landing page (src/pages/LandingPage.jsx):
 * VITE_WINDOWS_DOWNLOAD_URL overrides, falling back to the published
 * v0.1.0 Windows installer asset on GitHub Releases.
 * ----------------------------------------------------------------- */
const ORIXUS_APP_DOWNLOAD_URL =
  import.meta.env.VITE_WINDOWS_DOWNLOAD_URL ||
  'https://github.com/orixusofficial/orixus-v2/releases/download/v0.1.0/orixus_0.1.0_x64-setup.exe';

const APP_AVAILABILITY_TEXT = ORIXUS_APP_DOWNLOAD_URL
  ? 'Available for Windows'
  : 'Desktop available soon · Mobile coming soon';

const CAPABILITIES = [
  {
    id: 'device',
    icon: Monitor,
    title: 'Device-Level Protection',
    text: 'Blocks distracting and harmful websites across your entire device — beyond any single browser.',
  },
  {
    id: 'persistent',
    icon: ShieldCheck,
    title: 'Protection That Persists',
    text: 'Protection stays active even when Orixus is closed, so your focus session never depends on an open tab.',
  },
  {
    id: 'enforced',
    icon: Lock,
    title: 'Enforced, Not Suggested',
    text: 'Active sessions are locked in at the device level and cannot be bypassed from the browser.',
  },
];

export default function UltimateFocusPage() {
  const isAppReleased = Boolean(ORIXUS_APP_DOWNLOAD_URL);
  // Native engine panel renders only inside the Tauri desktop runtime.
  // The browser version of this page is completely unchanged.
  const isDesktop = isTauriRuntime();

  return (
    <div className="uf-page">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://orixus.vercel.app/' },
            { '@type': 'ListItem', position: 2, name: 'Ultimate Focus', item: 'https://orixus.vercel.app/ultimate-focus' },
          ],
        }}
      />

      <header className="uf-hero">
        <span className="uf-status-badge">
          <Lock size={11} strokeWidth={2.25} aria-hidden="true" />
          App Exclusive
        </span>

        <h1 className="uf-title">Ultimate Focus</h1>

        <p className="uf-tagline">Protect your focus beyond the browser.</p>

        <p className="uf-lede">
          Ultimate Focus blocks distracting and harmful websites across your device —
          and keeps protection active even when Orixus is closed.
        </p>

        <div className="uf-cta-row">
          {isAppReleased ? (
            <a
              className="uf-cta"
              href={ORIXUS_APP_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download size={15} strokeWidth={2.25} aria-hidden="true" />
              <span>Download for Windows</span>
            </a>
          ) : (
            <span
              className="uf-cta uf-cta--locked"
              aria-disabled="true"
              title="The Orixus app is coming soon"
            >
              <Download size={15} strokeWidth={2.25} aria-hidden="true" />
              <span>Download Orixus App</span>
              <span className="uf-cta__soon">Coming Soon</span>
            </span>
          )}
          <span className="uf-availability">{APP_AVAILABILITY_TEXT}</span>
        </div>
      </header>

      {isDesktop ? <NativeFocusPanel /> : null}

      <section className="uf-panel" aria-label="Ultimate Focus capabilities">
        {CAPABILITIES.map(({ id, icon: Icon, title, text }) => (
          <div key={id} className="uf-panel__row">
            <span className="uf-panel__icon" aria-hidden="true">
              <Icon size={20} strokeWidth={1.75} />
            </span>
            <div className="uf-panel__copy">
              <h2 className="uf-panel__title">{title}</h2>
              <p className="uf-panel__text">{text}</p>
            </div>
          </div>
        ))}
      </section>

      <p className="uf-footnote">
        Ultimate Focus is not available on the Orixus website. It is delivered exclusively
        through the Orixus app for desktop and mobile.
      </p>
    </div>
  );
}
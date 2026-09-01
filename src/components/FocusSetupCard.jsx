import { useState } from 'react';
import {
  isChromeStoreListingAvailable,
  openChromeWebStore,
} from '../services/focusExtension';

function formatRemainingTime(expiresAtStr) {
  if (!expiresAtStr) return '00:00:00';
  const diff = Math.max(0, new Date(expiresAtStr).getTime() - Date.now());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Permanent Ultimate Focus setup card on /ultimate-focus.
 *
 * Always visible — never hidden via localStorage. Renders one of three
 * states based on extension connection and Focus session status:
 *
 *   STATE 1 — Extension not installed:
 *     ULTIMATE FOCUS / "Protect your focus even when Orixus is closed." /
 *     "Extension required" / "Browser protection is not connected." / BEGIN
 *
 *   STATE 2 — Extension installed, no active session:
 *     ULTIMATE FOCUS / "Extension connected" /
 *     "Browser protection is ready." / COMMIT & PROTECT
 *
 *   STATE 3 — Focus active:
 *     ULTIMATE FOCUS / PROTECTED / remaining time / protected categories
 */
export default function FocusSetupCard({
  extensionStatus, // 'checking' | 'installed' | 'not_installed' | 'error'
  activeSession,
  categories,
  onBegin,
  onCommit,
  committing,
  commitDisabled,
}) {
  const [showDevHint, setShowDevHint] = useState(false);
  const isSessionActive = activeSession?.status === 'active';
  const isConnected = extensionStatus === 'installed';

  const handleBegin = () => {
    setShowDevHint(false);
    if (isChromeStoreListingAvailable()) {
      // Open the configured Chrome Web Store listing in a new tab.
      openChromeWebStore();
    } else {
      // Store URL not configured yet (placeholder): never navigate to
      // GitHub or download anything. Show the local-development hint.
      setShowDevHint(true);
    }
    if (onBegin) onBegin();
  };

  return (
    <section className="focus-setup-card" aria-label="Ultimate Focus setup">
      <div className="focus-setup-card__header">
        <h2 className="focus-setup-card__title">ULTIMATE FOCUS</h2>
        {isSessionActive ? (
          <span className="focus-badge focus-badge--active">PROTECTED</span>
        ) : isConnected ? (
          <span className="focus-badge focus-badge--active">CONNECTED</span>
        ) : extensionStatus === 'checking' ? (
          <span className="focus-badge focus-badge--inactive">CHECKING…</span>
        ) : (
          <span className="focus-badge focus-badge--inactive">EXTENSION REQUIRED</span>
        )}
      </div>

      {isSessionActive ? (
        /* STATE 3 — Focus active */
        <div className="focus-setup-card__body">
          <p className="focus-setup-card__lede focus-setup-card__lede--accent">PROTECTED</p>
          <div className="focus-setup-card__timer">{formatRemainingTime(activeSession.expires_at)}</div>
          <div className="focus-setup-card__row">
            <span className="focus-setup-card__label">Protected categories:</span>
            <div className="focus-setup-card__tags">
              {(activeSession.focus_policies?.categories || categories).map((c) => (
                <span key={c} className="focus-setup-card__tag">{c}</span>
              ))}
            </div>
          </div>
        </div>
      ) : isConnected ? (
        /* STATE 2 — Extension installed */
        <div className="focus-setup-card__body">
          <p className="focus-setup-card__lede">Extension connected</p>
          <p className="focus-setup-card__text">Browser protection is ready.</p>
          <button
            type="button"
            className="focus-setup-card__btn focus-setup-card__btn--primary"
            onClick={onCommit}
            disabled={committing || commitDisabled}
          >
            {committing ? 'INITIALIZING…' : 'COMMIT & PROTECT'}
          </button>
        </div>
      ) : (
        /* STATE 1 — Extension not installed (permanent section, never hidden) */
        <div className="focus-setup-card__body">
          <p className="focus-setup-card__lede">
            Protect your focus even when Orixus is closed.
          </p>
          <p className="focus-setup-card__text">
            {extensionStatus === 'error'
              ? 'Browser protection is not responding. Reinstall or reload the extension.'
              : 'Browser protection is not connected.'}
          </p>
          <button
            type="button"
            className="focus-setup-card__btn focus-setup-card__btn--primary"
            onClick={handleBegin}
          >
            BEGIN
          </button>
          {showDevHint && (
            <p className="focus-setup-card__note">
              The Chrome Web Store listing is not published yet. For local
              development, load the extension unpacked via Chrome → Extensions
              → Developer Mode → Load unpacked.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
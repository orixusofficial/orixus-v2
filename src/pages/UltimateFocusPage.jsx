import { useState, useEffect, useCallback, useMemo } from 'react';
import JsonLd from '../components/JsonLd';
import {
  DEFAULT_CATEGORIES,
  fetchActiveFocusSession,
  createFocusSession,
  endFocusSession,
} from '../services/focus';
import '../styles/ultimate-focus.css';

const DURATION_PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '30m', minutes: 30 },
  { label: '1h', minutes: 60 },
  { label: '2h', minutes: 120 },
  { label: '4h', minutes: 240 },
  { label: '8h', minutes: 480 },
  { label: '24h', minutes: 1440 },
  { label: 'Custom', minutes: 'custom' },
];

function formatTimeRemaining(expiresAtStr) {
  if (!expiresAtStr) return '00:00:00';
  const expiresAt = new Date(expiresAtStr).getTime();
  const now = Date.now();
  const diff = Math.max(0, expiresAt - now);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function UltimateFocusPage({ userId, currentCycle }) {
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [selectedCategories, setSelectedCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedDuration, setSelectedDuration] = useState(60); // Default 1 hour
  const [customMinutes, setCustomMinutes] = useState(180);
  const [isCustom, setIsCustom] = useState(false);
  const [timeRemainingStr, setTimeRemainingStr] = useState('00:00:00');

  const loadSession = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const session = await fetchActiveFocusSession(userId);
      setActiveSession(session);
    } catch (err) {
      setError(err.message ?? 'Failed to load focus session.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  // Live timer interval when session is active
  useEffect(() => {
    if (!activeSession || activeSession.status !== 'active') {
      setTimeRemainingStr('00:00:00');
      return;
    }

    const updateTimer = () => {
      const formatted = formatTimeRemaining(activeSession.expires_at);
      setTimeRemainingStr(formatted);

      if (formatted === '00:00:00') {
        setActiveSession((prev) => (prev ? { ...prev, status: 'expired' } : null));
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length === 1) return; // Must keep at least 1 category
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSelectDuration = (preset) => {
    if (preset.minutes === 'custom') {
      setIsCustom(true);
    } else {
      setIsCustom(false);
      setSelectedDuration(preset.minutes);
    }
  };

  const effectiveDuration = useMemo(() => {
    if (isCustom) {
      const val = Number(customMinutes);
      return Number.isFinite(val) && val > 0 ? val : 60;
    }
    return selectedDuration;
  }, [isCustom, customMinutes, selectedDuration]);

  const handleCommitAndProtect = async () => {
    if (!userId) return;
    setError('');
    setSubmitting(true);
    try {
      const session = await createFocusSession(
        userId,
        effectiveDuration,
        selectedCategories,
        []
      );
      setActiveSession(session);
    } catch (err) {
      setError(err.message ?? 'Failed to start focus session.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEndSession = async () => {
    if (!userId || !activeSession) return;
    setError('');
    setSubmitting(true);
    try {
      const ended = await endFocusSession(activeSession.id, userId);
      setActiveSession(ended);
    } catch (err) {
      setError(err.message ?? 'Failed to end focus session.');
    } finally {
      setSubmitting(false);
    }
  };

  const isSessionActive = activeSession?.status === 'active';

  return (
    <div className="focus-page">
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

      <div className="focus-header">
        <h1 className="focus-title">Ultimate Focus</h1>
        <p className="focus-subtitle">
          Un-compromised, website-independent focus protection for deep work.
        </p>
      </div>

      {error && <div className="focus-error-banner">{error}</div>}

      <div className="focus-grid">
        {/* Left Column: Focus Configuration / Controls */}
        <div className="focus-card">
          <div className="focus-card__header">
            <h2 className="focus-card__title">Protection Configuration</h2>
            <span className={`focus-badge focus-badge--${activeSession?.status || 'inactive'}`}>
              {activeSession?.status || 'inactive'}
            </span>
          </div>

          {!isSessionActive ? (
            <>
              <div>
                <label className="focus-cycle-label" style={{ display: 'block', marginBottom: '10px' }}>
                  Target Categories
                </label>
                <div className="focus-categories">
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <label key={cat} className="focus-category-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        disabled={submitting}
                      />
                      <span className="focus-category-label">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="focus-cycle-label" style={{ display: 'block', marginBottom: '10px' }}>
                  Session Duration
                </label>
                <div className="focus-durations">
                  {DURATION_PRESETS.map((preset) => {
                    const active = isCustom
                      ? preset.minutes === 'custom'
                      : selectedDuration === preset.minutes && !isCustom;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        className={`focus-duration-btn ${active ? 'focus-duration-btn--active' : ''}`}
                        onClick={() => handleSelectDuration(preset)}
                        disabled={submitting}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {isCustom && (
                  <div style={{ marginTop: '12px' }}>
                    <input
                      type="number"
                      min="1"
                      max="10080"
                      className="focus-duration-btn"
                      style={{ width: '100%', textAlign: 'left', padding: '10px 14px' }}
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(e.target.value)}
                      placeholder="Minutes (e.g. 180)"
                      disabled={submitting}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                className="focus-commit-btn"
                onClick={handleCommitAndProtect}
                disabled={submitting || loading || selectedCategories.length === 0}
              >
                {submitting ? 'Initializing...' : 'COMMIT & PROTECT'}
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p className="focus-subtitle">
                Protection is active. The browser extension will enforce blocking rules across all tabs even when this website is closed.
              </p>
              <div>
                <span className="focus-cycle-label">Protected Categories:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {(activeSession.focus_policies?.categories || selectedCategories).map((c) => (
                    <span key={c} className="focus-badge focus-badge--active" style={{ textTransform: 'none' }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="focus-end-btn"
                onClick={handleEndSession}
                disabled={submitting}
              >
                {submitting ? 'Ending...' : 'End Focus Session Early'}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Status & Cycle Integration */}
        <div className="focus-card">
          <div className="focus-card__header">
            <h2 className="focus-card__title">Active Status</h2>
            {isSessionActive && <span className="focus-badge focus-badge--active">PROTECTED</span>}
          </div>

          <div className="focus-timer">
            <div className="focus-timer__digits">{timeRemainingStr}</div>
            <div className="focus-timer__label">Remaining Time</div>
          </div>

          {currentCycle ? (
            <div className="focus-cycle-info">
              <div>
                <span className="focus-cycle-label">Active Discipline Cycle</span>
                <div className="focus-cycle-val">Day 1 of {currentCycle.duration} ({currentCycle.rank || 'Initiate'})</div>
              </div>
              <span className="focus-badge focus-badge--active">Sync Connected</span>
            </div>
          ) : (
            <div className="focus-cycle-info">
              <span className="focus-cycle-label">Discipline Cycle:</span>
              <span className="focus-cycle-val">No Active Cycle</span>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimers & Extension Instructions */}
      <div className="focus-disclaimer-card">
        <h3 className="focus-disclaimer-title">Browser Extension & Platform Integration</h3>
        <p className="focus-disclaimer-text">
          • <strong>Browser Enforcement MVP</strong>: This control panel configures protection policies in Supabase. Install the Orixus Manifest V3 extension in Chromium browsers (Chrome, Edge, Brave) to enforce local domain blocking.
        </p>
        <p className="focus-disclaimer-text">
          • <strong>Website Independent</strong>: The extension retains cached session tokens and rules in local extension storage. Closing this tab or restarting the browser will NOT stop an active Focus session.
        </p>
        <p className="focus-disclaimer-text">
          • <strong>Bypass Disclaimer</strong>: Browser-level extensions enforce web request blocking during active sessions, but cannot alter operating system level network configuration. Dedicated Android & iOS companion apps will connect to this exact Focus Policy backend for full mobile OS enforcement.
        </p>
      </div>
    </div>
  );
}

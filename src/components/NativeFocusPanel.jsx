import { useCallback, useEffect, useState } from 'react';
import { Power, ShieldAlert, ShieldCheck } from 'lucide-react';
import {
  disableNativeFocus,
  enableNativeFocus,
  getNativeFocusStatus,
  isNativeFocusAvailable,
} from '../services/ultimateFocusNative';

/**
 * Native Ultimate Focus panel — rendered ONLY inside the Tauri desktop
 * runtime. Reads its state from the native Rust engine and calls the native
 * enable/disable commands. In the browser this component never mounts, so
 * the website behavior is unchanged.
 *
 * Honest status: the panel reports the engine phase exactly as the native
 * engine reports it. In Phase 1 the engine tracks focus state natively but
 * does NOT yet block websites system-wide, and the UI says so.
 */
export default function NativeFocusPanel() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    const result = await getNativeFocusStatus();
    if (result.available) {
      setStatus(result.status);
      setError(result.error ?? null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isNativeFocusAvailable()) return;
    refresh();
  }, [refresh]);

  const handleToggle = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = status?.enabled
        ? await disableNativeFocus()
        : await enableNativeFocus(null);
      if (result.status) {
        setStatus(result.status);
      }
      if (result.error) {
        setError(result.error);
      } else if (result.status && !result.status.enabled && result.status.lastError) {
        // The invoke itself succeeded but the engine reported a failed
        // operation (e.g. UAC elevation declined) — surface the structured
        // error so the panel leaves its working state with feedback.
        setError({ code: 'engine_error', message: result.status.lastError });
      }
    } catch (err) {
      // Never leave the panel stuck in its working state on unexpected
      // failures — show the existing error state instead.
      setError({
        code: 'unknown',
        message: err?.message ?? 'Something went wrong. Please try again.',
      });
    } finally {
      setBusy(false);
    }
  };

  if (!isNativeFocusAvailable() || loading) return null;

  const enabled = status?.enabled ?? false;

  return (
    <section className="uf-native" aria-label="Native Ultimate Focus engine">
      <div className="uf-native__header">
        <span
          className={`uf-native__dot ${enabled ? 'uf-native__dot--on' : ''}`}
          aria-hidden="true"
        />
        <div className="uf-native__copy">
          <h2 className="uf-native__title">Native Engine</h2>
          <p className="uf-native__state">
            {enabled
              ? status?.blockingActive
                ? 'Active — system-wide blocking running'
                : 'Enabled — state tracked natively (no system-wide blocking yet)'
              : 'Disabled'}
          </p>
        </div>
        <button
          type="button"
          className={`uf-native__btn ${enabled ? 'uf-native__btn--stop' : ''}`}
          onClick={handleToggle}
          disabled={busy}
        >
          {enabled ? <Power size={13} strokeWidth={2.25} aria-hidden="true" /> : null}
          <span>{busy ? 'Working…' : enabled ? 'Disable' : 'Enable'}</span>
        </button>
      </div>

      {status?.expiresAt ? (
        <p className="uf-native__meta">
          Session ends at {new Date(status.expiresAt * 1000).toLocaleTimeString()}
        </p>
      ) : null}

      {enabled && !status?.blockingActive ? (
        <p className="uf-native__notice">
          <ShieldAlert size={13} strokeWidth={2} aria-hidden="true" />
          Focus enabled — initializing system-wide Windows blocking engine…
        </p>
      ) : null}

      {status?.blockingActive ? (
        <p className="uf-native__notice uf-native__notice--ok">
          <ShieldCheck size={13} strokeWidth={2} aria-hidden="true" />
          System-wide blocking is active across your device.
        </p>
      ) : null}

      {error ? <p className="uf-native__error">{error.message}</p> : null}
    </section>
  );
}
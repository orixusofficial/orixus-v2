/**
 * Orixus Ultimate Focus — native (Tauri) bridge.
 *
 * This module is the ONLY place in the frontend that talks to the native
 * Windows Ultimate Focus engine. Every function is gated on
 * `isTauriRuntime()`: in a normal browser they resolve to
 * `{ available: false, ... }` and never attempt to invoke Tauri commands,
 * so the browser version of Orixus is completely unaffected.
 *
 * The native engine (src-tauri/src/ultimate_focus/) owns the authoritative
 * focus state — persisted on disk in the Rust process, independent of the
 * React window. This module never caches focus state in localStorage or
 * React state beyond displaying what the engine reports.
 */

import { isTauriRuntime } from '../lib/desktop';

/** Lazily import Tauri's invoke only inside the Tauri runtime. */
async function getInvoke() {
  if (!isTauriRuntime()) return null;
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke;
  } catch {
    return null;
  }
}

/** Shape of a native FocusStatus returned by the Rust engine. */
function normalizeStatus(raw) {
  if (!raw || typeof raw !== 'object') return null;
  return {
    enabled: Boolean(raw.enabled),
    activatedAt: raw.activated_at ?? null,
    expiresAt: raw.expires_at ?? null,
    durationMinutes: raw.duration_minutes ?? null,
    // Honest flag: true only when the native engine is REALLY blocking.
    blockingActive: Boolean(raw.blocking_active),
    enginePhase: raw.engine_phase ?? 'not_implemented',
    lastError: raw.last_error ?? null,
  };
}

/**
 * Whether the native engine is available in the current environment.
 * True only inside the Tauri desktop runtime.
 */
export function isNativeFocusAvailable() {
  return isTauriRuntime();
}

/**
 * Get the native Ultimate Focus status.
 * Resolves to { available: false } in the browser.
 */
export async function getNativeFocusStatus() {
  if (!isTauriRuntime()) return { available: false, status: null };
  const invoke = await getInvoke();
  if (!invoke) return { available: false, status: null };
  try {
    const raw = await invoke('get_ultimate_focus_status');
    return { available: true, status: normalizeStatus(raw) };
  } catch (err) {
    return { available: true, status: null, error: normalizeError(err) };
  }
}

/**
 * Enable Ultimate Focus natively.
 * @param {number|null} durationMinutes Optional session length in minutes.
 */
export async function enableNativeFocus(durationMinutes = null) {
  if (!isTauriRuntime()) {
    return { available: false, status: null, error: { code: 'not_tauri', message: 'Native focus requires the Orixus desktop app.' } };
  }
  const invoke = await getInvoke();
  if (!invoke) {
    return { available: false, status: null, error: { code: 'not_tauri', message: 'Native focus requires the Orixus desktop app.' } };
  }
  try {
    const raw = await invoke('enable_ultimate_focus', { durationMinutes });
    return { available: true, status: normalizeStatus(raw) };
  } catch (err) {
    return { available: true, status: null, error: normalizeError(err) };
  }
}

/**
 * Disable Ultimate Focus natively.
 */
export async function disableNativeFocus() {
  if (!isTauriRuntime()) {
    return { available: false, status: null, error: { code: 'not_tauri', message: 'Native focus requires the Orixus desktop app.' } };
  }
  const invoke = await getInvoke();
  if (!invoke) {
    return { available: false, status: null, error: { code: 'not_tauri', message: 'Native focus requires the Orixus desktop app.' } };
  }
  try {
    const raw = await invoke('disable_ultimate_focus');
    return { available: true, status: normalizeStatus(raw) };
  } catch (err) {
    return { available: true, status: null, error: normalizeError(err) };
  }
}

/** Normalize Tauri command errors (structured { code, message }). */
function normalizeError(err) {
  if (err && typeof err === 'object' && 'code' in err) {
    return { code: String(err.code), message: String(err.message ?? 'Unknown native error.') };
  }
  return { code: 'unknown', message: typeof err === 'string' ? err : 'Unknown native error.' };
}
/**
 * Detects whether the app is running inside the Tauri desktop runtime.
 *
 * Safe for browser use: returns false in any normal browser environment.
 * Tauri v2 injects `window.__TAURI_INTERNALS__`; older/other integrations may
 * expose `window.__TAURI__` or a user-agent containing "tauri".
 */
export function isTauriRuntime() {
  if (typeof window === 'undefined') return false;
  if ('__TAURI_INTERNALS__' in window) return true;
  if ('__TAURI__' in window) return true;
  try {
    return /tauri/i.test(navigator.userAgent || '');
  } catch {
    return false;
  }
}
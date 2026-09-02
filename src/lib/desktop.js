/**
 * Detects whether the app is running inside the Tauri desktop runtime.
 *
 * Safe for browser use: returns false in any normal browser environment.
 * Tauri v2 injects `window.__TAURI_INTERNALS__`; older/other integrations may
 * expose `window.__TAURI__` or a user-agent containing "tauri".
 */
export function isTauriRuntime() {
  if (typeof window === 'undefined') return false;
  // Primary detection: Tauri v2 injects __TAURI_INTERNALS__ into every webview
  // (both `tauri dev` and production builds). This works regardless of the
  // `app.withGlobalTauri` setting.
  if ('__TAURI_INTERNALS__' in window) return true;
  if ('__TAURI__' in window) return true;
  try {
    // Production fallback: Tauri v2 serves bundled assets from the custom
    // `tauri://` scheme (macOS/Linux) or `http://tauri.localhost` (Windows).
    // These protocols never occur in a normal browser, so this is reliable
    // in packaged builds even if the globals above were somehow unavailable.
    const proto = window.location?.protocol || '';
    const host = (window.location?.hostname || '').toLowerCase();
    if (proto === 'tauri:' || proto === 'asset:') return true;
    if (host === 'tauri.localhost') return true;
    return /tauri/i.test(navigator.userAgent || '');
  } catch {
    return false;
  }
}

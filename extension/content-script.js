// Orixus Ultimate Focus Extension — Content Script
//
// Bridges Focus state from the Orixus web app to the extension background
// service worker. The web app broadcasts `ORIXUS_FOCUS_SESSION_SYNC` /
// `ORIXUS_FOCUS_SESSION_END` via window.postMessage after committing the
// session to Supabase. This script relays those events to the background's
// existing SYNC_SESSION / END_SESSION handlers, which activate DNR blocking.
//
// Security: only messages from the Orixus web app origins are accepted.

const ALLOWED_ORIGINS = new Set([
  'https://orixus.vercel.app',
  'http://localhost',
  'https://localhost',
  'http://127.0.0.1',
  'https://127.0.0.1',
]);

// Match patterns cannot express ports, so allow any port on localhost dev servers.
function isAllowedOrigin(origin) {
  if (ALLOWED_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    return isLocal && (url.protocol === 'http:' || url.protocol === 'https:');
  } catch (_) {
    return false;
  }
}

window.addEventListener('message', (event) => {
  // Only accept messages posted by the page itself (not iframes/other sources)
  if (event.source !== window) return;
  if (!isAllowedOrigin(event.origin)) return;

  const msg = event.data;
  if (!msg || typeof msg !== 'object') return;

  if (msg.type === 'ORIXUS_FOCUS_SESSION_SYNC' && msg.payload && msg.payload.session) {
    chrome.runtime.sendMessage(
      {
        type: 'SYNC_SESSION',
        payload: {
          session: msg.payload.session,
          policy: msg.payload.policy || msg.payload.session.focus_policies || null,
        },
      },
      () => void chrome.runtime.lastError // no-op callback; swallow context-invalidated errors
    );
  }

  if (msg.type === 'ORIXUS_FOCUS_SESSION_END') {
    chrome.runtime.sendMessage(
      { type: 'END_SESSION', payload: { sessionId: msg.payload ? msg.payload.sessionId : null } },
      () => void chrome.runtime.lastError
    );
  }
});
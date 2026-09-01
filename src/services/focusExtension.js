/**
 * Orixus Ultimate Focus — Website ↔ Extension bridge.
 *
 * This module is the SINGLE configuration location for the website↔extension
 * integration. It handles:
 *   - Extension availability detection (FOCUS_PING)
 *   - Activating enforcement (FOCUS_ACTIVATE) after a Supabase session commit
 *   - Ending enforcement (FOCUS_END) when the user ends Focus
 *
 * Two transport paths are used:
 *   1. Chrome external messaging (`chrome.runtime.sendMessage` to the
 *      extension ID) — the proper Manifest V3 mechanism, enabled by
 *      `externally_connectable` in extension/manifest.json. Used in
 *      production once ORIXUS_EXTENSION_ID is configured.
 *   2. window.postMessage bridge relayed by the extension's content script —
 *      used for local development / unpacked installs where the extension ID
 *      is unknown, and for ported dev servers (externally_connectable
 *      patterns cannot contain ports).
 *
 * Security: no browsing history, URLs, or credentials are ever sent — only
 * the minimum Focus policy data required by the blocker.
 */

// ---------------------------------------------------------------------------
// Configuration (single source of truth)
// ---------------------------------------------------------------------------

/** Production Orixus web origin. Also declared in extension/manifest.json
 *  (`externally_connectable`) and in the extension content-script matches. */
export const ORIXUS_PROD_ORIGIN = 'https://orixus.vercel.app';

/** Local development origin (Vite default). */
export const ORIXUS_DEV_ORIGIN = 'http://localhost:5173';

/**
 * Published extension ID. Leave empty until the extension is published to the
 * Chrome Web Store; while empty, detection/activation falls back to the
 * content-script bridge (which works for unpacked installs and production,
 * since the content script matches the production origin).
 */
export const ORIXUS_EXTENSION_ID = '';

/**
 * Official Chrome Web Store listing for the Orixus Ultimate Focus extension.
 *
 * ⚠️ PLACEHOLDER — the extension has NOT been published to the Chrome Web
 * Store yet. Replace this single value with the real store URL after
 * publication (this is the ONLY value that needs changing). Users are NEVER
 * sent to GitHub; local development uses the unpacked-extension workflow
 * (Chrome → Extensions → Developer Mode → Load unpacked) instead.
 *
 * While the placeholder is in place, the BEGIN button stays clickable but
 * shows the local-development install hint instead of navigating anywhere.
 */
export const CHROME_EXTENSION_STORE_URL = 'REPLACE_WITH_CHROME_WEB_STORE_URL';

/** Timeout (ms) for bridge-based detection pings. */
const PING_TIMEOUT_MS = 600;

// ---------------------------------------------------------------------------
// Low-level transports
// ---------------------------------------------------------------------------

function sendExternalMessage(extensionId, message) {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
      resolve({ ok: false, reason: 'unavailable' });
      return;
    }
    try {
      chrome.runtime.sendMessage(extensionId, message, (response) => {
        if (chrome.runtime.lastError) {
          resolve({ ok: false, reason: 'no_receiver' });
          return;
        }
        if (!response || response.type === 'FOCUS_ERROR') {
          resolve({ ok: false, reason: response?.error || 'extension_error' });
          return;
        }
        resolve({ ok: true, response });
      });
    } catch (_) {
      resolve({ ok: false, reason: 'unavailable' });
    }
  });
}

function postBridgeMessage(message) {
  if (typeof window === 'undefined') return;
  window.postMessage(message, window.location.origin);
}

/**
 * Send a message through the content-script bridge and wait for a reply.
 * Returns null when the bridge does not answer (extension not installed).
 */
function bridgeRequest(message, { expectReply = true } = {}) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }

    if (!expectReply) {
      postBridgeMessage(message);
      resolve(undefined);
      return;
    }

    let settled = false;
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        window.removeEventListener('message', onMessage);
        resolve(null);
      }
    }, PING_TIMEOUT_MS);

    function onMessage(event) {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'ORIXUS_FOCUS_PONG') {
        settled = true;
        clearTimeout(timeout);
        window.removeEventListener('message', onMessage);
        resolve(data);
      }
    }

    window.addEventListener('message', onMessage);
    postBridgeMessage(message);
  });
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Detect the extension. Distinguishes:
 *   - 'installed'      → extension responded
 *   - 'not_installed'  → no receiver on any channel
 *   - 'error'          → receiver present but reported an error
 *
 * Returns { status, active, expiresAt }.
 */
export async function detectExtension() {
  // 1. Proper external messaging channel (when the extension ID is known).
  if (ORIXUS_EXTENSION_ID) {
    const result = await sendExternalMessage(ORIXUS_EXTENSION_ID, { type: 'FOCUS_PING' });
    if (result.ok) {
      return {
        status: 'installed',
        active: !!result.response?.active,
        expiresAt: result.response?.expires_at || null,
      };
    }
    if (result.reason === 'extension_error') {
      return { status: 'error', active: false, expiresAt: null };
    }
  }

  // 2. Content-script bridge (unpacked/dev installs, ported dev servers).
  const pong = await bridgeRequest({ type: 'ORIXUS_FOCUS_PING' });
  if (pong) {
    if (pong.available) {
      return {
        status: 'installed',
        active: !!pong.session?.active,
        expiresAt: pong.session?.expires_at || null,
      };
    }
    // Bridge answered but the background could not be reached.
    return { status: 'error', active: false, expiresAt: null };
  }

  return { status: 'not_installed', active: false, expiresAt: null };
}

/**
 * Send FOCUS_ACTIVATE to the extension after a successful Supabase session
 * commit. Tries external messaging first, then the content-script bridge.
 * Returns { delivered: boolean, via: 'external' | 'bridge' | null }.
 */
export async function sendFocusActivate(session) {
  const payload = {
    sessionId: session.id,
    expires_at: session.expires_at,
    started_at: session.started_at,
    duration_minutes: session.duration_minutes,
    categories: session.focus_policies?.categories || [],
    blocked_domains: session.focus_policies?.blocked_domains || [],
  };

  // 1. External messaging (production path).
  if (ORIXUS_EXTENSION_ID) {
    const result = await sendExternalMessage(ORIXUS_EXTENSION_ID, {
      type: 'FOCUS_ACTIVATE',
      payload,
    });
    if (result.ok) return { delivered: true, via: 'external' };
  }

  // 2. Content-script bridge (dev / unpacked installs). Fire-and-forget:
  //    the bridge relays to the background's SYNC_SESSION handler.
  postBridgeMessage({
    type: 'ORIXUS_FOCUS_SESSION_SYNC',
    payload: {
      session: { ...session, status: 'active' },
      policy: session.focus_policies || null,
    },
  });

  // Confirm the bridge actually reached the background.
  const pong = await bridgeRequest({ type: 'ORIXUS_FOCUS_PING' });
  if (pong && pong.available) {
    return { delivered: true, via: 'bridge' };
  }

  return { delivered: false, via: null };
}

/**
 * Send FOCUS_END to the extension when the user ends Focus from Orixus.
 * If delivery fails, the extension still expires via its own alarm.
 * Returns { delivered: boolean }.
 */
export async function sendFocusEnd(sessionId) {
  // 1. External messaging (production path).
  if (ORIXUS_EXTENSION_ID) {
    const result = await sendExternalMessage(ORIXUS_EXTENSION_ID, {
      type: 'FOCUS_END',
      payload: { sessionId },
    });
    if (result.ok) return { delivered: true };
  }

  // 2. Content-script bridge (dev / unpacked installs).
  postBridgeMessage({
    type: 'ORIXUS_FOCUS_SESSION_END',
    payload: { sessionId },
  });

  return { delivered: true };
}

// ---------------------------------------------------------------------------
// Installation
// ---------------------------------------------------------------------------

/** Sentinel value used before the real Chrome Web Store URL is configured. */
const STORE_URL_PLACEHOLDER = 'REPLACE_WITH_CHROME_WEB_STORE_URL';

/**
 * Whether the official Chrome Web Store listing is available.
 * False while CHROME_EXTENSION_STORE_URL is still the unpublished placeholder.
 */
export function isChromeStoreListingAvailable() {
  return (
    typeof CHROME_EXTENSION_STORE_URL === 'string' &&
    CHROME_EXTENSION_STORE_URL.startsWith('https://') &&
    CHROME_EXTENSION_STORE_URL !== STORE_URL_PLACEHOLDER
  );
}

/**
 * Open the official Chrome Web Store listing in a new tab.
 * Returns false when the store URL has not been supplied yet.
 */
export function openChromeWebStore() {
  if (!isChromeStoreListingAvailable()) return false;
  if (typeof window !== 'undefined') {
    window.open(CHROME_EXTENSION_STORE_URL, '_blank', 'noopener,noreferrer');
  }
  return true;
}

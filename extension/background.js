// Orixus Ultimate Focus Extension — Background Service Worker (Manifest V3)

// Import maintainable category-based blocklist
// (importScripts is the supported way to load scripts in an MV3 classic service worker;
//  CommonJS require() is NOT available in service workers)
importScripts('./blocklist.js');

/**
 * Update declarativeNetRequest dynamic blocking rules based on active focus session
 */
async function applyBlockingRules(session, policy) {
  if (!session || session.status !== 'active') {
    await clearBlockingRules();
    return;
  }

  const now = Date.now();
  const expiresAt = new Date(session.expires_at).getTime();

  if (now >= expiresAt) {
    await clearBlockingRules();
    await chrome.storage.local.set({ activeSession: { ...session, status: 'expired' } });
    return;
  }

  // Aggregate blocklist domains + any custom domains from policy
  const targetDomains = new Set(ALL_DOMAINS);
  const customDomains = policy?.blocked_domains || session.focus_policies?.blocked_domains || [];
  customDomains.forEach(domain => targetDomains.add(domain));

  const domainsArray = Array.from(targetDomains);
  if (domainsArray.length === 0) {
    await clearBlockingRules();
    return;
  }

  // Build declarativeNetRequest dynamic redirect rules to extension/blocked.html
  const addRules = domainsArray.map((domain, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: 'redirect',
      redirect: { extensionPath: `/blocked.html?domain=${encodeURIComponent(domain)}` }
    },
    condition: {
      urlFilter: `||${domain}^`,
      resourceTypes: ['main_frame']
    }
  }));

  // Fetch existing rule IDs to remove them cleanly before adding new rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existingRules.map(rule => rule.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules
  });

  // Set chrome alarm for exact session expiration
  const delayInMinutes = Math.max(0.05, (expiresAt - now) / (1000 * 60));
  chrome.alarms.create('ORIXUS_SESSION_EXPIRATION', { delayInMinutes });
}

async function clearBlockingRules() {
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existingRules.map(rule => rule.id);
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds });
  chrome.alarms.clear('ORIXUS_SESSION_EXPIRATION');
}

// Restore enforcement on browser startup or extension load/reload
async function initializeEnforcement() {
  const { activeSession, activePolicy } = await chrome.storage.local.get(['activeSession', 'activePolicy']);
  if (activeSession) {
    await applyBlockingRules(activeSession, activePolicy);
  }
}

chrome.runtime.onStartup.addListener(() => {
  initializeEnforcement();
});

chrome.runtime.onInstalled.addListener(() => {
  initializeEnforcement();
});

// Handle alarm triggers (session expiry)
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'ORIXUS_SESSION_EXPIRATION') {
    await clearBlockingRules();
    const { activeSession } = await chrome.storage.local.get(['activeSession']);
    if (activeSession) {
      await chrome.storage.local.set({ activeSession: { ...activeSession, status: 'expired' } });
    }
  }
});

/**
 * External messaging (Website → Extension)
 *
 * The Orixus web app is allowed to talk to this extension via
 * `externally_connectable` (see manifest.json). Only the production Orixus
 * origin and localhost development origins are accepted — every other sender
 * is rejected. Messages are validated before any state is stored or any
 * blocking rule is touched.
 *
 * NOTE: Chrome does not allow ports in `externally_connectable` match
 * patterns, so ported dev servers (e.g. http://localhost:5173) are bridged by
 * the content script instead (see content-script.js).
 */
const ALLOWED_EXTERNAL_ORIGINS = new Set([
  'https://orixus.vercel.app',
  'http://localhost',
  'https://localhost',
  'http://127.0.0.1',
  'https://127.0.0.1',
]);

function isAllowedExternalOrigin(origin) {
  if (ALLOWED_EXTERNAL_ORIGINS.has(origin)) return true;
  try {
    const url = new URL(origin);
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    return isLocal && (url.protocol === 'http:' || url.protocol === 'https:');
  } catch (_) {
    return false;
  }
}

function isValidIsoDateInFuture(value) {
  if (typeof value !== 'string') return false;
  const time = new Date(value).getTime();
  return Number.isFinite(time) && time > Date.now();
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Validate a FOCUS_ACTIVATE payload from the website.
 * Returns an error string, or null when the payload is valid.
 */
function validateActivatePayload(payload) {
  if (!payload || typeof payload !== 'object') return 'Missing payload';
  if (typeof payload.sessionId !== 'string' || payload.sessionId.length === 0) {
    return 'Invalid sessionId';
  }
  if (!isValidIsoDateInFuture(payload.expires_at)) return 'Invalid or past expires_at';
  if (payload.started_at !== undefined && typeof payload.started_at !== 'string') {
    return 'Invalid started_at';
  }
  if (payload.categories !== undefined && !isStringArray(payload.categories)) {
    return 'Invalid categories';
  }
  if (payload.blocked_domains !== undefined && !isStringArray(payload.blocked_domains)) {
    return 'Invalid blocked_domains';
  }
  return null;
}

// External message API: FOCUS_PING | FOCUS_ACTIVATE | FOCUS_END
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
  const origin = sender.origin || (sender.url ? new URL(sender.url).origin : '');
  if (!isAllowedExternalOrigin(origin)) {
    sendResponse({ type: 'FOCUS_ERROR', error: 'Unauthorized origin' });
    return false;
  }

  if (!message || typeof message !== 'object' || typeof message.type !== 'string') {
    sendResponse({ type: 'FOCUS_ERROR', error: 'Malformed message' });
    return false;
  }

  if (message.type === 'FOCUS_PING') {
    chrome.storage.local.get(['activeSession'], (data) => {
      const session = data.activeSession;
      const active = !!(session && session.status === 'active' &&
        new Date(session.expires_at).getTime() > Date.now());
      sendResponse({ type: 'FOCUS_ACK', active, expires_at: active ? session.expires_at : null });
    });
    return true;
  }

  if (message.type === 'FOCUS_ACTIVATE') {
    const validationError = validateActivatePayload(message.payload);
    if (validationError) {
      sendResponse({ type: 'FOCUS_ERROR', error: validationError });
      return false;
    }

    const { sessionId, expires_at, started_at, duration_minutes, categories, blocked_domains } = message.payload;

    // Minimum required active Focus state, stored locally so enforcement
    // persists after the Orixus tab/window is closed.
    const session = {
      id: sessionId,
      status: 'active',
      started_at: started_at || new Date().toISOString(),
      expires_at,
      ...(Number.isFinite(duration_minutes) ? { duration_minutes } : {}),
    };
    const policy = {
      categories: Array.isArray(categories) ? categories : [],
      blocked_domains: Array.isArray(blocked_domains) ? blocked_domains : [],
    };

    chrome.storage.local.set({ activeSession: session, activePolicy: policy }, async () => {
      // Existing enforcement function — same path as the extension popup.
      await applyBlockingRules(session, policy);
      sendResponse({ type: 'FOCUS_ACK', sessionId, active: true });
    });
    return true;
  }

  if (message.type === 'FOCUS_END') {
    if (!message.payload || typeof message.payload.sessionId !== 'string' || message.payload.sessionId.length === 0) {
      sendResponse({ type: 'FOCUS_ERROR', error: 'Invalid sessionId' });
      return false;
    }

    chrome.storage.local.get(['activeSession'], async (data) => {
      const activeSession = data.activeSession;
      // Only end the session that matches the request (ignore stale ids).
      if (activeSession && activeSession.id !== message.payload.sessionId) {
        sendResponse({ type: 'FOCUS_ERROR', error: 'Session ID mismatch' });
        return;
      }
      const updated = activeSession ? { ...activeSession, status: 'ended' } : null;
      await chrome.storage.local.set({ activeSession: updated });
      // Existing deactivation function.
      await clearBlockingRules();
      sendResponse({ type: 'FOCUS_ACK', sessionId: message.payload.sessionId, active: false });
    });
    return true;
  }

  sendResponse({ type: 'FOCUS_ERROR', error: 'Unknown message type' });
  return false;
});

// Listen for sync messages from popup or web app
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SYNC_SESSION') {
    const { session, policy } = message.payload;
    chrome.storage.local.set({ activeSession: session, activePolicy: policy }, async () => {
      await applyBlockingRules(session, policy);
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'END_SESSION') {
    chrome.storage.local.get(['activeSession'], async (res) => {
      const updated = res.activeSession ? { ...res.activeSession, status: 'ended' } : null;
      await chrome.storage.local.set({ activeSession: updated });
      await clearBlockingRules();
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'GET_STATUS') {
    chrome.storage.local.get(['activeSession', 'activePolicy'], (data) => {
      sendResponse(data);
    });
    return true;
  }
});

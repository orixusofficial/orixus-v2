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

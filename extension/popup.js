function formatRemainingTime(expiresAtStr) {
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

document.addEventListener('DOMContentLoaded', () => {
  const badgeEl = document.getElementById('statusBadge');
  const timerEl = document.getElementById('timerDigits');
  const activateBtn = document.getElementById('activateBtn');
  const endBtn = document.getElementById('endBtn');

  function updatePopup() {
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
      if (chrome.runtime.lastError || !response) return;

      const session = response.activeSession;
      if (session && session.status === 'active') {
        const remaining = formatRemainingTime(session.expires_at);
        if (remaining === '00:00:00') {
          badgeEl.textContent = 'EXPIRED';
          badgeEl.className = 'badge';
          timerEl.textContent = '00:00:00';
          activateBtn.style.display = 'block';
          endBtn.style.display = 'none';
        } else {
          badgeEl.textContent = 'PROTECTED';
          badgeEl.className = 'badge badge--active';
          timerEl.textContent = remaining;
          activateBtn.style.display = 'none';
          endBtn.style.display = 'block';
        }
      } else {
        badgeEl.textContent = session?.status ? session.status.toUpperCase() : 'INACTIVE';
        badgeEl.className = 'badge';
        timerEl.textContent = '00:00:00';
        activateBtn.style.display = 'block';
        endBtn.style.display = 'none';
      }
    });
  }

  activateBtn.addEventListener('click', () => {
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + 15 * 60 * 1000);
    const mockSession = {
      id: `session-${Date.now()}`,
      status: 'active',
      duration_minutes: 15,
      started_at: startedAt.toISOString(),
      expires_at: expiresAt.toISOString()
    };
    const mockPolicy = {
      categories: ['Adult', 'Gambling', 'Harmful'],
      blocked_domains: ['example.com', 'example.org', 'example.net']
    };

    chrome.runtime.sendMessage(
      { type: 'SYNC_SESSION', payload: { session: mockSession, policy: mockPolicy } },
      () => updatePopup()
    );
  });

  endBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'END_SESSION' }, () => updatePopup());
  });

  updatePopup();
  setInterval(updatePopup, 1000);
});

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const domain = params.get('domain');
  const domainEl = document.getElementById('domainDisplay');
  if (domain && domainEl) {
    domainEl.textContent = domain;
  }
});

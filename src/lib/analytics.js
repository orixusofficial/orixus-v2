import { useEffect } from 'react';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isInitialized = false;

export function initGA() {
  if (isInitialized || !GA_MEASUREMENT_ID || import.meta.env.DEV) {
    return;
  }

  isInitialized = true;

  // Load gtag.js script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
}

export function trackPageView(path) {
  if (!isInitialized || !window.gtag) {
    return;
  }
  window.gtag('event', 'page_view', {
    page_path: path,
  });
}

export function trackEvent(name, params = {}) {
  if (!isInitialized || !window.gtag) {
    return;
  }
  window.gtag('event', name, params);
}

export function useAnalytics() {
  useEffect(() => {
    initGA();
  }, []);
}
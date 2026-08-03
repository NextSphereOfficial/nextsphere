import { useEffect } from 'react';

declare global {
  function gtag(...args: unknown[]): void;
}

function updateGAConsent(consent: string | null) {
  if (typeof gtag === 'undefined') return;
  gtag('consent', 'update', {
    analytics_storage: consent === 'accepted' ? 'granted' : 'denied',
  });
}

export function useGoogleAnalytics() {
  useEffect(() => {
    // Apply stored consent on mount
    updateGAConsent(localStorage.getItem('ns_cookie_consent'));

    // Update consent whenever the banner is acted on
    const handleChange = (e: Event) => {
      updateGAConsent((e as CustomEvent<{ consent: string }>).detail.consent);
    };

    window.addEventListener('ns:cookie-consent-changed', handleChange);
    return () => window.removeEventListener('ns:cookie-consent-changed', handleChange);
  }, []);
}

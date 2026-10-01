/** Cookiebot is authoritative when present; the legacy banner is preview-only. */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.Cookiebot) return window.Cookiebot.consent?.statistics === true;
    // Do not fall back to stale legacy consent while Cookiebot is still loading.
    if (document.getElementById('Cookiebot')) return false;
    return window.localStorage.getItem('ns_cookie_consent') === 'accepted';
  } catch {
    return false;
  }
}
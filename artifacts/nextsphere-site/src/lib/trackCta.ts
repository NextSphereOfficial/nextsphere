import { track } from '@vercel/analytics';
import { hasAnalyticsConsent } from './analyticsConsent';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Track a CTA click:
 *  1. Vercel Analytics (client-side)
 *  2. Our own API server (server-side aggregation for the dashboard)
 */
export function trackCta(location: string) {
  // Demo funnel events all use the same consent gate.
  if (location === 'demo') {
    trackAnalyticsEvent('cta_click', { location }, location);
    return;
  }
  try { track('cta_click', { location }); } catch { /* never interrupt navigation */ }
  aggregate(location);
}

/** Consent is checked for every event, including after mid-playback revocation. */
export function trackAnalyticsEvent(
  name: string,
  properties: Record<string, string | number | boolean>,
  aggregateLocation: string,
): boolean {
  if (!hasAnalyticsConsent()) return false;
  try { track(name, properties); } catch { /* the API can still record the event */ }
  aggregate(aggregateLocation);
  return true;
}

function aggregate(location: string) {
  // Reuse the existing location-based API, without identifiers or user content.
  try {
    void fetch(`${BASE}/api/analytics/cta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      keepalive: true,
      body: JSON.stringify({ location }),
    }).catch(() => { /* analytics must never break the UX */ });
  } catch { /* fetch may also fail synchronously */ }
}

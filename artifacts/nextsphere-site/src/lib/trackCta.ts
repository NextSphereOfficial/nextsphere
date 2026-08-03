import { track } from '@vercel/analytics';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Track a CTA click:
 *  1. Vercel Analytics (client-side)
 *  2. Our own API server (server-side aggregation for the dashboard)
 */
export function trackCta(location: string) {
  // Vercel Analytics
  track('cta_click', { location });

  // Server-side aggregator (fire-and-forget, never throws)
  fetch(`${BASE}/api/analytics/cta`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location }),
  }).catch(() => {
    // silently ignore — analytics must never break the UX
  });
}

/**
 * Behavioural tests for cookie consent flow.
 * Run with: node src/components/cookieConsent.test.mjs
 *
 * Covers four scenarios without requiring a DOM or React:
 *   1. Banner appears on load when localStorage has no consent stored.
 *   2. Banner reopens via the `ns:open-cookie-settings` event even after
 *      consent was previously stored.
 *   3. Accepting then rejecting updates ns_cookie_consent to "rejected".
 *   4. Analytics opt-out: `ns:cookie-consent-changed` with "rejected" fires
 *      gtag consent update with analytics_storage: "denied" (no page reload
 *      required), matching the contract of useGoogleAnalytics.ts.
 *
 * The tests exercise the same logic that CookieBanner.tsx and
 * useGoogleAnalytics.ts use, keeping them in sync with the implementation
 * contract rather than its internals.
 */

// ---------------------------------------------------------------------------
// Minimal mocks
// ---------------------------------------------------------------------------

/** Lightweight localStorage mock. */
function makeLocalStorage() {
  const store = new Map();
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

/** Minimal EventTarget-style event bus that mimics window's dispatch/listen. */
function makeEventBus() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(fn);
    },
    removeEventListener(type, fn) {
      if (!listeners.has(type)) return;
      listeners.set(type, listeners.get(type).filter((f) => f !== fn));
    },
    dispatchEvent(event) {
      (listeners.get(event.type) ?? []).forEach((fn) => fn(event));
    },
  };
}

/** Recreates the CookieBanner logic in a testable, framework-free form. */
function makeBannerController(ls, bus) {
  let isVisible = false;

  // Mirrors the useEffect in CookieBanner.tsx:
  // show if no consent stored; always register the reopen listener.
  function mount() {
    const consent = ls.getItem('ns_cookie_consent');
    if (!consent) {
      isVisible = true;
    }
    bus.addEventListener('ns:open-cookie-settings', handleOpen);
  }

  function unmount() {
    bus.removeEventListener('ns:open-cookie-settings', handleOpen);
  }

  function handleOpen() {
    isVisible = true;
  }

  // Mirrors handleConsent in CookieBanner.tsx.
  function handleConsent(choice) {
    ls.setItem('ns_cookie_consent', choice);
    bus.dispatchEvent({ type: 'ns:cookie-consent-changed', detail: { consent: choice } });
    isVisible = false;
  }

  return { mount, unmount, handleConsent, get visible() { return isVisible; } };
}

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

let passed = true;
let testCount = 0;

function assert(label, actual, expected) {
  testCount++;
  if (actual === expected) {
    console.log(`  ✓ ${label}`);
  } else {
    console.error(`  ✗ ${label}`);
    console.error(`      expected: ${JSON.stringify(expected)}`);
    console.error(`      received: ${JSON.stringify(actual)}`);
    passed = false;
  }
}

function test(name, fn) {
  console.log(`\n${name}`);
  fn();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test('Banner appears on load when localStorage has no consent stored', () => {
  const ls = makeLocalStorage();          // empty — no prior consent
  const bus = makeEventBus();
  const banner = makeBannerController(ls, bus);

  banner.mount();

  assert('banner is visible', banner.visible, true);
  assert('ns_cookie_consent is absent', ls.getItem('ns_cookie_consent'), null);
});

test('Banner does NOT appear on load when consent was already stored', () => {
  const ls = makeLocalStorage();
  ls.setItem('ns_cookie_consent', 'accepted');
  const bus = makeEventBus();
  const banner = makeBannerController(ls, bus);

  banner.mount();

  assert('banner is hidden', banner.visible, false);
});

test('Banner reopens via Cookie Settings even after consent was already stored', () => {
  const ls = makeLocalStorage();
  ls.setItem('ns_cookie_consent', 'accepted'); // user previously accepted
  const bus = makeEventBus();
  const banner = makeBannerController(ls, bus);

  banner.mount();
  assert('banner starts hidden', banner.visible, false);

  // Footer "Cookie Settings" button dispatches this event.
  bus.dispatchEvent(new (class { constructor() { this.type = 'ns:open-cookie-settings'; } })());

  assert('banner reopens after event', banner.visible, true);
});

test('Accept then reject — ns_cookie_consent is updated to "rejected"', () => {
  const ls = makeLocalStorage();
  const bus = makeEventBus();
  const banner = makeBannerController(ls, bus);

  // Track consent-changed events
  const events = [];
  bus.addEventListener('ns:cookie-consent-changed', (e) => events.push(e.detail?.consent ?? e.detail));

  banner.mount();
  assert('banner visible before choice', banner.visible, true);

  // User clicks Accept
  banner.handleConsent('accepted');
  assert('stored value after accept', ls.getItem('ns_cookie_consent'), 'accepted');
  assert('banner hidden after accept', banner.visible, false);

  // Footer reopens the banner
  bus.dispatchEvent({ type: 'ns:open-cookie-settings' });
  assert('banner visible again', banner.visible, true);

  // User clicks Reject
  banner.handleConsent('rejected');
  assert('stored value updated to rejected', ls.getItem('ns_cookie_consent'), 'rejected');
  assert('banner hidden after reject', banner.visible, false);

  // Two consent-changed events should have fired
  assert('two consent events fired', events.length, 2);
  assert('first event was accepted', events[0], 'accepted');
  assert('second event was rejected', events[1], 'rejected');
});

// ---------------------------------------------------------------------------
// Analytics opt-out tests (mirrors useGoogleAnalytics.ts contract)
// ---------------------------------------------------------------------------

/**
 * Recreates the analytics hook logic in a testable, framework-free form.
 * Mirrors useGoogleAnalytics.ts: reads stored consent on mount and reacts to
 * ns:cookie-consent-changed events for the remainder of the session.
 */
function makeAnalyticsController(ls, bus, gtagFn) {
  function updateConsent(consent) {
    gtagFn('consent', 'update', {
      analytics_storage: consent === 'accepted' ? 'granted' : 'denied',
    });
  }

  function handleChange(e) {
    updateConsent(e.detail.consent);
  }

  function mount() {
    // Apply stored consent immediately (matches the hook's useEffect)
    updateConsent(ls.getItem('ns_cookie_consent'));
    bus.addEventListener('ns:cookie-consent-changed', handleChange);
  }

  function unmount() {
    bus.removeEventListener('ns:cookie-consent-changed', handleChange);
  }

  return { mount, unmount };
}

test('Analytics: revoking consent mid-session calls gtag denied without page reload', () => {
  const ls = makeLocalStorage();
  ls.setItem('ns_cookie_consent', 'accepted'); // user previously accepted
  const bus = makeEventBus();

  const gtagCalls = [];
  const mockGtag = (...args) => gtagCalls.push(args);

  const analytics = makeAnalyticsController(ls, bus, mockGtag);
  analytics.mount();

  // On mount, should immediately apply "granted" for the stored "accepted" value
  assert('mount applies granted for stored accepted', gtagCalls[0]?.[2]?.analytics_storage, 'granted');

  // Simulate user revoking consent via the banner — no page reload
  bus.dispatchEvent({
    type: 'ns:cookie-consent-changed',
    detail: { consent: 'rejected' },
  });

  assert('revoke triggers gtag consent update', gtagCalls.length, 2);
  assert('revoke sets analytics_storage to denied', gtagCalls[1]?.[2]?.analytics_storage, 'denied');
  assert('gtag command is consent update', gtagCalls[1]?.[1], 'update');
});

test('Analytics: accepting consent mid-session calls gtag granted without page reload', () => {
  const ls = makeLocalStorage();
  // No prior consent stored — mount applies "denied" by default
  const bus = makeEventBus();

  const gtagCalls = [];
  const mockGtag = (...args) => gtagCalls.push(args);

  const analytics = makeAnalyticsController(ls, bus, mockGtag);
  analytics.mount();

  assert('mount applies denied when no consent stored', gtagCalls[0]?.[2]?.analytics_storage, 'denied');

  // Simulate user accepting consent via the banner
  bus.dispatchEvent({
    type: 'ns:cookie-consent-changed',
    detail: { consent: 'accepted' },
  });

  assert('accept triggers gtag consent update', gtagCalls.length, 2);
  assert('accept sets analytics_storage to granted', gtagCalls[1]?.[2]?.analytics_storage, 'granted');
});

test('Analytics: unmount stops reacting to consent events', () => {
  const ls = makeLocalStorage();
  ls.setItem('ns_cookie_consent', 'accepted');
  const bus = makeEventBus();

  const gtagCalls = [];
  const mockGtag = (...args) => gtagCalls.push(args);

  const analytics = makeAnalyticsController(ls, bus, mockGtag);
  analytics.mount();
  analytics.unmount();

  const callsAfterMount = gtagCalls.length; // 1 (from mount)

  // Fire a consent change — should be ignored after unmount
  bus.dispatchEvent({
    type: 'ns:cookie-consent-changed',
    detail: { consent: 'rejected' },
  });

  assert('no additional gtag calls after unmount', gtagCalls.length, callsAfterMount);
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passed ? 'All' : 'Some'} assertions ${passed ? 'passed' : 'FAILED'} (${testCount} checks).`);
if (!passed) process.exit(1);

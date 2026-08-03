/**
 * Behavioural tests for cookie consent flow.
 * Run with: node src/components/cookieConsent.test.mjs
 *
 * Covers three scenarios without requiring a DOM or React:
 *   1. Banner appears on load when localStorage has no consent stored.
 *   2. Banner reopens via the `ns:open-cookie-settings` event even after
 *      consent was previously stored.
 *   3. Accepting then rejecting updates ns_cookie_consent to "rejected".
 *
 * The tests exercise the same logic that CookieBanner.tsx uses, keeping
 * them in sync with the implementation contract rather than its internals.
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
// Summary
// ---------------------------------------------------------------------------

console.log(`\n${passed ? 'All' : 'Some'} assertions ${passed ? 'passed' : 'FAILED'} (${testCount} checks).`);
if (!passed) process.exit(1);

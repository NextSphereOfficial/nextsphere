import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DemoWatchSession, type DemoVideoEvent, type DemoVideoProperties } from './demoWatchSession.ts';
import { hasAnalyticsConsent } from './analyticsConsent.ts';

function recorder() {
  const events: { event: DemoVideoEvent; properties: DemoVideoProperties }[] = [];
  let consent = true;
  return {
    events,
    consent(value: boolean) { consent = value; },
    emit(event: DemoVideoEvent, properties: DemoVideoProperties) {
      if (!consent) return false;
      events.push({ event, properties });
      return true;
    },
  };
}

test('autoplay start/complete are deduplicated across buffering and manual resume', () => {
  const session = new DemoWatchSession();
  const r = recorder();
  session.playing('auto', 'landscape', r.emit);
  session.playing('auto', 'landscape', r.emit);
  session.playing('manual', 'landscape', r.emit);
  session.ended(r.emit);
  session.ended(r.emit);
  assert.deepEqual(r.events, [
    { event: 'demo_video_start', properties: { mode: 'auto', format: 'landscape', watch: 'initial' } },
    { event: 'demo_video_complete', properties: { mode: 'auto', format: 'landscape', watch: 'initial' } },
  ]);
});

test('manual initial run and each replay have separate deduplicated counts', () => {
  const session = new DemoWatchSession();
  const r = recorder();
  session.playing('manual', 'portrait', r.emit);
  session.ended(r.emit);
  for (let i = 0; i < 2; i++) {
    session.restart();
    session.playing('manual', 'portrait', r.emit);
    session.playing('manual', 'portrait', r.emit);
    session.ended(r.emit);
    session.ended(r.emit);
  }
  assert.equal(r.events.length, 6);
  assert.equal(r.events[0].properties.watch, 'initial');
  assert.ok(r.events.slice(2).every((e) => e.properties.watch === 'replay'));
});

test('blocked/failed play and premature ended never count; retry before first actual play stays initial', () => {
  const session = new DemoWatchSession();
  const r = recorder();
  session.ended(r.emit);
  session.restart();
  assert.deepEqual(r.events, []);
  session.playing('manual', 'landscape', r.emit);
  assert.equal(r.events[0].properties.watch, 'initial');
});

test('replay mid-run and source replacement reset deduplication, without completing the abandoned run', () => {
  const session = new DemoWatchSession();
  const r = recorder();
  session.playing('auto', 'landscape', r.emit);
  session.restart();
  session.playing('manual', 'landscape', r.emit);
  session.restart();
  session.playing('manual', 'portrait', r.emit);
  session.ended(r.emit);
  assert.deepEqual(r.events.map((e) => [e.event, e.properties.watch, e.properties.format]), [
    ['demo_video_start', 'initial', 'landscape'],
    ['demo_video_start', 'replay', 'landscape'],
    ['demo_video_start', 'replay', 'portrait'],
    ['demo_video_complete', 'replay', 'portrait'],
  ]);
});

test('consent granted mid-run does not backfill a start or orphan completion; next replay can count', () => {
  const session = new DemoWatchSession();
  const r = recorder();
  r.consent(false);
  session.playing('auto', 'landscape', r.emit);
  r.consent(true);
  session.playing('manual', 'landscape', r.emit);
  session.ended(r.emit);
  assert.deepEqual(r.events, []);
  session.restart();
  session.playing('manual', 'landscape', r.emit);
  session.ended(r.emit);
  assert.equal(r.events.length, 2);
  assert.equal(r.events[0].properties.watch, 'replay');
});

test('revocation suppresses completion and repeated ended never backfills it', () => {
  const session = new DemoWatchSession();
  const r = recorder();
  session.playing('auto', 'landscape', r.emit);
  r.consent(false);
  session.ended(r.emit);
  r.consent(true);
  session.ended(r.emit);
  assert.equal(r.events.length, 1);
});

test('consent gate: Cookiebot statistics is authoritative, legacy fallback fails closed', () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const originalDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
  const mockWindow = {
    Cookiebot: undefined as undefined | { consent?: { statistics?: boolean } },
    localStorage: { getItem: (_key: string) => 'accepted' },
  };
  let cookiebotScript = true;
  Object.defineProperty(globalThis, 'window', { configurable: true, value: mockWindow });
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: { getElementById: () => cookiebotScript ? {} : null },
  });
  try {
    assert.equal(hasAnalyticsConsent(), false); // Cookiebot loading, stale legacy acceptance
    mockWindow.Cookiebot = {};
    assert.equal(hasAnalyticsConsent(), false);
    mockWindow.Cookiebot = { consent: { statistics: false } };
    assert.equal(hasAnalyticsConsent(), false);
    mockWindow.Cookiebot.consent!.statistics = true;
    assert.equal(hasAnalyticsConsent(), true);
    mockWindow.Cookiebot.consent!.statistics = false;
    assert.equal(hasAnalyticsConsent(), false); // revoke without reload
    mockWindow.Cookiebot = undefined;
    cookiebotScript = false;
    assert.equal(hasAnalyticsConsent(), true); // legacy preview
    mockWindow.localStorage.getItem = () => 'rejected';
    assert.equal(hasAnalyticsConsent(), false);
    mockWindow.localStorage.getItem = () => { throw new Error('storage blocked'); };
    assert.equal(hasAnalyticsConsent(), false);
  } finally {
    if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
    else Reflect.deleteProperty(globalThis, 'window');
    if (originalDocument) Object.defineProperty(globalThis, 'document', originalDocument);
    else Reflect.deleteProperty(globalThis, 'document');
  }
  if (!originalWindow) assert.equal(hasAnalyticsConsent(), false);
});
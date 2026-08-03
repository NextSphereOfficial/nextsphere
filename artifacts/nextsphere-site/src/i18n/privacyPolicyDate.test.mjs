/**
 * Snapshot test for privacy policy date formatting.
 * Run with: node src/i18n/privacyPolicyDate.test.mjs
 *
 * Verifies that the EN and IT labels always resolve to the expected month/year
 * regardless of the runtime timezone (TZ env var is forced to a western offset
 * to confirm no shifting occurs).
 */

// Simulate a timezone far west of UTC (UTC-12) to stress-test for shifting
process.env.TZ = 'Etc/GMT+12';

const PRIVACY_POLICY_DATE = { year: 2026, month: 8 }; // August 2026

const date = new Date(Date.UTC(PRIVACY_POLICY_DATE.year, PRIVACY_POLICY_DATE.month - 1, 1));

const en = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
const it = new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);

let passed = true;

function assert(label, actual, expected) {
  if (actual === expected) {
    console.log(`✓ ${label}: "${actual}"`);
  } else {
    console.error(`✗ ${label}: expected "${expected}", got "${actual}"`);
    passed = false;
  }
}

assert('EN label', en, 'August 2026');
assert('IT label', it, 'agosto 2026');

if (!passed) {
  process.exit(1);
}
console.log('\nAll assertions passed.');

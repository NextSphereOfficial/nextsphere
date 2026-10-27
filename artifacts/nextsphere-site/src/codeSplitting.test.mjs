import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';
import { defaultDist, measureInitialJs } from '../scripts/measure-initial-js.mjs';

// Production checks: run the site build before this file, not against Vite dev.
const manifest = JSON.parse(await readFile(`${defaultDist}/.vite/manifest.json`, 'utf8'));
const report = await measureInitialJs();

test('startup budget covers every static import, not only the entry', () => {
  assert.ok(report.files.length > 1, 'Expected separate reusable vendor chunks');
  assert.ok(report.totalBytes < 650_000, `Startup JS: ${report.totalBytes} bytes`);
  assert.ok(report.totalGzipBytes < 210_000, `Startup gzip: ${report.totalGzipBytes} bytes`);
  assert.ok(!report.files.some(({ file }) => /analytics|charts/i.test(file)));
});

test('all secondary pages are dynamic entries and no JS chunk exceeds 500 kB', async () => {
  const pages = ['Pricing', 'Airbnb', 'Booking', 'GuidaDigitaleOspiti', 'PrivacyPolicy',
    'CookiePolicy', 'LegalNotes', 'LegalHub', 'LegalDocument', 'Analytics', 'Contact', 'About', 'not-found'];
  for (const page of pages) {
    const chunk = manifest[`src/pages/${page}.tsx`];
    assert.ok(chunk?.isDynamicEntry, `${page} must be loaded on demand`);
    assert.ok(!report.files.some(({ file }) => file === chunk.file), `${page} entered the startup graph`);
  }
  for (const { file } of Object.values(manifest)) {
    if (file.endsWith('.js')) assert.ok((await stat(`${defaultDist}/${file}`)).size < 500_000, file);
  }
});

test('compiled bootstrap alone stays exempt from Cookiebot blocking', async () => {
  const html = await readFile(`${defaultDist}/index.html`, 'utf8');
  const entry = Object.values(manifest).find((chunk) => chunk.isEntry);
  const scripts = html.match(/<script\b[^>]*>/g) ?? [];
  const entryTag = scripts.find((tag) => tag.includes(entry.file));
  assert.match(entryTag ?? '', /data-cookieconsent="ignore"/);
  assert.match(html, /data-blockingmode="auto"/);
  const gaTag = scripts.find((tag) => tag.includes('googletagmanager.com/gtag/js'));
  assert.match(gaTag ?? '', /data-cookieconsent="statistics"/);
  assert.doesNotMatch(gaTag, /data-cookieconsent="ignore"/);
});

test('demo stays eager and mounts synchronously in the opening gesture', async () => {
  const app = await readFile(new URL('./App.tsx', import.meta.url), 'utf8');
  const home = await readFile(new URL('./pages/Home.tsx', import.meta.url), 'utf8');
  const overlay = await readFile(new URL('./components/DemoOverlay.tsx', import.meta.url), 'utf8');
  assert.match(app, /import Home from '\.\/pages\/Home'/);
  assert.match(home, /import DemoOverlay from '\.\.\/components\/DemoOverlay'/);
  assert.match(overlay, /import DemoVideo from '\.\/DemoVideo'/);
  assert.match(home, /flushSync\(\(\) => setDemoOpen\(true\)\)/);
  assert.doesNotMatch(home, /lazy\(|import\(/);
  assert.doesNotMatch(overlay, /lazy\(|import\(/);
});

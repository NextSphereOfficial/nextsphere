import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { removeStaticSeo } from './staticSeo.ts';

test('shell cleanup removes page metadata but preserves global schema', () => {
  const metadata = [{ removed: false, remove() { this.removed = true; } }];
  const schemas = ['FAQPage', 'VideoObject', 'Organization', 'WebSite', 'SoftwareApplication'].map((type) => ({
    textContent: JSON.stringify({ '@type': type }),
    removed: false,
    remove() { this.removed = true; },
  }));
  const doc = { head: { querySelectorAll(selector) {
    return selector === 'script[type="application/ld+json"]' ? schemas : metadata;
  } } };
  removeStaticSeo(doc);
  assert.ok(metadata[0].removed);
  assert.deepEqual(schemas.map(({ removed }) => removed), [true, true, false, false, false]);
});

test('cleanup runs before React mounts, never on a page effect', async () => {
  const main = await readFile(new URL('../main.tsx', import.meta.url), 'utf8');
  const seo = await readFile(new URL('../components/SEO.tsx', import.meta.url), 'utf8');
  assert.ok(main.indexOf('removeStaticSeo(document)') < main.indexOf('createRoot('));
  assert.doesNotMatch(seo, /\.remove\(|removeChild|querySelector/);
});

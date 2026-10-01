import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import test from 'node:test';

const sitemapPath = new URL('../public/sitemap.xml', import.meta.url);
const htmlPath = new URL('../index.html', import.meta.url);
const sitemap = await readFile(sitemapPath, 'utf8');
const html = await readFile(htmlPath, 'utf8');

const BASE = 'https://www.nextsphere.it';
const videoTitle = 'Demo NextSphere: configurazione e risposta del chatbot AI';
const videoDescription = "Video dimostrativo di 20 secondi, senza audio e in italiano: l'host inserisce gli orari di check-in e NextSphere risponde all'ospite usando quelle informazioni.";
const posterUrl = `${BASE}/media/nextsphere-demo-poster.jpg`;
const videoUrl = `${BASE}/media/nextsphere-demo.mp4`;

function assertWellFormedXml(xml) {
  const tags = xml.match(/<\?[\s\S]*?\?>|<!--[\s\S]*?-->|<![^>]*>|<\/?[A-Za-z_][\w:.-]*(?:\s[^<>]*?)?\s*\/?>/g) ?? [];
  const tagNames = [];
  let cursor = 0;

  for (const tag of tags) {
    const between = xml.slice(cursor, xml.indexOf(tag, cursor));
    if (tagNames.length === 0) {
      assert.doesNotMatch(between, /[^\s]/, 'XML contains non-whitespace outside the root element');
    }
    cursor = xml.indexOf(tag, cursor) + tag.length;

    if (tag.startsWith('<?') || tag.startsWith('<!')) continue;
    const name = tag.match(/^<\/?([A-Za-z_][\w:.-]*)/)[1];
    if (tag.startsWith('</')) {
      assert.equal(tagNames.pop(), name, `Mismatched XML closing tag: ${name}`);
    } else if (!tag.endsWith('/>')) {
      tagNames.push(name);
    }
  }

  assert.doesNotMatch(xml.slice(cursor), /[^\s]/, 'XML contains non-whitespace after markup');
  assert.deepEqual(tagNames, [], 'XML has unclosed elements');
}

function tagValue(block, tag) {
  const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = block.match(new RegExp(`<${escapedTag}>([\\s\\S]*?)</${escapedTag}>`));
  assert.ok(match, `Missing <${tag}>`);
  return match[1].replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
}

function parseVideoSitemap() {
  assertWellFormedXml(sitemap);
  assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(sitemap, /xmlns:video="http:\/\/www\.google\.com\/schemas\/sitemap-video\/1\.1"/);

  return [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    loc: tagValue(block, 'loc'),
    lastmod: block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1],
    videoBlock: block.match(/<video:video>([\s\S]*?)<\/video:video>/)?.[1],
  }));
}

function parseJsonLd() {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(([, contents]) => JSON.parse(contents));
}

test('video sitemap is well-formed and preserves the existing public page URLs', () => {
  const pages = parseVideoSitemap();
  assert.deepEqual(pages.map(page => page.loc), [
    `${BASE}/`,
    `${BASE}/pricing`,
    `${BASE}/airbnb`,
    `${BASE}/booking`,
    `${BASE}/guida-digitale-ospiti`,
    `${BASE}/privacy-policy`,
    `${BASE}/cookie-policy`,
  ]);
  assert.equal(pages[0].lastmod, '2026-10-01');
  assert.ok(pages.slice(1).every(page => page.videoBlock === undefined));
  assert.ok(pages.every(page => !page.loc.includes('#') && !page.loc.includes('?')));
  assert.ok(pages.every(page => !page.loc.includes('/demo')));
});

test('homepage video sitemap entry has matching, Google-readable metadata and live local assets', async () => {
  const homepage = parseVideoSitemap()[0];
  assert.ok(homepage.videoBlock);
  assert.equal(tagValue(homepage.videoBlock, 'video:title'), videoTitle);
  assert.equal(tagValue(homepage.videoBlock, 'video:description'), videoDescription);
  assert.equal(tagValue(homepage.videoBlock, 'video:thumbnail_loc'), posterUrl);
  assert.equal(tagValue(homepage.videoBlock, 'video:content_loc'), videoUrl);
  assert.equal(tagValue(homepage.videoBlock, 'video:duration'), '20');

  const poster = await stat(new URL('../public/media/nextsphere-demo-poster.jpg', import.meta.url));
  const video = await stat(new URL('../public/media/nextsphere-demo.mp4', import.meta.url));
  assert.ok(poster.isFile(), 'static poster asset exists');
  assert.ok(poster.size > 0, 'static poster is not empty');
  assert.ok(video.isFile(), 'stable desktop MP4 asset exists');
  assert.equal(video.size, 1213245, 'desktop MP4 is the approved verified asset');
});

test('crawlable initial HTML contains one consistent VideoObject and retains existing schemas', () => {
  const schemas = parseJsonLd();
  const schemaTypes = schemas.flatMap(schema => Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']]);
  for (const existingType of ['Organization', 'WebSite', 'SoftwareApplication', 'FAQPage']) {
    assert.ok(schemaTypes.includes(existingType), `${existingType} schema remains in the HTML shell`);
  }

  const videoSchemas = schemas.filter(schema => schema['@type'] === 'VideoObject');
  assert.equal(videoSchemas.length, 1, 'there is exactly one initial-HTML VideoObject');
  assert.deepEqual(
    {
      name: videoSchemas[0].name,
      description: videoSchemas[0].description,
      thumbnailUrl: videoSchemas[0].thumbnailUrl,
      contentUrl: videoSchemas[0].contentUrl,
      uploadDate: videoSchemas[0].uploadDate,
      duration: videoSchemas[0].duration,
    },
    {
      name: videoTitle,
      description: videoDescription,
      thumbnailUrl: posterUrl,
      contentUrl: videoUrl,
      uploadDate: '2026-10-01',
      duration: 'PT20S',
    },
  );
  assert.doesNotMatch(sitemap, /<video:publication_date>/, 'no unsupported public-release date is invented');
});

test('initial HTML does not preload video or instantiate a video element before opening the overlay', () => {
  assert.doesNotMatch(html, /<video\b/i);
  assert.doesNotMatch(html, /<link\b[^>]*rel=["']preload["'][^>]*as=["']video["']/i);
});
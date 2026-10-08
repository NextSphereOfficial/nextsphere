import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const containerId = 'GTM-TQNRZJG4';
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
  .map((match) => ({ attributes: match[1], code: match[2], offset: match.index }));
const defaults = scripts.find((script) => script.code.includes("gtag('consent', 'default'"));
const loader = scripts.find((script) => script.code.includes('/gtm.js?id='));
const cmp = scripts.find((script) => script.attributes.includes('id="Cookiebot"'));

test('one GTM bootstrap, correct container, and consent-first head ordering', () => {
  assert.equal(scripts.filter((script) => script.code.includes('/gtm.js?id=')).length, 1);
  assert.ok(defaults && loader && cmp);
  assert.ok(defaults.offset < loader.offset && loader.offset < cmp.offset);
  assert.ok(cmp.offset < html.indexOf('</head>'));
  assert.match(defaults.attributes, /data-cookieconsent="ignore"/);
  assert.match(loader.attributes, /data-cookieconsent="ignore"/);
  assert.match(loader.code, new RegExp(`'${containerId}'`));
  assert.equal(scripts.filter((script) => script.attributes.includes('id="Cookiebot"')).length, 1);
  assert.match(cmp.attributes, /data-blockingmode="auto"/);
});

test('noscript is the first body element and uses the same container', () => {
  const body = html.slice(html.indexOf('<body>') + '<body>'.length);
  const withoutComments = body.replace(/<!--[\s\S]*?-->/g, '').trimStart();
  assert.ok(withoutComments.startsWith('<noscript>'));
  const fallback = withoutComments.match(/^<noscript>([\s\S]*?)<\/noscript>/)?.[1];
  assert.ok(fallback);
  assert.match(fallback, new RegExp(`src="https://www\\.googletagmanager\\.com/ns\\.html\\?id=${containerId}"`));
  assert.match(fallback, /height="0" width="0"/);
  assert.match(fallback, /display:none;visibility:hidden/);
  assert.equal((html.match(/googletagmanager\.com\/ns\.html/g) ?? []).length, 1);
});

test('actual bootstrap preserves consent commands and inserts one async GTM script', () => {
  const inserted = [];
  const firstScript = {
    parentNode: { insertBefore: (element, reference) => {
      assert.equal(reference, firstScript);
      inserted.push(element);
    } },
  };
  const context = vm.createContext({
    document: {
      getElementsByTagName: (tag) => {
        assert.equal(tag, 'script');
        return [firstScript];
      },
      createElement: (tag) => {
        assert.equal(tag, 'script');
        return {};
      },
    },
  });
  context.window = context;
  vm.runInContext(defaults.code, context);
  vm.runInContext(loader.code, context);

  const consent = Array.from(context.dataLayer[0]);
  assert.deepEqual(consent.slice(0, 2), ['consent', 'default']);
  for (const key of ['ad_storage', 'ad_user_data', 'ad_personalization',
    'analytics_storage', 'functionality_storage', 'personalization_storage']) {
    assert.equal(consent[2][key], 'denied', key);
  }
  assert.equal(consent[2].security_storage, 'granted');
  assert.equal(consent[2].wait_for_update, 500);
  assert.deepEqual(Array.from(context.dataLayer[1]), ['set', 'ads_data_redaction', true]);
  assert.equal(context.dataLayer[2].event, 'gtm.js');
  assert.equal(typeof context.dataLayer[2]['gtm.start'], 'number');
  assert.equal(inserted.length, 1);
  assert.equal(inserted[0].async, true);
  assert.equal(inserted[0].src, `https://www.googletagmanager.com/gtm.js?id=${containerId}`);
});

test('existing GA4 remains statistics-gated and essential app startup stays unblocked', () => {
  const ga4 = scripts.filter((script) => script.attributes.includes('gtag/js?id=G-Y5LPDQZCTX')
    || script.code.includes("gtag('config', 'G-Y5LPDQZCTX')"));
  assert.equal(ga4.length, 2);
  for (const script of ga4) {
    assert.match(script.attributes, /type="text\/plain"/);
    assert.match(script.attributes, /data-cookieconsent="statistics"/);
    assert.doesNotMatch(script.attributes, /data-cookieconsent="ignore"/);
  }
  assert.equal((html.match(/function gtag\(/g) ?? []).length, 1);
  assert.match(html, /<script type="module" src="\/src\/main\.tsx" data-cookieconsent="ignore"><\/script>/);
});

const builtHtmlPath = new URL('../dist/index.html', import.meta.url);
test('production app entry retains its Cookiebot exemption after Vite rewrites HTML',
  { skip: !existsSync(builtHtmlPath) }, () => {
    const built = readFileSync(builtHtmlPath, 'utf8');
    const entry = [...built.matchAll(/<script\b([^>]*)>/g)]
      .map((match) => match[1])
      .filter((attributes) => /type="module"/.test(attributes)
        && /src="[^"]*\/assets\/index-[^"]+\.js"/.test(attributes));
    assert.equal(entry.length, 1);
    assert.match(entry[0], /data-cookieconsent="ignore"/);
    assert.equal((built.match(/googletagmanager\.com\/gtm\.js\?id=/g) ?? []).length, 1);
    assert.equal((built.match(/googletagmanager\.com\/ns\.html\?id=GTM-TQNRZJG4/g) ?? []).length, 1);
  });

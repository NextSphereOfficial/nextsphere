#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const requireFromRoot = createRequire(path.join(rootDir, 'package.json'));
const ts = requireFromRoot('typescript');
const siteDir = path.join(rootDir, 'artifacts/nextsphere-site/src');
const homePath = path.join(siteDir, 'pages/Home.tsx');
const consentPath = path.join(siteDir, 'lib/analyticsConsent.ts');
const trackPath = path.join(siteDir, 'lib/trackCta.ts');
const dashboardDataPath = path.join(siteDir, 'lib/analyticsDashboardData.ts');

function transpile(source, fileName, jsx = false) {
  const compilerOptions = { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 };
  if (jsx) {
    compilerOptions.jsx = ts.JsxEmit.React;
    compilerOptions.jsxFactory = 'jsx';
  }
  const result = ts.transpileModule(source, {
    fileName,
    compilerOptions,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  assert.deepEqual(errors, [], errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n')).join('\n'));
  return result.outputText;
}

function evaluate(source, filename, globals = {}) {
  const module = { exports: {} };
  vm.runInNewContext(transpile(source, filename), {
    ...globals,
    exports: module.exports,
    module,
  }, { filename });
  return module.exports;
}

function plain(value) {
  return JSON.parse(JSON.stringify(value));
}

// Load the real consent and analytics implementations with only their external
// Vercel call and network request replaced by recorders.
const consentWindow = {
  Cookiebot: { consent: { statistics: true } },
  localStorage: { getItem: () => null },
};
const consentModule = evaluate(readFileSync(consentPath, 'utf8'), consentPath, {
  document: { getElementById: () => ({}) },
  window: consentWindow,
});
const analyticsCalls = [];
const aggregateCalls = [];
const trackSource = readFileSync(trackPath, 'utf8');
const baseDeclaration = "const BASE = import.meta.env.BASE_URL.replace(/\\/$/, '');";
assert.equal(trackSource.split(baseDeclaration).length - 1, 1, 'trackCta BASE declaration changed');
const analyticsModule = evaluate(trackSource.replace(baseDeclaration, "const BASE = '';"), trackPath, {
  fetch(url, options) {
    aggregateCalls.push({ url, options });
    return Promise.resolve({ ok: true });
  },
  require(specifier) {
    if (specifier === '@vercel/analytics') {
      return { track: (event, properties) => analyticsCalls.push({ event, properties }) };
    }
    if (specifier === './analyticsConsent') return consentModule;
    throw new Error(`Unexpected analytics import: ${specifier}`);
  },
  window: consentWindow,
});

const homeSource = readFileSync(homePath, 'utf8');
const homeAst = ts.createSourceFile(homePath, homeSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let openDemoCallback;
let heroClickHandler;
let teaserClickHandler;
function findHomeHandlers(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(homeAst) === 'openDemo'
    && node.initializer && ts.isCallExpression(node.initializer)) {
    const callback = node.initializer.arguments[0];
    if (callback && ts.isArrowFunction(callback)) openDemoCallback = callback.getText(homeAst);
  }
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
    const attributes = node.attributes.properties;
    const testId = attributes.find((attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText(homeAst) === 'data-testid');
    const event = attributes.find((attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText(homeAst) === 'onClick');
    if (testId?.initializer && ts.isStringLiteral(testId.initializer) && testId.initializer.text === 'hero-cta-secondary') {
      heroClickHandler = event?.initializer?.expression?.getText(homeAst);
    }
    const teaserOnOpen = attributes.find((attribute) => ts.isJsxAttribute(attribute) && attribute.name.getText(homeAst) === 'onOpen');
    if (teaserOnOpen?.initializer?.expression) teaserClickHandler = teaserOnOpen.initializer.expression.getText(homeAst);
  }
  ts.forEachChild(node, findHomeHandlers);
}
findHomeHandlers(homeAst);
assert.ok(openDemoCallback, 'Home must keep a single explicit openDemo handler');
assert.ok(heroClickHandler, 'hero demo button should request the hero open source');
assert.ok(teaserClickHandler, 'demo teaser should request the teaser open source');

const openStates = [];
const triggerRef = { current: null };
const openDemo = evaluate(`module.exports = (${openDemoCallback});`, homePath, {
  trackDemoOpen: analyticsModule.trackDemoOpen,
  triggerRef,
  setDemoOpen: (open) => openStates.push(open),
});
const heroClick = evaluate(`module.exports = (${heroClickHandler});`, homePath, { openDemo });
const teaserClick = evaluate(`module.exports = (${teaserClickHandler});`, homePath, { openDemo });
const heroTarget = {};
const teaserTarget = {};
heroClick({ currentTarget: heroTarget });
teaserClick({ currentTarget: teaserTarget });
assert.equal(openStates.length, 2, 'each explicit click should request one overlay open');
assert.equal(triggerRef.current, teaserTarget, 'the clicked trigger should be retained for overlay focus');
assert.deepEqual(plain(analyticsCalls), [
  { event: 'demo_open', properties: { source: 'hero' } },
  { event: 'demo_open', properties: { source: 'teaser' } },
], 'hero and teaser opens each produce one dedicated event');
assert.deepEqual(plain(aggregateCalls.map(({ options }) => JSON.parse(options.body).location)), [
  'demo_open_hero',
  'demo_open_teaser',
], 'dedicated origin counters should use stable backend keys');
assert.ok(aggregateCalls.every(({ options }) => options.body.includes('"sessionId"') === false));

consentWindow.Cookiebot.consent.statistics = false;
heroClick({ currentTarget: heroTarget });
assert.equal(analyticsCalls.length, 2, 'denied statistics consent suppresses the open event');
assert.equal(aggregateCalls.length, 2, 'denied statistics consent suppresses the API counter');
consentWindow.Cookiebot.consent.statistics = true;
teaserClick({ currentTarget: teaserTarget });
consentWindow.Cookiebot.consent.statistics = false; // revoke without reloading
heroClick({ currentTarget: heroTarget });
assert.equal(analyticsCalls.length, 3, 'revocation suppresses subsequent opens immediately');
assert.equal(aggregateCalls.length, 3, 'revocation suppresses subsequent API counters immediately');
assert.equal(aggregateCalls.some(({ options }) => JSON.parse(options.body).location === 'hero_secondary'), false,
  'new hero opens must not be duplicated into the historical platform CTA key');

const dashboardSource = readFileSync(dashboardDataPath, 'utf8');
const dashboardData = evaluate(dashboardSource, dashboardDataPath);
const sampleCounters = [
  { location: 'hero_primary', count: 7 },
  { location: 'hero_secondary', count: 3 }, // historical demo attribution remains visible
  { location: 'demo_open_hero', count: 11 },
  { location: 'demo_open_teaser', count: 5 },
  { location: 'demo_section_view', count: 20 },
  { location: 'demo_video_start_auto_initial', count: 8 },
  { location: 'demo_video_start_manual_replay', count: 2 },
  { location: 'demo_video_complete_auto_initial', count: 4 },
];
assert.deepEqual(plain(dashboardData.platformCtaRows(sampleCounters).map((row) => row.location)), [
  'hero_primary',
  'hero_secondary',
], 'demo opens and playback events must not be included in platform CTA totals');
assert.deepEqual(plain(dashboardData.demoOpenCounts(sampleCounters)), { total: 16, hero: 11, teaser: 5 });
assert.deepEqual(plain(dashboardData.demoViewingCounts(sampleCounters)), { starts: 10, completions: 4 },
  'video viewing totals must continue to use only real playback start/completion counters');

const apiSource = readFileSync(path.join(rootDir, 'artifacts/api-server/src/routes/analytics.ts'), 'utf8');
assert.ok(apiSource.includes('/^demo_open_(hero|teaser)$/.test(location)'),
  'API must classify opening counters as demo events');

console.log('Demo open analytics checks passed.');
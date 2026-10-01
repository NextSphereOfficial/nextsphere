#!/usr/bin/env node

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '../..');
const requireFromRoot = createRequire(path.join(rootDir, 'package.json'));
const ts = requireFromRoot('typescript');
const componentPath = path.join(rootDir, 'artifacts/nextsphere-site/src/components/DemoVideo.tsx');
const sessionPath = path.join(rootDir, 'artifacts/nextsphere-site/src/lib/demoWatchSession.ts');
const analyticsPath = path.join(rootDir, 'artifacts/nextsphere-site/src/lib/trackCta.ts');
const consentPath = path.join(rootDir, 'artifacts/nextsphere-site/src/lib/analyticsConsent.ts');
const overlayPath = path.join(rootDir, 'artifacts/nextsphere-site/src/components/DemoOverlay.tsx');
const componentSource = readFileSync(componentPath, 'utf8');
const baseDeclaration = 'const BASE = import.meta.env.BASE_URL;';
assert.equal(componentSource.split(baseDeclaration).length - 1, 1, 'DemoVideo BASE declaration changed');
assert.match(componentSource, /declare\s+const\s+__NEXTSPHERE_DEMO_PORTRAIT__/, 'compile-time PORTRAIT declaration changed');
assert.match(componentSource, /function\s+DemoVideo\s*\(\s*\{\s*watchSession\b/, 'DemoVideo must accept the shared watch session prop');

function transpile(source, fileName, jsx = false) {
  const compilerOptions = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  };
  if (jsx) {
    compilerOptions.jsx = ts.JsxEmit.React;
    compilerOptions.jsxFactory = 'jsx';
  }
  const result = ts.transpileModule(source, {
    fileName,
    compilerOptions,
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
  assert.deepEqual(errors, [], errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n'));
  return result.outputText;
}

const overlaySource = readFileSync(overlayPath, 'utf8');
const overlayAst = ts.createSourceFile(overlayPath, overlaySource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let overlayCtaHandlerText = null;
function inspectOverlayNode(node) {
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
    const isDemoLink = node.tagName.getText(overlayAst) === 'a'
      && node.attributes.properties.some((attribute) =>
        ts.isJsxAttribute(attribute)
        && attribute.name.getText(overlayAst) === 'data-testid'
        && ts.isStringLiteral(attribute.initializer)
        && attribute.initializer.text === 'demo-cta');
    if (isDemoLink) {
      const click = node.attributes.properties.find((attribute) =>
        ts.isJsxAttribute(attribute) && attribute.name.getText(overlayAst) === 'onClick');
      if (click && ts.isJsxAttribute(click) && click.initializer && ts.isJsxExpression(click.initializer)) {
        const handler = click.initializer.expression;
        if (handler && ts.isArrowFunction(handler)
          && ts.isCallExpression(handler.body)
          && handler.body.expression.getText(overlayAst) === 'trackCta'
          && handler.body.arguments.length === 1
          && ts.isStringLiteral(handler.body.arguments[0])
          && handler.body.arguments[0].text === 'demo') {
          overlayCtaHandlerText = handler.getText(overlayAst);
        }
      }
    }
  }
  ts.forEachChild(node, inspectOverlayNode);
}
inspectOverlayNode(overlayAst);
assert.ok(overlayCtaHandlerText, 'the actual DemoOverlay CTA handler must call trackCta("demo")');

const sessionModule = { exports: {} };
vm.runInNewContext(transpile(readFileSync(sessionPath, 'utf8'), sessionPath), {
  exports: sessionModule.exports,
  module: sessionModule,
  require(specifier) {
    throw new Error(`Unexpected demoWatchSession import: ${specifier}`);
  },
}, { filename: sessionPath });
const { DemoWatchSession } = sessionModule.exports;

const componentOutput = transpile(componentSource.replace(baseDeclaration, "const BASE = '/';"), componentPath, true);

function makeHarness({
  viewportWidth = 1024,
  portraitMetadata = null,
  fullscreenEnabled = true,
  fullscreenReject = false,
  session = new DemoWatchSession(),
  playFailures = [],
} = {}) {
  const hooks = [];
  const observers = [];
  const documentListeners = new Map();
  const mediaQueries = [];
  const analyticsCalls = [];
  const aggregateCalls = [];
  const playOutcomes = [...playFailures];
  let cursor = 0;
  let effectsToRun = [];
  let tree;
  let videoProps;
  let player;
  let dialogFullscreenRequests = 0;
  let playerFullscreenRequests = 0;
  const videoListeners = new Map();

  const video = {
    attributes: new Map(),
    currentTime: 12,
    ended: false,
    paused: true,
    playCalls: 0,
    pauseCalls: 0,
    loadCalls: 0,
    addEventListener(type, listener) {
      const listeners = videoListeners.get(type) ?? new Set();
      listeners.add(listener);
      videoListeners.set(type, listeners);
    },
    removeEventListener(type, listener) {
      videoListeners.get(type)?.delete(listener);
    },
    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    },
    setAttribute(name, value) {
      this.attributes.set(name, String(value));
    },
    removeAttribute(name) {
      this.attributes.delete(name);
    },
    play() {
      this.playCalls += 1;
      this.paused = false;
      this.ended = false;
      const outcome = playOutcomes.shift();
      if (outcome) {
        this.paused = true;
        return Promise.reject(outcome);
      }
      return Promise.resolve();
    },
    pause() {
      this.pauseCalls += 1;
      this.paused = true;
    },
    load() {
      this.loadCalls += 1;
    },
  };

  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = null;
      this.disconnected = false;
      observers.push(this);
    }
    observe(element) {
      this.observed = element;
    }
    disconnect() {
      this.disconnected = true;
    }
    trigger(entry) {
      this.callback([entry]);
    }
  }

  const document = {
    hidden: false,
    fullscreenEnabled,
    fullscreenElement: null,
    getElementById() {
      return null;
    },
    addEventListener(type, listener) {
      const listeners = documentListeners.get(type) ?? new Set();
      listeners.add(listener);
      documentListeners.set(type, listeners);
    },
    removeEventListener(type, listener) {
      documentListeners.get(type)?.delete(listener);
    },
    dispatchEvent(type) {
      for (const listener of [...(documentListeners.get(type) ?? [])]) listener();
    },
    exitFullscreen() {
      document.fullscreenElement = null;
      document.dispatchEvent('fullscreenchange');
      return Promise.resolve();
    },
  };
  const dialog = {
    requestFullscreen() {
      if (fullscreenReject) return Promise.reject(new Error('Fullscreen denied'));
      dialogFullscreenRequests += 1;
      document.fullscreenElement = dialog;
      document.dispatchEvent('fullscreenchange');
      return Promise.resolve();
    },
  };
  player = {
    closest(selector) {
      return selector === '[role="dialog"]' ? dialog : null;
    },
    requestFullscreen() {
      playerFullscreenRequests += 1;
      if (fullscreenReject) return Promise.reject(new Error('Fullscreen denied'));
      document.fullscreenElement = player;
      document.dispatchEvent('fullscreenchange');
      return Promise.resolve();
    },
  };
  const window = {
    Cookiebot: { consent: { statistics: true } },
    localStorage: { getItem: () => null },
    IntersectionObserver: FakeIntersectionObserver,
    location: { hash: '' },
    matchMedia(query) {
      const media = {
        media: query,
        matches: query === '(max-width: 639px)' && viewportWidth <= 639,
        listeners: new Set(),
        addEventListener(type, listener) {
          if (type === 'change') this.listeners.add(listener);
        },
        removeEventListener(type, listener) {
          if (type === 'change') this.listeners.delete(listener);
        },
      };
      mediaQueries.push(media);
      return media;
    },
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
  };

  const consentModule = { exports: {} };
  vm.runInNewContext(transpile(readFileSync(consentPath, 'utf8'), consentPath), {
    document,
    exports: consentModule.exports,
    module: consentModule,
    window,
  }, { filename: consentPath });

  const analyticsModule = { exports: {} };
  const analyticsSource = readFileSync(analyticsPath, 'utf8');
  const analyticsBaseDeclaration = "const BASE = import.meta.env.BASE_URL.replace(/\\/$/, '');";
  assert.equal(analyticsSource.split(analyticsBaseDeclaration).length - 1, 1, 'analytics BASE declaration changed');
  vm.runInNewContext(transpile(analyticsSource.replace(analyticsBaseDeclaration, "const BASE = '';"), analyticsPath), {
    document,
    exports: analyticsModule.exports,
    fetch(url, options) {
      aggregateCalls.push({ url, options });
      return Promise.resolve({ ok: true });
    },
    module: analyticsModule,
    require(specifier) {
      if (specifier === '@vercel/analytics') {
        return { track: (event, properties) => analyticsCalls.push({ event, properties: JSON.parse(JSON.stringify(properties)) }) };
      }
      if (specifier === './analyticsConsent') return consentModule.exports;
      throw new Error(`Unexpected analytics import: ${specifier}`);
    },
    window,
  }, { filename: analyticsPath });
  const overlayCtaHandler = vm.runInNewContext(`(${overlayCtaHandlerText})`, {
    trackCta: analyticsModule.exports.trackCta,
  }, { filename: overlayPath });

  const hooksApi = {
    useRef(initialValue) {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { kind: 'ref', current: initialValue };
      return hooks[index];
    },
    useState(initialValue) {
      const index = cursor++;
      if (!hooks[index]) {
        const lazy = typeof initialValue === 'function';
        hooks[index] = {
          kind: 'state',
          lazy,
          initial: lazy ? initialValue() : initialValue,
          value: lazy ? undefined : initialValue,
          initializations: lazy ? 1 : 0,
        };
        if (lazy) hooks[index].value = hooks[index].initial;
      }
      const slot = hooks[index];
      return [slot.value, (next) => {
        slot.value = typeof next === 'function' ? next(slot.value) : next;
      }];
    },
    useCallback(callback, dependencies) {
      const index = cursor++;
      const previous = hooks[index];
      if (previous && dependencies && previous.dependencies
        && dependencies.length === previous.dependencies.length
        && dependencies.every((value, i) => Object.is(value, previous.dependencies[i]))) {
        return previous.callback;
      }
      hooks[index] = { kind: 'callback', callback, dependencies };
      return callback;
    },
    useEffect(effect, dependencies) {
      const index = cursor++;
      const previous = hooks[index];
      const changed = !previous || !dependencies || !previous.dependencies
        || dependencies.length !== previous.dependencies.length
        || dependencies.some((value, i) => !Object.is(value, previous.dependencies[i]));
      hooks[index] = previous ?? { kind: 'effect', dependencies: undefined, cleanup: undefined };
      if (changed) effectsToRun.push({ index, effect, dependencies });
    },
  };

  const icon = () => null;
  const module = { exports: {} };
  const context = {
    DOMException,
    document,
    exports: module.exports,
    IntersectionObserver: FakeIntersectionObserver,
    __NEXTSPHERE_DEMO_PORTRAIT__: portraitMetadata,
    jsx: (type, props, ...children) => ({
      type,
      props: children.length
        ? { ...props, children: children.length === 1 ? children[0] : children }
        : props ?? {},
    }),
    jsxs: (type, props, ...children) => ({
      type,
      props: children.length
        ? { ...props, children: children.length === 1 ? children[0] : children }
        : props ?? {},
    }),
    module,
    require(specifier) {
      if (specifier === 'react') return hooksApi;
      if (specifier === 'lucide-react') {
        return { Play: icon, Pause: icon, RotateCcw: icon, AlertTriangle: icon, Loader2: icon,
          Clock: icon, MessageCircle: icon, SlidersHorizontal: icon, Maximize: icon, Minimize: icon };
      }
      if (specifier === '../hooks/useTranslation') return { useTranslation: () => ({ t: (key) => key }) };
      if (specifier === '../lib/externalLinks') return { PLATFORM_URL: 'https://example.invalid' };
      if (specifier === '../lib/trackCta') return analyticsModule.exports;
      if (specifier === '../lib/demoWatchSession') return sessionModule.exports;
      throw new Error(`Unexpected DemoVideo import: ${specifier}`);
    },
    window,
  };
  vm.runInNewContext(componentOutput, context, { filename: componentPath });
  const DemoVideo = module.exports.default;

  function findNode(node, predicate) {
    if (!node || typeof node !== 'object') return null;
    if (predicate(node)) return node;
    const children = node.props?.children;
    for (const child of Array.isArray(children) ? children : [children]) {
      const result = findNode(child, predicate);
      if (result) return result;
    }
    return null;
  }

  function findAllNodes(node, predicate, result = []) {
    if (!node || typeof node !== 'object') return result;
    if (predicate(node)) result.push(node);
    const children = node.props?.children;
    for (const child of Array.isArray(children) ? children : [children]) findAllNodes(child, predicate, result);
    return result;
  }

  function render() {
    cursor = 0;
    effectsToRun = [];
    tree = DemoVideo({ watchSession: session });
    const playerNode = findNode(tree, (node) => node.type === 'div' && node.props.className?.includes('demo-player'));
    const videoNode = findNode(tree, (node) => node.type === 'video');
    assert.ok(playerNode && videoNode, 'expected mounted player and video in DemoVideo output');
    playerNode.props.ref.current = player;
    videoNode.props.ref.current = video;
    videoProps = videoNode.props;
    if (videoNode.props.src) video.setAttribute('src', videoNode.props.src);
    else video.removeAttribute('src');

    for (const pending of effectsToRun) {
      const slot = hooks[pending.index];
      slot.cleanup?.();
      slot.dependencies = pending.dependencies;
      slot.cleanup = pending.effect();
    }
    return tree;
  }

  function findByTestId(testId) {
    const node = findNode(tree, (candidate) => candidate.props?.['data-testid'] === testId);
    assert.ok(node, `expected element with data-testid=${testId}`);
    return node;
  }

  function dispatchVideo(name, extra = {}) {
    const handler = videoProps?.[name];
    assert.equal(typeof handler, 'function', `expected video ${name} handler`);
    handler({ currentTarget: video, ...extra });
  }

  function unmount() {
    for (const hook of hooks) {
      if (hook?.kind === 'effect') {
        hook.cleanup?.();
        hook.cleanup = undefined;
      }
    }
  }

  return {
    aggregateCalls,
    analyticsCalls,
    document,
    dispatchVideo,
    clickOverlayCta: overlayCtaHandler,
    findByTestId,
    findNode(predicate) {
      return findNode(tree, predicate);
    },
    findAllNodes(predicate) {
      return findAllNodes(tree, predicate);
    },
    get lazyInitializations() {
      return hooks.filter((hook) => hook?.kind === 'state' && hook.lazy)
        .reduce((total, hook) => total + hook.initializations, 0);
    },
    get mediaQueries() {
      return mediaQueries;
    },
    get observers() {
      return observers;
    },
    get fullscreenDialog() {
      return dialog;
    },
    get dialogFullscreenRequests() {
      return dialogFullscreenRequests;
    },
    get playerFullscreenRequests() {
      return playerFullscreenRequests;
    },
    get portrait() {
      return hooks.find((hook) => hook?.kind === 'state' && hook.lazy)?.value;
    },
    get status() {
      return hooks.find((hook) => hook?.kind === 'state' && hook.initial === 'loading')?.value;
    },
    get video() {
      return video;
    },
    get videoProps() {
      return videoProps;
    },
    get videoCount() {
      return findAllNodes(tree, (node) => node.type === 'video').length;
    },
    render,
    setHidden(value) {
      document.hidden = value;
    },
    setAnalyticsConsent(value) {
      window.Cookiebot = { consent: { statistics: value } };
    },
    setViewportWidth(value) {
      viewportWidth = value;
      for (const media of mediaQueries) {
        const matches = media.media === '(max-width: 639px)' && viewportWidth <= 639;
        if (matches === media.matches) continue;
        media.matches = matches;
        for (const listener of [...media.listeners]) listener();
      }
    },
    unmount,
  };
}

async function drainPlayPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

const portraitMetadata = {
  src: 'media/nextsphere-demo-vertical.mp4',
  poster: null,
  width: 1080,
  height: 1920,
};

{
  const harness = makeHarness();
  harness.render();
  assert.equal(harness.video.getAttribute('src'), '/media/nextsphere-demo.mp4', 'source must be attached on the first mounted render');
  assert.equal(harness.videoProps.src, '/media/nextsphere-demo.mp4');
  assert.equal(harness.videoProps.muted, true, 'opened player should request muted playback');
  assert.equal(harness.videoProps.autoPlay, undefined, 'playback should be initiated by the mounted player, not autoplay markup');
  assert.notEqual(harness.videoProps.preload, 'auto', 'the player must not preload media');
  assert.equal(harness.status, 'loading', 'a newly mounted player should show its loading state');
  assert.equal(harness.videoCount, 1, 'only one video element/source should be mounted');
  assert.equal(harness.findNode((node) => node.type === 'source'), null, 'do not add a second source element');
  assert.equal(harness.observers.length, 0, 'mounted player must not create intersection observers');
  assert.equal(harness.video.playCalls, 1, 'opening the player should request playback immediately');
  await drainPlayPromises();
  assert.deepEqual(harness.analyticsCalls, [], 'a successful play() promise is not evidence that playback started');
  assert.equal(harness.aggregateCalls.length, 0, 'no analytics aggregation before the actual playing event');

  harness.dispatchVideo('onPlaying');
  assert.deepEqual(harness.analyticsCalls, [{
    event: 'demo_video_start',
    properties: { mode: 'manual', watch: 'initial', format: 'landscape' },
  }], 'analytics should be recorded only from the actual playing event');
  assert.equal(harness.aggregateCalls.length, 1, 'actual playing should use the imported analytics module');
}

{
  const harness = makeHarness({ viewportWidth: 390, portraitMetadata });
  harness.render();
  assert.equal(harness.portrait, true, 'phone width should synchronously select portrait presentation on mount');
  assert.equal(harness.videoProps.src, '/media/nextsphere-demo-vertical.mp4', 'portrait source must be attached on first render');
  assert.equal(harness.videoProps.poster, undefined, 'missing portrait poster should not invent a poster');
  assert.equal(harness.videoProps['data-format'], 'portrait');
  assert.equal(harness.lazyInitializations, 1, 'portrait selection should use a single lazy mount initializer');
  assert.ok(harness.mediaQueries.some((media) => media.media === '(max-width: 639px)'), 'portrait choice should inspect the mount viewport');
  assert.equal(harness.mediaQueries.find((media) => media.media === '(max-width: 639px)').listeners.size, 0, 'portrait choice must not install resize listeners');

  harness.render();
  harness.setViewportWidth(900);
  harness.render();
  assert.equal(harness.portrait, true, 'presentation format must remain frozen for the mounted session');
  assert.equal(harness.videoProps.src, '/media/nextsphere-demo-vertical.mp4', 'viewport changes must not swap a mounted video source');
  assert.equal(harness.videoProps['data-format'], 'portrait');
  assert.equal(harness.lazyInitializations, 1, 'rerendering must not re-evaluate the lazy initializer');
}

{
  const harness = makeHarness({ viewportWidth: 1440, portraitMetadata });
  harness.render();
  assert.equal(harness.portrait, false, 'desktop width should select landscape presentation');
  assert.equal(harness.videoProps.src, '/media/nextsphere-demo.mp4');
  assert.equal(harness.videoProps['data-format'], 'landscape');
}

{
  const harness = makeHarness({ viewportWidth: 390, portraitMetadata: null });
  harness.render();
  assert.equal(harness.portrait, false, 'missing portrait metadata should retain landscape fallback on mobile');
  assert.equal(harness.videoProps.src, '/media/nextsphere-demo.mp4');
}

{
  const harness = makeHarness({ playFailures: [new DOMException('blocked', 'NotAllowedError')] });
  harness.render();
  await drainPlayPromises();
  assert.equal(harness.status, 'paused', 'NotAllowedError should settle to paused');
  assert.deepEqual(harness.analyticsCalls, [], 'blocked playback must not create analytics');
}

{
  const harness = makeHarness({ playFailures: [new DOMException('cancelled', 'AbortError')] });
  harness.render();
  await drainPlayPromises();
  assert.equal(harness.status, 'loading', 'AbortError should be ignored without turning into a visible error');
  assert.deepEqual(harness.analyticsCalls, [], 'aborted playback must not create analytics');
}

{
  const harness = makeHarness({ playFailures: [new Error('decoder rejected playback')] });
  harness.render();
  await drainPlayPromises();
  assert.equal(harness.status, 'error', 'unexpected playback rejection should surface as an error');
  harness.render();
  assert.ok(harness.findByTestId('demo-retry'), 'error state should retain the retry control');
  const playsBeforeRetry = harness.video.playCalls;
  harness.findByTestId('demo-retry').props.onClick();
  await drainPlayPromises();
  assert.equal(harness.video.playCalls, playsBeforeRetry + 1, 'retry should request playback again');
}

{
  const harness = makeHarness();
  harness.setAnalyticsConsent(false);
  harness.clickOverlayCta();
  assert.deepEqual(harness.analyticsCalls, [], 'the actual overlay CTA handler must honor denied analytics consent');
  assert.equal(harness.aggregateCalls.length, 0, 'denied consent must not aggregate the actual overlay CTA');

  harness.setAnalyticsConsent(true);
  harness.clickOverlayCta();
  assert.deepEqual(harness.analyticsCalls, [{
    event: 'cta_click',
    properties: { location: 'demo' },
  }], 'the actual overlay CTA should use the consent-gated demo attribution when accepted');
  assert.equal(harness.aggregateCalls.length, 1);

  harness.setAnalyticsConsent(false); // Consent can be revoked without a page reload.
  harness.clickOverlayCta();
  assert.equal(harness.analyticsCalls.length, 1, 'revocation must immediately stop CTA analytics');
  assert.equal(harness.aggregateCalls.length, 1, 'revocation must immediately stop CTA aggregation');
}

{
  const harness = makeHarness();
  harness.render();
  harness.dispatchVideo('onPlaying');
  const toggle = harness.findByTestId('demo-toggle');
  toggle.props.onClick();
  assert.equal(harness.video.paused, true, 'pause control should pause the video');
  harness.dispatchVideo('onPause');
  harness.render();
  assert.equal(harness.status, 'paused');

  toggle.props.onClick();
  await drainPlayPromises();
  harness.dispatchVideo('onPlaying');
  assert.equal(harness.analyticsCalls.length, 1, 'resuming the same watch should not count another start');

  harness.setHidden(true);
  harness.document.dispatchEvent('visibilitychange');
  assert.equal(harness.video.paused, true, 'hiding the document should pause playback');
  harness.render();
  assert.equal(harness.status, 'paused');
  assert.equal(harness.analyticsCalls.length, 1);

  const pauseCount = harness.video.pauseCalls;
  harness.setHidden(false);
  toggle.props.onClick();
  await drainPlayPromises();
  harness.dispatchVideo('onPlaying');
  harness.unmount();
  assert.ok(harness.video.pauseCalls > pauseCount, 'unmount should pause an active video');
  assert.equal(harness.video.getAttribute('src'), null, 'unmount should remove the media source');
  assert.equal(harness.analyticsCalls.some((call) => call.event === 'demo_video_complete'), false, 'closing mid-watch must not fabricate completion');
}

{
  const session = new DemoWatchSession();
  session.restart(); // DemoOverlay resets the shared session whenever it opens.
  const first = makeHarness({ session });
  first.render();
  first.dispatchVideo('onPlaying');
  first.unmount();
  assert.equal(first.analyticsCalls.filter((call) => call.event === 'demo_video_complete').length, 0);

  session.restart(); // A second open is a new watch while retaining everStarted.
  const reopened = makeHarness({ session });
  reopened.render();
  reopened.dispatchVideo('onPlaying');
  assert.deepEqual(reopened.analyticsCalls, [{
    event: 'demo_video_start',
    properties: { mode: 'manual', watch: 'replay', format: 'landscape' },
  }], 'a remount with the shared session should be counted as a replay');
  reopened.unmount();
  assert.equal(reopened.analyticsCalls.some((call) => call.event === 'demo_video_complete'), false, 'closing a reopened watch must not fabricate completion');
}

{
  const harness = makeHarness();
  harness.render();
  harness.dispatchVideo('onPlaying');
  harness.video.currentTime = 27;
  harness.findByTestId('demo-replay').props.onClick();
  await drainPlayPromises();
  assert.equal(harness.video.currentTime, 0, 'replay should reset the playhead');
  assert.equal(harness.video.playCalls, 2, 'replay should request playback again');
  harness.dispatchVideo('onPlaying');
  assert.equal(harness.analyticsCalls.length, 2, 'replay should count one new actual start');
  assert.equal(harness.analyticsCalls[1].properties.watch, 'replay');
  harness.video.ended = true;
  harness.dispatchVideo('onEnded');
  assert.equal(harness.analyticsCalls.filter((call) => call.event === 'demo_video_complete').length, 1, 'a real ended event should complete the replay');
}

{
  const harness = makeHarness();
  harness.render();
  harness.render(); // Reflect fullscreen capability discovered after the video ref is attached.
  await harness.findByTestId('demo-fullscreen').props.onClick();
  harness.render();
  assert.equal(harness.document.fullscreenElement, harness.fullscreenDialog, 'fullscreen should target the containing Radix dialog');
  assert.equal(harness.dialogFullscreenRequests, 1, 'dialog should receive the fullscreen request');
  assert.equal(harness.playerFullscreenRequests, 0, 'fullscreen must not isolate only the player subtree');
  assert.equal(harness.findByTestId('demo-fullscreen').props['aria-pressed'], true, 'fullscreen entry should update state');
  await harness.findByTestId('demo-fullscreen').props.onClick();
  harness.render();
  assert.equal(harness.findByTestId('demo-fullscreen').props['aria-pressed'], false, 'fullscreen exit should update state');
}

{
  const harness = makeHarness({ fullscreenReject: true });
  harness.render();
  harness.render();
  await harness.findByTestId('demo-fullscreen').props.onClick();
  harness.render();
  const notice = harness.findNode((node) => node.type === 'p' && node.props.role === 'status');
  assert.equal(notice?.props.children, 'demo.fullscreenError', 'rejected fullscreen should show a nonfatal notice');
  assert.ok(harness.findByTestId('demo-toggle'), 'fullscreen rejection should leave the player controls usable');
}

console.log('DemoVideo lifecycle regression checks passed.');
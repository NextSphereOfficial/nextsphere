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
const sourcePath = path.join(rootDir, 'artifacts/nextsphere-site/src/components/DemoVideo.tsx');
const componentSource = readFileSync(sourcePath, 'utf8');

// Vite normally replaces this compile-time constant. Replace only that exact
// declaration so the real component can be transpiled and evaluated by Node.
const baseDeclaration = 'const BASE = import.meta.env.BASE_URL;';
assert.equal(componentSource.split(baseDeclaration).length - 1, 1, 'DemoVideo BASE declaration changed');
const transpiled = ts.transpileModule(componentSource.replace(baseDeclaration, "const BASE = '/';"), {
  compilerOptions: {
    jsx: ts.JsxEmit.React,
    jsxFactory: 'jsx',
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
  },
  reportDiagnostics: true,
});
const errors = (transpiled.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
assert.deepEqual(errors, [], errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')).join('\n'));

function makeHarness({ hidden = false, reducedMotion = false } = {}) {
  const hooks = [];
  const observers = [];
  const documentListeners = new Map();
  let cursor = 0;
  let effectsToRun = [];

  const video = {
    attributes: new Map(),
    currentTime: 12,
    ended: false,
    paused: true,
    playCalls: 0,
    pauseCalls: 0,
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
      return Promise.resolve();
    },
    pause() {
      this.pauseCalls += 1;
      this.paused = true;
    },
    load() {},
  };

  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.observed = null;
      observers.push(this);
    }
    observe(element) {
      this.observed = element;
    }
    disconnect() {}
    trigger(entry) {
      this.callback([entry]);
    }
  }

  const mediaListeners = new Set();
  const mediaQuery = {
    matches: reducedMotion,
    addEventListener(type, listener) {
      if (type === 'change') mediaListeners.add(listener);
    },
    removeEventListener(type, listener) {
      if (type === 'change') mediaListeners.delete(listener);
    },
  };
  const document = {
    hidden,
    addEventListener(type, listener) {
      const listeners = documentListeners.get(type) ?? new Set();
      listeners.add(listener);
      documentListeners.set(type, listeners);
    },
    removeEventListener(type, listener) {
      documentListeners.get(type)?.delete(listener);
    },
    dispatchEvent(type) {
      for (const listener of documentListeners.get(type) ?? []) listener();
    },
  };
  const window = {
    IntersectionObserver: FakeIntersectionObserver,
    location: { hash: '' },
    matchMedia: () => mediaQuery,
    requestAnimationFrame: () => 1,
    cancelAnimationFrame() {},
  };

  const react = {
    useRef(initialValue) {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { kind: 'ref', current: initialValue };
      return hooks[index];
    },
    useState(initialValue) {
      const index = cursor++;
      if (!hooks[index]) hooks[index] = { kind: 'state', value: initialValue };
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
      if (specifier === 'react') return react;
      if (specifier === 'lucide-react') {
        return { Play: icon, Pause: icon, RotateCcw: icon, AlertTriangle: icon, Loader2: icon,
          Clock: icon, MessageCircle: icon, SlidersHorizontal: icon };
      }
      if (specifier === '../hooks/useTranslation') return { useTranslation: () => ({ t: (key) => key }) };
      if (specifier === '../lib/externalLinks') return { PLATFORM_URL: 'https://example.invalid' };
      if (specifier === '../lib/trackCta') return { trackCta() {} };
      throw new Error(`Unexpected DemoVideo import: ${specifier}`);
    },
    window,
  };
  vm.runInNewContext(transpiled.outputText, context, { filename: sourcePath });
  const DemoVideo = module.exports.default;

  let tree;
  let section;
  let frame;
  let videoProps;

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

  function render() {
    cursor = 0;
    effectsToRun = [];
    tree = DemoVideo();
    const sectionNode = findNode(tree, (node) => node.type === 'section' && node.props.id === 'demo');
    const frameNode = findNode(tree, (node) => node.type === 'div' && node.props.role === 'region');
    const videoNode = findNode(tree, (node) => node.type === 'video');
    assert.ok(sectionNode && frameNode && videoNode, 'expected section, frame and video in DemoVideo output');
    sectionNode.props.ref.current = section ??= {};
    frameNode.props.ref.current = frame ??= {};
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

  function getFrameObserver() {
    const observer = observers.find((candidate) => candidate.observed === frame);
    assert.ok(observer, 'expected frame IntersectionObserver to be installed');
    return observer;
  }

  function enterFrame() {
    getFrameObserver().trigger({ isIntersecting: true, intersectionRatio: 0.5 });
  }

  function exitFrame() {
    getFrameObserver().trigger({ isIntersecting: false, intersectionRatio: 0 });
  }

  return {
    document,
    enterFrame,
    exitFrame,
    findByTestId,
    get status() {
      return hooks.filter((hook) => hook?.kind === 'state')[1]?.value;
    },
    get attached() {
      return hooks.filter((hook) => hook?.kind === 'state')[0]?.value;
    },
    get video() {
      return video;
    },
    get videoProps() {
      return videoProps;
    },
    render,
    setHidden(value) {
      document.hidden = value;
    },
  };
}

async function drainPlayPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

function testQueuedCancellation(mode, reason) {
  const harness = makeHarness({ reducedMotion: mode === 'manual' });
  harness.render();
  harness.enterFrame();
  if (mode === 'manual') harness.findByTestId('demo-toggle').props.onClick();

  assert.equal(harness.video.getAttribute('src'), null, `${mode} should still be queued before src commit`);
  if (reason === 'hidden') {
    harness.setHidden(true);
    harness.document.dispatchEvent('visibilitychange');
  } else {
    harness.exitFrame();
  }

  harness.render();
  assert.ok(harness.video.getAttribute('src'), 'attached render should commit the video source');
  assert.equal(harness.video.playCalls, 0, `${mode} queued playback should be cancelled on ${reason}`);
  assert.equal(harness.status, 'paused');
}

for (const mode of ['auto', 'manual']) {
  for (const reason of ['hidden', 'frame exit']) testQueuedCancellation(mode, reason);
}

for (const mode of ['auto', 'manual']) {
  const harness = makeHarness({ reducedMotion: mode === 'manual' });
  harness.render();
  harness.enterFrame();
  if (mode === 'manual') harness.findByTestId('demo-toggle').props.onClick();
  harness.setHidden(true); // Deliberately do not dispatch visibilitychange before React commits src.
  harness.render();
  assert.ok(harness.video.getAttribute('src'), `${mode} source should commit while hidden`);
  assert.equal(harness.video.playCalls, 0, `${mode} queued playback must not start when src commits hidden`);
  assert.equal(harness.status, 'paused');
}

{
  const harness = makeHarness({ reducedMotion: true });
  harness.render();
  harness.enterFrame();
  assert.equal(harness.video.playCalls, 0, 'reduced motion should suppress automatic playback');
  assert.equal(harness.attached, false, 'reduced-motion autoplay should not even attach the source');
}

{
  const harness = makeHarness({ reducedMotion: true });
  harness.render();
  harness.enterFrame();
  harness.findByTestId('demo-toggle').props.onClick();
  harness.render();
  await drainPlayPromises();
  assert.equal(harness.video.playCalls, 1, 'manual play should work with reduced motion enabled');
  assert.ok(harness.video.getAttribute('src'));

  harness.video.currentTime = 27;
  harness.findByTestId('demo-replay').props.onClick();
  await drainPlayPromises();
  assert.equal(harness.video.currentTime, 0, 'replay should reset the playhead');
  assert.equal(harness.video.playCalls, 2, 'replay should request playback again');
}

{
  const harness = makeHarness();
  harness.render();
  harness.enterFrame();
  harness.render();
  await drainPlayPromises();
  assert.equal(harness.video.playCalls, 1, 'visible frame should start automatic playback');

  harness.findByTestId('demo-toggle').props.onClick();
  assert.equal(harness.video.paused, true, 'manual toggle should pause playback');
  harness.exitFrame();
  harness.enterFrame();
  assert.equal(harness.video.playCalls, 1, 're-entry must retain the user pause');

  harness.findByTestId('demo-toggle').props.onClick();
  await drainPlayPromises();
  assert.equal(harness.video.playCalls, 2, 'manual play should resume after a retained pause');
}

console.log('DemoVideo lifecycle regression checks passed.');
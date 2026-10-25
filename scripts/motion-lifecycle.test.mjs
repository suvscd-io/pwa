import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { bindScenePointer, observeSceneLayout } from "../src/hooks/sceneLifecycle.ts";

class Surface extends EventTarget {
  listeners = new Map();
  addEventListener(type, listener, options) {
    super.addEventListener(type, listener, options);
    const listeners = this.listeners.get(type) ?? new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }
  removeEventListener(type, listener, options) {
    super.removeEventListener(type, listener, options);
    this.listeners.get(type)?.delete(listener);
  }
  countListeners() {
    return [...this.listeners.values()].reduce((sum, listeners) => sum + listeners.size, 0);
  }
}

let originalGlobals;
let win;
let doc;
let page;
let frames;
let resizeObservers;
let mutationObservers;
let reads;
let rectangle;

beforeEach(() => {
  originalGlobals = new Map(["window", "ResizeObserver", "MutationObserver"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  frames = new Map();
  resizeObservers = [];
  mutationObservers = [];
  reads = 0;
  rectangle = { left: 0, top: 0, width: 1000, height: 800, bottom: 800 };
  let nextFrame = 0;
  win = Object.assign(new Surface(), {
    innerHeight: 900,
    requestAnimationFrame: (callback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  doc = Object.assign(new Surface(), { hidden: false });
  page = Object.assign(new Surface(), {
    ownerDocument: doc, isConnected: true, offsetWidth: 1000, offsetHeight: 2000,
    getBoundingClientRect: () => { reads++; return rectangle; },
  });
  globalThis.window = win;
  globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; resizeObservers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
    emit(width, height) { this.callback([{ target: this.target, contentRect: { width, height } }]); }
  };
  globalThis.MutationObserver = class {
    constructor(callback) { this.callback = callback; mutationObservers.push(this); }
    observe(target) { this.target = target; }
    disconnect() { this.disconnected = true; }
  };
});

afterEach(() => {
  for (const [key, descriptor] of originalGlobals) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else delete globalThis[key];
  }
});

function flushFrame() {
  const callbacks = [...frames.values()];
  frames.clear();
  callbacks.forEach((callback) => callback(0));
}

function pointer(x, y, type = "mouse") {
  page.dispatchEvent(Object.assign(new Event("pointermove"), {
    clientX: x, clientY: y, pointerType: type,
  }));
}

function assertListenersRemoved() {
  assert.equal(win.countListeners() + doc.countListeners() + page.countListeners(), 0);
}

test("layout refresh works without ResizeObserver or the Font Loading API", () => {
  globalThis.ResizeObserver = undefined;
  let refreshes = 0;
  const dispose = observeSceneLayout(page, () => refreshes++);
  flushFrame();
  assert.equal(refreshes, 1);

  page.offsetHeight += 120;
  mutationObservers[0].callback([]);
  page.dispatchEvent(new Event("click"));
  page.dispatchEvent(new Event("load"));
  assert.equal(frames.size, 1);
  flushFrame();
  assert.equal(refreshes, 2);

  page.dispatchEvent(new Event("click"));
  flushFrame();
  assert.equal(refreshes, 2, "unchanged layout must not trigger another refresh");
  dispose();
  assert.equal(mutationObservers[0].disconnected, true);
  assertListenersRemoved();
});

test("FAQ clicks still refresh when neither observer API is available", () => {
  globalThis.ResizeObserver = undefined;
  globalThis.MutationObserver = undefined;
  let refreshes = 0;
  const dispose = observeSceneLayout(page, () => refreshes++);
  flushFrame();
  page.offsetHeight += 100;
  page.dispatchEvent(new Event("click"));
  flushFrame();
  assert.equal(refreshes, 2);
  dispose();
  assertListenersRemoved();
});

test("resize notifications coalesce, deduplicate, and cancel during cleanup", () => {
  let refreshes = 0;
  const dispose = observeSceneLayout(page, () => refreshes++);
  resizeObservers[0].emit(1000, 2000);
  resizeObservers[0].emit(1000, 2000);
  assert.equal(frames.size, 1);
  flushFrame();
  assert.equal(refreshes, 1);
  resizeObservers[0].emit(1000, 2000);
  assert.equal(frames.size, 0);

  page.offsetHeight = 2100;
  resizeObservers[0].emit(1000, 2100);
  assert.equal(frames.size, 1);
  dispose();
  flushFrame();
  assert.equal(refreshes, 1);
  assert.equal(resizeObservers[0].disconnected, true);
  assertListenersRemoved();
});

test("hidden documents defer refresh, then measure the latest layout on return", () => {
  let refreshes = 0;
  const dispose = observeSceneLayout(page, () => refreshes++);
  flushFrame();
  doc.hidden = true;
  page.offsetHeight = 2200;
  resizeObservers[0].emit(1000, 2200);
  assert.equal(frames.size, 0);
  assert.equal(refreshes, 1);
  doc.hidden = false;
  doc.dispatchEvent(new Event("visibilitychange"));
  flushFrame();
  assert.equal(refreshes, 2);
  dispose();
});

test("font completion after teardown cannot schedule stale work", async () => {
  let finishFonts;
  doc.fonts = { ready: new Promise((resolve) => { finishFonts = resolve; }) };
  let refreshes = 0;
  const dispose = observeSceneLayout(page, () => refreshes++);
  flushFrame();
  dispose();
  finishFonts();
  await Promise.resolve();
  assert.equal(frames.size, 0);
  assert.equal(refreshes, 1);
  assertListenersRemoved();
});

test("pointer events use the latest position once per frame and reuse bounds", () => {
  const moves = [];
  const binding = bindScenePointer(page, (x, y) => moves.push([x, y]), () => {});
  for (let i = 0; i < 20; i++) pointer(i * 50, 400);
  assert.equal(frames.size, 1);
  assert.equal(reads, 0);
  flushFrame();
  assert.equal(moves.length, 1);
  assert.ok(Math.abs(moves[0][0] - 0.45) < 0.00001);
  assert.equal(moves[0][1], 0);
  assert.equal(reads, 1);
  pointer(500, 600);
  flushFrame();
  assert.equal(reads, 1, "ordinary pointer movement must not read geometry again");
  assert.deepEqual(moves.at(-1), [0, 0.25]);

  rectangle = { ...rectangle, top: -200, bottom: 600 };
  win.dispatchEvent(new Event("scroll"));
  pointer(500, 200);
  flushFrame();
  assert.equal(reads, 2);
  assert.deepEqual(moves.at(-1), [0, 0]);
  binding.dispose();
  assertListenersRemoved();
});

test("touch, hidden and offscreen movement does no animation work; cleanup cancels queued input", () => {
  let moves = 0;
  let settles = 0;
  const binding = bindScenePointer(page, () => moves++, () => settles++);
  pointer(10, 10, "touch");
  assert.equal(frames.size, 0);
  doc.hidden = true;
  pointer(10, 10);
  assert.equal(frames.size, 0);
  doc.hidden = false;
  rectangle = { ...rectangle, top: -900, bottom: -100 };
  pointer(10, 10);
  flushFrame();
  assert.equal(moves, 0);
  pointer(10, 10);
  binding.dispose();
  flushFrame();
  assert.equal(moves, 0);
  assert.equal(settles, 0);
  assertListenersRemoved();
});

test("leaving the hero cancels the pending position before settling", () => {
  let moves = 0;
  let settles = 0;
  const binding = bindScenePointer(page, () => moves++, () => settles++);
  pointer(100, 100);
  flushFrame();
  pointer(900, 700);
  page.dispatchEvent(new Event("pointerleave"));
  flushFrame();
  assert.equal(moves, 1);
  assert.equal(settles, 1);
  binding.dispose();
  assertListenersRemoved();
});

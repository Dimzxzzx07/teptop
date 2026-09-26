import {createTestRenderer} from 'teptop.js/testing';

export function renderView(document, view) {
  const renderer = createTestRenderer(document);
  const root = renderer.render(view);
  return {renderer, root, html: () => renderer.html(), cleanup: () => renderer.cleanup()};
}

export async function waitFor(assertion, options = {}) {
  const timeout = options.timeout ?? 1000;
  const interval = options.interval ?? 10;
  const started = Date.now();
  let lastError;
  while (Date.now() - started < timeout) {
    try { return assertion(); }
    catch (error) { lastError = error; await new Promise(resolve => setTimeout(resolve, interval)); }
  }
  throw lastError || new Error('Teptop waitFor timed out.');
}

export function createTestClock() {
  let now = 0;
  const timers = [];
  return {
    now: () => now,
    setTimeout(work, delay) { const timer = {at: now + delay, work}; timers.push(timer); return timer; },
    advanceBy(delay) {
      now += delay;
      const due = timers.filter(timer => timer.at <= now);
      const waiting = timers.filter(timer => timer.at > now);
      timers.splice(0, timers.length, ...waiting);
      due.forEach(timer => timer.work());
    },
  };
}

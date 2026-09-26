import assert from 'node:assert/strict';
import test from 'node:test';
import {createInspector, createPerformanceReporter} from '../src/index.js';

test('devtools inspector records traces and performance reports', async () => {
  const inspector = createInspector('test');
  inspector.record('state', {ready: true});
  inspector.trace('work', () => 42);
  assert.equal(inspector.snapshot().length, 2);
  const messages = [];
  await createPerformanceReporter(inspector, {info: (...args) => messages.push(args)} )('load', async () => 'done');
  assert.equal(messages.length, 1);
  inspector.clear();
  assert.equal(inspector.snapshot().length, 0);
});

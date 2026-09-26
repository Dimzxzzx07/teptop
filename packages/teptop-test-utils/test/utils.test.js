import assert from 'node:assert/strict';
import test from 'node:test';
import {createTestClock, waitFor} from '../src/index.js';

test('test clock preserves future timers', () => {
  const clock = createTestClock();
  const calls = [];
  clock.setTimeout(() => calls.push('early'), 10);
  clock.setTimeout(() => calls.push('late'), 30);
  clock.advanceBy(10);
  assert.deepEqual(calls, ['early']);
  clock.advanceBy(20);
  assert.deepEqual(calls, ['early', 'late']);
});

test('waitFor retries asynchronous assertions', async () => {
  let ready = false;
  setTimeout(() => { ready = true; }, 5);
  await waitFor(() => { assert.equal(ready, true); }, {interval: 2});
});

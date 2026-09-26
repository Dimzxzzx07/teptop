import assert from 'node:assert/strict';
import test from 'node:test';
import {createConcurrencyAdapter} from '../src/index.js';

test('concurrency adapter package exposes a working API', () => {
  const feature = createConcurrencyAdapter({enabled: true});
  assert.equal(feature.domain, 'concurrency');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

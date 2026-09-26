import assert from 'node:assert/strict';
import test from 'node:test';
import {createConcurrencyCore} from '../src/index.js';

test('concurrency core package exposes a working API', () => {
  const feature = createConcurrencyCore({enabled: true});
  assert.equal(feature.domain, 'concurrency');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

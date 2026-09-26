import assert from 'node:assert/strict';
import test from 'node:test';
import {createObservabilityCore} from '../src/index.js';

test('observability core package exposes a working API', () => {
  const feature = createObservabilityCore({enabled: true});
  assert.equal(feature.domain, 'observability');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

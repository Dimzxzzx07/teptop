import assert from 'node:assert/strict';
import test from 'node:test';
import {createObservabilityAdapter} from '../src/index.js';

test('observability adapter package exposes a working API', () => {
  const feature = createObservabilityAdapter({enabled: true});
  assert.equal(feature.domain, 'observability');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

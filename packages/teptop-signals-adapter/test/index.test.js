import assert from 'node:assert/strict';
import test from 'node:test';
import {createSignalsAdapter} from '../src/index.js';

test('signals adapter package exposes a working API', () => {
  const feature = createSignalsAdapter({enabled: true});
  assert.equal(feature.domain, 'signals');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createRuntimeAdapter} from '../src/index.js';

test('runtime adapter package exposes a working API', () => {
  const feature = createRuntimeAdapter({enabled: true});
  assert.equal(feature.domain, 'runtime');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createDataAdapter} from '../src/index.js';

test('data adapter package exposes a working API', () => {
  const feature = createDataAdapter({enabled: true});
  assert.equal(feature.domain, 'data');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

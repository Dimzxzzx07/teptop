import assert from 'node:assert/strict';
import test from 'node:test';
import {createValidationAdapter} from '../src/index.js';

test('validation adapter package exposes a working API', () => {
  const feature = createValidationAdapter({enabled: true});
  assert.equal(feature.domain, 'validation');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

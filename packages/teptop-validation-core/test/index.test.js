import assert from 'node:assert/strict';
import test from 'node:test';
import {createValidationCore} from '../src/index.js';

test('validation core package exposes a working API', () => {
  const feature = createValidationCore({enabled: true});
  assert.equal(feature.domain, 'validation');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

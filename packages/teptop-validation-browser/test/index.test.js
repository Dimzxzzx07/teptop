import assert from 'node:assert/strict';
import test from 'node:test';
import {createValidationBrowser} from '../src/index.js';

test('validation browser package exposes a working API', () => {
  const feature = createValidationBrowser({enabled: true});
  assert.equal(feature.domain, 'validation');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createFormsBrowser} from '../src/index.js';

test('forms browser package exposes a working API', () => {
  const feature = createFormsBrowser({enabled: true});
  assert.equal(feature.domain, 'forms');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

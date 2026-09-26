import assert from 'node:assert/strict';
import test from 'node:test';
import {createStorageCore} from '../src/index.js';

test('storage core package exposes a working API', () => {
  const feature = createStorageCore({enabled: true});
  assert.equal(feature.domain, 'storage');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

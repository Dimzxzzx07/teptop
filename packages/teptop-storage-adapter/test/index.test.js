import assert from 'node:assert/strict';
import test from 'node:test';
import {createStorageAdapter} from '../src/index.js';

test('storage adapter package exposes a working API', () => {
  const feature = createStorageAdapter({enabled: true});
  assert.equal(feature.domain, 'storage');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

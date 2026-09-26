import assert from 'node:assert/strict';
import test from 'node:test';
import {createStorageServer} from '../src/index.js';

test('storage server package exposes a working API', () => {
  const feature = createStorageServer({enabled: true});
  assert.equal(feature.domain, 'storage');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

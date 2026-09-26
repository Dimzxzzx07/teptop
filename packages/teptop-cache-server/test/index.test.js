import assert from 'node:assert/strict';
import test from 'node:test';
import {createCacheServer} from '../src/index.js';

test('cache server package exposes a working API', () => {
  const feature = createCacheServer({enabled: true});
  assert.equal(feature.domain, 'cache');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

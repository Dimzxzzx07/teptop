import assert from 'node:assert/strict';
import test from 'node:test';
import {createCacheAdapter} from '../src/index.js';

test('cache adapter package exposes a working API', () => {
  const feature = createCacheAdapter({enabled: true});
  assert.equal(feature.domain, 'cache');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

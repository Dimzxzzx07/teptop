import assert from 'node:assert/strict';
import test from 'node:test';
import {createCacheCore} from '../src/index.js';

test('cache core package exposes a working API', () => {
  const feature = createCacheCore({enabled: true});
  assert.equal(feature.domain, 'cache');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

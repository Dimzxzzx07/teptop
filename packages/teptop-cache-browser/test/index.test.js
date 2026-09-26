import assert from 'node:assert/strict';
import test from 'node:test';
import {createCacheBrowser} from '../src/index.js';

test('cache browser package exposes a working API', () => {
  const feature = createCacheBrowser({enabled: true});
  assert.equal(feature.domain, 'cache');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

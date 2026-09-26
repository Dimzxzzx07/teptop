import assert from 'node:assert/strict';
import test from 'node:test';
import {createMiddlewareBrowser} from '../src/index.js';

test('middleware browser package exposes a working API', () => {
  const feature = createMiddlewareBrowser({enabled: true});
  assert.equal(feature.domain, 'middleware');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

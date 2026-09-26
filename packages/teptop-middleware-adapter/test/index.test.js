import assert from 'node:assert/strict';
import test from 'node:test';
import {createMiddlewareAdapter} from '../src/index.js';

test('middleware adapter package exposes a working API', () => {
  const feature = createMiddlewareAdapter({enabled: true});
  assert.equal(feature.domain, 'middleware');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

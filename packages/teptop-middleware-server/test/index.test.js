import assert from 'node:assert/strict';
import test from 'node:test';
import {createMiddlewareServer} from '../src/index.js';

test('middleware server package exposes a working API', () => {
  const feature = createMiddlewareServer({enabled: true});
  assert.equal(feature.domain, 'middleware');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createMiddlewareCore} from '../src/index.js';

test('middleware core package exposes a working API', () => {
  const feature = createMiddlewareCore({enabled: true});
  assert.equal(feature.domain, 'middleware');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

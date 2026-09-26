import assert from 'node:assert/strict';
import test from 'node:test';
import {createRouterAdapter} from '../src/index.js';

test('router adapter package exposes a working API', () => {
  const feature = createRouterAdapter({enabled: true});
  assert.equal(feature.domain, 'router');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

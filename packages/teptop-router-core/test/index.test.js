import assert from 'node:assert/strict';
import test from 'node:test';
import {createRouterCore} from '../src/index.js';

test('router core package exposes a working API', () => {
  const feature = createRouterCore({enabled: true});
  assert.equal(feature.domain, 'router');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

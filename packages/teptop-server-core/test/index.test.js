import assert from 'node:assert/strict';
import test from 'node:test';
import {createServerCore} from '../src/index.js';

test('server core package exposes a working API', () => {
  const feature = createServerCore({enabled: true});
  assert.equal(feature.domain, 'server');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

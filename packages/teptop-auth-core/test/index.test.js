import assert from 'node:assert/strict';
import test from 'node:test';
import {createAuthCore} from '../src/index.js';

test('auth core package exposes a working API', () => {
  const feature = createAuthCore({enabled: true});
  assert.equal(feature.domain, 'auth');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

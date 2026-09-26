import assert from 'node:assert/strict';
import test from 'node:test';
import {createAuthAdapter} from '../src/index.js';

test('auth adapter package exposes a working API', () => {
  const feature = createAuthAdapter({enabled: true});
  assert.equal(feature.domain, 'auth');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

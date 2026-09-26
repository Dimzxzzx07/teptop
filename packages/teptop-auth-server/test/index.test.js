import assert from 'node:assert/strict';
import test from 'node:test';
import {createAuthServer} from '../src/index.js';

test('auth server package exposes a working API', () => {
  const feature = createAuthServer({enabled: true});
  assert.equal(feature.domain, 'auth');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

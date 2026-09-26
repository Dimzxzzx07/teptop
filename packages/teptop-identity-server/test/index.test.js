import assert from 'node:assert/strict';
import test from 'node:test';
import {createIdentityServer} from '../src/index.js';

test('identity server package exposes a working API', () => {
  const feature = createIdentityServer({enabled: true});
  assert.equal(feature.domain, 'identity');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createIdentityAdapter} from '../src/index.js';

test('identity adapter package exposes a working API', () => {
  const feature = createIdentityAdapter({enabled: true});
  assert.equal(feature.domain, 'identity');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

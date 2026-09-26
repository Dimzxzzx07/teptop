import assert from 'node:assert/strict';
import test from 'node:test';
import {createIdentityCore} from '../src/index.js';

test('identity core package exposes a working API', () => {
  const feature = createIdentityCore({enabled: true});
  assert.equal(feature.domain, 'identity');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

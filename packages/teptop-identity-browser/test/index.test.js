import assert from 'node:assert/strict';
import test from 'node:test';
import {createIdentityBrowser} from '../src/index.js';

test('identity browser package exposes a working API', () => {
  const feature = createIdentityBrowser({enabled: true});
  assert.equal(feature.domain, 'identity');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

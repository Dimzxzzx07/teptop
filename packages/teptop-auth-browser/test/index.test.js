import assert from 'node:assert/strict';
import test from 'node:test';
import {createAuthBrowser} from '../src/index.js';

test('auth browser package exposes a working API', () => {
  const feature = createAuthBrowser({enabled: true});
  assert.equal(feature.domain, 'auth');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

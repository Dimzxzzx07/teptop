import assert from 'node:assert/strict';
import test from 'node:test';
import {createSignalsBrowser} from '../src/index.js';

test('signals browser package exposes a working API', () => {
  const feature = createSignalsBrowser({enabled: true});
  assert.equal(feature.domain, 'signals');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

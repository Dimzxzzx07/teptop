import assert from 'node:assert/strict';
import test from 'node:test';
import {createNetworkBrowser} from '../src/index.js';

test('network browser package exposes a working API', () => {
  const feature = createNetworkBrowser({enabled: true});
  assert.equal(feature.domain, 'network');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

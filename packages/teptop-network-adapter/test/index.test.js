import assert from 'node:assert/strict';
import test from 'node:test';
import {createNetworkAdapter} from '../src/index.js';

test('network adapter package exposes a working API', () => {
  const feature = createNetworkAdapter({enabled: true});
  assert.equal(feature.domain, 'network');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

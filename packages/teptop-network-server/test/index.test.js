import assert from 'node:assert/strict';
import test from 'node:test';
import {createNetworkServer} from '../src/index.js';

test('network server package exposes a working API', () => {
  const feature = createNetworkServer({enabled: true});
  assert.equal(feature.domain, 'network');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

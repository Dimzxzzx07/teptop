import assert from 'node:assert/strict';
import test from 'node:test';
import {createNetworkCore} from '../src/index.js';

test('network core package exposes a working API', () => {
  const feature = createNetworkCore({enabled: true});
  assert.equal(feature.domain, 'network');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

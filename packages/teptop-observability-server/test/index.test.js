import assert from 'node:assert/strict';
import test from 'node:test';
import {createObservabilityServer} from '../src/index.js';

test('observability server package exposes a working API', () => {
  const feature = createObservabilityServer({enabled: true});
  assert.equal(feature.domain, 'observability');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

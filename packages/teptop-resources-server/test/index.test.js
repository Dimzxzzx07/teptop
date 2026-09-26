import assert from 'node:assert/strict';
import test from 'node:test';
import {createResourcesServer} from '../src/index.js';

test('resources server package exposes a working API', () => {
  const feature = createResourcesServer({enabled: true});
  assert.equal(feature.domain, 'resources');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

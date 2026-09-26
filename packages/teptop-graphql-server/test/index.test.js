import assert from 'node:assert/strict';
import test from 'node:test';
import {createGraphqlServer} from '../src/index.js';

test('graphql server package exposes a working API', () => {
  const feature = createGraphqlServer({enabled: true});
  assert.equal(feature.domain, 'graphql');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

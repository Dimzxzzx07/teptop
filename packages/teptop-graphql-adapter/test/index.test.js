import assert from 'node:assert/strict';
import test from 'node:test';
import {createGraphqlAdapter} from '../src/index.js';

test('graphql adapter package exposes a working API', () => {
  const feature = createGraphqlAdapter({enabled: true});
  assert.equal(feature.domain, 'graphql');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

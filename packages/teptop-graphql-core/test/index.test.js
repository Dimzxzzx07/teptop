import assert from 'node:assert/strict';
import test from 'node:test';
import {createGraphqlCore} from '../src/index.js';

test('graphql core package exposes a working API', () => {
  const feature = createGraphqlCore({enabled: true});
  assert.equal(feature.domain, 'graphql');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

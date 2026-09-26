import assert from 'node:assert/strict';
import test from 'node:test';
import {createGraphqlBrowser} from '../src/index.js';

test('graphql browser package exposes a working API', () => {
  const feature = createGraphqlBrowser({enabled: true});
  assert.equal(feature.domain, 'graphql');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createConcurrencyServer} from '../src/index.js';

test('concurrency server package exposes a working API', () => {
  const feature = createConcurrencyServer({enabled: true});
  assert.equal(feature.domain, 'concurrency');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

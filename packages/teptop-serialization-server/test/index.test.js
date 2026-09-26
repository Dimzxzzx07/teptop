import assert from 'node:assert/strict';
import test from 'node:test';
import {createSerializationServer} from '../src/index.js';

test('serialization server package exposes a working API', () => {
  const feature = createSerializationServer({enabled: true});
  assert.equal(feature.domain, 'serialization');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

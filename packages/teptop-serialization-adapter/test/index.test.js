import assert from 'node:assert/strict';
import test from 'node:test';
import {createSerializationAdapter} from '../src/index.js';

test('serialization adapter package exposes a working API', () => {
  const feature = createSerializationAdapter({enabled: true});
  assert.equal(feature.domain, 'serialization');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

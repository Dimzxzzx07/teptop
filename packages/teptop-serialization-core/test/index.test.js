import assert from 'node:assert/strict';
import test from 'node:test';
import {createSerializationCore} from '../src/index.js';

test('serialization core package exposes a working API', () => {
  const feature = createSerializationCore({enabled: true});
  assert.equal(feature.domain, 'serialization');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createSerializationBrowser} from '../src/index.js';

test('serialization browser package exposes a working API', () => {
  const feature = createSerializationBrowser({enabled: true});
  assert.equal(feature.domain, 'serialization');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

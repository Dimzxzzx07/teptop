import assert from 'node:assert/strict';
import test from 'node:test';
import {createTestingAdapter} from '../src/index.js';

test('testing adapter package exposes a working API', () => {
  const feature = createTestingAdapter({enabled: true});
  assert.equal(feature.domain, 'testing');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

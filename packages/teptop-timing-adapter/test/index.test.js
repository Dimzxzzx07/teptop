import assert from 'node:assert/strict';
import test from 'node:test';
import {createTimingAdapter} from '../src/index.js';

test('timing adapter package exposes a working API', () => {
  const feature = createTimingAdapter({enabled: true});
  assert.equal(feature.domain, 'timing');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

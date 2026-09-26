import assert from 'node:assert/strict';
import test from 'node:test';
import {createTimingCore} from '../src/index.js';

test('timing core package exposes a working API', () => {
  const feature = createTimingCore({enabled: true});
  assert.equal(feature.domain, 'timing');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

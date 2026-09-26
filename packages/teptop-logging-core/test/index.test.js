import assert from 'node:assert/strict';
import test from 'node:test';
import {createLoggingCore} from '../src/index.js';

test('logging core package exposes a working API', () => {
  const feature = createLoggingCore({enabled: true});
  assert.equal(feature.domain, 'logging');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

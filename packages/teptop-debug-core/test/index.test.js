import assert from 'node:assert/strict';
import test from 'node:test';
import {createDebugCore} from '../src/index.js';

test('debug core package exposes a working API', () => {
  const feature = createDebugCore({enabled: true});
  assert.equal(feature.domain, 'debug');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createDebugAdapter} from '../src/index.js';

test('debug adapter package exposes a working API', () => {
  const feature = createDebugAdapter({enabled: true});
  assert.equal(feature.domain, 'debug');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

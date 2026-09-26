import assert from 'node:assert/strict';
import test from 'node:test';
import {createContextAdapter} from '../src/index.js';

test('context adapter package exposes a working API', () => {
  const feature = createContextAdapter({enabled: true});
  assert.equal(feature.domain, 'context');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

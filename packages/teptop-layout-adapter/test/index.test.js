import assert from 'node:assert/strict';
import test from 'node:test';
import {createLayoutAdapter} from '../src/index.js';

test('layout adapter package exposes a working API', () => {
  const feature = createLayoutAdapter({enabled: true});
  assert.equal(feature.domain, 'layout');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createConfigAdapter} from '../src/index.js';

test('config adapter package exposes a working API', () => {
  const feature = createConfigAdapter({enabled: true});
  assert.equal(feature.domain, 'config');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

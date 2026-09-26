import assert from 'node:assert/strict';
import test from 'node:test';
import {createSecurityAdapter} from '../src/index.js';

test('security adapter package exposes a working API', () => {
  const feature = createSecurityAdapter({enabled: true});
  assert.equal(feature.domain, 'security');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

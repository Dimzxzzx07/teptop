import assert from 'node:assert/strict';
import test from 'node:test';
import {createTestingCore} from '../src/index.js';

test('testing core package exposes a working API', () => {
  const feature = createTestingCore({enabled: true});
  assert.equal(feature.domain, 'testing');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

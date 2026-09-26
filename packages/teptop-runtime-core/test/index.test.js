import assert from 'node:assert/strict';
import test from 'node:test';
import {createRuntimeCore} from '../src/index.js';

test('runtime core package exposes a working API', () => {
  const feature = createRuntimeCore({enabled: true});
  assert.equal(feature.domain, 'runtime');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

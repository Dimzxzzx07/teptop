import assert from 'node:assert/strict';
import test from 'node:test';
import {createInputCore} from '../src/index.js';

test('input core package exposes a working API', () => {
  const feature = createInputCore({enabled: true});
  assert.equal(feature.domain, 'input');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

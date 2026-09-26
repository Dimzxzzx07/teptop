import assert from 'node:assert/strict';
import test from 'node:test';
import {createWorkersCore} from '../src/index.js';

test('workers core package exposes a working API', () => {
  const feature = createWorkersCore({enabled: true});
  assert.equal(feature.domain, 'workers');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

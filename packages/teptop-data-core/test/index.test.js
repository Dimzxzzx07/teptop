import assert from 'node:assert/strict';
import test from 'node:test';
import {createDataCore} from '../src/index.js';

test('data core package exposes a working API', () => {
  const feature = createDataCore({enabled: true});
  assert.equal(feature.domain, 'data');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

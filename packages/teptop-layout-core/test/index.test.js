import assert from 'node:assert/strict';
import test from 'node:test';
import {createLayoutCore} from '../src/index.js';

test('layout core package exposes a working API', () => {
  const feature = createLayoutCore({enabled: true});
  assert.equal(feature.domain, 'layout');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

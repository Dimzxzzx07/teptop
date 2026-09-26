import assert from 'node:assert/strict';
import test from 'node:test';
import {createConfigCore} from '../src/index.js';

test('config core package exposes a working API', () => {
  const feature = createConfigCore({enabled: true});
  assert.equal(feature.domain, 'config');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

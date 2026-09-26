import assert from 'node:assert/strict';
import test from 'node:test';
import {createContextCore} from '../src/index.js';

test('context core package exposes a working API', () => {
  const feature = createContextCore({enabled: true});
  assert.equal(feature.domain, 'context');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

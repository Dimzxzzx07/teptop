import assert from 'node:assert/strict';
import test from 'node:test';
import {createCompilerCore} from '../src/index.js';

test('compiler core package exposes a working API', () => {
  const feature = createCompilerCore({enabled: true});
  assert.equal(feature.domain, 'compiler');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

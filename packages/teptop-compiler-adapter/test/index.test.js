import assert from 'node:assert/strict';
import test from 'node:test';
import {createCompilerAdapter} from '../src/index.js';

test('compiler adapter package exposes a working API', () => {
  const feature = createCompilerAdapter({enabled: true});
  assert.equal(feature.domain, 'compiler');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

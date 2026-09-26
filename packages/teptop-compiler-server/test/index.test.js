import assert from 'node:assert/strict';
import test from 'node:test';
import {createCompilerServer} from '../src/index.js';

test('compiler server package exposes a working API', () => {
  const feature = createCompilerServer({enabled: true});
  assert.equal(feature.domain, 'compiler');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

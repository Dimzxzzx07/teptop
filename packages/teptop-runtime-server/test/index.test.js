import assert from 'node:assert/strict';
import test from 'node:test';
import {createRuntimeServer} from '../src/index.js';

test('runtime server package exposes a working API', () => {
  const feature = createRuntimeServer({enabled: true});
  assert.equal(feature.domain, 'runtime');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

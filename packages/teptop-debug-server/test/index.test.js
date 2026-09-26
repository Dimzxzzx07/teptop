import assert from 'node:assert/strict';
import test from 'node:test';
import {createDebugServer} from '../src/index.js';

test('debug server package exposes a working API', () => {
  const feature = createDebugServer({enabled: true});
  assert.equal(feature.domain, 'debug');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

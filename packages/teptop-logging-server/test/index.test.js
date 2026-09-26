import assert from 'node:assert/strict';
import test from 'node:test';
import {createLoggingServer} from '../src/index.js';

test('logging server package exposes a working API', () => {
  const feature = createLoggingServer({enabled: true});
  assert.equal(feature.domain, 'logging');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

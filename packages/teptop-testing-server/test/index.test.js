import assert from 'node:assert/strict';
import test from 'node:test';
import {createTestingServer} from '../src/index.js';

test('testing server package exposes a working API', () => {
  const feature = createTestingServer({enabled: true});
  assert.equal(feature.domain, 'testing');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

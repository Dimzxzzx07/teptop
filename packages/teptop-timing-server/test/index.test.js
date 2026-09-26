import assert from 'node:assert/strict';
import test from 'node:test';
import {createTimingServer} from '../src/index.js';

test('timing server package exposes a working API', () => {
  const feature = createTimingServer({enabled: true});
  assert.equal(feature.domain, 'timing');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

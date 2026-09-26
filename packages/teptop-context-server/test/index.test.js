import assert from 'node:assert/strict';
import test from 'node:test';
import {createContextServer} from '../src/index.js';

test('context server package exposes a working API', () => {
  const feature = createContextServer({enabled: true});
  assert.equal(feature.domain, 'context');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

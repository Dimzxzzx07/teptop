import assert from 'node:assert/strict';
import test from 'node:test';
import {createServerServer} from '../src/index.js';

test('server server package exposes a working API', () => {
  const feature = createServerServer({enabled: true});
  assert.equal(feature.domain, 'server');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

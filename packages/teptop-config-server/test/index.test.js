import assert from 'node:assert/strict';
import test from 'node:test';
import {createConfigServer} from '../src/index.js';

test('config server package exposes a working API', () => {
  const feature = createConfigServer({enabled: true});
  assert.equal(feature.domain, 'config');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

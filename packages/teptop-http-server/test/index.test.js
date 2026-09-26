import assert from 'node:assert/strict';
import test from 'node:test';
import {createHttpServer} from '../src/index.js';

test('http server package exposes a working API', () => {
  const feature = createHttpServer({enabled: true});
  assert.equal(feature.domain, 'http');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

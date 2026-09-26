import assert from 'node:assert/strict';
import test from 'node:test';
import {createDataServer} from '../src/index.js';

test('data server package exposes a working API', () => {
  const feature = createDataServer({enabled: true});
  assert.equal(feature.domain, 'data');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

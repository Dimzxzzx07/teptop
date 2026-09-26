import assert from 'node:assert/strict';
import test from 'node:test';
import {createQueryServer} from '../src/index.js';

test('query server package exposes a working API', () => {
  const feature = createQueryServer({enabled: true});
  assert.equal(feature.domain, 'query');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

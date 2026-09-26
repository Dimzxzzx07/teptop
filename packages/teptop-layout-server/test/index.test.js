import assert from 'node:assert/strict';
import test from 'node:test';
import {createLayoutServer} from '../src/index.js';

test('layout server package exposes a working API', () => {
  const feature = createLayoutServer({enabled: true});
  assert.equal(feature.domain, 'layout');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

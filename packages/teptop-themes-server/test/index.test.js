import assert from 'node:assert/strict';
import test from 'node:test';
import {createThemesServer} from '../src/index.js';

test('themes server package exposes a working API', () => {
  const feature = createThemesServer({enabled: true});
  assert.equal(feature.domain, 'themes');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

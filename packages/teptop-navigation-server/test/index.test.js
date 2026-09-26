import assert from 'node:assert/strict';
import test from 'node:test';
import {createNavigationServer} from '../src/index.js';

test('navigation server package exposes a working API', () => {
  const feature = createNavigationServer({enabled: true});
  assert.equal(feature.domain, 'navigation');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

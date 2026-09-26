import assert from 'node:assert/strict';
import test from 'node:test';
import {createRouterServer} from '../src/index.js';

test('router server package exposes a working API', () => {
  const feature = createRouterServer({enabled: true});
  assert.equal(feature.domain, 'router');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

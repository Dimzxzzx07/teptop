import assert from 'node:assert/strict';
import test from 'node:test';
import {createRouterBrowser} from '../src/index.js';

test('router browser package exposes a working API', () => {
  const feature = createRouterBrowser({enabled: true});
  assert.equal(feature.domain, 'router');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

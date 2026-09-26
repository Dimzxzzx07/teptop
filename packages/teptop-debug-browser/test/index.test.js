import assert from 'node:assert/strict';
import test from 'node:test';
import {createDebugBrowser} from '../src/index.js';

test('debug browser package exposes a working API', () => {
  const feature = createDebugBrowser({enabled: true});
  assert.equal(feature.domain, 'debug');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createServerBrowser} from '../src/index.js';

test('server browser package exposes a working API', () => {
  const feature = createServerBrowser({enabled: true});
  assert.equal(feature.domain, 'server');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

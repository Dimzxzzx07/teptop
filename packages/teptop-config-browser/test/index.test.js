import assert from 'node:assert/strict';
import test from 'node:test';
import {createConfigBrowser} from '../src/index.js';

test('config browser package exposes a working API', () => {
  const feature = createConfigBrowser({enabled: true});
  assert.equal(feature.domain, 'config');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

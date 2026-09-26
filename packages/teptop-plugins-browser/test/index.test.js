import assert from 'node:assert/strict';
import test from 'node:test';
import {createPluginsBrowser} from '../src/index.js';

test('plugins browser package exposes a working API', () => {
  const feature = createPluginsBrowser({enabled: true});
  assert.equal(feature.domain, 'plugins');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

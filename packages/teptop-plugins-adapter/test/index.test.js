import assert from 'node:assert/strict';
import test from 'node:test';
import {createPluginsAdapter} from '../src/index.js';

test('plugins adapter package exposes a working API', () => {
  const feature = createPluginsAdapter({enabled: true});
  assert.equal(feature.domain, 'plugins');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

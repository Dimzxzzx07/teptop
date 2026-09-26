import assert from 'node:assert/strict';
import test from 'node:test';
import {createPluginsServer} from '../src/index.js';

test('plugins server package exposes a working API', () => {
  const feature = createPluginsServer({enabled: true});
  assert.equal(feature.domain, 'plugins');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

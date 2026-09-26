import assert from 'node:assert/strict';
import test from 'node:test';
import {createPluginsCore} from '../src/index.js';

test('plugins core package exposes a working API', () => {
  const feature = createPluginsCore({enabled: true});
  assert.equal(feature.domain, 'plugins');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

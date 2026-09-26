import assert from 'node:assert/strict';
import test from 'node:test';
import {createRuntimeBrowser} from '../src/index.js';

test('runtime browser package exposes a working API', () => {
  const feature = createRuntimeBrowser({enabled: true});
  assert.equal(feature.domain, 'runtime');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

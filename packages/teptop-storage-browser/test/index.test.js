import assert from 'node:assert/strict';
import test from 'node:test';
import {createStorageBrowser} from '../src/index.js';

test('storage browser package exposes a working API', () => {
  const feature = createStorageBrowser({enabled: true});
  assert.equal(feature.domain, 'storage');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

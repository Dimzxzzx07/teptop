import assert from 'node:assert/strict';
import test from 'node:test';
import {createAsyncBrowser} from '../src/index.js';

test('async browser package exposes a working API', () => {
  const feature = createAsyncBrowser({enabled: true});
  assert.equal(feature.domain, 'async');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

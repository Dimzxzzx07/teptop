import assert from 'node:assert/strict';
import test from 'node:test';
import {createDataBrowser} from '../src/index.js';

test('data browser package exposes a working API', () => {
  const feature = createDataBrowser({enabled: true});
  assert.equal(feature.domain, 'data');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

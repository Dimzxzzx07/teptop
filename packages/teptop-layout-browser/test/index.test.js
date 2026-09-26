import assert from 'node:assert/strict';
import test from 'node:test';
import {createLayoutBrowser} from '../src/index.js';

test('layout browser package exposes a working API', () => {
  const feature = createLayoutBrowser({enabled: true});
  assert.equal(feature.domain, 'layout');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

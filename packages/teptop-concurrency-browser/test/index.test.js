import assert from 'node:assert/strict';
import test from 'node:test';
import {createConcurrencyBrowser} from '../src/index.js';

test('concurrency browser package exposes a working API', () => {
  const feature = createConcurrencyBrowser({enabled: true});
  assert.equal(feature.domain, 'concurrency');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

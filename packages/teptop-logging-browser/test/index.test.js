import assert from 'node:assert/strict';
import test from 'node:test';
import {createLoggingBrowser} from '../src/index.js';

test('logging browser package exposes a working API', () => {
  const feature = createLoggingBrowser({enabled: true});
  assert.equal(feature.domain, 'logging');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

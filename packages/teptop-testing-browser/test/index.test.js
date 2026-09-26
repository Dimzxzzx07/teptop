import assert from 'node:assert/strict';
import test from 'node:test';
import {createTestingBrowser} from '../src/index.js';

test('testing browser package exposes a working API', () => {
  const feature = createTestingBrowser({enabled: true});
  assert.equal(feature.domain, 'testing');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

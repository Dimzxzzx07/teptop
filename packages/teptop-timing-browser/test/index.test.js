import assert from 'node:assert/strict';
import test from 'node:test';
import {createTimingBrowser} from '../src/index.js';

test('timing browser package exposes a working API', () => {
  const feature = createTimingBrowser({enabled: true});
  assert.equal(feature.domain, 'timing');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

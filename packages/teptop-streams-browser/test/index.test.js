import assert from 'node:assert/strict';
import test from 'node:test';
import {createStreamsBrowser} from '../src/index.js';

test('streams browser package exposes a working API', () => {
  const feature = createStreamsBrowser({enabled: true});
  assert.equal(feature.domain, 'streams');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

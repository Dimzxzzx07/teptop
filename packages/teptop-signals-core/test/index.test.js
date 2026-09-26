import assert from 'node:assert/strict';
import test from 'node:test';
import {createSignalsCore} from '../src/index.js';

test('signals core package exposes a working API', () => {
  const feature = createSignalsCore({enabled: true});
  assert.equal(feature.domain, 'signals');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

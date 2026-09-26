import assert from 'node:assert/strict';
import test from 'node:test';
import {createSignalsServer} from '../src/index.js';

test('signals server package exposes a working API', () => {
  const feature = createSignalsServer({enabled: true});
  assert.equal(feature.domain, 'signals');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

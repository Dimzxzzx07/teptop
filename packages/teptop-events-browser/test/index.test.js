import assert from 'node:assert/strict';
import test from 'node:test';
import {createEventsBrowser} from '../src/index.js';

test('events browser package exposes a working API', () => {
  const feature = createEventsBrowser({enabled: true});
  assert.equal(feature.domain, 'events');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createEventsAdapter} from '../src/index.js';

test('events adapter package exposes a working API', () => {
  const feature = createEventsAdapter({enabled: true});
  assert.equal(feature.domain, 'events');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createEventsCore} from '../src/index.js';

test('events core package exposes a working API', () => {
  const feature = createEventsCore({enabled: true});
  assert.equal(feature.domain, 'events');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createEventsServer} from '../src/index.js';

test('events server package exposes a working API', () => {
  const feature = createEventsServer({enabled: true});
  assert.equal(feature.domain, 'events');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

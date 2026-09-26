import assert from 'node:assert/strict';
import test from 'node:test';
import {createStreamsServer} from '../src/index.js';

test('streams server package exposes a working API', () => {
  const feature = createStreamsServer({enabled: true});
  assert.equal(feature.domain, 'streams');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createStreamsAdapter} from '../src/index.js';

test('streams adapter package exposes a working API', () => {
  const feature = createStreamsAdapter({enabled: true});
  assert.equal(feature.domain, 'streams');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

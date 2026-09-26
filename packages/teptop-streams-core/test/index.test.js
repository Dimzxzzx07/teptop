import assert from 'node:assert/strict';
import test from 'node:test';
import {createStreamsCore} from '../src/index.js';

test('streams core package exposes a working API', () => {
  const feature = createStreamsCore({enabled: true});
  assert.equal(feature.domain, 'streams');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

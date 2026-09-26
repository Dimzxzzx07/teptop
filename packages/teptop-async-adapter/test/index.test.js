import assert from 'node:assert/strict';
import test from 'node:test';
import {createAsyncAdapter} from '../src/index.js';

test('async adapter package exposes a working API', () => {
  const feature = createAsyncAdapter({enabled: true});
  assert.equal(feature.domain, 'async');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

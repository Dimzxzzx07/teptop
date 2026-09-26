import assert from 'node:assert/strict';
import test from 'node:test';
import {createAsyncCore} from '../src/index.js';

test('async core package exposes a working API', () => {
  const feature = createAsyncCore({enabled: true});
  assert.equal(feature.domain, 'async');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

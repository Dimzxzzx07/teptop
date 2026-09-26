import assert from 'node:assert/strict';
import test from 'node:test';
import {createAsyncServer} from '../src/index.js';

test('async server package exposes a working API', () => {
  const feature = createAsyncServer({enabled: true});
  assert.equal(feature.domain, 'async');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

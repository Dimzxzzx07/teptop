import assert from 'node:assert/strict';
import test from 'node:test';
import {createWorkersBrowser} from '../src/index.js';

test('workers browser package exposes a working API', () => {
  const feature = createWorkersBrowser({enabled: true});
  assert.equal(feature.domain, 'workers');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

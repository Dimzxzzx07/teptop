import assert from 'node:assert/strict';
import test from 'node:test';
import {createResourcesBrowser} from '../src/index.js';

test('resources browser package exposes a working API', () => {
  const feature = createResourcesBrowser({enabled: true});
  assert.equal(feature.domain, 'resources');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

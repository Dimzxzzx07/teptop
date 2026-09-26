import assert from 'node:assert/strict';
import test from 'node:test';
import {createCollectionsBrowser} from '../src/index.js';

test('collections browser package exposes a working API', () => {
  const feature = createCollectionsBrowser({enabled: true});
  assert.equal(feature.domain, 'collections');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createCollectionsCore} from '../src/index.js';

test('collections core package exposes a working API', () => {
  const feature = createCollectionsCore({enabled: true});
  assert.equal(feature.domain, 'collections');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

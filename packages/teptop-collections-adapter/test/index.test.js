import assert from 'node:assert/strict';
import test from 'node:test';
import {createCollectionsAdapter} from '../src/index.js';

test('collections adapter package exposes a working API', () => {
  const feature = createCollectionsAdapter({enabled: true});
  assert.equal(feature.domain, 'collections');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

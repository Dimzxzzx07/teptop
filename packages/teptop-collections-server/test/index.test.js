import assert from 'node:assert/strict';
import test from 'node:test';
import {createCollectionsServer} from '../src/index.js';

test('collections server package exposes a working API', () => {
  const feature = createCollectionsServer({enabled: true});
  assert.equal(feature.domain, 'collections');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

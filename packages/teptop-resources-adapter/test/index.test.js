import assert from 'node:assert/strict';
import test from 'node:test';
import {createResourcesAdapter} from '../src/index.js';

test('resources adapter package exposes a working API', () => {
  const feature = createResourcesAdapter({enabled: true});
  assert.equal(feature.domain, 'resources');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

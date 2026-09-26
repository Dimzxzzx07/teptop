import assert from 'node:assert/strict';
import test from 'node:test';
import {createResourcesCore} from '../src/index.js';

test('resources core package exposes a working API', () => {
  const feature = createResourcesCore({enabled: true});
  assert.equal(feature.domain, 'resources');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

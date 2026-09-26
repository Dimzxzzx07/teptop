import assert from 'node:assert/strict';
import test from 'node:test';
import {createCloudCore} from '../src/index.js';

test('cloud core package exposes a working API', () => {
  const feature = createCloudCore({enabled: true});
  assert.equal(feature.domain, 'cloud');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

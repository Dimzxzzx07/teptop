import assert from 'node:assert/strict';
import test from 'node:test';
import {createCloudAdapter} from '../src/index.js';

test('cloud adapter package exposes a working API', () => {
  const feature = createCloudAdapter({enabled: true});
  assert.equal(feature.domain, 'cloud');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

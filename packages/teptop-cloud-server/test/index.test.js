import assert from 'node:assert/strict';
import test from 'node:test';
import {createCloudServer} from '../src/index.js';

test('cloud server package exposes a working API', () => {
  const feature = createCloudServer({enabled: true});
  assert.equal(feature.domain, 'cloud');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

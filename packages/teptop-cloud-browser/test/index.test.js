import assert from 'node:assert/strict';
import test from 'node:test';
import {createCloudBrowser} from '../src/index.js';

test('cloud browser package exposes a working API', () => {
  const feature = createCloudBrowser({enabled: true});
  assert.equal(feature.domain, 'cloud');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

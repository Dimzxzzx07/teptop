import assert from 'node:assert/strict';
import test from 'node:test';
import {createChartsAdapter} from '../src/index.js';

test('charts adapter package exposes a working API', () => {
  const feature = createChartsAdapter({enabled: true});
  assert.equal(feature.domain, 'charts');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

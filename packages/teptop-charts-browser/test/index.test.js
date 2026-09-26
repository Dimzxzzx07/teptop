import assert from 'node:assert/strict';
import test from 'node:test';
import {createChartsBrowser} from '../src/index.js';

test('charts browser package exposes a working API', () => {
  const feature = createChartsBrowser({enabled: true});
  assert.equal(feature.domain, 'charts');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createChartsCore} from '../src/index.js';

test('charts core package exposes a working API', () => {
  const feature = createChartsCore({enabled: true});
  assert.equal(feature.domain, 'charts');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

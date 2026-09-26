import assert from 'node:assert/strict';
import test from 'node:test';
import {createCliCore} from '../src/index.js';

test('cli core package exposes a working API', () => {
  const feature = createCliCore({enabled: true});
  assert.equal(feature.domain, 'cli');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

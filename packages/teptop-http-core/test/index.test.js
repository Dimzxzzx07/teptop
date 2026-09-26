import assert from 'node:assert/strict';
import test from 'node:test';
import {createHttpCore} from '../src/index.js';

test('http core package exposes a working API', () => {
  const feature = createHttpCore({enabled: true});
  assert.equal(feature.domain, 'http');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

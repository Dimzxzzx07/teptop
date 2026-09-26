import assert from 'node:assert/strict';
import test from 'node:test';
import {createQueryCore} from '../src/index.js';

test('query core package exposes a working API', () => {
  const feature = createQueryCore({enabled: true});
  assert.equal(feature.domain, 'query');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

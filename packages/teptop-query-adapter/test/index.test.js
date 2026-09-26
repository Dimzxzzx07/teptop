import assert from 'node:assert/strict';
import test from 'node:test';
import {createQueryAdapter} from '../src/index.js';

test('query adapter package exposes a working API', () => {
  const feature = createQueryAdapter({enabled: true});
  assert.equal(feature.domain, 'query');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

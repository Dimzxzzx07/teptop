import assert from 'node:assert/strict';
import test from 'node:test';
import {createHttpAdapter} from '../src/index.js';

test('http adapter package exposes a working API', () => {
  const feature = createHttpAdapter({enabled: true});
  assert.equal(feature.domain, 'http');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createCliAdapter} from '../src/index.js';

test('cli adapter package exposes a working API', () => {
  const feature = createCliAdapter({enabled: true});
  assert.equal(feature.domain, 'cli');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

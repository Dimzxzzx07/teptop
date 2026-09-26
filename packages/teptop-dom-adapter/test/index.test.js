import assert from 'node:assert/strict';
import test from 'node:test';
import {createDomAdapter} from '../src/index.js';

test('dom adapter package exposes a working API', () => {
  const feature = createDomAdapter({enabled: true});
  assert.equal(feature.domain, 'dom');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

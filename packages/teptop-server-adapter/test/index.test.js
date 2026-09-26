import assert from 'node:assert/strict';
import test from 'node:test';
import {createServerAdapter} from '../src/index.js';

test('server adapter package exposes a working API', () => {
  const feature = createServerAdapter({enabled: true});
  assert.equal(feature.domain, 'server');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

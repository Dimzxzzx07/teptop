import assert from 'node:assert/strict';
import test from 'node:test';
import {createValidationServer} from '../src/index.js';

test('validation server package exposes a working API', () => {
  const feature = createValidationServer({enabled: true});
  assert.equal(feature.domain, 'validation');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

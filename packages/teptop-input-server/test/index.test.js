import assert from 'node:assert/strict';
import test from 'node:test';
import {createInputServer} from '../src/index.js';

test('input server package exposes a working API', () => {
  const feature = createInputServer({enabled: true});
  assert.equal(feature.domain, 'input');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

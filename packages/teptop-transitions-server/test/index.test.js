import assert from 'node:assert/strict';
import test from 'node:test';
import {createTransitionsServer} from '../src/index.js';

test('transitions server package exposes a working API', () => {
  const feature = createTransitionsServer({enabled: true});
  assert.equal(feature.domain, 'transitions');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

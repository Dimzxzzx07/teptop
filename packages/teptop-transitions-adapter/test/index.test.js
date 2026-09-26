import assert from 'node:assert/strict';
import test from 'node:test';
import {createTransitionsAdapter} from '../src/index.js';

test('transitions adapter package exposes a working API', () => {
  const feature = createTransitionsAdapter({enabled: true});
  assert.equal(feature.domain, 'transitions');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createTransitionsCore} from '../src/index.js';

test('transitions core package exposes a working API', () => {
  const feature = createTransitionsCore({enabled: true});
  assert.equal(feature.domain, 'transitions');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

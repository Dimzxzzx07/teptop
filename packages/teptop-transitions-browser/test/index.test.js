import assert from 'node:assert/strict';
import test from 'node:test';
import {createTransitionsBrowser} from '../src/index.js';

test('transitions browser package exposes a working API', () => {
  const feature = createTransitionsBrowser({enabled: true});
  assert.equal(feature.domain, 'transitions');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

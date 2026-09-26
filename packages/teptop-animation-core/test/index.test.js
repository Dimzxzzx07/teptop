import assert from 'node:assert/strict';
import test from 'node:test';
import {createAnimationCore} from '../src/index.js';

test('animation core package exposes a working API', () => {
  const feature = createAnimationCore({enabled: true});
  assert.equal(feature.domain, 'animation');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

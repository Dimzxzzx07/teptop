import assert from 'node:assert/strict';
import test from 'node:test';
import {createAnimationAdapter} from '../src/index.js';

test('animation adapter package exposes a working API', () => {
  const feature = createAnimationAdapter({enabled: true});
  assert.equal(feature.domain, 'animation');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

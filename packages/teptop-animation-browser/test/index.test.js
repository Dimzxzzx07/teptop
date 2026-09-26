import assert from 'node:assert/strict';
import test from 'node:test';
import {createAnimationBrowser} from '../src/index.js';

test('animation browser package exposes a working API', () => {
  const feature = createAnimationBrowser({enabled: true});
  assert.equal(feature.domain, 'animation');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

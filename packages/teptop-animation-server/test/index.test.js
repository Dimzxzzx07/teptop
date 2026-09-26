import assert from 'node:assert/strict';
import test from 'node:test';
import {createAnimationServer} from '../src/index.js';

test('animation server package exposes a working API', () => {
  const feature = createAnimationServer({enabled: true});
  assert.equal(feature.domain, 'animation');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

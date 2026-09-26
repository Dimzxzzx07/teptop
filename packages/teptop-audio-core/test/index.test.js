import assert from 'node:assert/strict';
import test from 'node:test';
import {createAudioCore} from '../src/index.js';

test('audio core package exposes a working API', () => {
  const feature = createAudioCore({enabled: true});
  assert.equal(feature.domain, 'audio');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

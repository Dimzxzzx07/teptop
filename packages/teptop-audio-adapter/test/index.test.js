import assert from 'node:assert/strict';
import test from 'node:test';
import {createAudioAdapter} from '../src/index.js';

test('audio adapter package exposes a working API', () => {
  const feature = createAudioAdapter({enabled: true});
  assert.equal(feature.domain, 'audio');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

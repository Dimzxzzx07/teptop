import assert from 'node:assert/strict';
import test from 'node:test';
import {createAudioServer} from '../src/index.js';

test('audio server package exposes a working API', () => {
  const feature = createAudioServer({enabled: true});
  assert.equal(feature.domain, 'audio');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

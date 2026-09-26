import assert from 'node:assert/strict';
import test from 'node:test';
import {createAudioBrowser} from '../src/index.js';

test('audio browser package exposes a working API', () => {
  const feature = createAudioBrowser({enabled: true});
  assert.equal(feature.domain, 'audio');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

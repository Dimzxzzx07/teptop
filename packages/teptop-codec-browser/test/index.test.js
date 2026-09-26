import assert from 'node:assert/strict';
import test from 'node:test';
import {createCodecBrowser} from '../src/index.js';

test('codec browser package exposes a working API', () => {
  const feature = createCodecBrowser({enabled: true});
  assert.equal(feature.domain, 'codec');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

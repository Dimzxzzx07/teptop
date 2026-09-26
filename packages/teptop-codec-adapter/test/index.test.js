import assert from 'node:assert/strict';
import test from 'node:test';
import {createCodecAdapter} from '../src/index.js';

test('codec adapter package exposes a working API', () => {
  const feature = createCodecAdapter({enabled: true});
  assert.equal(feature.domain, 'codec');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

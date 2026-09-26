import assert from 'node:assert/strict';
import test from 'node:test';
import {createCodecCore} from '../src/index.js';

test('codec core package exposes a working API', () => {
  const feature = createCodecCore({enabled: true});
  assert.equal(feature.domain, 'codec');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

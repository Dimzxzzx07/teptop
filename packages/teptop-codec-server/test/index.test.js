import assert from 'node:assert/strict';
import test from 'node:test';
import {createCodecServer} from '../src/index.js';

test('codec server package exposes a working API', () => {
  const feature = createCodecServer({enabled: true});
  assert.equal(feature.domain, 'codec');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createCliBrowser} from '../src/index.js';

test('cli browser package exposes a working API', () => {
  const feature = createCliBrowser({enabled: true});
  assert.equal(feature.domain, 'cli');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

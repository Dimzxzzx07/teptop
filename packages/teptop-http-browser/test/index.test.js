import assert from 'node:assert/strict';
import test from 'node:test';
import {createHttpBrowser} from '../src/index.js';

test('http browser package exposes a working API', () => {
  const feature = createHttpBrowser({enabled: true});
  assert.equal(feature.domain, 'http');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

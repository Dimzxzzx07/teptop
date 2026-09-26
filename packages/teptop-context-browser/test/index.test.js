import assert from 'node:assert/strict';
import test from 'node:test';
import {createContextBrowser} from '../src/index.js';

test('context browser package exposes a working API', () => {
  const feature = createContextBrowser({enabled: true});
  assert.equal(feature.domain, 'context');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createDevtoolsBrowser} from '../src/index.js';

test('devtools browser package exposes a working API', () => {
  const feature = createDevtoolsBrowser({enabled: true});
  assert.equal(feature.domain, 'devtools');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

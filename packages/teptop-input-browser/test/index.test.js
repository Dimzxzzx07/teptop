import assert from 'node:assert/strict';
import test from 'node:test';
import {createInputBrowser} from '../src/index.js';

test('input browser package exposes a working API', () => {
  const feature = createInputBrowser({enabled: true});
  assert.equal(feature.domain, 'input');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

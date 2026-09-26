import assert from 'node:assert/strict';
import test from 'node:test';
import {createCompilerBrowser} from '../src/index.js';

test('compiler browser package exposes a working API', () => {
  const feature = createCompilerBrowser({enabled: true});
  assert.equal(feature.domain, 'compiler');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

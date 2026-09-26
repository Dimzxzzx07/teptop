import assert from 'node:assert/strict';
import test from 'node:test';
import {createDomBrowser} from '../src/index.js';

test('dom browser package exposes a working API', () => {
  const feature = createDomBrowser({enabled: true});
  assert.equal(feature.domain, 'dom');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

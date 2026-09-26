import assert from 'node:assert/strict';
import test from 'node:test';
import {createQueryBrowser} from '../src/index.js';

test('query browser package exposes a working API', () => {
  const feature = createQueryBrowser({enabled: true});
  assert.equal(feature.domain, 'query');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createNavigationBrowser} from '../src/index.js';

test('navigation browser package exposes a working API', () => {
  const feature = createNavigationBrowser({enabled: true});
  assert.equal(feature.domain, 'navigation');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

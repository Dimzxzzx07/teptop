import assert from 'node:assert/strict';
import test from 'node:test';
import {createThemesBrowser} from '../src/index.js';

test('themes browser package exposes a working API', () => {
  const feature = createThemesBrowser({enabled: true});
  assert.equal(feature.domain, 'themes');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

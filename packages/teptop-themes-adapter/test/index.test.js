import assert from 'node:assert/strict';
import test from 'node:test';
import {createThemesAdapter} from '../src/index.js';

test('themes adapter package exposes a working API', () => {
  const feature = createThemesAdapter({enabled: true});
  assert.equal(feature.domain, 'themes');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createThemesCore} from '../src/index.js';

test('themes core package exposes a working API', () => {
  const feature = createThemesCore({enabled: true});
  assert.equal(feature.domain, 'themes');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

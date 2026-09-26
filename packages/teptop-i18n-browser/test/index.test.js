import assert from 'node:assert/strict';
import test from 'node:test';
import {createI18nBrowser} from '../src/index.js';

test('i18n browser package exposes a working API', () => {
  const feature = createI18nBrowser({enabled: true});
  assert.equal(feature.domain, 'i18n');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

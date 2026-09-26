import assert from 'node:assert/strict';
import test from 'node:test';
import {createI18nCore} from '../src/index.js';

test('i18n core package exposes a working API', () => {
  const feature = createI18nCore({enabled: true});
  assert.equal(feature.domain, 'i18n');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

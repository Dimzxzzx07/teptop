import assert from 'node:assert/strict';
import test from 'node:test';
import {createI18nAdapter} from '../src/index.js';

test('i18n adapter package exposes a working API', () => {
  const feature = createI18nAdapter({enabled: true});
  assert.equal(feature.domain, 'i18n');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

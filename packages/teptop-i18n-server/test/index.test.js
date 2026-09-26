import assert from 'node:assert/strict';
import test from 'node:test';
import {createI18nServer} from '../src/index.js';

test('i18n server package exposes a working API', () => {
  const feature = createI18nServer({enabled: true});
  assert.equal(feature.domain, 'i18n');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

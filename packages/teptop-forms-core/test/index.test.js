import assert from 'node:assert/strict';
import test from 'node:test';
import {createFormsCore} from '../src/index.js';

test('forms core package exposes a working API', () => {
  const feature = createFormsCore({enabled: true});
  assert.equal(feature.domain, 'forms');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

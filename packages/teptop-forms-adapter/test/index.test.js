import assert from 'node:assert/strict';
import test from 'node:test';
import {createFormsAdapter} from '../src/index.js';

test('forms adapter package exposes a working API', () => {
  const feature = createFormsAdapter({enabled: true});
  assert.equal(feature.domain, 'forms');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

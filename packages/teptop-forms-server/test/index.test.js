import assert from 'node:assert/strict';
import test from 'node:test';
import {createFormsServer} from '../src/index.js';

test('forms server package exposes a working API', () => {
  const feature = createFormsServer({enabled: true});
  assert.equal(feature.domain, 'forms');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

import assert from 'node:assert/strict';
import test from 'node:test';
import {createInputAdapter} from '../src/index.js';

test('input adapter package exposes a working API', () => {
  const feature = createInputAdapter({enabled: true});
  assert.equal(feature.domain, 'input');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

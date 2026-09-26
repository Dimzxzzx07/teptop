import assert from 'node:assert/strict';
import test from 'node:test';
import {createDevtoolsAdapter} from '../src/index.js';

test('devtools adapter package exposes a working API', () => {
  const feature = createDevtoolsAdapter({enabled: true});
  assert.equal(feature.domain, 'devtools');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

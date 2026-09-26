import assert from 'node:assert/strict';
import test from 'node:test';
import {createDevtoolsCore} from '../src/index.js';

test('devtools core package exposes a working API', () => {
  const feature = createDevtoolsCore({enabled: true});
  assert.equal(feature.domain, 'devtools');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

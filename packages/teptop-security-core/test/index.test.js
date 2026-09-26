import assert from 'node:assert/strict';
import test from 'node:test';
import {createSecurityCore} from '../src/index.js';

test('security core package exposes a working API', () => {
  const feature = createSecurityCore({enabled: true});
  assert.equal(feature.domain, 'security');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

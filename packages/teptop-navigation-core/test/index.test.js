import assert from 'node:assert/strict';
import test from 'node:test';
import {createNavigationCore} from '../src/index.js';

test('navigation core package exposes a working API', () => {
  const feature = createNavigationCore({enabled: true});
  assert.equal(feature.domain, 'navigation');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

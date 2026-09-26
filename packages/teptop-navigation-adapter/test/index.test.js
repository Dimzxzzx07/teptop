import assert from 'node:assert/strict';
import test from 'node:test';
import {createNavigationAdapter} from '../src/index.js';

test('navigation adapter package exposes a working API', () => {
  const feature = createNavigationAdapter({enabled: true});
  assert.equal(feature.domain, 'navigation');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

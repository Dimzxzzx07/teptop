import assert from 'node:assert/strict';
import test from 'node:test';
import {createAccessibilityAdapter} from '../src/index.js';

test('accessibility adapter package exposes a working API', () => {
  const feature = createAccessibilityAdapter({enabled: true});
  assert.equal(feature.domain, 'accessibility');
  assert.equal(feature.concept, 'adapter');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

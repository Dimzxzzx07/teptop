import assert from 'node:assert/strict';
import test from 'node:test';
import {createAccessibilityBrowser} from '../src/index.js';

test('accessibility browser package exposes a working API', () => {
  const feature = createAccessibilityBrowser({enabled: true});
  assert.equal(feature.domain, 'accessibility');
  assert.equal(feature.concept, 'browser');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

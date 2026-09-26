import assert from 'node:assert/strict';
import test from 'node:test';
import {createAccessibilityServer} from '../src/index.js';

test('accessibility server package exposes a working API', () => {
  const feature = createAccessibilityServer({enabled: true});
  assert.equal(feature.domain, 'accessibility');
  assert.equal(feature.concept, 'server');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

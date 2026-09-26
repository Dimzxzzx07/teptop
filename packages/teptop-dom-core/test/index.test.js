import assert from 'node:assert/strict';
import test from 'node:test';
import {createDomCore} from '../src/index.js';

test('dom core package exposes a working API', () => {
  const feature = createDomCore({enabled: true});
  assert.equal(feature.domain, 'dom');
  assert.equal(feature.concept, 'core');
  feature.emit('ready', {ok: true});
  assert.equal(feature.history().length, 1);
});

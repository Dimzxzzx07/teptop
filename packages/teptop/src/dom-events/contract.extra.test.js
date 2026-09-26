import assert from 'node:assert/strict'; import test from 'node:test'; import {pointerType} from './pointer.js'; test('pointer defaults to mouse', () => assert.equal(pointerType({}), 'mouse'));

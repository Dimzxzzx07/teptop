import assert from 'node:assert/strict'; import test from 'node:test'; import {wheelDelta} from './wheel.js'; test('wheel defaults to zero', () => assert.equal(wheelDelta({}), 0));

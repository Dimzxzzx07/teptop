import assert from 'node:assert/strict'; import test from 'node:test'; import {keysOf} from './keys.js'; test('identity keys lists object keys', () => assert.deepEqual(keysOf({a: 1}), ['a']));

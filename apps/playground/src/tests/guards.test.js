import assert from 'node:assert/strict'; import test from 'node:test'; import {isBrowser} from '../utils/guards.js'; test('guards are callable', () => assert.equal(typeof isBrowser, 'function'));

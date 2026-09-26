import assert from 'node:assert/strict'; import test from 'node:test'; import {packet} from './protocol.js'; test('wire packet includes version', () => assert.equal(packet('event').version, '1'));

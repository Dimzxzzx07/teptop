import assert from 'node:assert/strict'; import test from 'node:test'; import {modules} from '../data/modules.js'; test('module data is available', () => assert.equal(modules.length > 0, true));

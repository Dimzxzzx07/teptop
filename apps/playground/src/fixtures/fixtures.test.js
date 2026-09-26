import assert from 'node:assert/strict'; import test from 'node:test'; import {users} from './users.js'; test('fixtures have users', () => assert.equal(users.length, 2));

import assert from 'node:assert/strict'; import test from 'node:test'; import {users} from './index.js'; test('root fixtures expose users', () => assert.equal(users.length, 2));

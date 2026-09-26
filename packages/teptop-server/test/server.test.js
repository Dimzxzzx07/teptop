import assert from 'node:assert/strict';
import test from 'node:test';
import {h} from 'teptop.js';
import {createRenderStream, renderToString} from '../src/index.js';

test('server package renders a complete document and stream', async () => {
  const view = h('main', null, h('h1', null, 'Teptop <3'));
  assert.equal(renderToString(view, {title: 'Dashboard'}), '<!doctype html><html lang="en"><head><meta charset="UTF-8"><title>Dashboard</title></head><body><main><h1>Teptop &lt;3</h1></main></body></html>');
  const chunks = [];
  for await (const chunk of createRenderStream(view, {document: false})) chunks.push(chunk);
  assert.deepEqual(chunks, ['<main><h1>Teptop &lt;3</h1></main>']);
});

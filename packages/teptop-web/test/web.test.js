import assert from 'node:assert/strict';
import test from 'node:test';
import {compileUtilities, createStyleSheet, renderHTML, renderPHP} from '../src/index.js';

test('renders escaped standalone HTML and PHP documents', () => {
  assert.equal(renderHTML('<h1>{{title}}</h1>', {title: '<unsafe>'}), '<h1>&lt;unsafe&gt;</h1>');
  assert.equal(renderPHP('<main>{{name}}</main>', {name: 'Teptop'}), '<?php declare(strict_types=1); ?>\n<main>Teptop</main>');
});

test('compiles Tailwind-style utility classes without duplicate properties', () => {
  assert.equal(compileUtilities('flex items-center flex'), 'display:flex;align-items:center;');
  assert.match(createStyleSheet('p-4 rounded'), /\.p-4\{padding:1rem;\}/);
});
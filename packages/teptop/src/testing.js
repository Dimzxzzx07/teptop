import {flushSync, h, render} from './index.js';

export function createTestRenderer(document) {
  const target = document.createElement('div');
  const roots = new Set();
  return {
    target,
    render(view) { const root = render(view, target); roots.add(root); flushSync(); return root; },
    html() { return target.innerHTML; },
    fire(type, selector, init = {}) { const element = target.querySelector(selector); if (!element) throw new Error(`Element not found: ${selector}`); element.dispatchEvent(new Event(type, init)); },
    cleanup() { roots.forEach(root => root.destroy()); roots.clear(); target.remove(); },
    element(selector) { return target.querySelector(selector); },
    h,
  };
}

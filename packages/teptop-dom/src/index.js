import {createRoot, h, ref} from 'teptop.js';

export function createDomAdapter(document = globalThis.document) {
  if (!document) throw new Error('Teptop DOM adapter requires a document.');
  return {
    document,
    createElement(tag, props, ...children) { return h(tag, props, ...children); },
    mount(target, view) { return createRoot(typeof target === 'string' ? document.querySelector(target) : target).render(view); },
    query(selector, root = document) { return root.querySelector(selector); },
    ref,
  };
}

export function createEventDelegate(root, events = {}) {
  const handlers = new Map();
  Object.entries(events).forEach(([type, listener]) => {
    const handler = event => {
      const target = event.target.closest?.(`[data-teptop-${type}]`);
      if (target && root.contains(target)) listener(event, target);
    };
    handlers.set(type, handler);
    root.addEventListener(type, handler);
  });
  return () => handlers.forEach((handler, type) => root.removeEventListener(type, handler));
}

export function hydrateAttributes(element, attributes = {}) {
  Object.entries(attributes).forEach(([name, value]) => {
    if (value == null || value === false) element.removeAttribute(name);
    else element.setAttribute(name, value === true ? '' : String(value));
  });
  return element;
}

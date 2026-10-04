import {Fragment, h} from './index.js';

export {Fragment};

export function jsx(type, props, key) {
  const input = props || {};
  const {children, ...attributes} = input;
  if (key !== undefined) attributes.key = key;
  return h(type, attributes, ...(Array.isArray(children) ? children : [children]));
}

export const jsxs = jsx;

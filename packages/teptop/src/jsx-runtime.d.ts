import type {Component} from './index.js';

export declare const Fragment: string;
export declare function jsx(type: string | Component<any>, props: Record<string, unknown> | null, key?: string | number): JSX.Element;
export declare const jsxs: typeof jsx;

export declare namespace JSX {
  type Element = unknown;
  interface ElementChildrenAttribute { children: {}; }
  interface IntrinsicElements { [elementName: string]: Record<string, unknown>; }
}
import type {JSX} from './jsx-runtime.js';

export {Fragment} from './jsx-runtime.js';
export type {JSX};
export declare function jsxDEV(type: string | ((props: any) => unknown), props: Record<string, unknown> | null, key: string | number | undefined, isStaticChildren: boolean, source: unknown, self: unknown): JSX.Element;
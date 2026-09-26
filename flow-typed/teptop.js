declare module 'teptop.js' {
  declare export function signal<T>(value: T): (() => T) & {set(value: T | ((value: T) => T)): T};
  declare export function h(tag: string | Function, props?: Object | null, ...children: Array<mixed>): mixed;
  declare export function computed<T>(derive: () => T): () => T;
}

export function createFocusManager(document = globalThis.document) {
  const stack = [];
  return { trap(element) { stack.push(document.activeElement); element.focus?.(); return () => stack.pop()?.focus?.(); }, active() { return document.activeElement; } };
}

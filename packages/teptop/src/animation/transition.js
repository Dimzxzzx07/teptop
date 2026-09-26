export function transition(element, name, work) {
  element.classList?.add(`${name}-enter`);
  const result = work?.();
  queueMicrotask(() => element.classList?.remove(`${name}-enter`));
  return result;
}

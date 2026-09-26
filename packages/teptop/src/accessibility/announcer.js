export function createLiveAnnouncer(document = globalThis.document) {
  const element = document.createElement('div');
  element.setAttribute('aria-live', 'polite');
  return {element, announce(message) { element.textContent = message; }, clear() { element.textContent = ''; }};
}

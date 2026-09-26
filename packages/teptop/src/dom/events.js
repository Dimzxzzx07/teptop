export const listen = (element, event, handler) => { element.addEventListener(event, handler); return () => element.removeEventListener(event, handler); };

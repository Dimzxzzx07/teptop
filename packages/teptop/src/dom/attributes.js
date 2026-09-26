export const setAttribute = (element, name, value) => value == null ? element.removeAttribute(name) : element.setAttribute(name, value);

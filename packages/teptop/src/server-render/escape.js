export const escapeText = value => String(value).replace(/[&<>]/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;'}[character]));

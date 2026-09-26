const escape = value => String(value).replace(/[&<>\"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'}[character]));

export function compileTemplate(source, scope = {}) {
  const tokens = source.split(/(\{\{[^}]+\}\})/g);
  return tokens.map(token => {
    const expression = token.match(/^\{\{\s*([^}]+?)\s*\}\}$/);
    if (!expression) return token;
    const path = expression[1].split('.').map(part => part.trim());
    let value = scope;
    for (const part of path) value = value?.[part];
    return escape(value ?? '');
  }).join('');
}

export function compileView(source) {
  return scope => compileTemplate(source, scope);
}

export function parseAttributes(source) {
  const attributes = {};
  const pattern = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g;
  let match;
  while ((match = pattern.exec(source))) attributes[match[1]] = match[2] ?? match[3] ?? match[4] ?? true;
  return attributes;
}

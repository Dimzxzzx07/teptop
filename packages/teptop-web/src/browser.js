const utilityRules = new Map([
  ['flex', 'display:flex'], ['grid', 'display:grid'], ['block', 'display:block'], ['hidden', 'display:none'],
  ['items-center', 'align-items:center'], ['justify-center', 'justify-content:center'],
  ['text-center', 'text-align:center'], ['font-bold', 'font-weight:700'],
  ['w-full', 'width:100%'], ['h-full', 'height:100%'], ['rounded', 'border-radius:0.25rem'],
  ['shadow', 'box-shadow:0 1px 3px rgb(0 0 0 / 0.12)'], ['p-4', 'padding:1rem'], ['m-4', 'margin:1rem'],
  ['gap-4', 'gap:1rem'], ['text-sm', 'font-size:0.875rem'], ['text-lg', 'font-size:1.125rem'],
  ['bg-white', 'background-color:#fff'], ['bg-slate-900', 'background-color:#0f172a'],
  ['text-white', 'color:#fff'], ['text-slate-900', 'color:#0f172a'],
]);

const escapeAttribute = value => String(value).replace(/[&<>"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character]));

export function renderHTML(template, data = {}) {
  return String(template).replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path) => {
    const value = path.split('.').reduce((current, key) => current?.[key], data);
    return escapeAttribute(value ?? '');
  });
}

export function compileUtilities(classes = '') {
  const declarations = new Map();
  for (const token of String(classes).split(/\s+/u).filter(Boolean)) {
    const rule = utilityRules.get(token);
    if (rule) declarations.set(rule.split(':')[0], rule);
  }
  return [...declarations.values()].join(';') + (declarations.size ? ';' : '');
}

export function createStyleSheet(classes = '') {
  return String(classes).split(/\s+/u).filter(Boolean).map(token => {
    const declarations = compileUtilities(token);
    return declarations ? `.${token.replace(/[^a-zA-Z0-9_-]/g, '\\$&')}{${declarations}}` : '';
  }).filter(Boolean).join('\n');
}
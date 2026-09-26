const escape = value => String(value).replace(/[&<>\"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'}[character]));

export function toHTML(value) {
  if (value == null || value === false || value === true) return '';
  if (typeof value !== 'object') return escape(value);
  if (Array.isArray(value)) return value.map(toHTML).join('');
  if (typeof value.tag === 'function') return toHTML(value.tag({...value.props, children: value.children}));
  const props = Object.entries(value.props || {}).filter(([name]) => !name.startsWith('on') && name !== 'key' && name !== 'ref');
  const attributes = props.map(([name, property]) => {
    const attribute = name === 'className' ? 'class' : name;
    const resolved = typeof property === 'function' ? property() : property;
    if (resolved === false || resolved == null) return '';
    return resolved === true ? ` ${attribute}` : ` ${attribute}="${escape(resolved)}"`;
  }).join('');
  const children = (value.children || []).map(toHTML).join('');
  if (['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(value.tag)) return `<${value.tag}${attributes}>`;
  return `<${value.tag}${attributes}>${children}</${value.tag}>`;
}

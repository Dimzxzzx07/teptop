const escape = value => String(value).replace(/[&<>\"']/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'}[character]));

function renderChildren(children) {
  let html = '';
  for (let index = 0; index < children.length;) {
    const child = children[index];
    const isText = value => value != null && value !== true && value !== false && typeof value !== 'object';
    if (!isText(child)) {
      html += toHTML(child);
      index++;
      continue;
    }
    let end = index + 1;
    while (end < children.length && isText(children[end])) end++;
    if (end - index > 1) {
      for (; index < end; index++) html += `<!--teptop:text-->${toHTML(children[index])}`;
    } else {
      html += toHTML(child);
      index = end;
    }
  }
  return html;
}

export function toHTML(value) {
  if (value == null || value === false || value === true) return '';
  if (typeof value !== 'object') return escape(value);
  if (Array.isArray(value)) return renderChildren(value.flat(Infinity));
  if (typeof value.tag === 'function') return toHTML(value.tag({...value.props, children: value.children}));
  if (value.tag === 'teptop-fragment') return `<!--teptop:fragment:start-->${renderChildren(value.children || [])}<!--teptop:fragment:end-->`;
  const props = Object.entries(value.props || {}).filter(([name]) => !name.startsWith('on') && name !== 'key' && name !== 'ref');
  const attributes = props.map(([name, property]) => {
    const attribute = name === 'className' ? 'class' : name;
    const resolved = typeof property === 'function' ? property() : property;
    if (resolved === false || resolved == null) return '';
    return resolved === true ? ` ${attribute}` : ` ${attribute}="${escape(resolved)}"`;
  }).join('');
  const children = renderChildren(value.children || []);
  if (['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(value.tag)) return `<${value.tag}${attributes}>`;
  return `<${value.tag}${attributes}>${children}</${value.tag}>`;
}

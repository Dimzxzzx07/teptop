const decode = value => decodeURIComponent(value || '');

export function matchPath(pattern, pathname) {
  const names = [];
  const source = pattern.split('/').map(segment => {
    if (segment === '*') { names.push('wildcard'); return '(.*)'; }
    if (segment.startsWith(':')) { names.push(segment.slice(1)); return '([^/]+)'; }
    return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }).join('/');
  const match = pathname.match(new RegExp(`^${source}/?$`));
  if (!match) return null;
  return {params: Object.fromEntries(names.map((name, index) => [name, decode(match[index + 1])])), pathname};
}

export function createMemoryRouter(routes, initialPath = '/') {
  let current = initialPath;
  const listeners = new Set();
  const router = {
    get path() { return current; },
    get params() { return router.match()?.params || {}; },
    match() {
      for (const [pattern, route] of Object.entries(routes)) {
        const result = matchPath(pattern, current);
        if (result) return {...result, pattern, route};
      }
      return null;
    },
    navigate(path) { current = path; listeners.forEach(listener => listener(current)); return current; },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    back() { return router.navigate('/'); },
  };
  return router;
}

export function link(router, path) {
  return {href: path, onclick: event => { event.preventDefault(); router.navigate(path); }};
}

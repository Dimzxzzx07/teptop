import {randomBytes, timingSafeEqual} from 'node:crypto';

const COOKIE = 'teptop_admin_session';
const SESSION_TTL = 8 * 60 * 60 * 1000;

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

function cookies(header = '') {
  return Object.fromEntries(header.split(';').map(part => part.trim()).filter(Boolean).map(part => {
    const index = part.indexOf('=');
    return index < 0 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
  }));
}

export function createAuth(options = {}) {
  const username = options.username || process.env.DASH_ADMIN_USER || 'admin';
  const password = options.password || process.env.DASH_ADMIN_PASSWORD || 'teptop-admin';
  const sessions = new Map();
  const production = process.env.NODE_ENV === 'production';

  return {
    credentials: {username, password},
    login(input) {
      if (!safeEqual(input?.username || '', username) || !safeEqual(input?.password || '', password)) return null;
      const token = randomBytes(32).toString('base64url');
      sessions.set(token, {username, expiresAt: Date.now() + SESSION_TTL});
      return {token, user: {username, role: 'admin'}};
    },
    session(request) {
      const token = cookies(request.headers.cookie)[COOKIE];
      const session = token && sessions.get(token);
      if (!session) return null;
      if (session.expiresAt < Date.now()) { sessions.delete(token); return null; }
      return {username: session.username, role: 'admin'};
    },
    logout(request) {
      const token = cookies(request.headers.cookie)[COOKIE];
      if (token) sessions.delete(token);
    },
    cookie(token, maxAge = SESSION_TTL / 1000) {
      return `${COOKIE}=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${maxAge}${production ? '; Secure' : ''}`;
    },
    clearCookie() {
      return `${COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0${production ? '; Secure' : ''}`;
    },
  };
}

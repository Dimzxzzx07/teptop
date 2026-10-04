import {signal} from '/runtime/index.js';
import {dataProvider} from '../data/provider.js';

export const currentUser = signal(null);
export const authStatus = signal('checking');
export const currentRoute = signal('/');
export const dashboardSummary = signal(null);
export const listState = signal({resource: 'customers', data: [], total: 0, page: 1, perPage: 10, loading: false, error: null, q: '', status: ''});
export const dialogState = signal(null);
export const noticeState = signal(null);

let noticeTimer;
let listRequestId = 0;
export function notify(message, type = 'success') {
  clearTimeout(noticeTimer);
  noticeState.set({message, type});
  noticeTimer = setTimeout(() => noticeState.set(null), 3200);
}

export async function checkSession() {
  authStatus.set('checking');
  try { currentUser.set(await dataProvider.getIdentity()); authStatus.set('ready'); }
  catch { currentUser.set(null); authStatus.set('signed-out'); }
}

export async function signIn(username, password) {
  const user = await dataProvider.login(username, password);
  currentUser.set(user);
  authStatus.set('ready');
  return user;
}

export async function signOut() {
  await dataProvider.logout();
  currentUser.set(null);
  authStatus.set('signed-out');
  navigate('/');
}

export function navigate(path) {
  if (globalThis.location.pathname !== path) globalThis.history.pushState({}, '', path);
  currentRoute.set(path);
}

export async function loadDashboard() {
  try { dashboardSummary.set(await dataProvider.dashboard()); }
  catch (error) { if (error.status === 401) { currentUser.set(null); authStatus.set('signed-out'); } else notify(error.message, 'error'); }
}

export async function loadList(resource, params = {}) {
  const requestId = ++listRequestId;
  const previous = listState.peek();
  const next = {...previous, resource, page: params.page ?? previous.page, q: params.q ?? previous.q, status: params.status ?? previous.status, loading: true, error: null};
  listState.set(next);
  try {
    const result = await dataProvider.getList(resource, next);
    if (requestId !== listRequestId) return;
    listState.set({...next, ...result, resource, loading: false, q: next.q, status: next.status});
  } catch (error) {
    if (requestId !== listRequestId) return;
    listState.set({...next, loading: false, error: error.message});
    if (error.status === 401) { currentUser.set(null); authStatus.set('signed-out'); }
  }
}

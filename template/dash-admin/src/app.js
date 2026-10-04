import {Fragment, h, render, signal} from '/runtime/index.js';
import {resourceConfig} from './config/resources.js';
import {Header} from './components/Header.js';
import {Sidebar} from './components/Sidebar.js';
import {DashboardPage} from './pages/DashboardPage.js';
import {LoginPage} from './pages/LoginPage.js';
import {ResourcePage} from './pages/ResourcePage.js';
import {authStatus, checkSession, currentRoute, currentUser, dashboardSummary, listState, loadDashboard, loadList, navigate, noticeState, notify, signIn, signOut} from './state/admin.js';

const sidebarOpen = signal(false);
let application;

function routeTitle(path) {
  const resource = path.slice(1);
  return resourceConfig[resource]?.label || 'Overview';
}

function handleNavigate(path) {
  sidebarOpen.set(false);
  navigate(path);
  if (resourceConfig[path.slice(1)]) loadList(path.slice(1), {page: 1, q: '', status: ''});
  else if (path === '/') loadDashboard();
}

async function handleLogin(username, password) {
  authStatus.set('submitting');
  try {
    await signIn(username, password);
    await loadDashboard();
    if (currentRoute() !== '/') await loadList(currentRoute().slice(1));
    notify('Welcome back.');
  } catch (error) {
    authStatus.set(`error:${error.message}`);
  }
}

export function AdminApp() {
  const status = authStatus();
  if (status === 'checking') return h('main', {className: 'boot-state'}, h('div', {className: 'brand-mark'}, 'F'), h('p', null, 'Connecting to workspace…'));
  if (!currentUser()) return h(LoginPage, {onLogin: handleLogin});

  const path = currentRoute();
  const resource = path.slice(1);
  const page = resourceConfig[resource] ? h(ResourcePage, {resource}) : h(DashboardPage, {onNavigate: handleNavigate});
  const notice = noticeState();
  return h(Fragment, null,
    h('div', {className: 'frame'},
      h(Sidebar, {route: path, open: sidebarOpen(), onNavigate: handleNavigate, onLogout: signOut}),
      h('div', {className: 'workspace'}, h(Header, {title: routeTitle(path), user: currentUser(), onMenu: () => sidebarOpen.update(open => !open), onLogout: signOut}), h('main', {className: 'main'}, page)),
    ),
    notice && h('div', {className: `notice${notice.type === 'error' ? ' error' : ''}`, role: 'status'}, notice.message),
  );
}

export async function startAdmin(target = document.querySelector('#app')) {
  if (!target) throw new Error('Missing #app mount node.');
  application = render(AdminApp, target);
  const popstate = () => {
    currentRoute.set(globalThis.location.pathname);
    const resource = globalThis.location.pathname.slice(1);
    if (resourceConfig[resource]) loadList(resource, {page: 1});
    else loadDashboard();
  };
  globalThis.addEventListener('popstate', popstate);
  await checkSession();
  if (currentUser()) {
    await loadDashboard();
    const resource = currentRoute().slice(1);
    if (resourceConfig[resource]) await loadList(resource, {page: 1});
  }
  return {
    destroy() {
      globalThis.removeEventListener('popstate', popstate);
      application?.destroy();
      application = undefined;
    },
  };
}

import {createEmitter} from '../events.js';
import {createRoot} from '../index.js';

const isFunction = value => typeof value === 'function';

export function createApp(options = {}) {
  const emitter = createEmitter({history: true});
  const providers = new Map(options.providers || []);
  const installed = new Set();
  const cleanups = [];
  let root;
  let mounted = false;
  const app = {
    name: options.name || 'teptop-app',
    config: {...(options.config || {})},
    events: emitter,
    get mounted() { return mounted; },
    use(plugin, pluginOptions) {
      if (!plugin || installed.has(plugin)) return app;
      installed.add(plugin);
      const install = isFunction(plugin) ? plugin : plugin.install;
      if (!isFunction(install)) throw new TypeError('Teptop plugins must be functions or expose install().');
      const cleanup = install(app, pluginOptions);
      if (isFunction(cleanup)) cleanups.push(cleanup);
      return app;
    },
    provide(key, value) { providers.set(key, value); return app; },
    inject(key, fallback) { return providers.has(key) ? providers.get(key) : fallback; },
    on(event, listener) { return emitter.on(event, listener); },
    emit(event, payload) { return emitter.emit(event, payload); },
    mount(target, view) {
      if (mounted) app.unmount();
      root = createRoot(target);
      const application = root.render(view);
      mounted = true;
      emitter.emit('mount', {target, application});
      return application;
    },
    unmount() {
      if (!mounted) return false;
      root?.unmount();
      root = undefined;
      mounted = false;
      emitter.emit('unmount');
      return true;
    },
    destroy() {
      app.unmount();
      cleanups.splice(0).reverse().forEach(cleanup => cleanup());
      emitter.emit('destroy');
      emitter.clear();
    },
  };
  (options.plugins || []).forEach(plugin => app.use(plugin));
  return app;
}

export function definePlugin(install, metadata = {}) {
  if (!isFunction(install)) throw new TypeError('Teptop plugin installers must be functions.');
  return Object.assign({install}, metadata);
}

export function createLoggerPlugin(options = {}) {
  const level = options.level || 'info';
  const methods = ['debug', 'info', 'warn', 'error'];
  return definePlugin(app => {
    const logger = options.logger || console;
    app.logger = {
      level,
      ...Object.fromEntries(methods.map(method => [method, (...args) => logger[method]?.(`[${app.name}]`, ...args)])),
    };
    return () => { delete app.logger; };
  }, {name: 'logger', version: '1.0.0'});
}

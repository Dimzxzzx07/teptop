const isFunction = value => typeof value === 'function';

export function compose(middleware = []) {
  const stack = middleware.filter(isFunction);
  return function dispatch(context = {}, next) {
    let index = -1;
    const run = position => {
      if (position <= index) return Promise.reject(new Error('Teptop middleware called next() more than once.'));
      index = position;
      const handler = stack[position] || next;
      if (!handler) return Promise.resolve(context);
      try {
        return Promise.resolve(handler(context, () => run(position + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    };
    return run(0);
  };
}

export function createPipeline(options = {}) {
  const middleware = [];
  const before = [];
  const after = [];
  const errors = [];
  const pipeline = {
    use(handler) {
      if (!isFunction(handler)) throw new TypeError('Teptop middleware must be a function.');
      middleware.push(handler);
      return () => {
        const index = middleware.indexOf(handler);
        if (index >= 0) middleware.splice(index, 1);
      };
    },
    before(handler) { before.push(handler); return pipeline; },
    after(handler) { after.unshift(handler); return pipeline; },
    onError(handler) { errors.push(handler); return pipeline; },
    size() { return middleware.length; },
    async run(input = {}, terminal) {
      let context = {...input};
      try {
        for (const handler of before) context = await handler(context) ?? context;
        context = await compose(middleware)(context, terminal);
        for (const handler of after) context = await handler(context) ?? context;
        return context;
      } catch (error) {
        let current = error;
        for (const handler of errors) current = await handler(current, context) ?? current;
        throw current;
      }
    },
  };
  (options.middleware || []).forEach(handler => pipeline.use(handler));
  return pipeline;
}

export function createRequestPipeline(options = {}) {
  const pipeline = createPipeline(options);
  pipeline.use(async (context, next) => {
    context.startedAt = Date.now();
    const result = await next();
    return {...result, duration: Date.now() - context.startedAt};
  });
  return pipeline;
}

export const withContext = (context, value, work) => { context.push(value); try { return work(); } finally { context.pop(); } };

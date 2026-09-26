export const inspectSignal = signal => ({value: signal.peek?.(), callable: typeof signal === 'function'});

export const onMount = work => queueMicrotask(work); export const onDispose = (scope, work) => scope?.add(work);

export const disposeAll = disposers => [...disposers].reverse().forEach(dispose => dispose());

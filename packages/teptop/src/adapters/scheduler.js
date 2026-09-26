export const scheduleFrame = work => requestAnimationFrame?.(work) ?? queueMicrotask(work);

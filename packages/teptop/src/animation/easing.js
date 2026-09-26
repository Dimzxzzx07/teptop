export const easing = {linear: value => value, easeIn: value => value * value, easeOut: value => 1 - (1 - value) ** 2};
export function interpolate(start, end, progress, curve = easing.linear) { return start + (end - start) * curve(progress); }

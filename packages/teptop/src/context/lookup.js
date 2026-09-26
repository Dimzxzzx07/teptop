export const lookup = (providers, key, fallback) => providers.find(item => item.key === key)?.value ?? fallback;

export const sanitizeText = value => String(value).replace(/[<>]/g, '');

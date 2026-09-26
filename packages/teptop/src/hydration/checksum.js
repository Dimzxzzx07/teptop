export const checksum = value => [...String(value)].reduce((total, character) => (total + character.charCodeAt(0)) % 65535, 0);

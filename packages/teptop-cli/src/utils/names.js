export function assertProjectName(name) {
  if (typeof name !== 'string' || !/^[a-z0-9][a-z0-9._-]*$/.test(name) || name === '.' || name === '..') {
    throw new Error(`Invalid project name "${name}". Use letters, numbers, dots, underscores, or hyphens.`);
  }
  return name;
}

export function pascalCase(value) {
  const words = String(value).split(/[^a-z0-9]+/i).filter(Boolean);
  if (!words.length) throw new Error('Generated names must contain letters or numbers.');
  return words.map(word => word[0].toUpperCase() + word.slice(1)).join('');
}

export function assertGeneratedName(value) {
  if (typeof value !== 'string' || !/^[a-z][a-z0-9-]*$/i.test(value)) {
    throw new Error(`Invalid generated name "${value}". Use a letter followed by letters, numbers, or hyphens.`);
  }
  return value;
}
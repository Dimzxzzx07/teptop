const issue = (path, message, value, code = 'invalid') => ({path, message, value, code});

export class ValidationError extends Error {
  constructor(issues) {
    super('Teptop validation failed');
    this.name = 'ValidationError';
    this.issues = issues;
  }
}

class Schema {
  constructor(check, name = 'value') { this.check = check; this.name = name; }
  parse(value, path = []) {
    const result = this.check(value, path);
    if (result.length) throw new ValidationError(result);
    return value;
  }
  safeParse(value) { try { return {success: true, data: this.parse(value)}; } catch (error) { return {success: false, error}; } }
  optional() { return new Schema((value, path) => value === undefined ? [] : this.check(value, path), `${this.name}?`); }
  nullable() { return new Schema((value, path) => value === null ? [] : this.check(value, path), `${this.name}|null`); }
  refine(predicate, message = 'Value failed refinement') { return new Schema((value, path) => [...this.check(value, path), ...(predicate(value) ? [] : [issue(path, message, value, 'refine')])], this.name); }
}

export const schema = {
  any: () => new Schema(() => [], 'any'),
  string: () => new Schema((value, path) => typeof value === 'string' ? [] : [issue(path, 'Expected a string', value, 'type')], 'string'),
  number: () => new Schema((value, path) => typeof value === 'number' && Number.isFinite(value) ? [] : [issue(path, 'Expected a finite number', value, 'type')], 'number'),
  boolean: () => new Schema((value, path) => typeof value === 'boolean' ? [] : [issue(path, 'Expected a boolean', value, 'type')], 'boolean'),
  literal: expected => new Schema((value, path) => Object.is(value, expected) ? [] : [issue(path, `Expected ${String(expected)}`, value, 'literal')], 'literal'),
  array: item => new Schema((value, path) => !Array.isArray(value) ? [issue(path, 'Expected an array', value, 'type')] : value.flatMap((itemValue, index) => item.check(itemValue, [...path, index])), 'array'),
  object: shape => new Schema((value, path) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return [issue(path, 'Expected an object', value, 'type')];
    return Object.entries(shape).flatMap(([key, item]) => item.check(value[key], [...path, key]));
  }, 'object'),
  union: schemas => new Schema((value, path) => schemas.some(item => item.check(value, path).length === 0) ? [] : [issue(path, 'Value did not match any union member', value, 'union')], 'union'),
};

export const validate = (value, definition) => definition.safeParse(value);
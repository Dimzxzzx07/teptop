import {computed, signal} from './index.js';

export function createForm(initialValues, validators = {}) {
  const values = signal(structuredClone(initialValues));
  const touched = signal({});
  const submitted = signal(false);
  const errors = computed(() => Object.fromEntries(Object.entries(validators).map(([field, validate]) => [field, validate(values()[field], values())]).filter(([, error]) => error)));
  const valid = computed(() => Object.keys(errors()).length === 0);
  return {
    values, errors, valid, touched, submitted,
    set(field, value) { values.update(current => ({...current, [field]: value})); },
    touch(field) { touched.update(current => ({...current, [field]: true})); },
    reset() { values.set(structuredClone(initialValues)); touched.set({}); submitted.set(false); },
    submit(handler) {
      submitted.set(true);
      if (!valid()) return false;
      handler(values());
      return true;
    },
  };
}

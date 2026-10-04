import {computed, signal} from 'teptop.js';

export const visits = signal(12840);
export const title = computed(() => `${visits().toLocaleString()} active sessions`);
export const metrics = signal({deployments: 248, availability: '99.98%', latency: '42ms'});

export function incrementVisits() {
  visits.update(value => value + 1);
}

import {resource} from '/teptop.js';

const activityRows = [
  ['Deploy completed', 'production', '2m ago'],
  ['New workspace created', 'team', '18m ago'],
  ['Resource cache warmed', 'system', '41m ago'],
];

export const activity = resource(async () => new Promise(resolve => setTimeout(() => resolve(activityRows), 180)));
activity.load();

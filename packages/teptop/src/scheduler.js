const queues = new Map([['user-blocking', []], ['normal', []], ['background', []]]);
const weights = {'user-blocking': 0, normal: 1, background: 2};
let nextId = 1;
let scheduled = false;

const drain = () => {
  scheduled = false;
  const jobs = [...queues.values()].flat().sort((a, b) => a.priority - b.priority);
  queues.forEach(queue => queue.splice(0));
  jobs.forEach(job => {
    if (!job.cancelled) job.run({id: job.id, priority: job.priorityName});
  });
};

const scheduleDrain = () => {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(drain);
};

export function schedule(work, priority = 'normal') {
  const priorityName = queues.has(priority) ? priority : 'normal';
  const job = {id: nextId++, run: work, priority: weights[priorityName], priorityName, cancelled: false};
  queues.get(priorityName).push(job);
  scheduleDrain();
  return {id: job.id, cancel: () => { job.cancelled = true; }};
}

export function scheduleSync(work) {
  return work({id: 0, priority: 'sync'});
}

export function cancelAll(priority) {
  const selected = priority ? [queues.get(priority) || []] : [...queues.values()];
  selected.flat().forEach(job => { job.cancelled = true; });
}

export function pendingCount() {
  return [...queues.values()].reduce((total, queue) => total + queue.filter(job => !job.cancelled).length, 0);
}

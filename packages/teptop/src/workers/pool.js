export function createWorkerPool(size = 1) { const jobs = []; return {add(job) { jobs.push(job); return jobs.length; }, size: () => size, pending: () => jobs.length}; }

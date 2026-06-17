const jobs = new Map();

export function createJob(job_id, data) {
  jobs.set(job_id, { status: 'pending', regenerate_count: 0, ...data, created_at: Date.now() });
}

export function updateJob(job_id, data) {
  const job = jobs.get(job_id);
  if (job) jobs.set(job_id, { ...job, ...data });
}

export function getJob(job_id) {
  return jobs.get(job_id) ?? null;
}

export function deleteJob(job_id) {
  jobs.delete(job_id);
}

import { Router } from 'express';
import { randomUUID } from 'crypto';
import { createJob, getJob } from '../utils/jobStore.js';
import { startGeneratePipeline, confirmStory } from '../services/pipelineService.js';

const router = Router();

// POST /v1/stories/generate
router.post('/generate', async (req, res, next) => {
  try {
    const job_id = randomUUID();
    createJob(job_id, { status: 'pending' });

    // 백그라운드 실행
    startGeneratePipeline(job_id, req.body);

    res.status(202).json({ job_id });
  } catch (err) {
    next(err);
  }
});

// GET /v1/stories/jobs/:job_id
router.get('/jobs/:job_id', (req, res) => {
  const job = getJob(req.params.job_id);
  if (!job) return res.status(404).json({ error: 'job을 찾을 수 없습니다.' });
  res.json(job);
});

// POST /v1/stories/:job_id/confirm
router.post('/:job_id/confirm', async (req, res, next) => {
  try {
    const story_id = await confirmStory(req.params.job_id);
    res.json({ story_id });
  } catch (err) {
    next(err);
  }
});

export default router;

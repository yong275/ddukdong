import { Router } from 'express';
import { randomUUID } from 'crypto';
import { createJob, getJob } from '../utils/jobStore.js';
import { startGeneratePipeline, confirmStory, regenerateStory } from '../services/pipelineService.js';
import { generateStoryPdf } from '../services/pdfService.js';
import { requireAuth } from '../middleware/auth.js';
import supabase from '../db/supabase.js';

const router = Router();

// POST /v1/stories/generate
router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const job_id = randomUUID();
    createJob(job_id, { status: 'pending', user_id: req.user.id });
    startGeneratePipeline(job_id, req.body, req.user.id);
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

// POST /v1/stories/jobs/:job_id/regenerate
router.post('/jobs/:job_id/regenerate', requireAuth, async (req, res, next) => {
  try {
    await regenerateStory(req.params.job_id);
    res.status(202).json({ message: '재생성을 시작합니다.' });
  } catch (err) {
    next(err);
  }
});

// GET /v1/stories — 내 동화 목록
router.get('/', async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    let query = supabase
      .from('stories')
      .select('id, title, art_style, cover_url, status, created_at')
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    // 토큰 있으면 해당 유저 것만, 없으면 빈 배열
    if (header?.startsWith('Bearer ')) {
      const { data: { user } } = await supabase.auth.getUser(header.slice(7));
      if (user) query = query.eq('user_id', user.id);
      else return res.json([]);
    } else {
      return res.json([]);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// GET /v1/stories/:story_id — 동화 상세 (pages 포함)
router.get('/:story_id', requireAuth, async (req, res, next) => {
  try {
    const { data: story, error: se } = await supabase
      .from('stories')
      .select('*')
      .eq('id', req.params.story_id)
      .eq('user_id', req.user.id)
      .single();

    if (se || !story) return res.status(404).json({ error: '동화를 찾을 수 없습니다.' });

    const { data: pages, error: pe } = await supabase
      .from('pages')
      .select('id, page_number, text_ko, text_translated, translate_lang, image_url')
      .eq('story_id', req.params.story_id)
      .order('page_number');

    if (pe) throw new Error(pe.message);

    res.json({ ...story, pages: pages || [] });
  } catch (err) {
    next(err);
  }
});

// DELETE /v1/stories/:story_id — 동화 삭제
router.delete('/:story_id', requireAuth, async (req, res, next) => {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', req.params.story_id)
      .eq('user_id', req.user.id);

    if (error) throw new Error(error.message);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /v1/stories/:job_id/confirm
router.post('/:job_id/confirm', requireAuth, async (req, res, next) => {
  try {
    const story_id = await confirmStory(req.params.job_id);
    res.json({ story_id });
  } catch (err) {
    next(err);
  }
});

// GET /v1/stories/:story_id/pdf
router.get('/:story_id/pdf', async (req, res, next) => {
  try {
    const doc = await generateStoryPdf(req.params.story_id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="story.pdf"');
    doc.pipe(res);
  } catch (err) {
    next(err);
  }
});

export default router;

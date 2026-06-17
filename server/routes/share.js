import { Router } from 'express';
import supabase from '../db/supabase.js';

const router = Router();

// GET /v1/share/:story_id — 비로그인 읽기 전용
router.get('/:story_id', async (req, res, next) => {
  try {
    const { story_id } = req.params;

    const { data: story, error: storyError } = await supabase
      .from('stories')
      .select('id, title, art_style, character_name, status, cover_url, created_at')
      .eq('id', story_id)
      .eq('status', 'completed')
      .single();

    if (storyError || !story) {
      return res.status(404).json({ error: '동화를 찾을 수 없습니다.' });
    }

    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('page_number, text_ko, image_url')
      .eq('story_id', story_id)
      .order('page_number');

    if (pagesError) throw new Error(pagesError.message);

    res.json({ story, pages });
  } catch (err) {
    next(err);
  }
});

export default router;

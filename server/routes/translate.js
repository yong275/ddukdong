import { Router } from 'express';
import { translateStory } from '../services/translateService.js';

const router = Router();

// POST /v1/stories/:story_id/translate
router.post('/:story_id/translate', async (req, res, next) => {
  try {
    const { story_id } = req.params;
    const { lang = 'en' } = req.body;

    const result = await translateStory(story_id, lang);
    res.json({ success: true, pages: result });
  } catch (err) {
    next(err);
  }
});

export default router;

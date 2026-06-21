import { Router } from 'express';
import { translateTexts } from '../services/translateService.js';

const router = Router();

// POST /v1/translate  — DB 없이 raw 텍스트 번역 (샘플 동화용)
router.post('/', async (req, res, next) => {
  try {
    const { texts, lang = 'en' } = req.body;
    if (!Array.isArray(texts) || !texts.length) {
      return res.status(400).json({ error: 'texts 배열이 필요합니다.' });
    }
    const translated = await translateTexts(texts, lang);
    res.json({ success: true, texts: translated });
  } catch (err) {
    next(err);
  }
});

export default router;

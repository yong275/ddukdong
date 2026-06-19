import { Router } from 'express';
import { OPTIONS } from '../data/options.js';

const router = Router();

router.get('/', (req, res) => {
  res.json(OPTIONS);
});

export default router;

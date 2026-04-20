import { Router } from 'express';
import { runSeed } from '../../prisma/seed';

const router = Router();

router.post('/', async (_req, res) => {
  try {
    const result = await runSeed();
    res.json({ ok: true, ...result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

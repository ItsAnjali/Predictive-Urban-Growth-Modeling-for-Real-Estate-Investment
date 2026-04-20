import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/', async (_req, res) => {
  const jobs = await prisma.uploadJob.findMany({ orderBy: { uploadedAt: 'desc' }, take: 20 });
  res.json(jobs);
});

export default router;

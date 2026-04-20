import { Router } from 'express';
import { prisma } from '../db';
import { weightsSchema } from '../schemas/zone';
import { getWeights, rescoreAllZones } from '../services/rescore';

const router = Router();

router.get('/weights', async (_req, res) => {
  const weights = await getWeights();
  res.json(weights);
});

router.patch('/weights', async (req, res) => {
  const parsed = weightsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  await prisma.scoringWeights.upsert({
    where: { id: 1 },
    update: parsed.data,
    create: { id: 1, ...parsed.data },
  });
  await rescoreAllZones();
  res.json(parsed.data);
});

export default router;

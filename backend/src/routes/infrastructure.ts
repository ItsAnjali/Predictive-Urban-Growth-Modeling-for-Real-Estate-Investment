import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

router.get('/', async (req, res) => {
  const { zoneId } = req.query as Record<string, string>;
  const where = zoneId ? { zoneId } : {};
  const projects = await prisma.infrastructureProject.findMany({
    where,
    include: { zone: { select: { name: true, city: true } } },
    orderBy: { impactScore: 'desc' },
  });
  res.json(projects);
});

export default router;

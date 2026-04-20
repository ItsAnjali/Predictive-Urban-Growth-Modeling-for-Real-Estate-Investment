import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../db';
import { zoneInputSchema, zoneUpdateSchema } from '../schemas/zone';
import { parseZonePayload } from '../services/ingestion';
import { getWeights, rescoreAllZones } from '../services/rescore';
import { buildRanges, computeGVS } from '../services/scoring';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', async (req, res) => {
  const { city, minScore, filter } = req.query as Record<string, string>;
  const where: any = {};
  if (city) where.city = city;
  if (minScore) where.growthVelocityScore = { gte: Number(minScore) };

  let zones = await prisma.zone.findMany({ where, orderBy: { growthVelocityScore: 'desc' } });

  if (filter === 'rental') zones = zones.filter((z) => z.rentalAbsorptionRate >= 0.7);
  else if (filter === 'infra') zones = zones.filter((z) => z.infrastructureActivityScore >= 0.7);
  else if (filter === 'high') zones = zones.filter((z) => z.growthVelocityScore >= 70);
  else if (filter === 'undervalued') {
    // yield-to-price delta: high rental yield relative to selling price = undervalued.
    // Compare each zone's yield/price ratio against the city median.
    const ratios = zones.map((z) => z.rentalYieldPercent / z.avgPricePerSqFt);
    const sorted = [...ratios].sort((a, b) => a - b);
    const medianRatio = sorted[Math.floor(sorted.length / 2)] || 0;
    zones = zones.filter((z, i) => ratios[i] > medianRatio && z.growthVelocityScore >= 55);
  }

  res.json(zones);
});

router.get('/:id', async (req, res) => {
  const zone = await prisma.zone.findUnique({
    where: { id: req.params.id },
    include: { infrastructureProjects: true },
  });
  if (!zone) return res.status(404).json({ error: 'Not found' });
  const all = await prisma.zone.findMany();
  const weights = await getWeights();
  const ranges = buildRanges(all);
  const result = computeGVS(zone, weights, ranges);
  res.json({ ...zone, scoring: result });
});

router.post('/', async (req, res) => {
  const parsed = zoneInputSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  const zone = await prisma.zone.create({ data: parsed.data });
  await rescoreAllZones();
  res.status(201).json(zone);
});

router.patch('/:id', async (req, res) => {
  const parsed = zoneUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues });
  const zone = await prisma.zone.update({ where: { id: req.params.id }, data: parsed.data });
  await rescoreAllZones();
  res.json(zone);
});

router.delete('/:id', async (req, res) => {
  await prisma.zone.delete({ where: { id: req.params.id } });
  await rescoreAllZones();
  res.status(204).end();
});

router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required (field name: file)' });
  const fileName = req.file.originalname;
  const sourceType = fileName.toLowerCase().endsWith('.json') ? 'json' : 'csv';

  try {
    const { valid, errors } = parseZonePayload(req.file.buffer, fileName);
    for (const row of valid) {
      await prisma.zone.upsert({
        where: { name_city: { name: row.name, city: row.city } },
        update: row,
        create: row,
      });
    }
    await rescoreAllZones();
    const status = errors.length === 0 ? 'success' : valid.length === 0 ? 'failed' : 'partial';
    const job = await prisma.uploadJob.create({
      data: {
        sourceType,
        fileName,
        status,
        rowCount: valid.length,
        message: errors.length ? JSON.stringify(errors).slice(0, 500) : null,
      },
    });
    res.json({ job, inserted: valid.length, errors });
  } catch (err: any) {
    await prisma.uploadJob.create({
      data: { sourceType, fileName, status: 'failed', message: err.message },
    });
    res.status(400).json({ error: err.message });
  }
});

export default router;

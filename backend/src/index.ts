import express from 'express';
import cors from 'cors';
import { env } from './config';
import zonesRouter from './routes/zones';
import analyticsRouter from './routes/analytics';
import configRouter from './routes/config';
import infrastructureRouter from './routes/infrastructure';
import seedRouter from './routes/seed';
import uploadsRouter from './routes/uploads';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'growth-model-api' }));

app.use('/api/zones', zonesRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/config', configRouter);
app.use('/api/infrastructure', infrastructureRouter);
app.use('/api/seed', seedRouter);
app.use('/api/uploads', uploadsRouter);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(env.port, () => {
  console.log(`[growth-model] API listening on http://localhost:${env.port}`);
});

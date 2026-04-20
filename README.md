# Predictive Urban Growth Modeling — MVP

An investor-style dashboard that combines municipal infrastructure activity, listing density, pricing velocity, rental absorption and oversupply risk into a single explainable **Growth Velocity Score (GVS)** per zone, and visualizes likely high-opportunity areas on an interactive map.

Demo city: **Bangalore** · 15 fictional zones · all data is mock or user-uploaded.

> Not a forecasting oracle. The score is a transparent weighted heuristic — see [`docs/SCORING_METHODOLOGY.md`](docs/SCORING_METHODOLOGY.md).

## Tech stack

Frontend: React + TypeScript + Vite · Tailwind CSS · Leaflet (+ leaflet.heat) · TanStack Query · Recharts · React Hook Form · Zod
Backend: Node.js + Express + TypeScript · Prisma ORM · Zod · Multer (CSV/JSON upload) · csv-parse
Database: SQLite (local dev) — swap to PostgreSQL for production by changing `provider` in `prisma/schema.prisma`

## Project structure

Growth_model/
├── backend/        Express API, Prisma schema, scoring engine, seed
├── frontend/       Vite React dashboard
├── sample-data/    CSV / JSON samples for the upload flow
└── docs/           SCORING_METHODOLOGY.md

## How to run

### 1. Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev          # http://localhost:4001
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173 (or 5174)
```

If frontend lands on a different port, set `CORS_ORIGIN` in `backend/.env` to match, then restart the backend.

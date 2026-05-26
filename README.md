# FinLens

FinLens is an India-first financial intelligence and revenue assurance platform MVP.

This scaffold implements:

- A Next.js app with Manufacturing, Retail, and SaaS/Technology demo workspaces.
- Deterministic ratio computation from seeded financial data.
- Demo document health, capability unlocks, warnings, revenue leak findings, forecasts, and lineage.
- A privacy-safe `InsightBlueprint` preview that represents the only payload shape intended for LLM interpretation.
- API routes for demo workspace contracts.
- A FastAPI processing-service scaffold under `services/api`.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run test
npm run build
```

## Backend Scaffold

The Python service is intentionally separate:

```bash
cd services/api
python -m venv .venv
.venv\Scripts\activate
pip install -e .
fastapi dev app/main.py
```

The frontend currently uses seeded local contracts so the MVP can be explored without database, object storage, Clerk, Redis, or worker infrastructure.

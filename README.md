# pymehub

Monorepo de 4 apps para PYMEs chilenas proveedoras del Estado.

> V2 repensada de `/DEVELOPMENT/ParaPymes/`. Misma superficie, stack más barato.

## Apps

| App | Descripción | Estado |
|---|---|---|
| `apps/api` | Ingesta ChileCompra → Postgres + Redis (BullMQ) | Real (F1) |
| `apps/web` | Dashboard PYMEs (Next.js 16 BFF + Supabase) | Real (F2) |
| `apps/fondos` | Scraper fondos concursables (descripción) | aiGenerated (F3 stub) |
| `apps/analytics` | ML + RAG + SNA (descripción) | aiGenerated (F4 stub) |

## Stack

- Monorepo: pnpm workspaces + Turborepo
- Backend: NestJS 11 + Fastify + Prisma 7 + Postgres 16 + Redis (BullMQ)
- Frontend: Next.js 16 (RSC + Server Actions) + Tailwind 4 + shadcn/ui + Zustand
- Auth: Supabase (Postgres + RLS + Auth)
- Validation: Zod · Logging: Pino · Testing: Vitest · Resilience: opossum

## Quick start

```bash
# Install
pnpm install

# Dev (api en :3000, web en :3001 — puerto distinto configurado en apps/web/.env.local)
pnpm --filter @pymehub/api dev
pnpm --filter @pymehub/web dev

# Build all
pnpm turbo build

# Test all
pnpm turbo test
```

## Docs

- [`docs/_CONCEPTO.md`](docs/_CONCEPTO.md) — origen de ideación
- Fases y progreso → ver `/work:create-backlog`
# CLAUDE.md — pymehub

Reglas específicas de este proyecto. Complementan (no reemplazan) `~/.claude/CLAUDE.md`.

## Documento de origen

El spec del proyecto vive en [`docs/_CONCEPTO.md`](docs/_CONCEPTO.md). Toda decisión arquitectónica se valida contra ese doc. Si hay conflicto entre `_CONCEPTO` y este archivo, gana `_CONCEPTO`.

## Stack (resumen, full en `_CONCEPTO.md`)

- **Monorepo**: pnpm workspaces + Turborepo
- **apps/api**: NestJS 11 + Fastify + Prisma 7 + Postgres 16 + Redis 7 (BullMQ) + opossum + Zod + Pino + Vitest
- **apps/web**: Next.js 16 (RSC + Server Actions) + Tailwind 4 + shadcn/ui + Radix + Zustand + Supabase + Vitest + Playwright
- **apps/fondos**: stub aiGenerated (NestJS placeholder)
- **apps/analytics**: stub aiGenerated (FastAPI placeholder)
- **Hosting**: long-running containers (Railway/Render)

## Migraciones pendientes (de templates al concept)

- **api**: reemplazar `class-validator` + `class-transformer` por `zod` (pipes custom NestJS)
- **api**: reemplazar Jest por Vitest (mantener `@nestjs/testing` para módulos)
- **web**: instalar shadcn/ui + Zustand + Supabase client (no vienen en template-nextjs-fullstack)

## Convenciones de Fase

- F1 (`api` ETL ChileCompra) debe shippear antes de empezar F2.
- F3 (`fondos`) y F4 (`analytics`) son stubs aiGenerated — implementación diferida salvo decisión explícita.
- No commitear `node_modules/`, `.env`, `.next/`, `dist/` (ya en `.gitignore`).

## Resiliencia

- Toda llamada a ChileCompra API pasa por Circuit Breaker (opossum).
- Todo job BullMQ declara `attempts` + `backoff` + `removeOnComplete`/`removeOnFail`.
- BullMQ `failedRegistry` actúa como DLQ — alerta cuando supera threshold.

## Testing

- Unit + Integration: Vitest
- E2E: Playwright solo en F2 (web)
- Mockear ChileCompra HTTP client con `msw` o `nock` en suite unit.

## Secrets

- `.env` por app (`apps/api/.env`, `apps/web/.env.local`).
- Variables sensibles (`DATABASE_URL`, `REDIS_URL`, `SUPABASE_SERVICE_KEY`) nunca en código.
- `.gitignore` excluye todos los `.env*`.
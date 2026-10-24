# concept-pymehub

> Origen: DEVELOPMENT/concept-pymehub.md (ideación)
>
> Draft de concepto. Fase de bases (`/work:resume:new-project`). Cruzado contra norte + gaps.
> Scope de esta sesion: SOLO este archivo. No hay carpeta ni codigo; forks de F1 decididos como
> defaults recomendados (revisables al construir); no toca resume.json.
> Siguiente paso: `/work:create-backlog` lee este doc → fases + progress.json.

## Proposito

Reimplementación de ParaPymes (ecosistema de 4 apps para PYMEs chilenas proveedoras del Estado) con stack más barato y mantenible. Mantiene la superficie de 4 servicios (api + web + fondos + analytics) para no perder el brand en CV, pero **solo implementa 2** (api + web). `fondos` + `analytics` quedan como stubs aiGenerated (carpeta + package.json mínimo) — descripciones aspiracionales, sin código real.

Es la **v2 repensada** del proyecto `/DEVELOPMENT/ParaPymes/`.

## Que es / Que no es

| Es | No es |
|---|---|
| Monorepo de 4 apps (api + web + fondos + analytics) | SaaS multi-tenant o producto público |
| Stack más barato: long-running + Redis + Postgres, sin Lambda/SQS | Un clon 1:1 de ParaPymes (FASE_5/6 XGBoost+RAG siguen bloqueadas) |
| api + web implementados de verdad; fondos + analytics aiGenerated | 4 apps implementadas (riesgo gold-plating) |
| ETL ChileCompra + dashboard mínimo para PYMEs | BI predictivo / RAG / SNA (queda en stub) |
| Single-user friendly (autoservicio para Freddy) | Producto para vender |

## Modelo de dominio

```
RUT de la PYME (usuario)
    │
    ├── api (NestJS)         → Ingesta ChileCompra (REST + bulk OCDS) → Postgres
    │     └── Redis cache + BullMQ queue
    │
    ├── web (Next.js 16 BFF) → Dashboard: lista licitaciones, filtros, favoritos
    │     └── Auth Supabase, RSC puro + Server Actions
    │
    ├── fondos (stub aiGen)  → Scraper fondos.gob.cl + matching (DESCRIPCION ONLY)
    │
    └── analytics (stub aiGen) → ML ranking + RAG + SNA (DESCRIPCION ONLY)
```

### Dependencias entre apps

| App | Depende de | aiGenerated |
|---|---|---|
| api | ChileCompra API + Postgres + Redis | No (real) |
| web | api + Supabase | No (real) |
| fondos | (scraper hipotético) | **Sí** (stub) |
| analytics | api + datos historicos | **Sí** (stub) |

## Stack

| Capa | Tech | Fuente |
|---|---|---|
| Runtime | Node.js 22 LTS | [feature] |
| Monorepo | pnpm workspaces + Turborepo | [feature] status quo ParaPymes |
| Backend FW | NestJS 11 + Fastify | [norte] Clean Architecture; [feature] status quo |
| ORM | Prisma 7 | [feature] status quo ct-fondos |
| DB | Postgres 16 | [norte] SQL opts + DB indexing; [gap] sql-postgres-depth |
| Cache + Queue | Redis 7 (BullMQ) | [norte] Redis project wishlist |
| Cron/Scheduler | BullMQ + workers NestJS | [norte] distributed patterns; [feature] reemplaza Lambda |
| Validation | Zod 3 | [norte] TS avanzado |
| Logging | Pino + nestjs-pino | [feature] |
| Testing | Vitest + @nestjs/testing | [feature] más rápido que Jest |
| Resilience | opossum (Circuit Breaker) | [norte] resilience patterns |
| Frontend FW | Next.js 16 App Router | [feature] status quo ct-core-web |
| Server state | RSC puro + Server Actions | [feature] stack más barato |
| Client state | Zustand | [norte] |
| UI components | shadcn/ui + Radix | [norte] |
| Styling | Tailwind 4 | [feature] status quo |
| Auth | Supabase (Postgres + RLS + Auth) | [feature] status quo ct-core-web |
| BFF | Next.js Route Handlers (web actúa de BFF) | [norte] 1 proyecto BFF |
| Container dev | Docker Compose (Postgres + Redis + api) | [feature] status quo |
| Container deploy | Dockerfile per app (Railway/Render) | [feature] long-running |
| Hosting | Railway / Render long-running containers | [feature] cheaper stack |

## Practice-wishlist (lo que este concepto entrena)

### NORTE cerrado

- **Redis** (cache + queue + pub/sub via BullMQ)
- **BFF architecture** (Next.js Route Handlers actúa de agregador)
- **Clean Architecture (ports & adapters)** via NestJS módulos + DI
- **Resilience patterns**: Circuit Breaker (opossum), Retry exponencial, Idempotencia (idempotency-key)
- **TypeScript avanzado** (Prisma generated types + Zod inference + generics constraints)
- **Transaction isolation levels** (Postgres via Prisma `$transaction`)
- **DB indexing** (composite + covering indexes en `CodigoExterno`, `RUT`, fechas)
- **Microservices Architecture** (4 servicios en monorepo)
- **Distributed patterns** (queue + DLQ via BullMQ failed jobs)
- **SQL Query Optimization + High-Volume Data SQL** (ETL bulk OCDS contra Postgres)
- **Dead Letter Queue** (BullMQ `failedRegistry`)
- **shadcn/ui** (copy-paste components + Radix primitives)
- **Zustand** (auth state + UI efímero)
- **Load balancer / Auto-scaling** (Railway replica scaling)
- **Read replicas** (Postgres read replica para ct-core-web reads vs ct-core-api writes)

### Gaps cerrados

- **SOLID-práctico** (Clean Architecture enforcement via NestJS)
- **sql-postgres-depth** (ETL real contra Postgres con índices + EXPLAIN)
- **TDD practice** (Vitest en api + web)
- **practica-redis** (BullMQ + cache + pub/sub)
- **practica-tdd** (suite Vitest desde F1)

## Fases (F1 PROTEGIDO)

### F1 — `api` (NestJS) ETL ChileCompra end-to-end

**DEBE entregar valor real.** Esto es el "ship-ready mínimo" — si F1 falla, no se shippea.

- [ ] `apps/api/package.json` + NestJS 11 + Fastify + Prisma 7
- [ ] `apps/api/prisma/schema.prisma` con `Licitacion` + `Organismo` + `CodigoExterno` UNIQUE
- [ ] `apps/api/src/modules/chile-compra/` — cliente REST con Circuit Breaker (opossum)
- [ ] `apps/api/src/modules/ingesta/` — BullMQ worker que ingiere ChileCompra cada 24h
- [ ] `apps/api/src/modules/ingesta/` — BullMQ `failedRegistry` configurado (DLQ)
- [ ] `apps/api/src/common/` — Zod validation pipes + Pino logger global
- [ ] `apps/api/test/` — Vitest suite con `ChileCompraClient` mock + idempotencia test
- [ ] `docker-compose.yml` — Postgres 16 + Redis 7 + api service
- [ ] `apps/api/README.md` con `pnpm dev` (sube el stack completo)

### F2 — `web` (Next.js 16) BFF + dashboard mínimo

- [ ] `apps/web/package.json` + Next.js 16 App Router + Tailwind 4 + shadcn/ui
- [ ] `apps/web/src/app/(auth)/login/` — Supabase auth UI
- [ ] `apps/web/src/app/dashboard/page.tsx` — RSC puro fetcheando api vía Route Handler (BFF)
- [ ] `apps/web/src/app/api/webhooks/` — Server Action para "favorito" toggle (writes)
- [ ] `apps/web/src/stores/auth.store.ts` — Zustand para sesión cliente
- [ ] `apps/web/src/components/ui/` — shadcn primitives (button, card, table, input)
- [ ] `apps/web/test/` — Vitest para stores + e2e con Playwright mínimo
- [ ] Auth RLS en Supabase: solo el RUT del user ve sus favoritos

### F3 — `fondos` (stub aiGenerated)

- [ ] `apps/fondos/package.json` mínimo (NestJS placeholder, scripts `dev:noop`)
- [ ] `apps/fondos/README.md` describiendo el diseño scraper (Playwright fondos.gob.cl)
- [ ] `apps/fondos/src/app.module.ts` con módulo vacío + comentario `// aiGenerated — implementation deferred`
- [ ] Marcado en `resume.json` con `"aiGenerated": true`

### F4 — `analytics` (stub aiGenerated)

- [ ] `apps/analytics/package.json` mínimo (FastAPI placeholder o NestJS stub, decisión F4)
- [ ] `apps/analytics/README.md` describiendo XGBoost + RAG + SNA
- [ ] Marcado en `resume.json` con `"aiGenerated": true`

### F5 — Hardening + deploy

- [ ] CI: GitHub Actions (lint → build → vitest → prisma migrate deploy → smoke test)
- [ ] Railway/Render config: 1 servicio por app + health checks
- [ ] Monitoring: Pino → Logtail (o similar) + uptime monitor
- [ ] Rate limiting en api: `@nestjs/throttler` con store Redis
- [ ] Backup Postgres automático (Railway addon)

## Fuera de alcance v1

- RAG / LlamaIndex / pgvector (queda en F4 stub)
- XGBoost + SMOTE + SNA (queda en F4 stub)
- Multi-tenant real (single-user, autoservicio)
- AWS Lambda / SQS / S3 (reemplazado por Redis + Railway)
- Mobile / PWA nativa
- Tests E2E exhaustivos (solo smoke en F1, básico en F2)

## Riesgos

- **Gold-plating**: si F1 insiste en meter web o fondos juntos → SCOPE CREEP. F1 = SOLO api ingestando ChileCompra. Web en F2. Fondos + analytics en stubs.
- **Postgres-only**: si scraping fondos en F3 futuro requiere MongoDB (datos no relacionales), reconsiderar. Pero F1 no toca eso.
- **BullMQ lock-in Redis**: si el día de mañana se quiere quitar Redis, hay que migrar queue. Acceptable: Redis ya está en stack por [norte].
- **shadcn copy-paste**: genera drift entre instancias. Documentar convención en `apps/web/CONTRIBUTING.md`.
- **Vitest + NestJS**: menos examples que Jest. Si bloquea F1, fallback a Jest (bajo costo).
- **Costos Railway**: 4 servicios pueden sumar ~$25-50 USD/mes en plan hobby. Documentar y avisar antes de F5.

## Notas para el siguiente paso

- Cuando se ejecute `/work:resume:new-project`, este archivo se copia tal cual a `apps/pymehub/docs/_CONCEPTO.md` (o equivalente) y crea el draft en `resume.json`.
- Los 4 proyectos en `resume.json` deben respetar el patrón aiGenerated: api + web = `false`, fondos + analytics = `true`.
- F1 debe ser SHIPPABLE antes de empezar F2. No acumular deuda cross-fase.
# FASE 1: api ETL ChileCompra end-to-end

**Status**: ⏸️ PENDIENTE
**Prioridad**: Alta (PRIMERA FASE REAL — F1 PROTEGIDO)
**Dependencias**: FASE_0

## Objetivo

Implementar `apps/api` con ETL diario de ChileCompra → Postgres + Redis (BullMQ). **DEBE** entregar valor real end-to-end: 1 vez ejecutado, devuelve licitaciones ingestadas consultables vía REST. Si F1 no funciona, no se avanza a F2.

## Orden de ejecución

> Tareas con dependencias internas dentro de esta fase.

1. Tarea 1.1 — Instalar dependencias y migrar validadores (crea base que 1.2-1.5 usan)
2. Tarea 1.2 — Prisma schema + migración (tabla base para 1.3-1.5)
3. Tarea 1.3 — Cliente ChileCompra con Circuit Breaker (consumido por 1.4)
4. Tarea 1.4 — BullMQ worker ingesta (orquestador diario)
5. Tarea 1.5 — REST controller GET /licitaciones (consumido por F2)
6. Tarea 1.6 — Tests Vitest (cubre 1.3 + 1.4)
7. Tarea 1.7 — Docker Compose dev (Postgres + Redis + api)

## Tareas

### Tarea 1.1: Migrar `class-validator` → `zod` + Jest → Vitest

- Archivo: `apps/api/package.json` (modificar deps), `apps/api/src/main.ts`, `apps/api/src/app.module.ts`
- Qué hacer:
  - Remover: `class-validator`, `class-transformer`, `jest`, `@types/jest`, `ts-jest`, `supertest`, `@nestjs/testing` (este último mantener — Vitest lo usa).
  - Agregar: `zod`, `vitest`, `@vitest/coverage-v8`.
  - Reemplazar `ValidationPipe` global por custom `ZodValidationPipe` que use schemas Zod.
  - Reemplazar todos los DTOs `class-validator` por schemas Zod en `apps/api/src/modules/*/dto/`.
  - Actualizar `apps/api/test/jest-e2e.json` → `apps/api/vitest.config.ts`.
- Referencia: patrón en `/DEVELOPMENT/ParaPymes/apps/ct-core-api/` (allí se usa class-validator, revisar para entender el delta).

### Tarea 1.2: Prisma schema + migración inicial

- Archivo: `apps/api/prisma/schema.prisma` (modificar), nueva migración `apps/api/prisma/migrations/<timestamp>_init/migration.sql`
- Qué hacer:
  - Modelo `Licitacion`: id (UUID), codigoExterno (String UNIQUE), nombre, organismoId, montoCLP (Decimal), fechaPublicacion, fechaCierre, estado, rawJson (JsonB), createdAt, updatedAt.
  - Modelo `Organismo`: id, codigo (String UNIQUE), nombre, sector.
  - Índices: `Licitacion(codigoExterno)` UNIQUE, `Licitacion(fechaCierre)` para queries por ventana, `Licitacion(organismoId, fechaPublicacion)` composite.
  - Generar migración: `pnpm --filter @pymehub/api prisma migrate dev --name init`.
  - Seed opcional: 0 organismos + 0 licitaciones (seed real desde ChileCompra en Tarea 1.4).

### Tarea 1.3: Cliente HTTP ChileCompra con Circuit Breaker

- Archivo: `apps/api/src/modules/chile-compra/chile-compra.client.ts` (crear)
- Qué hacer:
  - Clase `ChileCompraClient` con método `listarLicitaciones({ fechaDesde, fechaHasta, organismoCodigo? })`.
  - Wrap de cada request HTTP (axios o fetch) con `opossum` circuit breaker: `timeout: 10_000`, `errorThresholdPercentage: 50`, `resetTimeout: 30_000`.
  - Logger Pino: cada request logueado con método + URL + status + latency.
  - Retry exponencial solo para errores 5xx (NO 4xx): 3 intentos, backoff 1s → 2s → 4s.
  - Zod schema `LicitacionChileCompraSchema` para validar respuesta de la API externa.
- Referencia: `/DEVELOPMENT/ParaPymes/apps/ct-core-api/src/modules/chile-compra/` (estructura base, adaptar Circuit Breaker a opossum).

### Tarea 1.4: BullMQ worker ingesta diaria

- Archivo: `apps/api/src/modules/ingesta/ingesta.worker.ts` (crear), `apps/api/src/modules/ingesta/ingesta.processor.ts` (crear)
- Qué hacer:
  - Cola BullMQ `chile-compra-daily` con conexión a Redis (`REDIS_URL`).
  - Job recurrente: `cron: '0 3 * * *'` (3 AM Chile) — consulta ChileCompra últimas 24h.
  - Processor: por cada licitación nueva → UPSERT en Postgres (idempotencia via `codigoExterno` UNIQUE).
  - Batch: hasta 100 licitaciones por job.
  - `attempts: 3`, `backoff: { type: 'exponential', delay: 60_000 }`.
  - `removeOnComplete: { age: 7 * 24 * 3600 }`, `removeOnFail: false` (DLQ persiste).
  - Logger Pino: inicio + fin + count ingestadas + errores.
- Variable de entorno: `REDIS_URL`, `CHILECOMPRA_BASE_URL`, `CHILECOMPRA_API_KEY` (si aplica).

### Tarea 1.5: REST controller GET /licitaciones

- Archivo: `apps/api/src/modules/licitaciones/licitaciones.controller.ts` (crear)
- Qué hacer:
  - `GET /licitaciones?limit=20&offset=0&organismo=&estado=&fechaDesde=&fechaHasta=` → devuelve paginación.
  - `GET /licitaciones/:codigoExterno` → devuelve 1 licitación.
  - DTOs Zod para query params (validación + tipos).
  - Response shape: `{ data: Licitacion[], meta: { total, limit, offset } }`.
  - CORS habilitado (Fastify `@fastify/cors`).
  - Throttler: 100 req/min por IP (`@nestjs/throttler`, store Redis si hay réplicas).
- Referencia: `/DEVELOPMENT/ParaPymes/apps/ct-core-api/src/modules/licitaciones/` (estructura controller).

### Tarea 1.6: Tests Vitest

- Archivo: `apps/api/test/` (crear suite)
- Qué hacer:
  - `chile-compra.client.spec.ts`: mockea HTTP con `msw`, valida Circuit Breaker abre tras N fallos.
  - `ingesta.processor.spec.ts`: mockea `ChileCompraClient`, valida UPSERT idempotente (2 corridas → no duplica).
  - `licitaciones.controller.spec.ts`: test e2e con `@nestjs/testing` + supertest, valida paginación + filtros.
  - `vitest.config.ts`: coverage threshold 70% mínimo en `src/`.
- Comando: `pnpm --filter @pymehub/api test`.

### Tarea 1.7: Docker Compose dev

- Archivo: `apps/api/docker-compose.yml` (verificar existe del template), `.env.example`
- Qué hacer:
  - Servicios: `postgres:16-alpine`, `redis:7-alpine`, `api` (build desde `apps/api/Dockerfile`).
  - Volúmenes: `./prisma` para migraciones.
  - Health checks: `pg_isready`, `redis-cli ping`.
  - `.env.example` documenta: `DATABASE_URL`, `REDIS_URL`, `CHILECOMPRA_BASE_URL`.
- Comando: `docker compose up -d` desde `apps/api/`.

## Criterios de Aceptación

- [ ] `pnpm install` en root instala sin error
- [ ] `pnpm --filter @pymehub/api prisma migrate deploy` aplica migraciones
- [ ] `docker compose up` levanta Postgres + Redis + api healthy
- [ ] `GET http://localhost:3000/licitaciones` devuelve `[]` con meta OK (pre-ingesta)
- [ ] Job BullMQ dispara manualmente (`pnpm ts-node src/modules/ingesta/ingesta.trigger.ts`) e ingesta licitaciones reales de ChileCompra
- [ ] Tras ingesta: `GET /licitaciones` devuelve N licitaciones con shape correcto
- [ ] Re-correr job → count no aumenta (idempotencia OK)
- [ ] Circuit Breaker abre tras matar ChileCompra upstream (test `chile-compra.client.spec.ts`)
- [ ] `pnpm test` verde, coverage ≥70%
- [ ] Sin uso de `class-validator` ni `Jest` en `apps/api/`

## Riesgos / Notas

- **API ChileCompra rate-limit**: si excede, opossum abre circuit. Backoff exponencial ayuda.
- **First-run data**: 1 corrida trae ~5000 licitaciones/día. Storage inicial OK (Postgres liviano).
- **Migration class-validator → zod**: si bloquea, fallback temporal: dejar class-validator en F1, migrar en F2 (con web). NO recomendado — atrasa el delta del concept.

## Siguiente

→ `FASE_2_web-bff-dashboard.md` (solo tras F1 verde).
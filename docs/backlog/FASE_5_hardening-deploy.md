# FASE 5: Hardening + Deploy producción

**Status**: ⏸️ PENDIENTE
**Prioridad**: Media
**Dependencias**: FASE_1 ✅ + FASE_2 ✅ + (opcional) FASE_3 ✅ + (opcional) FASE_4 ✅

## Objetivo

Llevar pymehub de dev local a producción estable: CI multi-stage, deploy long-running en Railway/Render, monitoring, rate limiting, backups.

## Orden de ejecución

1. Tarea 5.1 — CI GitHub Actions (gate de aceptación)
2. Tarea 5.2 — Dockerfile producción por app
3. Tarea 5.3 — Railway/Render deploy (4 servicios)
4. Tarea 5.4 — Monitoring (Pino → Logtail + uptime check)
5. Tarea 5.5 — Rate limiting distribuido (Redis throttler)
6. Tarea 5.6 — Backup Postgres automático

## Tareas

### Tarea 5.1: CI GitHub Actions

- Archivo: `.github/workflows/ci.yml` (crear en root monorepo)
- Qué hacer:
  - Trigger: PR + push a `main`.
  - Stages: `pnpm install` → `lint` → `type-check` → `test` → `build` → (api) `prisma migrate deploy` en Postgres efímero.
  - Matrix por app: api + web. Fondos + analytics = noop (skip).
  - Cache: `pnpm` store + turbo remote cache.
- Referencia: `/DEVELOPMENT/ParaPymes/.github/workflows/` (estructura base, adaptar).

### Tarea 5.2: Dockerfile producción por app

- Archivo: `apps/api/Dockerfile` (verificar existe), `apps/web/Dockerfile` (crear)
- Qué hacer:
  - Multi-stage: builder + runner.
  - User no-root (`adduser appuser`).
  - `apps/api`: build NestJS → runtime node:22-slim + dist + prisma client.
  - `apps/web`: build Next.js standalone output → runtime node:22-slim + .next/standalone.
- Referencia: `/DEVELOPMENT/ParaPymes/apps/ct-core-api/Dockerfile`.

### Tarea 5.3: Deploy Railway/Render

- Archivo: `railway.json` o `render.yaml` en root (crear)
- Qué hacer:
  - 4 servicios: `api`, `web`, `fondos` (noop), `analytics` (noop).
  - Postgres + Redis como addons (no en Railway gratis — usar Neon + Upstash).
  - Variables de entorno: link desde Railway UI a los secrets.
  - Health check: `GET /health` en api + `GET /` en web.
  - Auto-deploy on push a `main`.

### Tarea 5.4: Monitoring

- Archivo: `apps/api/src/common/logger/pino.transport.ts` (crear)
- Qué hacer:
  - Pino transport → Logtail (o equivalente): logs estructurados centralizados.
  - Uptime monitor: Better Stack / UptimeRobot contra `https://api.pymehub.dev/health`.
  - Métricas: contar requests/min, error rate, BullMQ queue length.

### Tarea 5.5: Rate limiting distribuido

- Archivo: `apps/api/src/common/throttler/redis-throttler.storage.ts` (crear)
- Qué hacer:
  - Reemplazar throttler in-memory con `@nest-lab/throttler-storage-redis` (o equivalente).
  - Límite: 100 req/min por IP en `/licitaciones/*`, 1000 req/min global.
- Referencia: `BUNDLE_part01.md` (ya está el patrón documentado en ParaPymes).

### Tarea 5.6: Backup Postgres automático

- Archivo: `apps/api/scripts/backup.sh` (crear)
- Qué hacer:
  - Cron diario: `pg_dump` → upload a S3 (o Backblaze B2 free tier).
  - Retention: 7 daily + 4 weekly.
  - Alerta Slack/Resend si backup falla.

## Criterios de Aceptación

- [ ] CI corre en PR y bloquea merge si rojo
- [ ] `docker build apps/api` produce imagen <500MB
- [ ] `docker build apps/web` produce imagen <300MB
- [ ] Deploy Railway: 4 servicios healthy en :443
- [ ] Logs centralizados visibles en Logtail
- [ ] Rate limiting funciona: 101 req/min → 429
- [ ] Backup diario OK por 7 días consecutivos
- [ ] Uptime monitor activo + alertas

## Riesgos / Notas

- **Costos Railway hobby**: 4 servicios ≈ $25-50 USD/mes. Avisar antes.
- **Upstash Redis free tier**: 10K comandos/día. Suficiente para MVP, migrar a plan pago si crece.
- **Neon Postgres free tier**: 0.5GB. Suficiente para ETL diario por ~6 meses.

## Siguiente

→ (cierre de proyecto) Mantenimiento + monitoring continuo.
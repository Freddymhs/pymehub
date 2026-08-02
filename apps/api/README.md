# @pymehub/api

Backend de ingesta ChileCompra para el ecosistema **pymehub** (v2 repensada de ParaPymes).
Pipeline diario de licitaciones + BullMQ workers + Circuit Breaker contra la API gubernamental.

## Quick start

```bash
# 1. Instalar deps
pnpm install

# 2. Variables de entorno
cp .env.example .env
# editar .env: DATABASE_URL, REDIS_URL, CHILECOMPRA_BASE_URL

# 3. Generar Prisma client + aplicar migraciones
pnpm prisma:generate
pnpm prisma:migrate

# 4. Dev (api en :3000, Swagger en /docs)
pnpm dev
```

## Stack

| Capa          | Tecnologia                          |
| ------------- | ----------------------------------- |
| Framework     | NestJS 11                           |
| HTTP adapter  | Fastify                             |
| ORM           | Prisma 7                            |
| Base de datos | PostgreSQL 16                       |
| Cache + Queue | Redis 7 (BullMQ)                    |
| Validacion    | Zod (vía ZodValidationPipe)         |
| Documentacion | Swagger (GET /docs)                 |
| Logging       | Pino (nestjs-pino)                  |
| Resiliencia   | opossum (Circuit Breaker)           |
| Testing       | Vitest + Supertest                  |
| CI            | GitHub Actions                      |

## Scripts

| Script                 | Descripcion                    |
| ---------------------- | ------------------------------ |
| `pnpm dev`             | Desarrollo con watch mode      |
| `pnpm build`           | Build de produccion            |
| `pnpm start:prod`      | Ejecutar build                 |
| `pnpm lint`            | ESLint + Prettier con auto-fix |
| `pnpm test`            | Tests unitarios (Vitest)       |
| `pnpm test:cov`        | Tests con coverage             |
| `pnpm prisma:generate` | Generar Prisma client          |
| `pnpm prisma:migrate`  | Ejecutar migraciones           |
| `pnpm prisma:studio`   | Prisma Studio (GUI de DB)      |

## Endpoints actuales (FASE_0)

| Metodo | Path             | Descripcion                              |
| ------ | ---------------- | ---------------------------------------- |
| GET    | `/api/v1/health` | Health check con estado de DB            |
| GET    | `/api/v1/examples` | CRUD demo (template) — eliminar en FASE_1 |

> FASE_1 reemplaza `examples` por `licitaciones` (ChileCompra ETL) — ver `docs/backlog/FASE_1_api-etl-chilecompra.md`.

## Variables de entorno

Ver `.env.example`. Las requeridas se validan al arrancar con Joi (fail-fast).

## Docker

```bash
docker-compose up postgres    # solo DB
pnpm prisma:generate
pnpm dev                       # api local
```

## Licencia

Privado.
# @pymehub/fondos (aiGenerated stub)

> 🤖 **aiGenerated**: este proyecto está marcado como `aiGenerated: true` en `resume.json`.
> Solo esta carpeta existe como placeholder estructural para que el monorepo muestre los 4 servicios en CV.
> **Sin código de implementación real** — la implementación se difiere a F3 del backlog.

## Diseño planeado (F3)

Scraper de fondos concursables chilenos + matching paramétrico por perfil PYME.

### Stack objetivo

- NestJS 11 + Fastify (igual que `@pymehub/api`)
- Playwright / Crawlee para scraping de `fondos.gob.cl`
- Prisma 7 contra Postgres (mismo cliente que api)
- Cron: BullMQ (Redis compartido con api)
- Matching: heurística basada en `RUT` perfil PYME + reglas por fondo (CORFO, SERCOTEC, FOSIS, INDAP)

### Alcance F3

- Scraping diario fondos.gob.cl + SERCOTEC + CORFO + FOSIS
- Repository `FondosRepository` con queries Prisma
- Matching paramétrico por `RUT` + sector + región
- Alertas Resend cuando nuevo fondo calza
- Tests Vitest (parser + repository)

### Por qué no implementar ahora

- F1 (`api` ETL ChileCompra) es la prioridad — entrega valor real end-to-end
- F2 (`web` dashboard) depende de F1
- F3 + F4 son aspiracionales; si no se implementan, el stub mantiene el brand en CV sin inflar el repo

## Cuándo implementar

Cuando el usuario lo decida. Disparador posible: terminar F1 + F2, o interés concreto en scraping/ML.
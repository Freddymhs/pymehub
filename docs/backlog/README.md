# Backlog — pymehub

> Estructura de fases para construir el proyecto. Lee [`../_CONCEPTO.md`](../_CONCEPTO.md) primero.

## Índice

| Fase | Estado | Prioridad | Objetivo |
|---|---|---|---|
| [`FASE_0_BASE`](FASE_0_BASE.md) | ✅ Completado | Alta | Scaffold monorepo + clones + draft resume.json |
| [`FASE_1_api-etl-chilecompra`](FASE_1_api-etl-chilecompra.md) | ⏸️ Pendiente | Alta | **F1 PROTEGIDO** — api ETL ChileCompra end-to-end |
| [`FASE_2_web-bff-dashboard`](FASE_2_web-bff-dashboard.md) | ⏸️ Pendiente | Alta | web BFF + Dashboard PYMEs |
| [`FASE_3_fondos-stub`](FASE_3_fondos-stub.md) | ⏸️ Pendiente | Baja | fondos stub aiGenerated (declarativo) |
| [`FASE_4_analytics-stub`](FASE_4_analytics-stub.md) | ⏸️ Bloqueado | Baja | analytics stub aiGenerated (declarativo) |
| [`FASE_5_hardening-deploy`](FASE_5_hardening-deploy.md) | ⏸️ Pendiente | Media | CI + Docker + Railway + monitoring |

## Distribución de implementación

- **Real (F1 + F2):** `apps/api` + `apps/web` → 2 servicios con código real, dan crédito en CV.
- **Stub aiGenerated (F3 + F4):** `apps/fondos` + `apps/analytics` → carpetas placeholder, descripciones aspiracionales.
- **Hardening (F5):** CI + deploy + monitoring.

## Diagramas de Referencia

| Archivo | Tipo | Contenido |
|---------|------|-----------|
| [`../diagrams/DIAGRAMAS_COMPONENTES.md`](../diagrams/DIAGRAMAS_COMPONENTES.md) | Flowcharts | Topología del sistema |

Este diagrama es referencia estructural estable. Las fases lo referencian pero no lo repiten. Actualizar solo ante cambios de topología (agregar/quitar servicios o cambiar frontera cliente/servidor).

## Decisiones Técnicas

Carpeta [`../decisions/`](../decisions/) — documentar aquí decisiones arquitectónicas cuando surjan durante el desarrollo.
Formato: `DECISION_[TEMA].md` — explica el POR QUÉ, no el QUÉ.

## Próximo paso

→ FASE_1 (`FASE_1_api-etl-chilecompra.md`). F1 debe shippear antes de F2.
# FASE 4: analytics stub (aiGenerated)

**Status**: ⏸️ BLOQUEADO — requiere ≥3 meses de datos de FASE_1
**Prioridad**: Baja
**Dependencias**: FASE_1 (≥3 meses ingestando datos)

## Objetivo

Mantener `apps/analytics` como **stub aiGenerated**. Implementación real se difiere — solo se activa si (a) FASE_1 lleva ≥3 meses ingestando datos, Y (b) el usuario decide explícitamente.

## Tareas

### Tarea 4.1: Confirmar stub (NOOP)

- Archivo: `apps/analytics/{package.json,README.md}` (verificar existen)
- Qué hacer: nada. El stub ya está creado en FASE_0.

### Tarea 4.2 (opcional): Implementar ML + RAG

Solo si ambas condiciones se cumplen:

- Archivo: `apps/analytics/src/` (crear)
- Qué hacer:
  - FastAPI + Python 3.12.
  - XGBoost ranking (lee features desde Postgres read replica).
  - LlamaIndex + pgvector para RAG.
  - NetworkX para SNA.
  - Worker batch (cron diario o demanda).
- Activador: (a) FASE_1 ≥3 meses con datos, Y (b) decisión explícita del usuario.

## Criterios de Aceptación

- [x] `apps/analytics/package.json` ejecuta `dev:noop` sin error
- [x] `apps/analytics/README.md` describe diseño + bloqueo por datos
- [x] Marcado `aiGenerated: true` en `resume.json`
- [ ] (Opcional) ML real implementado — solo si se activa

## Siguiente

→ `FASE_5_hardening-deploy.md`
# FASE 3: fondos stub (aiGenerated)

**Status**: ⏸️ PENDIENTE (declarativo)
**Prioridad**: Baja
**Dependencias**: — (independiente)

## Objetivo

Esta fase documenta la decisión de mantener `apps/fondos` como **stub aiGenerated**. La implementación real se difiere — solo se ejecuta si el usuario lo pide explícitamente.

## Tareas

### Tarea 3.1: Confirmar stub (NOOP)

- Archivo: `apps/fondos/{package.json,README.md}` (verificar existen)
- Qué hacer: nada. El stub ya está creado en FASE_0. Marcar este archivo como referencia para cuando el usuario quiera implementar.

### Tarea 3.2 (opcional): Implementar scraper fondos.gob.cl

Solo si el usuario decide activar F3:

- Archivo: `apps/fondos/src/scraper/fondos-gob.scraper.ts` (crear), `apps/fondos/src/fondos.module.ts` (crear)
- Qué hacer:
  - Playwright headless contra `fondos.gob.cl`.
  - Repository Prisma para fondos (comparte DB con api).
  - Cron BullMQ (worker separado, mismo Redis).
- Activador: decisión explícita del usuario. Por defecto esta fase queda como stub.

## Criterios de Aceptación

- [x] `apps/fondos/package.json` ejecuta `dev:noop` sin error
- [x] `apps/fondos/README.md` describe diseño planeado
- [x] Marcado `aiGenerated: true` en `resume.json`
- [ ] (Opcional) Scraper real implementado — solo si se activa

## Siguiente

→ `FASE_4_analytics-stub.md`
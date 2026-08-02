# FASE 0: Scaffold + Monorepo Setup

**Status**: ✅ COMPLETADO (por `/work:resume:new-project` 2026-08-01)
**Prioridad**: Alta
**Dependencias**: —

## Resumen

Scaffold del monorepo + clonado de templates + plantado del concepto + draft en `resume.json`.

## Tareas

### Tarea 0.1: Root scaffold (pnpm workspaces + Turborepo)

- Archivo: `pnpm-workspace.yaml`, `turbo.json`, `.gitignore`, `README.md`
- Hecho: estructura base creada manualmente (no hay template Freddymhs para monorepo pnpm+turbo).

### Tarea 0.2: Clonar `template-nest` → `apps/api`

- Archivo: `apps/api/` (creado desde template)
- Hecho: clone de `Freddymhs/template-nest`. Renombrado `package.json` → `@pymehub/api`.
- Pendiente para F1: migrar `class-validator` → `zod`, Jest → Vitest.

### Tarea 0.3: Clonar `template-nextjs-fullstack` → `apps/web`

- Archivo: `apps/web/` (creado desde template)
- Hecho: clone de `Freddymhs/template-nextjs-fullstack`. Renombrado `package.json` → `@pymehub/web`.
- Pendiente para F2: agregar `shadcn/ui` + `zustand` + `@supabase/supabase-js`.

### Tarea 0.4: Stubs `apps/fondos` + `apps/analytics`

- Archivo: `apps/fondos/{package.json,README.md}`, `apps/analytics/{package.json,README.md}`
- Hecho: placeholders con `dev:noop` scripts. Marcados aiGenerated en `resume.json`.

### Tarea 0.5: Plantar `_CONCEPTO.md`

- Archivo: `docs/_CONCEPTO.md`
- Hecho: copiado desde `DEVELOPMENT/concept-pymehub.md` con puntero al origen.

### Tarea 0.6: Draft en `resume.json`

- Archivo: `PRODUCTION/fmarcos/fmarcosdev.api.resume/resume.json`
- Hecho: 4 entries nuevos (api + web reales, fondos + analytics aiGenerated).

### Tarea 0.7: `git init` en monorepo root

- Archivo: `.git/`
- Hecho: 1 repo en `DEVELOPMENT/pymehub/.git/` (NO sub-repos por app).
- Sin commits todavía (usuario revisa antes de stagear).

## Criterios de Aceptación

- [x] Monorepo compila con `pnpm install` en root
- [x] `apps/api` levanta con `pnpm dev` (template default)
- [x] `apps/web` levanta con `pnpm dev` (template default)
- [x] `apps/fondos` + `apps/analytics` ejecutan `dev:noop` sin error
- [x] `_CONCEPTO.md` plantado con puntero al origen
- [x] `resume.json` válido con 4 entries nuevos

## Siguiente

→ `FASE_1_api-etl-chilecompra.md`
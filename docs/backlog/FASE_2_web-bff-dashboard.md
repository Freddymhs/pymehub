# FASE 2: web BFF + Dashboard mínimo

**Status**: ⏸️ PENDIENTE
**Prioridad**: Alta
**Dependencias**: FASE_1 (api corriendo con datos)

## Objetivo

Implementar `apps/web` como BFF (Backend-For-Frontend) que consume `apps/api` y expone dashboard a PYMEs. **Mínimo 3 vistas** + auth Supabase + RSC puro + Server Actions.

## Orden de ejecución

1. Tarea 2.1 — Instalar deps (shadcn/ui + Zustand + Supabase) — base para 2.2-2.6
2. Tarea 2.2 — Supabase client + middleware auth — gate para 2.3-2.6
3. Tarea 2.3 — RSC layout + nav shell — consumido por 2.4-2.6
4. Tarea 2.4 — Vista `/dashboard` lista licitaciones (RSC)
5. Tarea 2.5 — Vista `/dashboard/[codigoExterno]` detalle (RSC + Server Action)
6. Tarea 2.6 — Server Action favoritos (Supabase RLS)
7. Tarea 2.7 — Tests Vitest (stores) + Playwright (e2e básico)

## Tareas

### Tarea 2.1: Instalar shadcn/ui + Zustand + Supabase client

- Archivo: `apps/web/package.json` (modificar deps)
- Qué hacer:
  - Agregar: `zustand`, `@supabase/supabase-js`, `@supabase/ssr` (Next.js 16 SSR support).
  - shadcn CLI: `pnpm dlx shadcn@latest init` (configura `components.json` + Tailwind plugin).
  - Agregar componentes base: `pnpm dlx shadcn@latest add button card input table badge`.
- Variables de entorno: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-side only).

### Tarea 2.2: Supabase client + middleware auth

- Archivo: `apps/web/src/lib/supabase/client.ts` (crear), `apps/web/src/lib/supabase/server.ts` (crear), `apps/web/src/middleware.ts` (crear)
- Qué hacer:
  - `client.ts`: cliente browser-side con anon key.
  - `server.ts`: cliente server-side con cookies (server components + server actions).
  - `middleware.ts`: protege `/dashboard/*`, redirige a `/login` si no hay sesión.
- Referencia: docs Supabase Next.js 16 SSR oficial.

### Tarea 2.3: Layout + nav shell (RSC)

- Archivo: `apps/web/src/app/(authed)/layout.tsx` (crear), `apps/web/src/components/nav.tsx` (crear)
- Qué hacer:
  - Group route `(authed)` envuelve todas las vistas autenticadas.
  - Layout: verifica sesión server-side, renderiza `<Nav>` + `<main>{children}</main>`.
  - `Nav`: logo + link Dashboard + dropdown user (logout).
- Eliminar rutas demo del template (`/csr`, `/ssr`, `/ssg`, `/isr`, `/api/hello`).

### Tarea 2.4: Vista `/dashboard` — lista licitaciones (RSC puro)

- Archivo: `apps/web/src/app/(authed)/dashboard/page.tsx` (crear)
- Qué hacer:
  - Server Component: fetch desde `apps/api` (`process.env.API_URL + '/licitaciones?limit=20'`).
  - Pasa datos a `<LicitacionTable data={licitaciones} />` (componente client que solo renderiza).
  - Empty state: "Aún no hay licitaciones ingestadas".
  - Link a detalle: `/dashboard/[codigoExterno]`.
  - Loading: usar `loading.tsx` con skeleton.
- Sin fetch en cliente. Sin TanStack Query. Sin SWR.

### Tarea 2.5: Vista `/dashboard/[codigoExterno]` — detalle (RSC + Server Action)

- Archivo: `apps/web/src/app/(authed)/dashboard/[codigoExterno]/page.tsx` (crear), `apps/web/src/app/(authed)/dashboard/[codigoExterno]/actions.ts` (crear)
- Qué hacer:
  - Server Component: fetch desde `apps/api` (`/licitaciones/:codigoExterno`).
  - Render: nombre, organismo, monto, fechas, descripción, botón "Marcar favorito".
  - Server Action `toggleFavorito(codigoExterno, userId)`: inserta/elimina fila en Supabase table `favoritos (userId, codigoExterno, createdAt)`.
  - RLS en Supabase: solo el `userId` ve sus favoritos (`auth.uid() = user_id`).
- Sin client mutation. Sin useState para el toggle.

### Tarea 2.6: Server Action favoritos (consolidación Tarea 2.5)

Cubierto por Tarea 2.5. Si la action crece, extraer a `apps/web/src/lib/actions/favoritos.ts`.

### Tarea 2.7: Tests

- Archivo: `apps/web/test/` (crear)
- Qué hacer:
  - Vitest unit: `zustand stores` (auth store shape, login/logout flow).
  - Playwright e2e: 1 test happy-path — login → ver dashboard → ver detalle → marcar favorito → recargar → favorito persiste.
- Comando: `pnpm --filter @pymehub/web test` + `pnpm --filter @pymehub/web test:e2e`.

## Criterios de Aceptación

- [ ] `pnpm dev` levanta web en :3000 sin error
- [ ] `/login` funciona con Supabase email/password (o magic link)
- [ ] `/dashboard` requiere auth (redirect a `/login` si no)
- [ ] `/dashboard` lista licitaciones reales desde api (data flow end-to-end)
- [ ] `/dashboard/[codigoExterno]` muestra detalle + botón favorito
- [ ] Click favorito → persiste en Supabase → recarga → sigue ahí (RLS OK)
- [ ] Vitest verde
- [ ] Playwright e2e verde (mínimo 1 test)
- [ ] Rutas demo del template eliminadas
- [ ] Sin `useState` para data fetching (RSC puro)

## Riesgos / Notas

- **Supabase RLS**: si se olvida activar, user A ve favoritos de user B. Test específico en Playwright.
- **API_URL env var**: en dev `http://localhost:3000`, en deploy variable de Railway.
- **First-deploy railway**: web puede tardar más en boot que api. Healthcheck necesario.

## Siguiente

→ `FASE_3_fondos-stub.md` (declarativo, casi noop).